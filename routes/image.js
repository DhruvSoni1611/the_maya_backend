// const express = require("express");
// const router = express.Router();
// const { handleImageSave } = require("../actions/gen_img");

// router.post("/save", async (req, res) => {
//   const { email, prompt, imageUrl, format } = req.body;

//   try {
//     const result = await handleImageSave({ email, prompt, imageUrl, format });
//     res.status(200).json(result);
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// module.exports = router;

// router.post("/gen", async (req, res) => {
//   const { prompt } = req.body;

//   try {
//     // Step 1: Create prediction on Replicate
//     const createRes = await fetch("https://api.replicate.com/v1/predictions", {
//       method: "POST",
//       headers: {
//         Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         version: process.env.REPLICATE_MODEL_VERSION,
//         input: { prompt },
//         num_inference_steps: 4,
//         guidance_scale: 7.5,
//         width: 1024,
//         height: 1024,
//         num_outputs: 1,
//       }),
//     });

//     const prediction = await createRes.json();
//     const predictionId = prediction.id;

//     if (!predictionId) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Failed to start prediction" });
//     }

//     // Step 2: Poll for result
//     let tries = 0;
//     let imageUrl = null;

//     while (tries < 10) {
//       await new Promise((r) => setTimeout(r, 2000));

//       const statusRes = await fetch(
//         `https://api.replicate.com/v1/predictions/${predictionId}`,
//         {
//           headers: {
//             Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
//           },
//         }
//       );

//       const statusData = await statusRes.json();

//       if (statusData.status === "succeeded") {
//         imageUrl = statusData.output?.[0];
//         break;
//       } else if (statusData.status === "failed") {
//         return res
//           .status(500)
//           .json({ success: false, message: "Prediction failed" });
//       }

//       tries++;
//     }

//     if (!imageUrl) {
//       return res
//         .status(408)
//         .json({ success: false, message: "Image generation timed out" });
//     }

//     return res.status(200).json({ success: true, imageUrl });
//   } catch (err) {
//     console.error("Replicate error:", err.message);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

const { REPLICATE_API_TOKEN, REPLICATE_MODEL_VERSION } = process.env;

router.post("/gen", async (req, res) => {
  const { prompt } = req.body;

  try {
    const replicateRes = await fetch(
      "https://api.replicate.com/v1/predictions",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          version: REPLICATE_MODEL_VERSION,
          input: { prompt },
        }),
      }
    );

    const prediction = await replicateRes.json();
    const predictionId = prediction.id;

    if (!predictionId) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to start prediction" });
    }

    let tries = 0;
    let imageUrl = null;

    while (tries < 10) {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (!REPLICATE_API_TOKEN || !REPLICATE_MODEL_VERSION) {
        return res
          .status(500)
          .json({ success: false, message: "Missing Replicate API env vars" });
      }
      const statusRes = await fetch(
        `https://api.replicate.com/v1/predictions/${predictionId}`,
        {
          headers: {
            Authorization: `Token ${REPLICATE_API_TOKEN}`,
          },
        }
      );

      const statusData = await statusRes.json();

      if (statusData.status === "succeeded") {
        imageUrl = statusData.output?.[0];
        break;
      } else if (statusData.status === "failed") {
        return res
          .status(500)
          .json({ success: false, message: "Image generation failed" });
      }

      tries++;
    }

    if (!imageUrl) {
      return res
        .status(408)
        .json({ success: false, message: "Timeout: image not ready" });
    }

    res.status(200).json({ success: true, imageUrl });
  } catch (err) {
    console.error("Error in /api/image/gen:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
