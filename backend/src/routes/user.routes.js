import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateUserAvatar,
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// ============== PUBLIC ROUTES ==============
// register route with multer
router.post("/register", upload.single("avatar"), registerUser);

// login user
router.route("/login").post(loginUser);

// refresh or regenerate access token
router.route("/refresh-token").post(refreshAccessToken);

// =========== PROTECTED ROUTES ============
// secured routes -> A route that can only be accessed by an authenticated (logged-in) user
// “A secured route is an endpoint protected by authentication middleware, ensuring only authorized users can access it.”

// logout user
router.route("/logout").post(verifyJWT, logoutUser);

// get current user
router.route("/me").get(verifyJWT, getCurrentUser);

// change password
router.route("/change-password").post(verifyJWT, changeCurrentPassword);

// update account details (name + email)
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

// update avatar
router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

//default export -> we can change the name of this router in the user.controller.js file.
export default router;
