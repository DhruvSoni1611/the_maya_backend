const express = require("express");
const router = express.Router();
const prisma = require("../lib/prisma").default;

router.post("/init", async (req, res) => {
  const { email, clerkId, name, imageUrl } = req.body;

  try {
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          clerkId,
          name,
          imageUrl,
          tokens: 5,
          audioTokens: 2,
        },
      });
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
