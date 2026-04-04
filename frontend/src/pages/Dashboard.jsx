import { useEffect, useState } from "react";

import {
  createTask,
  deleteTask,
  getAllTasks,
  updateTask,
} from "../api/taskApi";

import TaskForm from "../features/task/TaskForm";
import TaskList from "../features/task/TaskList";
import FilterBar from "../features/task/FilterBar";
import Analytics from "../features/task/Analytics";
import { getTaskAnalytics } from "../api/taskApi";
import toast from "react-hot-toast";
import Pagination from "../features/task/Pagination";

// const Dashboard = () => {
//   return <div>this is dashboard page.</div>;
// };

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({});
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1, // current page
    limit: 5, // tasks per page
    totalPages: 1, // from backend
  });

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
      await createTask(data);

      // move to the first page (new task will be there)
      setPagination((prev) => ({
        ...prev,
        page: 1,
      }));

      // we dont need to manually do UI update
      
      // fetchTasks(); // enven though this is also not required becuase when pagination changes, the useEffect automatically fetch all tasks from backend

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
      toast.success("Task Deleted Successfully!");
      fetchAnalytics();
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

  // useEffect(() => {
  //   fetchTasks();
  // }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [filters]);

  useEffect(() => {
    fetchTasks(filters);
  }, [filters, pagination.page]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <TaskForm onCreate={handleCreate} />

      <Analytics analytics={analytics} />

      <div className="bg-white p-4 rounded  shadow mb-6 ">
        {/* ADD FILTER HERE */}

        <h1 className="text-xl mb-4 font-semibold">All Tasks</h1>

        <FilterBar filters={filters} onFilterChange={handleFilterChange} />

        {/* <TaskList
          tasks={tasks}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        /> */}

        {loading ? (
          <p className="text-center"> Loading Tasks...</p>
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
    </div>
  );
};

export default Dashboard;
