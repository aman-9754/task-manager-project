import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
// import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
  const { username, fullName, email, password } = req.body;

  if (
    [fullName, email, username, password].some(
      (field) => !field || field.trim() === "",
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //   const existedUser = await User.findOne({ $or: [{ username }, { email }] });

  const existedUser = await User.findOne({
    $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists."); // 409 = conflict.
  }

  console.log("req.file", req.file);

  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatarUpload = await uploadOnCloudinary(avatarLocalPath);

  if (!avatarUpload || !avatarUpload.url) {
    throw new ApiError(500, "Avatar upload failed");
  }
  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password,
    avatar: avatarUpload.url,
  });

//   console.log("user:", user);

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

//   console.log("createdUser : ", createdUser);

  if (!createdUser) {
    throw new ApiError(500, "User registration failed");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

export { registerUser };
