import express from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { validateData } from "../middleware/validate.middleware.js";
import { sendMessageSchema } from "../validations/message.schema.js";
import { agentChatController } from "../controllers/agent.controller.js";
const router = express.Router();
router
  .route("/chat")
  .post(validateData(sendMessageSchema), verifyJwt, agentChatController);
export default router;
