const DeletedTaskList = ({ tasks, onRestore }) => {
  if (!tasks || tasks.length === 0) {
    return <p className="text-gray-500 text-center">No deleted tasks</p>;
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="bg-gray-100 p-3 rounded flex justify-between"
        >
          <span>{task.title}</span>

          <button
            onClick={() => onRestore(task._id)}
            className="bg-green-500 text-white px-2 py-1 rounded cursor-pointer"
          >
            Restore
          </button>
        </div>
      ))}
    </div>
  );
};

export default DeletedTaskList;
