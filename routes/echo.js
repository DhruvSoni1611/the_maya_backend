const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const extractTextFromPDF = require("../lib/pdfParser");

const router = express.Router();
const upload = multer({ dest: "uploads/" });
const prisma = require("../lib/prisma");

router.post("/echo", upload.single("pdf"), async (req, res) => {
  const { voiceId, format = "mp3", email } = req.body;

  if (!req.file || !email) {
    return res.status(400).json({ error: "PDF or email missing" });
  }

  try {
    // ✅ Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    // ➕ Optional: Check tokens
    if (user.tokens <= 0) {
      return res.status(403).json({ error: "Insufficient tokens" });
    }

    // ✅ Extract PDF and call ElevenLabs API as before...
    const pdfPath = req.file.path;
    const text = await extractTextFromPDF(pdfPath);

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text.slice(0, 5000),
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.4,
            similarity_boost: 0.8,
          },
        }),
      }
    );

    const audioBuffer = await response.buffer();

    const filename = `echo_${Date.now()}.${format}`;
    const outputPath = path.join(__dirname, "..", "public", "audio", filename);
    fs.writeFileSync(outputPath, audioBuffer);
    fs.unlinkSync(pdfPath);

    const newPodcast = await prisma.podcast.create({
      data: {
        title: req.file.originalname,
        outputUrl: `/audio/${filename}`,
        voiceUsed: voiceId,
        format,
        pdfUrl: `/uploads/${req.file.filename}`,
        user: { connect: { id: user.id } },
      },
    });

    await prisma.echoHistory.create({
      data: {
        user: { connect: { id: user.id } },
        podcast: { connect: { id: newPodcast.id } },
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        tokens: { decrement: 1 },
      },
    });

    return res.json({ success: true, downloadUrl: `/audio/${filename}` });
  } catch (err) {
    console.error("Echo Error:", err.message);
    return res.status(500).json({ error: "Failed to convert PDF to audio" });
  }
});

module.exports = router;
