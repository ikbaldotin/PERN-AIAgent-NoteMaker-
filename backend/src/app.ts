import express from "express";
import userRouter from "./routes/user.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  }),
);
app.use(cookieParser());
app.use("/health-check", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Health good",
  });
});

app.use("/api/v1/user", userRouter);
