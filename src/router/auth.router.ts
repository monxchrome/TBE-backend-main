import { Router } from "express";

import { authController } from "../controllers/auth.controller.js";
import { userMiddleware } from "../middlewares/user.middleware.js";

const router = Router();

export const authRouter = router;

router.post(
  "/register",
  userMiddleware.isValidCreate,
  userMiddleware.getDynamicallyAndThrow("email", "body"),
  authController.register,
);

router.post(
  "/login",
  userMiddleware.isValidLogin,
  userMiddleware.getDynamicallyOrThrow("email"),
  authController.login,
);
