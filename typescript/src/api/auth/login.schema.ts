import { z } from "zod";
import { RequestSchema } from "../../middlewares/validation.middleware";

export const loginBodySchema = z.object({
  username: z.string(),
  password: z.string(),
});

export interface LoginBody extends z.infer<typeof loginBodySchema> {}

export const loginSchema: RequestSchema = {
  body: loginBodySchema,
};
