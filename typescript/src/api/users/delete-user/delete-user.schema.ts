import { z } from "zod";
import { RequestSchema } from "../../../middlewares/validation.middleware";

export const deleteUserParamsSchema = z.object({
  username: z.string(),
});

export interface DeleteUserParams
  extends z.infer<typeof deleteUserParamsSchema> {}

export const deleteUserSchema: RequestSchema = {
  params: deleteUserParamsSchema,
};
