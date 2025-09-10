import React, { useState } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import FeatureTree from "./FeatureTree";

const ProjectSidebar = ({ features, tasks, onAddFeature, onAddTask, onAssign, onDeleteFeature, teamMembers }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ${
          open ? "w-80" : "w-12"
        } bg-white border-r border-gray-200 flex flex-col`}
      >
        {/* Toggle Button */}
        <div className="flex justify-end p-2">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            {open ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
          </button>
        </div>

        {/* Feature Tree */}
        {open && (
          <div className="flex-1 p-0">
            <div className="p-0 bg-white rounded-lg shadow-none m-0 overflow-visible">
              <FeatureTree
                features={features}
                tasks={tasks}
                onAddFeature={onAddFeature}
                onAddTask={onAddTask}
                onAssign={onAssign}
                onDeleteFeature={onDeleteFeature}
                teamMembers={teamMembers}
              />
            </div>
          </div>
        )}
      </div>

      {/* Right-hand main content (Kanban etc.) will be outside this component */}
    </div>
  );
};

export default ProjectSidebar;
