require("dotenv").config();
const express = require("express");
const cors = require("cors");

const imageRoutes = require("./routes/image");
const userRoutes = require("./routes/user");
const echoRoutes = require("./routes/echo");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/echo", echoRoutes);

app.get("/", (_, res) => res.send("Backend API is running 🚀"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server on http://localhost:${PORT}`));
