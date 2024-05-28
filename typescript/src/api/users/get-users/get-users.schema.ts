import { z } from "zod";
import { RequestSchema } from "../../../middlewares/validation.middleware";

export const getUsersQuerySchema = z.object({
  take: z.coerce.number().int().positive(),
  skip: z.coerce.number().int().nonnegative(),
});

export interface GetUsersQuery extends z.infer<typeof getUsersQuerySchema> {}

export const getUsersSchema: RequestSchema = {
  query: getUsersQuerySchema,
};
