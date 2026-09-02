import express from "express";
import {
  getCurrentController,
  loginUserController,
  logoutUserController,
  registerUserController,
} from "../controllers/user.controller.js";
import { validateData } from "../middleware/validate.middleware.js";
import {
  loginUserSchema,
  registerUserSchema,
} from "../validations/auth.schema.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = express.Router();
router
  .route("/register")
  .post(validateData(registerUserSchema), registerUserController);
router.route("/login").post(validateData(loginUserSchema), loginUserController);
router.route("/get").get(verifyJwt, getCurrentController);
router.route("/logout").get(verifyJwt, logoutUserController);
export default router;
