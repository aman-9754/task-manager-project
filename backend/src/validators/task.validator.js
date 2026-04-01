import Joi from "joi";
import mongoose from "mongoose";

import { ApiError } from "../utils/ApiError.js";

// helper for objectId validation
const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid Id format");
  }
  return value;
};

// create task validation
const createTaskValidator = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().trim().max(100).required(),
    description: Joi.string().trim().allow("").optional(),

    status: Joi.string()
      .valid("pending", "in-progress", "completed")
      .optional(),
    dueDate: Joi.date().optional().allow(null),
    priority: Joi.string().valid("low", "medium", "high").optional(),
  }); // to get all errors, not just the first one

  const { error, value } = schema.validate(req.body || {}, {
    abortEarly: false,
  });

  // console.log("value in validator", value);
  // console.log("error in validator", error);

  if (error) {
    // const errorMessages = error.details.map((err) => err.message);
    const errorMessages = error.details.map((err) =>
      err.message.replace(/"/g, ""),
    );
    return next(new ApiError(400, "Validation failed", errorMessages));
    // return res
    //   .status(400)
    //   .json(new ApiError(400, "Validation failed", errorMessages));
  }

  // sanitized and validated data
  req.body = value;

  next();
};

// params validator (used for getTaskById, updateTask, deleteTask, restoreTask)
const taskIdParamValidator = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().custom(objectIdValidator).required(),
    //  taskId: Joi.string().custom(objectIdValidator).required(),
  });

  const { error, value } = schema.validate(req.params, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map((err) =>
      err.message.replace(/"/g, ""),
    );
    return next(
      new ApiError(400, "Validation failed - Invalid Task Id", errorMessages),
    );
  }

  req.params = value;

  next();
};

// update task validation → we will reuse the createTaskValidator for validating the body and taskIdParamValidator for validating the id param in the update route.
const updateTaskValidator = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().trim().max(100).optional(),
    description: Joi.string().trim().allow("").optional(),
    status: Joi.string()
      .valid("pending", "in-progress", "completed")
      .optional(),
    dueDate: Joi.date().optional().allow(null),
    priority: Joi.string().valid("low", "medium", "high").optional(),
  }).min(1); // at least one field must be provided for update

  const { error, value } = schema.validate(req.body || {}, {
    abortEarly: false,
    // stripUnknown: true,
  });

  if (error) {
    const errorMessages = error.details.map((err) =>
      err.message.replace(/"/g, ""),
    );
    return next(new ApiError(400, "Validation failed", errorMessages));
  }

  // sanitized and validated data
  req.body = value;

  next();
};

// get all tasks - query validation (pagination + filters)
const getAllTasksQueryValidator = (req, res, next) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    status: Joi.string()
      .valid("pending", "in-progress", "completed")
      .optional(),
    priority: Joi.string().valid("low", "medium", "high").optional(),
    sortBy: Joi.string().valid("createdAt", "dueDate", "priority").optional(),
    order: Joi.string().valid("asc", "desc").optional(),
  });

  const { error, value } = schema.validate(req.query, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map((err) =>
      err.message.replace(/"/g, ""),
    );
    return next(new ApiError(400, "Validation failed", errorMessages));
  }

  req.query = value;

  next();
};

export { createTaskValidator, taskIdParamValidator, updateTaskValidator, getAllTasksQueryValidator };
