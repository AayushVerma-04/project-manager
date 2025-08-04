const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../Models/userModel");
const Project = require("../Models/projectModel");

const createToken = (_id) => {
  const secret = process.env.jwt_secret;
  return jwt.sign({ _id }, secret, { expiresIn: "3d" });
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.login(email, password);
    const token = createToken(user._id);

    return res
      .status(200)
      .json({ id: user._id, username: user.username, email, token });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.signup(username, email, password);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const token = createToken(user._id);
    res.status(201).json({ id: user._id, username, email, token });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Get projects where the user is an admin
const getUserProjects = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('userProjects');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user.userProjects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user projects' });
  }
};

// Get projects where the user is a team member (not admin)
const getOtherProjects = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('otherProjects');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user.otherProjects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch other projects' });
  }
};

// Get tasks assigned to the user
const getUserTasks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('tasks');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user.tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user tasks' });
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

    res.status(200).json({ message: "Successfully joined the team", projectId: project._id });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ error: "Failed to join team." });
  }
};


// const updateUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { username, password } = req.body;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Update username if provided
//     if (username) {
//       if (validator.isNumeric(username)) {
//         return res.status(400).json({ message: "Username cannot be a number" });
//       }
//       user.username = username;
//     }

    // Update password if provided
//     if (password) {
//       const validator = require("validator");
//       const bcrypt = require("bcryptjs");

//       if (!validator.isStrongPassword(password)) {
//         return res.status(400).json({ message: "Password not strong enough" });
//       }

//       const salt = await bcrypt.genSalt(10);
//       const hashed = await bcrypt.hash(password, salt);
//       user.password = hashed;
//     }

//     await user.save();

//     res.status(200).json({
//       id: user._id,
//       username: user.username,
//       email: user.email,
//       message: "User updated successfully",
//     });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// const deleteUser = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const user = await User.findById(userId).populate("tasks");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const sess = await mongoose.startSession();
//     sess.startTransaction();

//     await Task.deleteMany({ _id: { $in: user.tasks } }, { session: sess });
//     await user.deleteOne();

//     await sess.commitTransaction();
//     sess.endSession();

//     res.status(200).json({ message: "User deleted successfully" });
//   } catch (error) {
//     return res.status(400).json({ message: error.message });
//   }
// };

module.exports = {
  getUser,
  login,
  signup,
  getUserProjects,
  getOtherProjects,
  getUserTasks,
  joinTeam
};
