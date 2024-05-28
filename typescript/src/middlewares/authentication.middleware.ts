import { NextFunction, Request, Response } from "express";
import { UserWithoutPassword, role } from "../models/user.model";
import { AppError } from "../api/error-handler";
import { StatusCodes } from "http-status-codes";
import { verify } from "jsonwebtoken";
import config from "../config";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // const user: UserWithoutPassword = {
  //   id: 1,
  //   username: "teste",
  //   role: role.ADMIN,
  //   disabled: false,
  //   created_at: new Date(),
  //   last_login_at: new Date(),
  // };
  // reads Bearer token from Authorization header
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) {
    const err = new AppError(StatusCodes.UNAUTHORIZED, "Token not provided");
    next(err);
  } else {
    try {
      const user = verify(token, config.jwt_secret);
      if (!user) {
        new AppError(StatusCodes.UNAUTHORIZED, "Invalid Token");
      }

      req.user = user as UserWithoutPassword;
    } catch (jsonerr) {
      console.log("a");
      const err = new AppError(StatusCodes.UNAUTHORIZED, "Malformed Token");
      next(err);
    }

    next();
  }
}
