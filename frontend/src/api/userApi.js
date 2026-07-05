import API from "./axios";

// register
export const registerUser = (data) => API.post("/users/register", data);

// login
export const loginUser = (data) => API.post("/users/login", data);

// logout
export const logoutUser = () => API.post("/users/logout");

// get current user
export const getCurrentUser = () => API.get("/users/me");

// update account details
export const updateAccountDetails = (data) =>
	API.patch("/users/update-account", data);

// update avatar
export const updateUserAvatar = (data) => API.patch("/users/avatar", data);

// change password
export const changeCurrentPassword = (data) =>
	API.post("/users/change-password", data);
