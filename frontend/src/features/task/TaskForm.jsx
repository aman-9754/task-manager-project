import { useState } from "react";

const TaskForm = ({ onCreate }) => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    await onCreate(form);

    setLoading(false);

    setForm({
      title: "",
      description: "",
      priority: "medium",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-5 shadow-xl shadow-slate-950/20"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Quick create
          </p>
          <h1 className="mt-2 text-2xl font-bold text-white">Create New Task</h1>
          <p className="mt-1 text-sm text-slate-400">
            Capture the next thing to do without leaving the page.
          </p>
        </div>
        <div className="hidden rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 sm:block">
          New item
        </div>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Task title"
          className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-slate-900"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <textarea
          placeholder="Description"
          className="min-h-28 w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-slate-900"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        ></textarea>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <select
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:bg-slate-900 sm:max-w-48"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
          </select>

          <button className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-sky-500 to-cyan-500 px-5 py-3 font-semibold text-white shadow-lg shadow-cyan-950/30 transition hover:-translate-y-0.5 hover:from-sky-400 hover:to-cyan-400">
            {loading ? "Adding..." : "Add Task"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default TaskForm;
