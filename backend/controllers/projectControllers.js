const Project = require('../Models/projectModel');
const Task = require('../Models/taskModel');
const User = require('../Models/userModel');
const mongoose = require('mongoose');
const Feature = require('../Models/featureModel');
const {nanoid} = require('nanoid');

const getProject = async (req,res) =>{
  try {
    const projectId = req.params.projectId
    const project = await Project.findById(projectId)
      .populate('tasks')  // This will populate the tasks array with full task documents
      .lean()
    
    if(!project){
      return res.status(404).json({ error: 'Project not found' });
    }

    return res.status(200).json(project)
  } catch (error) {
    return res.status(500).json({error : 'Could not fetch project'})
  }
}

// Create a new project
const createProject = async (req, res) => {
  const sess = await mongoose.startSession();
  sess.startTransaction();

  try {
    //console.log(req.user)
    const { title, description } = req.body;
    const adminInfo = { _id: req.user._id, username: req.user.username };
    const code = nanoid(7);

    const adminUser = await User.findById(adminInfo._id).session(sess);
    if (!adminUser) throw new Error('User not found');

    const project = new Project({
      title,
      description,
      admin: adminInfo,
      team: [adminInfo._id],
      code
    });

    await project.save({ session: sess });

    adminUser.userProjects.push(project._id); // push into the Mongoose user doc
    await adminUser.save({ session: sess });

    await sess.commitTransaction();
    sess.endSession();

    res.status(201).json(project);
  } catch (error) {
    await sess.abortTransaction();
    sess.endSession();
    res.status(500).json({ error: 'Failed to create project', details: error.message });
  }
};


const getCode = async (req, res) =>{
    try {
        const projectId = req.params.projectId
        const project = await Project.findById(projectId).lean()
        if(!project){
            return res.status(404).json({ error: 'Project not found' });
        }

        return res.status(200).json(project.code)
    } catch (error) {
        return res.status(500).json({error : 'Could not fetch project code'})
    }
}

const getTeam = async (req, res) => {
    try {
        const projectId = req.params.projectId
        const project = await Project.findById(projectId).populate('team', 'username email').lean()
        if(!project){
            return res.status(404).json({ error: 'Project not found' });
        }
        return res.status(200).json(project.team)

    } catch (error) {
        return res.status(500).json({error : 'Could not fetch project team'})
    }
}

// Remove a member from the team
const removeFromTeam = async (req, res) => {
  try {
    const projectId = req.params.projectId
    const { userId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found.' });

    if (!project.admin.equals(req.user._id)) {
      return res.status(403).json({ error: 'Only admin can remove members.' });
    }

    const user = await User.findById(userId)
    if(!user){
      return res.status(404).json({ error: 'User not found' });
    }

    const sess = await mongoose.startSession();
    sess.startTransaction()

    user.otherProjects = user.otherProjects.filter(pid => pid.toString() !== projectId);
    await user.save({session: sess})

    project.team = project.team.filter(memberId => memberId.toString() !== userId);
    await project.save({session: sess});

    await sess.commitTransaction()
    sess.endSession()

    res.status(200).json({ message: 'User removed from team.', team: project.team });
  } catch (error) {
    await sess.abortTransaction();
    sess.endSession();
    res.status(500).json({ error: 'Failed to remove user from team.' });
  }
};

// Change project status
const changeStatus = async (req, res) => {
  try {
    const projectId = req.params.projectId
    const { newStatus } = req.body;

    if (!['pending', 'in_progress', 'completed'].includes(newStatus)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found.' });

    if (!project.admin.equals(req.user._id)) {
      return res.status(403).json({ error: 'Only admin can change status.' });
    }

    project.status = newStatus;
    await project.save();

    res.status(200).json({ message: 'Status updated.', status: project.status });
  } catch (error) {
    res.status(500).json({ error: 'Failed to change status.' });
  }
};

const joinTeam = async (req, res) => {
  const { code } = req.body; // join via project code
  const userId = req.user._id;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const project = await Project.findOne({ code }).session(session);
    if (!project) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Invalid project code." });
    }

    // Check if already part of team
    if (project.team.includes(userId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: "Already a team member." });
    }

    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "User not found." });
    }

    // Update both user and project
    project.team.push(userId);
    user.otherProjects.push(project._id);

    await project.save({ session });
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json(project);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ error: "Failed to join team." });
  }
}

const leaveProject = async (req, res) => {
  const userId = req.user._id;
  const projectId = req.params.projectId;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const project = await Project.findById(projectId).session(session);
    if (!project) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Project not found." });
    }

    // Prevent admin from leaving their own project
    if (project.admin._id.equals(userId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ error: "Admin cannot leave their own project." });
    }

    // Remove user from project team
    project.team = project.team.filter(memberId => memberId.toString() !== userId.toString());
    await project.save({ session });

    // Remove project from user's otherProjects
    const user = await User.findById(userId).session(session);
    if (user) {
      user.otherProjects = user.otherProjects.filter(pid => pid.toString() !== projectId);
      await user.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Successfully left the project." });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: "Failed to leave project." });
  }
};

const deleteProject = async (req, res) => {
  const projectId = req.params.projectId;
  const userId = req.user._id;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const project = await Project.findById(projectId).session(session);
    if (!project) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Project not found." });
    }

    // Only admin can delete the project
    if (!project.admin._id.equals(userId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ error: "Only admin can delete the project." });
    }

    // Remove project from all team members' otherProjects
    await User.updateMany(
      { otherProjects: project._id },
      { $pull: { otherProjects: project._id } },
      { session }
    );

    // Remove project from all users' userProjects (for admin)
    await User.updateMany(
      { userProjects: project._id },
      { $pull: { userProjects: project._id } },
      { session }
    );

    // delete all tasks associated with the project
    await Task.deleteMany({ projectId: project._id }).session(session);

    // delete all features associated with the project
    await Feature.deleteMany({ projectId: project._id }).session(session);

    // Delete the project itself
    await Project.findByIdAndDelete(projectId).session(session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Project deleted successfully." });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: "Failed to delete project." });
  }
};

module.exports = {
  getProject,
  createProject,
  changeStatus,
  getCode,
  getTeam,
  joinTeam,
  leaveProject,
  deleteProject,
};
