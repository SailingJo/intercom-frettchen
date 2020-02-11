const ip = require("ip");
const colors = require("colors");
const express = require('express');
const app = express();

const server = require('https').createServer(require("./ssl"), app);
const io = require('socket.io')(server);

const port = 3000;

let usercount = 0;

app.use(express.static(__dirname + "/public"));
app.get("/", (_, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

io.on("connection", (socket) => {
  usercount = usercount + 1;

  io.emit("users", usercount);

  socket.on("disconnect", () => {
    usercount = usercount - 1;
    io.emit("users", usercount);
  });

  socket.on("audioMessage", (msg) => {
    socket.broadcast.emit("audioMessage", msg);
  });
});

server.listen(port, console.log(colors.green(`Intercom Frettchen läuft auf https://${ip.address()}:${port}/`)));