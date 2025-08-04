// --- KanbanBoard Component ---
// The container for all four columns.
import KanbanColumn from './KanbanColumn';
const KanbanBoard = ({ tasks, teamMembers, onTaskUpdate, onTaskDelete }) => {
  // Filter tasks into their respective columns
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const assignedTasks = tasks.filter(task => task.status === 'assigned');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (
    <div className="flex flex-col md:flex-row gap-4 p-6 bg-gray-50 rounded-lg">
      <KanbanColumn 
        title="ToDo" 
        tasks={todoTasks} 
        teamMembers={teamMembers} 
        onTaskUpdate={onTaskUpdate}
        onTaskDelete={onTaskDelete}
      />
      <KanbanColumn 
        title="Assigned" 
        tasks={assignedTasks} 
        teamMembers={teamMembers} 
        onTaskUpdate={onTaskUpdate}
        onTaskDelete={onTaskDelete}
      />
      <KanbanColumn 
        title="In Progress" 
        tasks={inProgressTasks} 
        teamMembers={teamMembers} 
        onTaskUpdate={onTaskUpdate}
        onTaskDelete={onTaskDelete}
      />
      <KanbanColumn 
        title="Completed" 
        tasks={completedTasks} 
        teamMembers={teamMembers} 
        onTaskUpdate={onTaskUpdate}
        onTaskDelete={onTaskDelete}
      />
    </div>
  );
};
export default KanbanBoard;