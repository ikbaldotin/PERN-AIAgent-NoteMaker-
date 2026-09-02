import { Request, NextFunction, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { IJwtUserPayload } from "../types/index.js";
import { prisma } from "../lib/prisma.js";
export const verifyJwt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError("Unauthorized request", 401);
    }
    const decoded = (await jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET!
    )) as IJwtUserPayload;
    const user = await prisma.user.findUnique({
      where: {
        email: decoded.email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw new ApiError("Unauthorized request", 401);
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error: ", error);

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
