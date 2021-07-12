const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const validator = require("validator");

const routes = require("./routes");

const app = express();

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

const includeSocket = (req, res, next) => {
  req.io = io;

  next();
};

app.use(includeSocket);
app.use(cors());
app.use(
  "/files",
  express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
);
app.use(bodyParser.json());
app.use(routes);

app.get("/", (req, res) => {
  return res.send("Welcome to server");
});

io.on("connection", function (socket) {
  console.log("new user conect on socket: ", socket.id);
});

server.listen(3312, () => {
  console.log("Server online in port: 3312");
});
