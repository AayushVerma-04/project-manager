const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  admin: {
    _id: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true
    },
    username: {
      type: String,
      required: true
    }
  },
  team: [{
    type: mongoose.Types.ObjectId,
    ref: 'User',
    default : null
  }],
  tasks: [{
    type: mongoose.Types.ObjectId,
    ref: 'Task'
  }],
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending'
  },
  code: {
    type: String
  }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
