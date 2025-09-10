// --- KanbanColumn Component ---
import TaskCard from './TaskCard';

const KanbanColumn = ({ title, tasks, teamMembers, onTaskUpdate, onTaskDelete }) => {
  return (
    <div className="flex-1 min-w-[280px] bg-gray-100 p-4 rounded-lg shadow-inner">
      <h2 className="text-xl font-bold text-center text-gray-700 mb-4">{title}</h2>

      {/* Tasks list without forced height/scroll */}
      <div className="space-y-3">
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
          <p className="text-center text-gray-500 text-sm italic">
            No tasks in this column.
          </p>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
