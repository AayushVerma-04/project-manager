const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./routers/userRouter");
const projectRouter = require("./routers/projectRouter")
const dotenv = require("dotenv");
// const cron = require("node-cron");
dotenv.config();

const path = require('path');

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Fallback to index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Your existing routes
// app.use('/api', yourRoutes);


const mongodbURL = process.env.mongodbURL;
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/user", userRouter);
app.use("/api/project", projectRouter);


// const path = require('path');

// // Serve frontend static files
// app.use(express.static(path.join(__dirname, '../frontend/dist')));

// // Fallback to index.html for SPA
// app.get(/^\/(?!api).*/, (req, res) => {
//   res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
// });

mongoose
  .connect(mongodbURL)
  .then(() => {
    app.listen(PORT, () => {
      //console.log(`App listening to port ${PORT}`);
    });
  })
  .catch((error) => console.error("MongoDB connection error:", error));
