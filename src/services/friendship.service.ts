import { Server } from "socket.io";

import { EFriendshipStatus } from "../enums/friendship.enum";
import { Friendship } from "../models/Friendship.model";
import { User } from "../models/User.model";

class FriendshipService {
  public async sendFriendRequest(
    userId: string,
    friendId: string,
    io: Server,
  ): Promise<string> {
    if (userId === friendId) {
      throw new Error("You cannot add yourself as a friend.");
    }

    const existingRequest = await Friendship.findOne({
      $or: [
        { userId, friendId },
        { userId: friendId, friendId: userId },
      ],
    });

    if (existingRequest) {
      throw new Error("Friend request already exists.");
    }

    const friendship = new Friendship({
      userId,
      friendId,
      status: EFriendshipStatus.PENDING,
    });

    await friendship.save();

    io.emit("friendship:request", { userId, friendId });

    return "Friend request sent successfully.";
  }

  public async respondToFriendRequest(
    userId: string,
    friendId: string,
    status: EFriendshipStatus,
    io: Server,
  ): Promise<string> {
    if (!Object.values(EFriendshipStatus).includes(status)) {
      throw new Error("Invalid status.");
    }

    const friendship = await Friendship.findOne({
      userId,
      friendId,
      status: EFriendshipStatus.PENDING,
    });

    if (!friendship) {
      throw new Error("No pending friend request found.");
    }

    friendship.status = status;
    await friendship.save();

    io.emit("friendship:status", { userId, friendId, status });

    return `Friend request ${status}.`;
  }

  public async getFriends(userId: string): Promise<any[]> {
    const friends = await Friendship.find({
      $or: [
        { userId, status: EFriendshipStatus.ACCEPTED },
        { friendId: userId, status: EFriendshipStatus.ACCEPTED },
      ],
    });

    const friendIds = friends.map((friend) =>
      friend.userId.toString() === userId ? friend.friendId : friend.userId,
    );
    return User.find({ _id: { $in: friendIds } });
  }
}

export const friendshipService = new FriendshipService();
