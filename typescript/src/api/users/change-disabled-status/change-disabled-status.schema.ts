import { z } from "zod";
import { RequestSchema } from "../../../middlewares/validation.middleware";

export const changeDisabledStatusParamsSchema = z.object({
  username: z.string().min(3).max(16),
});

export interface ChangeDisabledStatusParams
  extends z.infer<typeof changeDisabledStatusParamsSchema> {}

export const changeDisabledStatusSchema: RequestSchema = {
  params: changeDisabledStatusParamsSchema,
};
