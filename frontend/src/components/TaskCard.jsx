import useAuthContext from "../hooks/useAuthContext";

const TaskCard = ({ task, teamMembers, onTaskUpdate, onTaskDelete }) => {
  const { user } = useAuthContext();
  const currentUserId = user.id; // Corrected to use user._id

  // Find the assigned user's name
  const assignedMember = teamMembers.find(member => member._id === task.assignedTo);

  // Function to handle the assignment dropdown change
  const handleAssignChange = (e) => {
    const newAssignedTo = e.target.value === '' ? null : e.target.value;
    const newStatus = newAssignedTo ? 'assigned' : 'todo';
    onTaskUpdate(task._id, { ...task, assignedTo: newAssignedTo, status: newStatus });
  };

  // Function to handle the 'Accept' button click
  const handleAcceptTask = () => {
    onTaskUpdate(task._id, { ...task, status: 'in-progress' });
  };

  // Function to handle the 'Completed' checkbox change
  const handleCompleteTask = (e) => {
    const newStatus = e.target.checked ? 'completed' : 'in-progress';
    onTaskUpdate(task._id, { ...task, status: newStatus });
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-md p-4 mb-3 border-l-4 border-indigo-500">
      {/* Delete button that appears on hover */}
      <button
        onClick={() => onTaskDelete(task._id)}
        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        aria-label="Delete Task"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 112 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
        </svg>
      </button>

      <h3 className="font-semibold text-gray-800">{task.title}</h3>
      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
      
      {/* Display who the task is assigned to */}
      {assignedMember && (
        <p className="text-xs text-gray-500 mb-2">Assigned to: <span className="font-medium">{assignedMember.username}</span></p>
      )}

      {/* Conditional rendering of interactive elements */}
      {(task.status === 'todo' || task.status === 'assigned' || task.status === 'in-progress') && (
        <div className="mt-2">
          <label htmlFor={`assign-${task._id}`} className="block text-sm font-medium text-gray-700">Assign to:</label>
          <select
            id={`assign-${task._id}`}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            onChange={handleAssignChange}
            value={task.assignedTo || ''}
          >
            <option value="">Unassigned</option>
            {teamMembers.map(member => (
              <option key={member._id} value={member._id}>{member.username}</option>
            ))}
          </select>
        </div>
      )}

      {task.status === 'assigned' && task.assignedTo === currentUserId && (
        <div className="mt-2">
          <button
            onClick={handleAcceptTask}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md text-sm transition duration-300"
          >
            Accept Task
          </button>
        </div>
      )}

      {task.status === 'in-progress' && task.assignedTo === currentUserId && (
        <div className="mt-2 flex items-center">
          <input
            type="checkbox"
            id={`complete-${task._id}`}
            checked={false}
            onChange={handleCompleteTask}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor={`complete-${task._id}`} className="ml-2 block text-sm text-gray-900">
            Mark as Completed
          </label>
        </div>
      )}
    </div>
  );
};

export default TaskCard;