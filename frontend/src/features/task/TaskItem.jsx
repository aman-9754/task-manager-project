// Single responsibility → shows ONE task

const TaskItem = ({ task, onDelete, onUpdate }) => {
  const getPriorityColor = () => {
    if (task.priority === "high")
      return "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/25";
    if (task.priority === "medium")
      return "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/25";
    return "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/25";
  };

  const getStatusColor = () => {
    if (task.status === "completed")
      return "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/25";
    if (task.status === "in-progress")
      return "bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/25";
    return "bg-slate-500/15 text-slate-300 ring-1 ring-slate-500/25";
  };

  const handleDeleteTaskClick = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      onDelete(task._id);
    }
  };

  return (
    <div className="group rounded-3xl border border-white/10 bg-slate-900/75 p-5 shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-950/30">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-white">{task.title}</h3>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${getStatusColor()}`}
            >
              {task.status}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${getPriorityColor()}`}
            >
              {task.priority}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {task.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="rounded-full bg-white/5 px-3 py-1 text-slate-200 ring-1 ring-white/10">
              Created task
            </span>
            {task.dueDate ? (
              <span className="rounded-full bg-white/5 px-3 py-1 text-slate-200 ring-1 ring-white/10">
                Due {new Date(task.dueDate).toLocaleDateString()}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex gap-2 md:ml-4">
          {task.status !== "completed" && (
            <button
              onClick={() =>
                onUpdate(task._id, {
                  status: "completed",
                })
              }
              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400"
            >
              Done
            </button>
          )}

          <button
            className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
            // onClick={() => onDelete(task._id)}
            onClick={handleDeleteTaskClick}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
