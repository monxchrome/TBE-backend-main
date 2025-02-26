import { Router } from "express";

import { authController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware";
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

router.post(
  "/refresh",
  authMiddleware.checkRefreshToken,
  authController.refresh,
);

router.post(
  "/password/change",
  authMiddleware.checkAccessToken,
  authMiddleware.isValidChangePassword,
  authController.changePassword,
);

router.put(
  "/password/forgot/:token",
  authMiddleware.checkActionForgotToken,
  authMiddleware.checkOldPassword,
  authMiddleware.isValidForgotPassword,
  authController.changePassword,
);
