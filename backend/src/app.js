import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";

// before it was in server.js but the app file load first (don't know why) that's why i write them here.
import dotenv from "dotenv";
dotenv.config({});
// console.log(process.env.CORS_ORIGIN)

// routes import
import userRouter from "./routes/user.routes.js";
import taskRouter from "./routes/task.routes.js";

// error middleware import
import { errorHandler } from "./middleware/error.middleware.js";

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    // origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to Task Manager API");
});

// TODO: now we will import routes here and use them

// routes use
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tasks", taskRouter);

app.use(errorHandler);

export { app };
