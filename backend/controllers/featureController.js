const Feature = require("../Models/featureModel");
const Task = require("../Models/taskModel");
const User = require("../Models/userModel")
const mongoose = require("mongoose");

// ✅ Create a new feature (or sub-feature)
const createFeature = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const { name, parentFeatureId } = req.body;

    const feature = await Feature.create({
      name,
      projectId,
      parentFeatureId: parentFeatureId || null,
    });

    res.status(201).json(feature);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ Get all features for a project
const getProjectFeatures = async (req, res) => {
  try {
    const { projectId } = req.params;
    const features = await Feature.find({ projectId });

    res.json(features);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ Update feature (rename, re-parent, etc.)
const updateFeature = async (req, res) => {
  try {
    const { featureId } = req.params;
    const updates = req.body;

    const feature = await Feature.findByIdAndUpdate(featureId, updates, {
      new: true,
    });

    if (!feature) {
      return res.status(404).json({ error: "Feature not found" });
    }

    res.json(feature);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ Delete feature (and related tasks, sub-features optional)
const deleteFeature = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { featureId } = req.params;

    // Delete the feature itself
    const feature = await Feature.findByIdAndDelete(featureId).session(session);
    if (!feature) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Feature not found" });
    }

    // Find all tasks under this feature before deleting them
    const tasksToDelete = await Task.find({ featureId }).session(session);
    const taskIds = tasksToDelete.map(task => task._id);

    // Remove tasks from users' task arrays
    if (taskIds.length > 0) {
      await User.updateMany(
        { tasks: { $in: taskIds } },
        { $pullAll: { tasks: taskIds } }
      ).session(session);
    }

    // Delete tasks under this feature
    await Task.deleteMany({ featureId }).session(session);

    // Delete sub-features directly under this one (not recursive yet)
    await Feature.deleteMany({ parentFeatureId: featureId }).session(session);

    await session.commitTransaction();
    session.endSession();

    res.json({ 
      message: "Feature and related tasks deleted",
      tasksRemoved: taskIds.length
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: err.message });
  }
};


// ✅ Assign feature to a user (cascade tasks)
const assignFeature = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { featureId } = req.params;
    const { userId } = req.body;

    // Update feature
    const feature = await Feature.findByIdAndUpdate(
      featureId,
      { assignedTo: userId },
      { new: true }
    ).session(session);

    if (!feature) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Feature not found" });
    }

    // Find tasks under this feature
    const tasks = await Task.find({ featureId: featureId }).session(session);
    const taskIds = tasks.map(task => task._id);

    // Update tasks under this feature
    await Task.updateMany(
      { featureId: featureId }, 
      { assignedTo: userId }
    ).session(session);

    // Update user's tasks array
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { tasks: { $each: taskIds } } },
      { new: true }
    ).session(session);

    await session.commitTransaction();
    session.endSession();

    res.json({ 
      message: "Feature and tasks assigned successfully", 
      feature,
      tasksAssigned: tasks.length 
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createFeature,
  getProjectFeatures,
  assignFeature,
  updateFeature,
  deleteFeature,
};