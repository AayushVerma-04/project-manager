import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  ListTodo,
  CircleCheckBig,
  Circle,
  MoreVertical,
  Trash2,
} from "lucide-react";

const FeatureNode = ({
  feature,
  onAddFeature,
  onAddTask,
  onAssign,
  onDeleteFeature,
  children,
  teamMembers = [],
}) => {
  const [expanded, setExpanded] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // close menu on outside click
  useEffect(() => {
    function handleDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, [menuOpen]);

  return (
    <div className="ml-4 mt-2 group relative">
      <div className="flex items-center space-x-2 overlfow-visible">
        {/* Expand/Collapse */}
        {((children && children.length > 0) ||
          (feature.tasks && feature.tasks.length > 0)) ? (
          <button
            onClick={() => setExpanded((s) => !s)}
            className="text-gray-500 hover:text-gray-700"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        ) : (
          <div className="w-4" />
        )}

        {/* Feature name */}
        <span className="font-medium">{feature.name}</span>

        {/* Assigned user badge */}
        {feature.assignedTo && (
          <span className="ml-2 text-xs text-gray-600 bg-gray-100 rounded px-2 py-0.5">
            {feature.assignedTo.username || "Assigned"}
          </span>
        )}

        {/* 3-dot menu */}
        <div className="ml-auto relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((s) => !s)}
            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-100 text-gray-600 transition"
            aria-haspopup="true"
            aria-expanded={menuOpen}
            title="Actions"
          >
            <MoreVertical size={16} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50 overflow-visible">
              <button
                onClick={() => {
                  onAddTask(feature);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <ListTodo size={14} /> <span>Add Task</span>
              </button>

              <button
                onClick={() => {
                  onAddFeature(feature);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <Plus size={14} /> <span>Add Sub-feature</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm(`Delete feature "${feature.name}"?`)) {
                    onDeleteFeature(feature);
                  }
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2"
              >
                <Trash2 size={14} /> <span>Delete Feature</span>
              </button>

              <div className="border-t my-1" />

              {/* Unassign option */}
              <button
                onClick={() => {
                  onAssign(feature, null);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
              >
                Unassign Feature
              </button>

              <div className="px-2 py-1 text-xs text-gray-500">Assign to</div>

              {teamMembers && teamMembers.length > 0 ? (
                teamMembers.map((member) => (
                  <button
                    key={member._id}
                    onClick={() => {
                      onAssign(feature, member._id);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                  >
                    {member.username || member.name || member._id}
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No team members
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* children + tasks */}
      {expanded && (
        <div className="ml-6 border-l border-gray-200 pl-2">
          {/* Sub-features */}
          {children &&
            children.map((child) => (
              <FeatureNode
                key={child._id}
                feature={child}
                onAddFeature={onAddFeature}
                onAddTask={onAddTask}
                onAssign={onAssign}
                onDeleteFeature={onDeleteFeature}
                children={child.children}
                teamMembers={teamMembers}
              />
            ))}

          {/* Tasks */}
          {feature.tasks &&
            feature.tasks.map((task) => (
              <div
                key={task._id}
                className="flex items-center space-x-2 mt-1 ml-2 text-sm text-gray-700"
              >
                {task.status === "done" ? (
                  <CircleCheckBig size={14} className="text-green-500" />
                ) : (
                  <Circle size={14} className="text-gray-400" />
                )}
                <span>{task.title}</span>
                {task.assignedTo && (
                  <span className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-0.5">
                    {task.assignedTo.name || "Assigned"}
                  </span>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

/**
 * FeatureTree - top-level component
 */
const FeatureTree = ({
  features = [],
  tasks = [],
  onAddFeature,
  onAddTask,
  onAssign,
  onDeleteFeature,
  teamMembers = [],
}) => {
  const buildTree = (list = [], parentId = null) =>
    (list || [])
      .filter((f) => String(f.parentFeatureId || null) === String(parentId))
      .map((f) => ({
        ...f,
        children: buildTree(list, f._id),
        tasks: (tasks || []).filter(
          (t) => String(t.featureId || null) === String(f._id)
        ),
      }));

  const tree = buildTree(features || []);

  return (
  <div className="w-80 h-full overflow-y-auto rounded-2xl bg-white">
    <div className="px-3 py-3">
      {/* Header with Add Root Feature button */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold">Feature Tree</h2>
        <button
          onClick={() => onAddFeature(null)} // parent = null → root feature
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"
          title="Add Root Feature"
        >
          <Plus size={18} />
        </button>
      </div>

      {tree.length > 0 ? (
        tree.map((feature) => (
          <FeatureNode
            key={feature._id}
            feature={feature}
            onAddFeature={onAddFeature}
            onAddTask={onAddTask}
            onAssign={onAssign}
            onDeleteFeature={onDeleteFeature}
            children={feature.children}
            teamMembers={teamMembers}
          />
        ))
      ) : (
        <p className="text-gray-500">No features yet</p>
      )}
    </div>
  </div>
);
};

export default FeatureTree;
