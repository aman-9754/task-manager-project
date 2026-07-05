import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  createTask,
  deleteTask,
  getAllTasks,
  updateTask,
  getTaskAnalytics,
  restoreTask,
} from "../api/taskApi";

import TaskForm from "../features/task/TaskForm";
import TaskList from "../features/task/TaskList";
import FilterBar from "../features/task/FilterBar";
import Analytics from "../features/task/Analytics";
import toast from "react-hot-toast";
import Pagination from "../features/task/Pagination";
import DeletedTaskList from "../features/task/DeletedTaskList";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({});
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1, // current page
    limit: 5, // tasks per page
    totalPages: 1, // from backend
  });

  const [deletedTasks, setDeletedTasks] = useState([]);
  const [deletedPagination, setDeletedPagination] = useState({
    page: 1,
    limit: 5,
    totalPages: 1,
  });

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  // fetch tasks
  const fetchTasks = async (query = {}) => {
    try {
      setLoading(true);

      // const res = await getAllTasks(query);
      // console.log(res);

      const res = await getAllTasks({
        ...query,
        page: pagination.page,
        limit: pagination.limit,
      });

      const data = res.data.data;
      setTasks(data.tasks);
      // setTasks(res.data.data.tasks); // we have to write this

      // update pagination info
      setPagination((prev) => ({
        ...prev,
        totalPages: data.totalPages,
      }));
    } catch (err) {
      // console.log("aman3");
      // console.error("Fetch All Tasks Error :", err);
      toast.error("Failed to fetch tasks!");
    } finally {
      setLoading(false);
    }
  };

  // fetch only deleted tasks (only where task.isDeleted = false)
  const fetchDeletedTasks = async () => {
    try {
      const res = await getAllTasks({
        isDeleted: true,
        page: deletedPagination.page,
        limit: deletedPagination.limit,
      });

      const data = res.data.data;

      setDeletedTasks(data.tasks);

      setDeletedPagination((prev) => ({
        ...prev,
        totalPages: data.totalPages,
      }));
    } catch (err) {
      toast.error("Failed to fetch deleted tasks");
    }
  };

  // create task
  // const handleCreate = async (data) => {
  //   try {
  //     const res = await createTask(data);
  //     // UI update
  //     setTasks((prev) => [res.data.data, ...prev]);
  //     // setTasks((prev) => [res.data.data.tasks, ...prev]);  // this is not required here, print the res and then decide what to write

  //     toast.success("Task Created Successfully!");
  //     fetchAnalytics();
  //   } catch (error) {
  //     // console.error("Create Task Error : ", error);
  //     toast.error("Failed to create task!");
  //   }
  // };

  const handleCreate = async (data) => {
    try {
      const res = await createTask(data);
      const createdTask = res.data.data;

      // move to the first page (new task will be there)
      setPagination((prev) => ({
        ...prev,
        page: 1,
      }));

      setTasks((prev) => {
        const nextTasks = [
          createdTask,
          ...prev.filter((task) => task._id !== createdTask._id),
        ];

        return nextTasks.slice(0, pagination.limit);
      });

      toast.success("Task Created Successfully!");
      fetchAnalytics();
    } catch (error) {
      // console.error("Create Task Error : ", error);
      toast.error("Failed to create task!");
    }
  };

  // update task
  const handleUpdate = async (id, data) => {
    try {
      const res = await updateTask(id, data);
      // here first see the res and then take the decision that what should we used res.data.data or res.data.data.tasks (it depends on the reponse we have returned)
      // console.log(res.data.data);

      // You used {} → but did NOT return anything, So this function returns undefined
      // setTasks((prev) => {
      //   prev.map((t) => (t._id === id ? res.data.data : t));
      // });

      setTasks((prev) => prev.map((t) => (t._id === id ? res.data.data : t)));
      toast.success("Task Updated Successfully!");
      fetchAnalytics();
    } catch (error) {
      // console.error("Update Task Error : ", error);
      toast.error("Failed to update task!");
    }
  };

  // delete task
  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));

      // toast.success("Task Deleted Successfully!");
      toast.success("Task moved to trash!");

      fetchAnalytics();
      fetchDeletedTasks(); // updated deleted task list
    } catch (error) {
      // console.error("Delete Task Error:", err);
      toast.error("Failed to delete task!");
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await getTaskAnalytics();
      // console.log(res.data.data);
      setAnalytics(res.data.data);
    } catch (error) {
      console.error("Analtics Error :", error);
    }
  };

  const handleFilterChange = (name, value) => {
    // clear all filters
    if (name === "clear") {
      setFilters({});
      setPagination((prev) => ({ ...prev, page: 1 }));
      return;
    }

    setFilters((prev) => {
      let updated;

      // remove filter if empty
      if (!value) {
        updated = { ...prev };
        delete updated[name];
      } else {
        updated = {
          ...prev,
          [name]: value,
        };
      }

      return updated;
    });

    // reset page
    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  const handleRestore = async (id) => {
    try {
      await restoreTask(id);

      toast.success("Task restored successfully!");

      fetchTasks(filters); // back to active
      fetchDeletedTasks(); // remove from deleted list
      fetchAnalytics(); // update states
    } catch (err) {
      toast.error("Failed to Restore the task!");
    }
  };

  // useEffect(() => {
  //   fetchTasks();
  // }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [filters]);

  useEffect(() => {
    fetchTasks(filters);
  }, [filters, pagination.page]);

  useEffect(() => {
    fetchDeletedTasks();
  }, [deletedPagination.page]);

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="absolute left-0 top-16 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="absolute right-0 top-36 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative mb-6 overflow-hidden rounded-4xl border border-white/10 bg-slate-950/55 p-6 shadow-2xl backdrop-blur">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-sky-200/70">
              Task Manager
            </p>
            <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
              Dashboard
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              Welcome back{user?.fullName ? `, ${user.fullName}` : ""}.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/profile"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <TaskForm onCreate={handleCreate} />

      <Analytics analytics={analytics} />

      <div className="mb-6 rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-5 text-slate-100 shadow-2xl shadow-slate-950/20">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Active work
            </p>
            <h1 className="mt-2 text-2xl font-bold text-white">All Tasks</h1>
          </div>
        </div>

        <FilterBar filters={filters} onFilterChange={handleFilterChange} />

        {loading ? (
          <p className="py-10 text-center text-sm text-slate-400">
            Loading tasks...
          </p>
        ) : (
          <>
            <TaskList
              tasks={tasks}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
            <Pagination pagination={pagination} setPagination={setPagination} />
          </>
        )}
      </div>

      <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-5 text-slate-100 shadow-2xl shadow-slate-950/20">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Trash
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              Deleted Tasks
            </h2>
          </div>
        </div>

        {deletedTasks.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">No deleted tasks</p>
        ) : (
          <>
            <DeletedTaskList tasks={deletedTasks} onRestore={handleRestore} />
            <Pagination
              pagination={deletedPagination}
              setPagination={setDeletedPagination}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
