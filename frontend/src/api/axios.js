import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true, // for cookies (refresh token)
});

// attach access token
// API.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error),
// );

// response interceptor → refresh token logic
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // console.log(originalRequest);

    if (
      error.response &&
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/users/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        const res = await API.post(
          "/users/refresh-token",
          {},
          { withCredentials: true },
        );

        // const newAccessToken = res.data.data.accessToken;
        // localStorage.setItem("accessToken", newAccessToken);
        // originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return API(originalRequest);
      } catch (err) {
        // localStorage.removeItem("accessToken");
        // window.location.href = "/login";

        return Promise.reject(error); // added by the chat gpt
      }
    }

    return Promise.reject(error);
  },
);

export default API;
