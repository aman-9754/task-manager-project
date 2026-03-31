import dotenv from "dotenv";
// dotenv.config({ path: "./env" });
dotenv.config({ path: "./.env" });

import connectDB from "./db/db.js";
import { app } from "./app.js";
import { connectCloudinary } from "./config/cloudinary.config.js";

// console.log(process.env.CLOUDINARY_API_KEY)

// ✅ initialize cloudinary AFTER env loads
connectCloudinary();

connectDB()
  .then(() => {
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log(` server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed !!!", err);
  });
