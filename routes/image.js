const express = require("express");
const router = express.Router();
const { handleImageSave } = require("../actions/gen_img");

router.post("/save", async (req, res) => {
  const { email, prompt, imageUrl, format } = req.body;

  try {
    const result = await handleImageSave({ email, prompt, imageUrl, format });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
