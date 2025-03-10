import { NextFunction, Request, Response } from "express";
import { Server } from "socket.io";

import { friendshipService } from "../services/friendship.service";

class FriendController {
  public async sendFriendRequest(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId, friendId } = req.body;
      const io: Server = req.app.get("io");

      const message = await friendshipService.sendFriendRequest(
        userId,
        friendId,
        io,
      );

      res.status(200).json({ message });
    } catch (e) {
      next(e);
    }
  }

  public async respondToFriendRequest(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId, friendId, status } = req.body;
      const io: Server = req.app.get("io");

      const message = await friendshipService.respondToFriendRequest(
        userId,
        friendId,
        status,
        io,
      );

      res.status(200).json({ message });
    } catch (e) {
      next(e);
    }
  }

  public async getFriends(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.body;

      const friends = await friendshipService.getFriends(userId);

      res.status(200).json({ friends });
    } catch (e) {
      next(e);
    }
  }
}

export const friendController = new FriendController();
