import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true, // for cookies (refresh token)
});

let refreshPromise = null;

const notifyAuthExpired = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth:expired"));
  }
};

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

    if (!originalRequest || !error.response) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/users/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = API.post(
            "/users/refresh-token",
            {},
            { withCredentials: true },
          ).finally(() => {
            refreshPromise = null;
          });
        }

        await refreshPromise;

        return API(originalRequest);
      } catch (err) {
        notifyAuthExpired();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default API;
