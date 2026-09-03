import express, { Response } from "express";
import userRouter from "./routes/user.route.js";
import agentRouter from "./routes/agent.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { prisma } from "./lib/prisma.js";
export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);
app.use(cookieParser());
app.use("/health-check", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Health good",
  });
});
app.use("/chat", async (req, res: Response) => {
  try {
    const result = await prisma.note.findMany();
    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "error",
    });
  }
});
app.use("/api/v1/user", userRouter);
app.use("/api/v1/agent", agentRouter);
