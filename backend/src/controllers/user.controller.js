import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

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

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    if (!accessToken || !refreshToken) {
      throw new ApiError(500, "Token generation failed");
    }

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, error?.message || "Token generation failed");
  }
};

const loginUser = asyncHandler(async (req, res) => {
  // req.body -> data
  // username and email checking
  // find the user
  // check password if user exists
  // access and refresh token generate.
  // send the token in cookies
  // send the response for successfull login

  // const { username, email, password } = req.body;
  // // console.log(email);

  // if (!username && !email)
  //   throw new ApiError(400, "username or email required.");

  const { identifier, password } = req.body;

  if (!identifier || !identifier?.trim()) {
    throw new ApiError(400, "Username or Email required.");
  }

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  // const user = await User.findOne({ $or: [{ username }, { email }] });
  const user = await User.findOne({
    $or: [
      // { username: username?.toLowerCase() },
      // { email: email?.toLowerCase() },
      { username: identifier?.trim().toLowerCase() },
      { email: identifier?.trim().toLowerCase() },
    ],
  });

  if (!user) {
    throw new ApiError(404, "User does not exists.");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid Password.");
  }

  // this function also save the refreshToken in the database for the particular user.
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  // const options = {
  //   httpOnly: true,
  //   secure: true,
  // };
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully",
      ),
    );

  // What browser does
  // -> Receives response
  // -> Stores cookies automatically
  // -> For future requests:
  // -> Cookies are sent automatically
  // -> verifyJWT reads it → req.user set
});

const logoutUser = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "Unauthorized");
  }

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: null,
      },
    },
    {
      new: true,
    },
  );

  // const options = {
  //   httpOnly: true,
  //   secure: true,
  // };

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

// regenerating the access token using refresh token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    // console.log("refreshAccessToken() function decodedToken :", decodedToken);

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or already used");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id,
    );

    // const options = {
    //   httpOnly: true,
    //   secure: true,
    // };

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed",
        ),
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (
    typeof oldPassword !== "string" ||
    typeof newPassword !== "string" ||
    !oldPassword.trim() ||
    !newPassword.trim()
  ) {
    throw new ApiError(400, "Valid old and new passwords are required");
  }

  if (oldPassword === newPassword) {
    throw new ApiError(400, "New password must be different");
  }

  // if (newPassword.length < 6) {
  //   throw new ApiError(400, "Password must be at least 6 characters long");
  // }

  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid old password");
  }

  user.password = newPassword;

  // TODO : understand this solved this
  // 🔥 invalidate old sessions
  // user.refreshToken = null;

  // the pre middleware automatically bcrypt the password and stored in the database.
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  // we already remove the password and refreshToken in the auth middleware so we can directly send the req.user as response.
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  // it depends on us(developer) that what fields we are allowing to the user to update
  const { fullName, email } = req.body;

  if (
    typeof fullName !== "string" ||
    typeof email !== "string" ||
    !fullName.trim() ||
    !email.trim()
  ) {
    throw new ApiError(400, "Valid full name and email are required");
  }

  // check that the new email is already in use or not.
  const existingUser = await User.findOne({
    email: email.toLowerCase().trim(),
  });

  if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
    throw new ApiError(400, "Email already in use");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        // email: email  // both are correct ES6 syntax
      },
    },
    { new: true },
  ).select("-password -refreshToken"); // by me

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "Account details updated successfully"),
    );
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  // here we have single file so we write 'req.file'

  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  // TODO : delete old image - assignment

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  // this might pass because cloudinary returns multiple fields in the response.
  // if (!avatar) {
  //   throw new ApiError(500, "Avatar upload (updation) failed");
  // }

  if (!avatar?.url) {
    throw new ApiError(500, "Avatar upload failed");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url, // this is the cloudinary url
      },
    },
    {
      new: true,
    },
  ).select("-password -refreshToken");

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Avatar updated successfully"));
});

export {
  registerUser,
  generateAccessAndRefreshTokens,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
};
