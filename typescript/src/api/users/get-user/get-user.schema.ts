import { z } from "zod";
import { RequestSchema } from "../../../middlewares/validation.middleware";

export const getUserParamsSchema = z.object({
  username: z.string(),
});

export interface GetUserParams extends z.infer<typeof getUserParamsSchema> {}

export const getUserSchema: RequestSchema = {
  params: getUserParamsSchema,
};
