import { z } from "zod";
export const sendMessageSchema = z
  .object({
    message: z.string().min(1, "message can not empty").trim(),
  })
  .strict();
export type messageDTO = z.infer<typeof sendMessageSchema>;
