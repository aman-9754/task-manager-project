import { Router } from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  restoreTask,
  updateTask,
} from "../controllers/task.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// all routes here are protected routes → we will verify JWT for all these routes

// create a task
router.route("/").post(verifyJWT, createTask);

// get all tasks of the logged in user
router.route("/").get(verifyJWT, getAllTasks);

// get a single task by id
router.route("/:id").get(verifyJWT, getTaskById);

// update a task by id
router.route("/:id").patch(verifyJWT, updateTask);

// delete a task by id
router.route("/:id").delete(verifyJWT, deleteTask);

// restore a deleted task by id
router.route("/:id/restore").patch(verifyJWT, restoreTask);


// default export -> so we can change the name of this router in the app.js file.
export default router;
