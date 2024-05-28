import express, { Request, Response, NextFunction } from "express";
import { router as usersRoutes } from "./users/users.routes";
import { router as authRoutes } from "./auth/auth.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);

router.use("/", (req: Request, res: Response, next: NextFunction): void => {
  res.json({ message: "Allo! Catch-all route." });
});

export default router;
