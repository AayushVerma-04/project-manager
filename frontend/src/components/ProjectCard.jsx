import React from "react";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project }) => {
  if (!project) return null;
  //console.log("ProjectCard", project);
  const navigate = useNavigate();
  const borderColor =
    project.status === "completed" ? "border-blue-500" : "border-red-500";

  return (
    <div className={`border-2 ${borderColor} rounded-xl shadow-md p-5 bg-white hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer`} 
      onClick={() => navigate(`/projects/${project._id}`)}
    >
      <h2 className="text-2xl font-bold text-indigo-800 mb-2">{project.title}</h2>
      <p className="text-gray-700 text-sm mb-3">
        {project.description || "No description provided."}
      </p>

      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600">
        <p><span className="font-semibold">Admin:</span> {project.admin?.username || "N/A"}</p>
        <p><span className="font-semibold">Status:</span> {project.status}</p>
        <p><span className="font-semibold">Team Members:</span> {project.team?.length || 0}</p>
        <p><span className="font-semibold">Tasks:</span> {project.tasks?.length || 0}</p>
        <p><span className="font-semibold">Created:</span> {new Date(project.createdAt).toLocaleDateString()}</p>
        <p><span className="font-semibold">Code:</span> {project.code}</p>
      </div>
    </div>
  );
};

export default ProjectCard;