import { NextFunction, Request, Response } from "express";
import loginService from "./login.service";
import { LoginBody } from "./login.schema";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.body as unknown as LoginBody;

    const response = await loginService({
      username: body.username,
      password: body.password,
    });

    return res.send(response);
  } catch (err) {
    next(err);
  }
}
