const express = require("express");
const router = express.Router();
const prisma = require("../lib/prisma");

router.post("/init", async (req, res) => {
  const { email, clerkId, name, imageUrl } = req.body;

  if (!email || !clerkId) {
    return res
      .status(400)
      .json({ success: false, error: "Missing email or clerkId" });
  }

  try {
    // ✅ Step 1: Check if user exists
    let user = await prisma.user.findUnique({ where: { email } });

    // ✅ Step 2: If not, create a new user
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

      return res
        .status(201)
        .json({ success: true, message: "User created", user });
    }

    // ✅ Step 3: If already exists, return user (no change)
    return res
      .status(200)
      .json({ success: true, message: "User already exists", user });
  } catch (err) {
    console.error("❌ /api/user/init error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
