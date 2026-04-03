import { useState } from "react";

const TaskForm = ({ onCreate }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(form);

    setForm({
      title: "",
      description: "",
      priority: "medium",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded mb-4">
      <h1 className="text-xl mb-4 font-semibold">Create New Task</h1>
      <input
        type="text"
        placeholder="Task Title"
        className="w-full border p-2 m-2"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />

      <textarea
        name=""
        placeholder="Description"
        className="w-full border p-2 m-2"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        required
      ></textarea>

      <select
        name=""
        className="w-full border p-2 m-2"
        value={form.priority}
        onChange={(e) => setForm({ ...form, priority: e.target.value })}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
