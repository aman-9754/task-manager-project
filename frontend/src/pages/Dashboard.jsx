import { useEffect, useState } from "react";

import {
  createTask,
  deleteTask,
  getAllTasks,
  updateTask,
} from "../api/taskApi";

import TaskForm from "../features/task/TaskForm";
import TaskList from "../features/task/TaskList";

// const Dashboard = () => {
//   return <div>this is dashboard page.</div>;
// };

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({});

  // fetch tasks
  const fetchTasks = async (query = {}) => {
    try {
      // console.log("aman1");
      const res = await getAllTasks(query);
      // console.log(res);

      // console.log("aman2");
      // console.log("res.data.data: ", res.data.data);
      // console.log("res.data.data.tasks: ", res.data.data.tasks);

      // setTasks(res.data.data);   // this is wrong
      // this same problem has arrived in below all function also because everywhere we have sed res.data.data but actually it is res.data.data.tasks

      setTasks(res.data.data.tasks); // we have to write this
    } catch (err) {
      // console.log("aman3");
      console.error("Fetch All Tasks Error :", err);
    }
  };

  // create task
  const handleCreate = async (data) => {
    try {
      const res = await createTask(data);
      // UI update
      setTasks((prev) => [res.data.data, ...prev]);
      // setTasks((prev) => [res.data.data.tasks, ...prev]);  // this is not required here, print the res and then decide what to write
    } catch (error) {
      console.error("Create Task Error : ", error);
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
    } catch (error) {
      console.error("Update Task Error : ", error);
    }
  };

  // delete task
  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Delete Task Error:", err);
    }
  };

  // useEffect(() => {
  //   fetchTasks();
  // }, []);

  useEffect(() => {
    fetchTasks(filters);
  }, [filters]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <TaskForm onCreate={handleCreate} />

      <TaskList tasks={tasks} onDelete={handleDelete} onUpdate={handleUpdate} />
    </div>
  );
};

export default Dashboard;
