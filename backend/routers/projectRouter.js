const express = require('express');
const requireAuth = require('../middlewares/requireAuth');
const {
  getProject,
  createProject,
  getCode,
  getTeam,
  changeStatus,
  joinTeam,
  leaveProject,
  deleteProject
} = require('../controllers/projectControllers');
const taskRouter = require('./taskRouter');

const projectRouter = express.Router();

projectRouter.use(requireAuth);

projectRouter.post('/', createProject);

projectRouter.get('/:projectId', getProject);

projectRouter.use('/:projectId/tasks', taskRouter)

projectRouter.get('/:projectId/code', getCode);

projectRouter.get('/:projectId/team', getTeam);

projectRouter.put('/:projectId/status', changeStatus);

projectRouter.post('/join', joinTeam);

projectRouter.delete('/:projectId/leave', leaveProject);

projectRouter.delete('/:projectId', deleteProject);

module.exports = projectRouter;
