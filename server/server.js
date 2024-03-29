const express = require("express");
const { chats } = require("./data");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middelwares/errorMiddelwares");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);


app.use(express.json());

mongoose.connect(process.env.DB_STRING);

app.use("/api", [userRoutes, chatRoutes, messageRoutes]);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => `server running on port ${PORT}`);

const io = require('socket.io')(server, {
  pingTimout: 60000,
  cors: {
    origin: 'http://localhost:3000',
  }
})

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connection");
  });

  //selected chat room
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.on("create group", (newGroup) => {
    var groupUsers = newGroup.users;
    
    if(!groupUsers) return console.log('no users in the group');

    groupUsers.forEach(user => {
      if(user._id === newGroup.groupAdmin._id) return;
      socket.in(user._id).emit("group added", newGroup);
    })
  })

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
})