import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.routes.js";

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

// TODO: now we will import routes here and use them

// routes
app.use("/api/v1/users", userRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Task Manager API");
});

export { app };
