import { Server, Socket } from "socket.io";

import { EToken } from "../enums/token.enum";
import { Token } from "../models/Token.model";
import { tokenService } from "../services/token.service";

export const chatSocket = (io: Server) => {
  io.use(async (socket: Socket, next) => {
    try {
      const token =
        socket.handshake.auth.token || socket.handshake.headers.authorization;

      if (!token) {
        return next(new Error("Access token is missing"));
      }

      const jwtPayload = tokenService.checkToken(token, EToken.access);
      const tokenData = await Token.findOne({ accessToken: token });

      if (!tokenData) {
        return next(new Error("Invalid access token"));
      }

      socket.data.user = jwtPayload;
      next();

      io.on("connection", (socket: Socket) => {
        console.log(`User connected: ${socket.data.user.username}`);

        socket.on("message:send", (text) => {
          io.emit("message:get", {
            sender: socket.data.user.username,
            message: text,
          });
        });

        socket.on("disconnect", () => {
          console.log(`User disconnected: ${socket.data.user.username}`);
        });
      });
    } catch (e) {
      next(new Error(`Authentication error: ${e}`));
    }
  });
};
