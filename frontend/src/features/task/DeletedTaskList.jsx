const DeletedTaskList = ({ tasks, onRestore }) => {
  if (!tasks || tasks.length === 0) {
    return <p className="py-4 text-center text-sm text-slate-400">No deleted tasks</p>;
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/10"
        >
          <div>
            <p className="font-semibold text-white">{task.title}</p>
            <p className="text-xs text-slate-400">Moved to trash</p>
          </div>

          <button
            onClick={() => onRestore(task._id)}
            className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400"
          >
            Restore
          </button>
        </div>
      ))}
    </div>
  );
};

export default DeletedTaskList;
