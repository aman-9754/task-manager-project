import API from "./axios";

// =======================
// GET TASKS
// =======================

// get all tasks (with query params like status, priority, page, etc.)
export const getAllTasks = (params) => API.get("/tasks", { params });

// get single task by id
export const getTaskById = (id) => API.get(`/tasks/${id}`);

// =======================
// CREATE / UPDATE
// =======================

// create task
export const createTask = (data) => API.post("/tasks", data);

// update task
export const updateTask = (id, data) => API.patch(`/tasks/${id}`, data);

// =======================
// DELETE / RESTORE
// =======================

// soft delete
export const deleteTask = (id) => API.delete(`/tasks/${id}`);

// restore task
export const restoreTask = (id) => API.patch(`/tasks/${id}/restore`);

// =======================
// ANALYTICS
// =======================

export const getTaskAnalytics = () => API.get("/tasks/analytics");
