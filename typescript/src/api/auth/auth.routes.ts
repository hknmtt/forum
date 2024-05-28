import { Router, Request, Response } from "express";
import { validateRequest } from "../../middlewares/validation.middleware";
import { loginSchema } from "./login.schema";
import { login } from "./auth.handlers";

export const router = Router();

router.route("/login").post(validateRequest(loginSchema), login);
