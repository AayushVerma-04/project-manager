import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthContext from "../hooks/useAuthContext";
import KanbanBoard from "../components/KanbanBoard";
import ProjectSidebar from "../components/ProjectSidebar";
import AddTaskModal from "../components/AddTaskModal"; // <-- use existing modal

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const Project = () => {
  const { projectId } = useParams();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [features, setFeatures] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);

  // modal state
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  // Fetch project, tasks, team, features
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
        const [projectRes, tasksRes, teamRes, featureRes] = await Promise.all([
          axios.get(`${baseUrl}/api/project/${projectId}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          axios.get(`${baseUrl}/api/project/${projectId}/tasks`, {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          axios.get(`${baseUrl}/api/project/${projectId}/team`, {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          axios.get(`${baseUrl}/api/project/${projectId}/features`, {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
        ]);
        setProject(projectRes.data);
        setTasks(tasksRes.data);
        setTeamMembers(teamRes.data);
        setFeatures(featureRes.data);
      } catch (err) {
        console.error("Error fetching project data:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjectData();
  }, [projectId, user]);

  // Add Task
  const handleAddTask = async (newTask) => {
    try {
      const res = await axios.post(
        `${baseUrl}/api/project/${projectId}/tasks`,
        newTask,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setTasks([...tasks, res.data]);
    } catch (err) {
      console.error("Error adding task:", err);
      setError(err);
    }
  };

  const handleDeleteFeature = async (feature) => {
    try {
      const res = await axios.delete(
        `${baseUrl}/api/project/${projectId}/features/${feature._id}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      // helper: find all descendant IDs
      const getDescendantIds = (fid, allFeatures) => {
        let ids = [fid];
        const children = allFeatures.filter((f) => f.parentFeatureId === fid);
        for (const child of children) {
          ids = ids.concat(getDescendantIds(child._id, allFeatures));
        }
        return ids;
      };

      // get all feature IDs to remove
      const deletedFeatureIds = getDescendantIds(feature._id, features);

      // update state
      setFeatures(features.filter((f) => !deletedFeatureIds.includes(f._id)));
      setTasks(tasks.filter((t) => !deletedFeatureIds.includes(t.featureId)));
    } catch (error) {
      console.error("Error deleting feature:", error);
      setError(error);
    }
  };

  // Update Task
  const handleTaskUpdate = async (taskId, updatedTask) => {
    // console.log(updatedTask);
    try {
      const res = await axios.put(
        `${baseUrl}/api/project/${projectId}/tasks/${taskId}`,
        { status: updatedTask.status, assignedTo: updatedTask.assignedTo },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setTasks(tasks.map((task) => (task._id === taskId ? res.data : task)));
    } catch (err) {
      console.error("Error updating task:", err);
      setError(err);
    }
  };

  // Delete Task
  const handleTaskDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(
          `${baseUrl}/api/project/${projectId}/tasks/${taskId}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setTasks(tasks.filter((task) => task._id !== taskId));
      } catch (err) {
        console.error("Error deleting task:", err);
        setError(err);
      }
    }
  };

  // Leave Project
  const handleLeaveProject = async () => {
    if (window.confirm("Are you sure you want to leave this project?")) {
      try {
        await axios.delete(`${baseUrl}/api/project/${projectId}/leave`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        navigate("/home");
      } catch (err) {
        console.error("Error leaving project:", err);
        setError(err.response?.data?.message || "Failed to leave project.");
      }
    }
  };

  // console.log(project);
  const isUserAdmin = project?.admin?._id === user?.id;

  // Delete Project
  const handleDeleteProject = async () => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this project?"
      )
    ) {
      try {
        await axios.delete(`${baseUrl}/api/project/${projectId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        navigate("/home");
      } catch (err) {
        console.error("Error deleting project:", err);
        setError(err.response?.data?.message || "Failed to delete project.");
      }
    }
  };

  if (isLoading || !project) {
    return (
      <div className="text-center p-8 text-xl font-bold text-gray-500">
        Loading project data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-xl font-bold text-red-500">
        Error: {error.message}
      </div>
    );
  }

  // Handlers for sidebar actions
  const handleAddFeature = async (parentFeature) => {
    const name = prompt("Enter name for the new feature:");
    if (!name) return;

    try {
      const res = await axios.post(
        `${baseUrl}/api/project/${projectId}/features`,
        {
          name,
          parentFeatureId: parentFeature ? parentFeature._id : null, // null for root-level feature
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const newFeature = res.data;

      // ✅ Update state to include new feature
      setFeatures((prev) => [...prev, newFeature]);

      // console.log("Feature added:", newFeature);
    } catch (err) {
      console.error("Error adding feature:", err);
      setError(err);
    }
  };

  const handleAssignFeature = async (feature, memberId) => {
  try {
    const res = await axios.post(
      `${baseUrl}/api/project/${projectId}/features/${feature._id}/assign`,
      { userId: memberId },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );

    const updatedFeature = res.data.feature;

    // ✅ Update features list
    setFeatures((prev) =>
      prev.map((f) => (f._id === updatedFeature._id ? updatedFeature : f))
    );
    let newStatus = updatedFeature.assignedTo ? "assigned" : "todo";
    // ✅ Update only non-completed tasks for this feature
    setTasks((prev) =>
      prev.map((t) =>
        t.featureId === updatedFeature._id && t.status !== "completed"
          ? { ...t, assignedTo: updatedFeature.assignedTo, status: newStatus }
          : t
      )
    );
  } catch (err) {
    console.error("Error assigning feature:", err);
    setError(err);
  }
};


  return (
    <div className="flex h-screen">
      {/* Sidebar with FeatureTree */}
      <ProjectSidebar
        features={features}
        tasks={tasks}
        onAddFeature={handleAddFeature}
        onAddTask={(feature) => {
          setIsAddTaskOpen(true);
          setSelectedFeature(feature._id);
        }}
        onAssign={handleAssignFeature}
        onDeleteFeature={handleDeleteFeature}
        teamMembers={teamMembers}
      />

      {/* Main content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Project: {project.title}
          </h1>

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

        {/* Button to open Add Task Modal */}
        <button
          onClick={() => setIsAddTaskOpen(true)}
          className="mb-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
          + Add Task
        </button>

        <KanbanBoard
          tasks={tasks}
          teamMembers={teamMembers}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
        />

        {/* Use AddTaskModal */}
        <AddTaskModal
          isOpen={isAddTaskOpen}
          onClose={() => {
            setIsAddTaskOpen(false);
            setSelectedFeature(null);
          }}
          onAddTask={handleAddTask}
          featureId={selectedFeature}
        />
      </div>
    </div>
  );
};

export default Project;
