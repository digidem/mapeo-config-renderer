const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const events = require("events");
const chokidar = require("chokidar");
const path = require("path");
const os = require("os");
const getIcon = require("./lib/getIcon");
const getPresets = require("./lib/getPresets");
const getFields = require("./lib/getFields");

const hostname = os.hostname();
const envPort = process.env.PORT || 5000;
const log = require("./lib/log");

log(`Hostname: ${hostname}`);
log(`Environment Port: ${envPort}`);

function runApp(mapeoConfigFolder, appPort, headless) {
  const app = express();
  const server = http.createServer(app);

  log(`appPort: ${appPort || "not set"}`);
  const port = appPort || envPort;
  const presetsDir = mapeoConfigFolder
    ? path.join(mapeoConfigFolder, "presets")
    : process.env.PRESETS_FOLDER || path.join(__dirname, "presets");

  const fieldsDir = path.join(mapeoConfigFolder, "fields");
  log(`Config directory: ${mapeoConfigFolder}`);
  log(`Presets directory: ${presetsDir}`);
  log(`Fields directory: ${fieldsDir}`);

  !headless && app.use(express.static(path.join(__dirname, "..", "build")));

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept",
    );
    next();
  });
  const io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  let updateView = false;
  let updateTimeout = null; // Add updateTimeout

  const updateEmitter = new events.EventEmitter();
  const msgId = "presets:update";
  const watcher = chokidar.watch(mapeoConfigFolder, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
  });

  watcher.on("change", (path) => {
    log(`File ${path} has been changed`);
    updateEmitter.on("update", () => {
      clearTimeout(updateTimeout); // Clear any existing timeout
      updateTimeout = setTimeout(() => {
        // Throttle the emit on update
        io.emit(msgId, "Folder updated");
      }, 1000); // Set a delay of 1 second before emitting the update
    });
    updateEmitter.emit("update");
    io.on("connection", (socket) => {
      log("Client connected");

      socket.on("disconnect", () => {
        log("Client disconnected");
      });
    });
  });
  !headless &&
    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "..", "build", "index.html"));
      if (updateView) {
        res.sendFile(path.join(__dirname, "..", "build", "index.html"));
        updateView = false;
      }
    });

  app.get("/icons/:iconName", async (req, res) => {
    const iconName = req.params.iconName;
    const iconsDir = path.join(mapeoConfigFolder, "icons");
    const iconPath = path.join(iconsDir, iconName);
    try {
      const data = await getIcon(iconPath);
      res.header("Content-Type", "image/svg+xml");
      res.send(data);
    } catch (err) {
      res.status(404).json({ error: "Icon not found.", message: err });
    }
  });
  app.get("/api/presets", async (req, res) => {
    try {
      const hostname = req.hostname;
      const protocol = req.protocol;
      log("Getting presets");
      const data = await getPresets(presetsDir, protocol, hostname, port);
      log("Got presets", data.length);
      res.json(data);
    } catch (error) {
      res
        .status(500)
        .json({ error: error || "Unknown error on getting presets" });
    }
  });
  app.get("/api/fields", async (req, res) => {
    try {
      log("Getting fields");
      const data = await getFields(fieldsDir);
      log("Got fields", data.length);
      res.json(data);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to get fields", message: error.message });
    }
  });
  app.get("/path", (req, res) => {
    res.json({
      data: mapeoConfigFolder,
    });
  });

  server.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}`);
  });
}

module.exports = runApp;
