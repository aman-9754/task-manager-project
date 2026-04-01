import { Router } from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskAnalytics,
  getTaskById,
  restoreTask,
  updateTask,
} from "../controllers/task.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

import {
  createTaskValidator,
  taskIdParamValidator,
  updateTaskValidator,
  getAllTasksQueryValidator,
} from "../validators/task.validator.js";

const router = Router();

// all routes here are protected routes → we will verify JWT for all these routes

// create a task
router.route("/").post(verifyJWT, createTaskValidator, createTask);

// get all tasks of the logged in user
router.route("/").get(verifyJWT, getAllTasksQueryValidator, getAllTasks);

// -----------------------------------------
// ✅ specific routes first
// restore a deleted task by id
router
  .route("/:id/restore")
  .patch(verifyJWT, taskIdParamValidator, restoreTask);

// get task analytics for the logged in user
router.get("/analytics", verifyJWT, getTaskAnalytics);
// -----------------------------------------

// ❗ dynamic routes last
// get a single task by id
router.route("/:id").get(verifyJWT, taskIdParamValidator, getTaskById);

// update a task by id
router
  .route("/:id")
  .patch(verifyJWT, taskIdParamValidator, updateTaskValidator, updateTask);

// delete a task by id
router.route("/:id").delete(verifyJWT, taskIdParamValidator, deleteTask);

// default export -> so we can change the name of this router in the app.js file.
export default router;
