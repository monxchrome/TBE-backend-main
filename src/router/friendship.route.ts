import { Router } from "express";

import { friendController } from "../controllers/friend.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

export const friendshipRoute = router;

router.post(
  "/add",
  authMiddleware.checkAccessToken,
  friendController.sendFriendRequest,
);
router.post(
  "/respond",
  authMiddleware.checkAccessToken,
  friendController.respondToFriendRequest,
);
router.get(
  "/list",
  authMiddleware.checkAccessToken,
  friendController.getFriends,
);
