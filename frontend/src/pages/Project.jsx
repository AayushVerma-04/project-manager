import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import useAuthContext from '../hooks/useAuthContext';
import KanbanBoard from '../components/KanbanBoard';
import TaskForm from '../components/TaskForm';

// The base URL for your API
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const Project = () => {
  const { projectId } = useParams();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [project, setProject] = useState(null); // New state to hold project details
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      setIsLoading(true);
      setError(null);
      if (!user || !user.token) {
        setError(new Error("User not authenticated."));
        setIsLoading(false);
        return;
      }
      try {
        // Use Promise.all to fetch all necessary data concurrently
        const [projectRes, tasksRes, teamRes] = await Promise.all([
          axios.get(
            `${baseUrl}/api/project/${projectId}`,
            { headers: { Authorization: `Bearer ${user.token}` } }
          ),
          axios.get(
            `${baseUrl}/api/project/${projectId}/tasks`,
            { headers: { Authorization: `Bearer ${user.token}` } }
          ),
          axios.get(
            `${baseUrl}/api/project/${projectId}/team`,
            { headers: { Authorization: `Bearer ${user.token}` } }
          )
        ]);
        setProject(projectRes.data); // Set the project details
        setTasks(tasksRes.data);
        setTeamMembers(teamRes.data);
      } catch (err) {
        console.error("Error fetching project data:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjectData();
  }, [projectId, user]); // Depend on projectId and user to refetch when needed

  // Function to handle adding a new task
  const handleAddTask = async (newTask) => {
    try {
      const res = await axios.post(
        `${baseUrl}/api/project/${projectId}/tasks`,
        newTask,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setTasks([...tasks, res.data]); // Use the returned task from the backend
    } catch (err) {
      console.error("Error adding task:", err);
      setError(err);
    }
  };

  // Function to update a task's status or assignment
  const handleTaskUpdate = async (taskId, updatedTask) => {
    try {
      const res = await axios.put(
        `${baseUrl}/api/project/${projectId}/tasks/${taskId}`,
        { status: updatedTask.status, assignedTo: updatedTask.assignedTo },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setTasks(tasks.map(task => (task._id === taskId ? res.data : task)));
    } catch (err) {
      console.error("Error updating task:", err);
      setError(err);
    }
  };
  
  // Function to handle deleting a task
  const handleTaskDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(
          `${baseUrl}/api/project/${projectId}/tasks/${taskId}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        // Remove the task from the local state
        setTasks(tasks.filter(task => task._id !== taskId));
      } catch (err) {
        console.error("Error deleting task:", err);
        setError(err);
      }
    }
  };

  // Function to handle leaving the project
  const handleLeaveProject = async () => {
    if (window.confirm("Are you sure you want to leave this project?")) {
      try {
        await axios.delete(
          `${baseURL}/api/project/${projectId}/leave`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        //console.log("Successfully left project:", projectId);
        navigate('/home'); // Redirect to home page after leaving
      } catch (err) {
        console.error("Error leaving project:", err);
        setError(err.response?.data?.message || 'Failed to leave project.');
      }
    }
  };

  // Function to handle deleting the project (for admin only)
  const handleDeleteProject = async () => {
    if (window.confirm("Are you sure you want to permanently delete this project? This action cannot be undone.")) {
      try {
        await axios.delete(
          `${baseURL}/api/project/${projectId}/delete`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        //console.log("Successfully deleted project:", projectId);
        navigate('/home'); // Redirect to home page after deletion
      } catch (err) {
        console.error("Error deleting project:", err);
        setError(err.response?.data?.message || 'Failed to delete project.');
      }
    }
  };

  if (isLoading || !project) {
    return <div className="text-center p-8 text-xl font-bold text-gray-500">Loading project data...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-xl font-bold text-red-500">Error: {error.message}</div>;
  }

  // Check if the current user is the admin
  const isUserAdmin = project.admin?._id === user?.id;

  return (
    <div className="container mx-auto p-4 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-gray-900">Project: {project.title}</h1>
        
        {/* Conditional rendering for Leave vs. Delete button */}
        {isUserAdmin ? (
          <button
            onClick={handleDeleteProject}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
          >
            Delete Project
          </button>
        ) : (
          <button
            onClick={handleLeaveProject}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
          >
            Leave Project
          </button>
        )}
      </div>
      <TaskForm onAddTask={handleAddTask} />
      <KanbanBoard 
        tasks={tasks} 
        teamMembers={teamMembers} 
        onTaskUpdate={handleTaskUpdate} 
        onTaskDelete={handleTaskDelete}
      />
    </div>
  );
};

export default Project;
