const mongoose = require("mongoose");

const featureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    parentFeatureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feature",
      default: null, // null = root feature
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // feature may or may not be assigned
    },
  },
  { timestamps: true }
);

const Feature = mongoose.model('Feature', featureSchema);
module.exports = Feature;