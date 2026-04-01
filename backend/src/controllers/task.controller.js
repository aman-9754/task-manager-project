import mongoose from "mongoose";
import { Task } from "../models/task.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// create a new task without validation middleware
// const createTask = asyncHandler(async (req, res) => {
//   const { title, description, status, dueDate, priority } = req.body;

//   if (!title || title.trim() === "") {
//     throw new ApiError(400, "Title is required");
//   }

//   // create task
//   const task = await Task.create({
//     title: title.trim(),
//     description: description ? description.trim() : "",
//     status: status || "pending",
//     dueDate: dueDate || null,
//     priority: priority || "medium",
//     user: req.user._id, // important
//   });

//   return res
//     .status(201)
//     .json(new ApiResponse(201, task, "Task created successfully"));
// });

// create a new task with validation middleware
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, dueDate, priority } = req.body;

  // create task
  const task = await Task.create({
    title,
    description,
    status: status || "pending",
    dueDate: dueDate || null,
    priority: priority || "medium",
    user: req.user._id, // important
  });

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully"));
});

// fetch all the tasks of the logged in user with pagination, filtering and sorting
const getAllTasks = asyncHandler(async (req, res) => {
  // 🔹 extract query params
  let {
    page = 1,
    limit = 10,
    status,
    priority,
    search,
    sortBy = "createdAt",
    sortType = "desc",
  } = req.query;

  // 🔹 convert to numbers
  page = parseInt(page);
  limit = parseInt(limit);

  // 🔹 fallback safety
  if (page < 1) page = 1;
  if (limit < 1) limit = 10;

  const skip = (page - 1) * limit;

  // 🔹 base query
  const query = {
    user: req.user._id, // users can only see their own tasks
    isDeleted: false,
  };

  // 🔹 filtering
  if (status) query.status = status;
  if (priority) query.priority = priority;

  // 🔹 search (title + description)
  if (search && search.trim() !== "") {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // 🔹 sorting
  const sortOrder = sortType === "asc" ? 1 : -1;

  const sortOptions = {
    [sortBy]: sortOrder,
  };

  // 🔹 fetch tasks
  const tasks = await Task.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  // 🔹 total count (for pagination)
  const totalTasks = await Task.countDocuments(query);

  const totalPages = Math.ceil(totalTasks / limit);

  // 🔹 response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        tasks,
        totalTasks,
        currentPage: page,
        totalPages,
      },
      "Tasks fetched successfully",
    ),
  );
});

// get a single task by id (only if it belongs to the logged in user)
const getTaskById = asyncHandler(async (req, res) => {
  // this is the task id from the url params
  const { id } = req.params;

  // validate mongo id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid task id");
  }

  // find the task
  const task = await Task.findOne({
    _id: id,
    user: req.user._id, // ownership check
    isDeleted: false, // soft delete check
  });

  // if task not found or doesn't belong to the user
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // if found, send the task details in the response
  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task fetched successfully"));
});

// update a task (only if it belongs to the logged in user)
// 🧠 WHAT WE WILL DO
// Get taskId from params
// Validate ID
// Ensure task:
// exists
// belongs to user
// not deleted
// Update only provided fields (partial update)
// Return updated task in response

const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, status, dueDate, priority } = req.body;

  // validate mongo id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid task id");
  }

  // find the task (ownership + not deleted)
  const task = await Task.findOne({
    _id: id,
    user: req.user._id,
    isDeleted: false,
  });

  // if task not found or doesn't belong to the user
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // update only provided fields
  if (title !== undefined) {
    if (title.trim() === "") {
      throw new ApiError(400, "Title cannot be empty");
    }
    task.title = title.trim();
  }

  if (description !== undefined) {
    task.description = description.trim();
  }

  if (status !== undefined) {
    task.status = status;
  }

  if (priority !== undefined) {
    task.priority = priority;
  }

  if (dueDate !== undefined) {
    task.dueDate = dueDate;
  }

  // save the updated task
  await task.save();

  // send response
  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task updated successfully"));
});

// delete a task (soft delete - only if it belongs to the logged in user)
// 🧠 WHAT WE WILL DO
// Validate task ID
// Check:
// task exists ✅
// belongs to user ✅
// not already deleted ✅
// Instead of deleting → set: isDeleted: true

const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // validate mongo id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid task id");
  }

  // find the task (ownership + not deleted)
  const task = await Task.findOne({
    _id: id,
    user: req.user._id,
    isDeleted: false,
  });

  // if task not found or doesn't belong to the user
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // soft delete → set isDeleted to true
  task.isDeleted = true;
  await task.save();

  // send response
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Task deleted successfully"));
});

