import { z } from "zod";
import { RequestSchema } from "../../../middlewares/validation.middleware";

export const createUserBodySchema = z.object({
  username: z.string().min(3).max(16),
  password: z.string().min(8),
  role: z.enum(["MODERATOR", "USER"]),
});

export interface createUserBody extends z.infer<typeof createUserBodySchema> {}

export const createUserSchema: RequestSchema = {
  body: createUserBodySchema,
};
