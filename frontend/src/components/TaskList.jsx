import { FaEdit, FaTrash } from "react-icons/fa";

const TaskList = ({ tasks, onToggleComplete, onEdit, onDelete }) => {
  
  const getDaysLeft = (deadline) => {
    const today = new Date();
    const dueDate = new Date(deadline);

    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate - today;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.isCompleted && !b.isCompleted) return 1;
    if (!a.isCompleted && b.isCompleted) return -1;
    return new Date(a.deadline) - new Date(b.deadline);
  });

  return tasks.length === 0 ? (
    <p className="ml-4 p-4 text-gray-600 text-lg italic bg-gray-50 border border-dashed border-gray-300 rounded">
      No pending task
    </p>
  ) : (
    <div className="p-4 space-y-4">
      {sortedTasks.map((task) => {
        const daysLeft = getDaysLeft(task.deadline);
        const isDueSoon = daysLeft <= 1;

        const cardClasses = `flex items-center justify-between p-4 shadow rounded ${
          isDueSoon && !task.isCompleted ? "bg-red-100 border border-red-400" : "bg-white"
        }`;

        return (
          <div key={task._id} className={cardClasses}>
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={task.isCompleted}
                onChange={() => onToggleComplete(task._id)}
                className="w-5 h-5"
              />
              <div>
                <h3
                  className={`font-semibold ${
                    task.isCompleted ? "line-through text-gray-500" : ""
                  }`}
                >
                  {task.title}
                </h3>
                <p className="text-sm text-gray-600">
                  Deadline: {new Date(task.deadline).toLocaleDateString()} (
                  {daysLeft === 0
                    ? "due today"
                    : `${Math.abs(daysLeft)} day${
                        Math.abs(daysLeft) !== 1 ? "s" : ""
                      } ${daysLeft > 0 ? "left" : "overdue"}`}
                  )
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => onEdit(task)}
                title="Edit Task"
                className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-transform transform hover:scale-110"
              >
                <FaEdit className="text-blue-600" />
              </button>
              <button
                onClick={() => onDelete(task)}
                title="Delete Task"
                className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition-transform transform hover:scale-110"
              >
                <FaTrash className="text-red-600" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;
