// --- Task Creation Form Component ---
// Allows a user to create a new task.
import React, { useState } from 'react';
const TaskForm = ({ onAddTask }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskTitle.trim() === '') return;

    const newTask = {
      title: taskTitle,
      description: taskDesc,
    };
    
    onAddTask(newTask);
    setTaskTitle('');
    setTaskDesc('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-3">Add a New Task</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700">Task Title</label>
          <input
            type="text"
            id="taskTitle"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="taskDesc" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="taskDesc"
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
            rows="2"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
        >
          Add Task
        </button>
      </div>
    </form>
  );
};


export default TaskForm;