// advanced controller
// restore a deleted task (only if it belongs to the logged in user)
const restoreTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // validate mongo id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid task ID");
  }

  // find deleted task
  const task = await Task.findOne({
    _id: id,
    user: req.user._id,
    isDeleted: true, // important (only deleted tasks)
  });

  if (!task) {
    throw new ApiError(404, "Task not found or not deleted");
  }

  // restore the task → set isDeleted to false
  task.isDeleted = false;
  await task.save();

  // send response
  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task restored successfully"));
});

// method 1 : Multiple simple queries + combine results
// const getTaskAnalytics = asyncHandler(async (req, res) => {
//   const userId = req.user._id;

//   // base filter
//   const baseQuery = {
//     user: userId,
//     isDeleted: false,
//   };

//   // 1. total tasks
//   const totalTasks = await Task.countDocuments(baseQuery);

//   // 2. status counts
//   const completedTasks = await Task.countDocuments({
//     ...baseQuery,
//     status: "completed",
//   });

//   const pendingTasks = await Task.countDocuments({
//     ...baseQuery,
//     status: "pending",
//   });

//   const inProgressTasks = await Task.countDocuments({
//     ...baseQuery,
//     status: "in-progress",
//   });

//   // 3 priority counts
//   const highPriorityTasks = await Task.countDocuments({
//     ...baseQuery,
//     priority: "high",
//   });

//   const mediumPriorityTasks = await Task.countDocuments({
//     ...baseQuery,
//     priority: "medium",
//   });

//   const lowPriorityTasks = await Task.countDocuments({
//     ...baseQuery,
//     priority: "low",
//   });

//   // 4. overdue tasks
//   const currentDate = new Date();
//   const overdueTasks = await Task.countDocuments({
//     ...baseQuery,
//     dueDate: { $lt: currentDate },
//     status: { $ne: "completed" }, // only consider non-completed tasks as overdue
//   });

//   // 5. completion rate
//   const completionRate =
//     totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

//   // final response
//   const analytics = {
//     totalTasks,
//     statusCounts: {
//       completed: completedTasks,
//       pending: pendingTasks,
//       inProgress: inProgressTasks,
//     },
//     priorityCounts: {
//       high: highPriorityTasks,
//       medium: mediumPriorityTasks,
//       low: lowPriorityTasks,
//     },
//     overdueTasks,
//     completionRate,
//   };

//   return res
//     .status(200)
//     .json(
//       new ApiResponse(200, analytics, "Task analytics fetched successfully"),
//     );
// });

// method 2 : Aggregation pipeline (more efficient - single query)
const getTaskAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const analytics = await Task.aggregate([
    {
      $match: {
        user: userId,
        isDeleted: false,
      },
    }, // filter tasks of the user and not deleted
    {
      $group: {
        _id: null,
        totalTasks: { $sum: 1 },
        completedTasks: {
          $sum: {
            $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
          },
        },
        pendingTasks: {
          $sum: {
            $cond: [{ $eq: ["$status", "pending"] }, 1, 0],
          },
        },
        inProgressTasks: {
          $sum: {
            $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0],
          },
        },
        highPriorityTasks: {
          $sum: {
            $cond: [{ $eq: ["$priority", "high"] }, 1, 0],
          },
        },
        mediumPriorityTasks: {
          $sum: {
            $cond: [{ $eq: ["$priority", "medium"] }, 1, 0],
          },
        },
        lowPriorityTasks: {
          $sum: {
            $cond: [{ $eq: ["$priority", "low"] }, 1, 0],
          },
        },
        overdueTasks: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $ne: ["$dueDate", null] }, // 🔥 add this
                  { $lt: ["$dueDate", new Date()] }, // dueDate < current date
                  { $ne: ["$status", "completed"] }, // status != completed
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalTasks: 1,
        statusCounts: {
          completed: "$completedTasks",
          pending: "$pendingTasks",
          inProgress: "$inProgressTasks",
        },
        priorityCounts: {
          high: "$highPriorityTasks",
          medium: "$mediumPriorityTasks",
          low: "$lowPriorityTasks",
        },
        overdueTasks: 1,
        completionRate: {
          $cond: [
            { $eq: ["$totalTasks", 0] },
            0,
            {
              $round: [
                {
                  $multiply: [
                    { $divide: ["$completedTasks", "$totalTasks"] },
                    100,
                  ],
                },
                0,
              ],
            },
          ],
        },
      },
    },
  ]);

  // if there are no tasks, analytics will be an empty array, so we need to handle that case
  const result = analytics[0] || {
    totalTasks: 0,
    statusCounts: {
      completed: 0,
      pending: 0,
      inProgress: 0,
    },
    priorityCounts: {
      high: 0,
      medium: 0,
      low: 0,
    },
    overdueTasks: 0,
    completionRate: 0,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Task analytics fetched successfully"));
});

export {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  restoreTask,
  getTaskAnalytics,
};
