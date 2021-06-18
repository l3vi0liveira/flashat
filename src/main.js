const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser")
const path = require("path");
const cors = require("cors");
var replaceall = require("replaceall");

const routes = require("./routes");

const app = express();

app.use(cors())
app.use(
  "/files",
  express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
);

app.use(bodyParser.json())

app.use(routes);

app.get("/", (req, res) => {
  return res.send("Welcome to server");
});

app.listen(3312, () => {
  console.log("Server online in port: 3312");
});
