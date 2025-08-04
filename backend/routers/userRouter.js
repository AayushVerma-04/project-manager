const express = require("express");
const {
  login,
  signup,
  getUserTasks,
  getUserProjects,
  getOtherProjects,
  getUser,
  joinTeam
} = require("../controllers/userController");
const requireAuth = require("../middlewares/requireAuth");

const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.post("/signup", signup);

userRouter.use(requireAuth);

userRouter.get("/myprojects", getUserProjects);
userRouter.get("/otherprojects", getOtherProjects);
userRouter.get("/tasks", getUserTasks);
userRouter.get("/:userId", getUser);
userRouter.post("/join", joinTeam); 

module.exports = userRouter;
