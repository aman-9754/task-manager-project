import API from "./axios";

// register
export const registerUser = (data) => API.post("/users/register", data);

// login
export const loginUser = (data) => API.post("/users/login", data);

// logout
export const logoutUser = () => API.post("/users/logout");

// get current user
export const getCurrentUser = () => API.get("/users/me");
