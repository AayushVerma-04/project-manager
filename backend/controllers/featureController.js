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


// ✅ Delete feature recursively (with all sub-features + tasks)
const deleteFeature = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { featureId } = req.params;

    // Recursive helper to delete a feature and its descendants
    const deleteFeatureRecursive = async (fid) => {
      // Delete all tasks of this feature
      await Task.deleteMany({ featureId: fid }).session(session);

      // Find child sub-features
      const children = await Feature.find({ parentFeatureId: fid }).session(session);

      // Recursively delete each child
      for (const child of children) {
        await deleteFeatureRecursive(child._id);
      }

      // Finally delete the feature itself
      await Feature.findByIdAndDelete(fid).session(session);
    };

    // First check if feature exists
    const exists = await Feature.findById(featureId).session(session);
    if (!exists) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Feature not found" });
    }

    // Perform recursive delete
    await deleteFeatureRecursive(featureId);

    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Feature and all sub-features & tasks deleted successfully" });
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

    // ✅ Update feature assignment
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

    // ✅ Update only tasks that are NOT completed
    const result = await Task.updateMany(
      { featureId, status: { $ne: "completed" } },
      { assignedTo: userId }
    ).session(session);

    await session.commitTransaction();
    session.endSession();

    res.json({
      message: "Feature and non-completed tasks assigned successfully",
      feature,
      tasksAssigned: result.modifiedCount, // only count tasks actually updated
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