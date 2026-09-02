import { Request, Response } from "express";
import { runAgent } from "../ai/agent.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const agentChatController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const { message } = req.body;
    const result = await runAgent(userId, message);
    return res
      .status(200)
      .json(new ApiResponse(200, { data: result }, "Task executed"));
  } catch (error) {
    console.error("Agent Chat Error: ", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errors: [],
    });
  }
};
