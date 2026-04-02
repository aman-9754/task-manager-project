import TaskItem from "./TaskItem";

const TaskList = ({ tasks, onDelete, onUpdate }) => {
  // console.log(tasks)
  // if (!tasks.length) {  // error is fixed but the below one is more safe
  if (!tasks || !tasks.length) {
    return <p className="text-center"> No tasks found</p>;
  }
  
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

export default TaskList;
