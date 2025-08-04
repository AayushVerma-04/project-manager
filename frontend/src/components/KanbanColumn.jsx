// --- KanbanColumn Component ---
// Renders a single column with a title and a list of tasks.
import TaskCard from './TaskCard';
const KanbanColumn = ({ title, tasks, teamMembers, onTaskUpdate, onTaskDelete }) => {
  return (
    <div className="flex-1 min-w-[280px] bg-gray-100 p-4 rounded-lg shadow-inner">
      <h2 className="text-xl font-bold text-center text-gray-700 mb-4">{title}</h2>
      <div className="h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar pr-2">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskCard 
              key={task._id} 
              task={task} 
              teamMembers={teamMembers} 
              onTaskUpdate={onTaskUpdate}
              onTaskDelete={onTaskDelete}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 text-sm italic">No tasks in this column.</p>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;