import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { prisma } from "../lib/prisma.js";
import { comparePassword, encryptPassword } from "../utils/auth/hash.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/auth/jwt.js";
import { setAuthCookie } from "../utils/auth/helper.js";
import { ApiResponse } from "../utils/ApiResponse.js";
export const registerUserController = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const exitingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (exitingUser) {
      throw new ApiError("user is already exists", 409);
    }
    const hashPassword = await encryptPassword(password);
    const user = await prisma.user.create({
      data: {
        name: name.toLowerCase().trim(),
        email: email.toLowerCase().trim(),
        password: hashPassword,
      },
    });
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    setAuthCookie(res, accessToken, refreshToken);
    return res.status(201).json(
      new ApiResponse(
        201,
        {
          user: {
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
          },
          accessToken,
          refreshToken,
        },
        "User registered successfully"
      )
    );
  } catch (error: unknown) {
    console.error("Regsiter User Error: ", error);

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

export const loginUserController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new ApiError("Invalid credentials", 400);
    }
    const isPassword = await comparePassword(password, user.password);
    if (!isPassword) {
      throw new ApiError("Invalid credentials", 400);
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    setAuthCookie(res, accessToken, refreshToken);
    return res.status(201).json(
      new ApiResponse(
        201,
        {
          user: {
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
          },
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
  } catch (error: unknown) {
    console.error("Login User Error: ", error);

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
