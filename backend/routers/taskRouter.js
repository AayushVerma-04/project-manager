const express = require("express");
const {
  addTask,
  getProjectTasks,
  changeTaskStatus,
  editTask,
  deleteTask,
  assignTask
} = require("../controllers/taskController");
const requireAuth = require("../middlewares/requireAuth");

const taskRouter = express.Router({mergeParams: true});

// taskRouter.use(requireAuth);

taskRouter.get("/", getProjectTasks);

taskRouter.post("/", addTask);

taskRouter.patch("/:taskId/status", changeTaskStatus);

taskRouter.put("/:taskId", editTask);

taskRouter.patch("/:taskId/assign", assignTask);

taskRouter.delete("/:taskId", deleteTask);

module.exports = taskRouter;
