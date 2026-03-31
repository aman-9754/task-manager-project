import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // token contains = header , payload, signature
    // Signature = HMACSHA256(header + payload + SECRET)

    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", ""); // internally ->  req.headers["authorization"]

    // console.log("auth.middleware.js token :", token);

    if (!token) {
      throw new ApiError(401, "Access token missing...");
    }

    // if token is correct then decodeToken contains the payload we originally signed
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // console.log("auth.middleware.js decoedToken :", decodedToken); // It is the payload we originally signed

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken",
    );

    if (!user) {
      throw new ApiError(401, "User not found or Invalid Access Token");
    }

    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});
