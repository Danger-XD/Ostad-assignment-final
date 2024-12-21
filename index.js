import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import {
  MAX_JSON_SIZE,
  REQUEST_NUMBER,
  REQUEST_TIME,
  URL_ENCODE,
  WEB_CACHE,
} from "./app/config/config.js";
import router from "./routes/api.js";

// Resolve __dirname for ES Modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const app = express();
dotenv.config();
app.use(express.json({ limit: MAX_JSON_SIZE }));
app.use(express.urlencoded({ extended: URL_ENCODE }));
app.use(helmet());
app.use(cookieParser());
// const prodOrigin = [process.env.ORIGIN_1, process.env.ORIGIN_2];
// const devOrigin = ["http://localhost:3000"];
// const allowedOrigins =
//   process.env.NODE_ENV === "production" ? prodOrigin : devOrigin;
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (allowedOrigins.includes(origin)) {
//         console.log(origin, allowedOrigins);
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST"],
//   })
// );
/// App Use Limiter
const limiter = rateLimit({ windowMs: REQUEST_TIME, max: REQUEST_NUMBER });
app.use(limiter);

/// Cache
app.set("etag", WEB_CACHE);

/// Database Connect
mongoose
  .connect(process.env.DATABASE, { autoIndex: true })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch(() => {
    console.log("MongoDB disconnected");
  });

/// App Use Routes
app.use("/api", router);

// Default route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

/// Serve Frontend
// app.use(express.static('client/dist'));
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
// });

/// Start Server
app.listen(process.env.PORT, () => {
  console.log("Server started on port " + process.env.PORT);
});
