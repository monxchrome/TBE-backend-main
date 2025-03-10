import { Server, Socket } from "socket.io";

import { EFriendshipStatus } from "../enums/friendship.enum";
import { friendshipService } from "../services/friendship.service";

export const friendshipSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("friendship:request", async ({ userId, friendId }) => {
      if (userId === friendId) {
        return socket.emit("friendship:error", "You cannot add yourself.");
      }

      try {
        const message = await friendshipService.sendFriendRequest(
          userId,
          friendId,
          io,
        );
        socket.emit("friendship:response", message);
      } catch (error: unknown) {
        if (error instanceof Error) {
          socket.emit("friendship:error", error.message);
        } else {
          socket.emit("friendship:error", "An unknown error occurred.");
        }
      }
    });

    socket.on("friendship:response", async ({ userId, friendId, status }) => {
      if (
        ![EFriendshipStatus.ACCEPTED, EFriendshipStatus.REJECTED].includes(
          status,
        )
      ) {
        return socket.emit("friendship:error", "Invalid status.");
      }

      try {
        const message = await friendshipService.respondToFriendRequest(
          userId,
          friendId,
          status,
          io,
        );
        socket.emit("friendship:response", message);
      } catch (error: unknown) {
        if (error instanceof Error) {
          socket.emit("friendship:error", error.message);
        } else {
          socket.emit("friendship:error", "An unknown error occurred.");
        }
      }
    });

    socket.on("friendship:get", async ({ userId }) => {
      try {
        const friends = await friendshipService.getFriends(userId);
        socket.emit("friendship:list", friends);
      } catch (error: unknown) {
        if (error instanceof Error) {
          socket.emit("friendship:error", error.message);
        } else {
          socket.emit("friendship:error", "An unknown error occurred.");
        }
      }
    });

    socket.on("disconnect", () => {
      console.log(`${socket.id} disconnected`);
    });
  });
};
