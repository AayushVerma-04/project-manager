const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required : true
  },
  description: {
    type: String,
    required : true
  },
  deadline: {
    type: Date,
    required : false
  },
  status: {
    type: String,
    enum : ['todo', 'assigned', 'in-progress', 'completed'],
    default : 'todo'
  },
  projectId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Project'
  },
  assignedTo:{
    type: mongoose.Types.ObjectId,
    ref: 'User',
    default: null
  },
  tags: [{ type: String, lowercase: true, trim: true }],
}, {timestamps: true});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task