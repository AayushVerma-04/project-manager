const Task = require("../Models/taskModel");
const User = require("../Models/userModel");
const Project = require("../Models/projectModel");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// Get all tasks related to a project
const getProjectTasks = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const project = await Project.findById(projectId).populate("tasks");
    if (!project) return res.status(404).json({ error: "Project not found" });

    res.status(200).json(project.tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch project tasks" });
  }
};

// Change task status
const changeTaskStatus = async (req, res) => {
  try {
    //console.log(req.params)
    const taskId = req.params.taskId //req.params log krke dekhna h
    const { newStatus } = req.body;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.status = newStatus;
    await task.save();

    res.status(200).json({ message: "Task status updated", task });
  } catch (error) {
    res.status(500).json({ error: "Failed to update task status" });
  }
};

// Add new task to project
const addTask = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const { title, description } = req.body;

    const newTask = new Task({ title, description, projectId });
    await newTask.save();

    await Project.findByIdAndUpdate(projectId, { $push: { tasks: newTask._id } });

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Edit task details
const editTask = async (req, res) => {
  try {
    const taskId = req.params.taskId
    const { assignedTo, status } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.status = status || task.status; // Update status if provided
    task.assignedTo = assignedTo || task.assignedTo; // Update assignedTo if provided
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to edit task" });
  }
};

// Delete task from project and user
const deleteTask = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const taskId = req.params.taskId

    const task = await Task.findById(taskId).session(session);
    if (!task) throw new Error("Task not found");

    const { projectId, assignedTo } = task;

    await Task.findByIdAndDelete(taskId).session(session);
    await Project.findByIdAndUpdate(projectId, { $pull: { tasks: taskId } }).session(session);

    if (assignedTo) {
      await User.findByIdAndUpdate(assignedTo, { $pull: { tasks: taskId } }).session(session);
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: "Failed to delete task" });
  }
};

// Assign or reassign task
const assignTask = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const taskId = req.params.taskId
    const { userId } = req.body;

    const task = await Task.findById(taskId).session(session);
    if (!task) throw new Error("Task not found");

    if (task.assignedTo) {
      await User.findByIdAndUpdate(task.assignedTo, { $pull: { tasks: task._id } }, { session });
    }

    task.assignedTo = userId;
    task.status = 'assigned'; // Set status to 'assigned' when assigning a task
    await task.save({ session });

    await User.findByIdAndUpdate(userId, { $addToSet: { tasks: task._id } }, { session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Task assigned", task });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: "Failed to assign task" });
  }
};

module.exports = {
  getProjectTasks,
  changeTaskStatus,
  addTask,
  editTask,
  deleteTask,
  assignTask
};
