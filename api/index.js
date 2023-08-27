const express = require("express");
const fs = require("fs");
const http = require("http");
const socketIO = require("socket.io");
const events = require("events");
const chokidar = require("chokidar");
const path = require("path");
const os = require("os");
const hostname = os.hostname();
const envPort = process.env.PORT || 5000;
const rootRoute = require("./routes/root");
const iconsRoute = require("./routes/icons");
const presetsRoute = require("./routes/presets");
const pathRoute = require("./routes/path");
const app = express();
const server = http.createServer(app);

function runApp(mapeoConfigFolder, appPort, headless) {
  const io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  console.log("appPort", appPort);
  const port = appPort || envPort;
  const presetsDir = mapeoConfigFolder
    ? path.join(mapeoConfigFolder, "presets")
    : process.env.PRESETS_FOLDER || path.join(__dirname, "presets");

  !headless && app.use(express.static(path.join(__dirname, "..", "build")));

  // app.use('/', rootRoute);
  app.use("/icons", iconsRoute);
  // app.use('/api/presets', presetsRoute);
  // app.use('/path', pathRoute);

  server.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}`);
  });
}

module.exports = runApp;
