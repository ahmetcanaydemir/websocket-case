const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");
const socketio = require("socket.io");
var session = require("express-session");
var redis = require("socket.io-redis");

const setupRoutes = require("./routes");
const { userJoin, getUsers, userLeave } = require("./utils/users");

async function main() {
  try {
    await mongoose.connect(`mongodb://mongo:27017`, {
      useNewUrlParser: true,
    });

    console.log("MongoDB connected!!");
  } catch (err) {
    console.log("Failed to connect to MongoDB", err);
  }

  const app = express();

  app.set("view engine", "ejs");
  app.set("views", "./views");

  app.use(session({ secret: "mySecret", resave: false, saveUninitialized: false }));
  app.use(express.static("./utils"));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  setupRoutes(app);

  const httpServer = http.createServer(app);
  const io = socketio(httpServer);

  io.adapter(redis({ host: "redis", port: 6379 }));

  app.set("io", io);

  // Run when client connects
  io.on("connection", (socket) => {
    socket.on("join", (userData) => {
      const user = userJoin(socket.id, userData);

      // Broadcast when a user connects
      socket.broadcast.emit("message", `${new Date().toLocaleTimeString()} - ${user.user.email} giriş yaptı`);

      // Send users and room info
      io.emit("onlineUsers", {
        users: getUsers(),
      });
    });

    // Runs when client disconnects
    socket.on("disconnect", () => {
      const user = userLeave(socket.id);

      if (user) {
        io.emit("message", `${new Date().toLocaleTimeString()} - ${user.user.email} çıkış yaptı`);

        // Send users and room info
        io.emit("onlineUsers", {
          users: getUsers(),
        });
      }
    });
  });

  const port = process.env.PORT || 4000;

  httpServer.listen(port, function () {
    console.log("server runing on: " + port);
  });
}

main();
