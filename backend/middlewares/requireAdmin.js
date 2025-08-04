const Project = require('../Models/projectModel')

const requireAdmin = async (req, res, next) => {
  const project = await Project.findById(req.params.projectId).lean();
  if (!project) return res.status(404).json({ error: "Project not found" });

  if (project.admin.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: "Only admin can perform this action" });
  }

  req.project = project;
  next();
};

module.exports = requireAdmin