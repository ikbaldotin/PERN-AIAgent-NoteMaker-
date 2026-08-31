import { z } from "zod";

export const registerUserSchema = z
  .object({
    name: z.string().min(1, "name can not be empty").trim().toLowerCase(),
    email: z.email().trim().toLowerCase(),
    password: z
      .string()
      .min(6, "password must be atleast 6 character long")
      .trim()
      .toLowerCase(),
  })
  .strict();
export const loginUserSchema = z
  .object({
    email: z.email().min(1, "email can not be empty").trim().toLowerCase(),
    password: z
      .string()
      .min(1, "password can not be empty")
      .trim()
      .toLowerCase(),
  })
  .strict();

export type registerUserDTO = z.infer<typeof registerUserSchema>;
export type loginUserDTO = z.infer<typeof loginUserSchema>;
