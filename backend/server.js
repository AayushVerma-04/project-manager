const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const userRouter = require("./routers/userRouter");
const projectRouter = require("./routers/projectRouter");

dotenv.config();
const app = express();

const mongodbURL = process.env.mongodbURL;
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// API routes
app.use("/api/user", userRouter);
app.use("/api/project", projectRouter);

// === Serve frontend in production ===
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Serve index.html for any route that doesn't start with /api
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
} else {
  // Development landing route
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

// === MongoDB Connection ===
mongoose
  .connect(mongodbURL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => console.error("MongoDB connection error:", error));
