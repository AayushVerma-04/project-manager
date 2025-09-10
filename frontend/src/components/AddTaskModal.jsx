import React, { useState } from "react";

const AddTaskModal = ({ isOpen, onClose, onAddTask, featureId }) => {
  // console.log("AddTaskModal featureId:", featureId);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null; // don’t render if not open

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Pass new task data up to parent
    onAddTask({
      title,
      description,
      featureId: featureId || null,
    });

    // Reset + close
    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Add Task</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter task title"
            />
          </div>

          {/* Task Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter task description"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
