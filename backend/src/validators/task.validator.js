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

  const { error, value } = schema.validate(req.body, { abortEarly: false });

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

export { createTaskValidator };
