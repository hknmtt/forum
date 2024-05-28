import { Router, Request, Response } from "express";
import {
  createUser,
  deleteUser,
  disableUser,
  enableUser,
  getUser,
  getUsers,
} from "./users.handlers";
import { getUsersSchema } from "./get-users/get-users.schema";
import { validateRequest } from "../../middlewares/validation.middleware";
import { getUserSchema } from "./get-user/get-user.schema";
import { authenticate } from "../../middlewares/authentication.middleware";
import { createUserSchema } from "./create-user/create-user.schema";
import { deleteUserSchema } from "./delete-user/delete-user.schema";
import { changeDisabledStatusSchema } from "./change-disabled-status/change-disabled-status.schema";

export const router = Router();

router
  .route("/")
  .get(validateRequest(getUsersSchema), authenticate, getUsers)
  .post(validateRequest(createUserSchema), authenticate, createUser);

router
  .route("/:username")
  .get(validateRequest(getUserSchema), getUser)
  .delete(validateRequest(deleteUserSchema), authenticate, deleteUser);

router
  .route("/:username/disable")
  .patch(
    validateRequest(changeDisabledStatusSchema),
    authenticate,
    disableUser
  );

router
  .route("/:username/enable")
  .patch(validateRequest(changeDisabledStatusSchema), authenticate, enableUser);
