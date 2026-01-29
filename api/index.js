const express = require("express");
const http = require("http");
const path = require("path");
const os = require("os");
const get = require("./routes/get.js");
const post = require("./routes/post.js");
// const socket = require("./routes/socket.js");

const DEBUG = process.env.DEBUG === "true";

const hostname = os.hostname();
const envPort = process.env.PORT || 5000;
const log = require("./lib/log");

log(`Hostname: ${hostname}`);
log(`Environment Port: ${envPort}`);

async function runApp(comapeocatFile, appPort, headless) {
  const app = express();
  const server = http.createServer(app);

  log(`appPort: ${appPort || "not set"}`);
  const port = appPort || envPort;
  log(`file: ${comapeocatFile}`);

  !headless && app.use(express.static(path.join(__dirname, "..", "build")));

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept",
    );
    next();
  });

  // ENDPOINTS
  // socket(app, server, headless);
  get(app);
  post(app);

  server.listen(port, () => {
    log(`Server running at http://${hostname}:${port}`);
  });
}

module.exports = runApp;
