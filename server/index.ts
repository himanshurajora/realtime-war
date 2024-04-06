import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const players: Socket[] = [];

io.on("connection", (socket: Socket) => {
  console.log("A user connected");

  players.push(socket);

  if (players.length === 2) {
    players.forEach((player) => {
      player.emit("start");
    });
  }

  socket.on("move", (data) => {
    socket.broadcast.emit("enemy-move", data);
  });

  socket.on("fire", (data) => {
    console.log("Player fired");
    socket.broadcast.emit("enemy-fire", data);
  });

  socket.on("score", (data) => {
    console.log("Player scored");
    socket.broadcast.emit("enemy-score", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    const index = players.indexOf(socket);

    console.log(index, " Player gone!");
    if (index > -1) {
      players.splice(index, 1);
    }

    socket.broadcast.emit("enemy-left");

    console.log("Players left: ", players.length);
  });
});

server.listen(3000, () => {
  console.log("Socket server listening on port 3000");
});
