import { Response } from "express";
import { UserWithoutPassword } from "./models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: UserWithoutPassword;
    }
  }
}
