const express = require('express');
const {
  createFeature,
  getProjectFeatures,
  updateFeature,
  deleteFeature,
  assignFeature,
} = require("../controllers/featureController");

const featureRouter = express.Router({mergeParams: true});

// Create feature
featureRouter.post("/", createFeature);

// Get all features for a project
featureRouter.get("/", getProjectFeatures);

// Update feature
featureRouter.put("/:featureId", updateFeature);

// Delete feature
featureRouter.delete("/:featureId", deleteFeature);

// Assign feature
featureRouter.post("/:featureId/assign", assignFeature);

module.exports = featureRouter;
