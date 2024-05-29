import { NextFunction, Request, Response } from "express";
import { GetUsersQuery } from "./get-users/get-users.schema";
import getUsersService from "./get-users/get-users.service";
import { GetUserParams } from "./get-user/get-user.schema";
import getUserService from "./get-user/get-user.service";

import { UserWithoutPassword } from "../../models/user.model";
import { AppError } from "../error-handler";
import { StatusCodes } from "http-status-codes";
import createUserService, {
  CreateUserRequest,
} from "./create-user/create-user.service";
import { DeleteUserParams } from "./delete-user/delete-user.schema";
import deleteUserService from "./delete-user/delete-user.service";
import { ChangeDisabledStatusParams } from "./change-disabled-status/change-disabled-status.schema";
import changeDisabledStatusService from "./change-disabled-status/change-disabled-status.service";

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = req.query as unknown as GetUsersQuery;

    const users = await getUsersService({
      take: query.take,
      skip: query.skip,
      requestingUser: req.user as UserWithoutPassword,
    });

    return res.send(users);
  } catch (err) {
    next(err);
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const params = req.params as unknown as GetUserParams;

    const user = await getUserService({
      username: params.username,
    });

    return res.send(user);
  } catch (err) {
    next(err);
  }
}

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const body = req.body as unknown as CreateUserRequest;

    const newUser = await createUserService({
      username: body.username,
      password: body.password,
      role: body.role,
      requestingUser: req.user as UserWithoutPassword,
    });

    return res.status(StatusCodes.CREATED).send(newUser);
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const params = req.params as unknown as DeleteUserParams;

    const deletedUser = await deleteUserService({
      username: params.username,
      requestingUser: req.user as UserWithoutPassword,
    });

    return res.status(StatusCodes.OK).send(deletedUser);
  } catch (err) {
    next(err);
  }
}

export async function disableUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const params = req.params as unknown as ChangeDisabledStatusParams;

    const disabledUser = await changeDisabledStatusService({
      username: params.username,
      disabled: true,
      requestingUser: req.user as UserWithoutPassword,
    });

    return res.status(StatusCodes.OK).send(disabledUser);
  } catch (err) {
    next(err);
  }
}

export async function enableUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const params = req.params as unknown as ChangeDisabledStatusParams;

    const enabledUser = await changeDisabledStatusService({
      username: params.username,
      disabled: false,
      requestingUser: req.user as UserWithoutPassword,
    });

    return res.status(StatusCodes.OK).send(enabledUser);
  } catch (err) {
    next(err);
  }
}
