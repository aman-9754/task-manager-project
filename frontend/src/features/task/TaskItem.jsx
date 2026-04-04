// Single responsibility → shows ONE task

const TaskItem = ({ task, onDelete, onUpdate }) => {
  const getPriorityColor = () => {
    if (task.priority === "high") return "text-red-500";
    if (task.priority === "medium") return "text-yellow-500";
  };

  const handleDeleteTaskClick = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      onDelete(task._id);
    }
  };

  return (
    // <div className="bg-gray-100 p-4 rounded shadow flex justify-between items-center">
    <div className="bg-white p-4 rounded shadow flex justify-between items-center gap-3 hover:shadow-md transition">
      <div>
        <h3 className="font-bold"> {task.title} </h3>
        <p className="text-gray-600">{task.description}</p>

        <div className="text-sm mt-2">
          <span>Status: {task.status}</span> |{" "}
          <span>
            Priority:
            <span className={getPriorityColor()}> {task.priority}</span>
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        {task.status !== "completed" && (
          <button
            onClick={() =>
              onUpdate(task._id, {
                status: "completed",
              })
            }
            className="bg-green-500 text-white px-2 rounded cursor-pointer"
          >
            Done
          </button>
        )}

        <button
          className="bg-red-500 text-white px-2 rounded h-8 cursor-pointer"
          // onClick={() => onDelete(task._id)}
          onClick={handleDeleteTaskClick}
        >
          {" "}
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
