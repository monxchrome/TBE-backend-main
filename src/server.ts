import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";

import { app } from "./app";
import { configs } from "./configs";
import { chatSocket } from "./events/chat.event";

const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" } });
chatSocket(io);

server.listen(configs.PORT, async () => {
  await mongoose.connect(configs.DB_URL);
  console.log(`✅ Server started on port: ${configs.PORT}`);
});
