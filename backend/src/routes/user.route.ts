import express from "express";
import {
  loginUserController,
  registerUserController,
} from "../controllers/user.controller.js";
import { validateDate } from "../middleware/validate.middleware.js";
import {
  loginUserSchema,
  registerUserSchema,
} from "../validations/auth.schema.js";

const router = express.Router();
router
  .route("/register")
  .post(validateDate(registerUserSchema), registerUserController);
router.route("/login").post(validateDate(loginUserSchema), loginUserController);
export default router;
