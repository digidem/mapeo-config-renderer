const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const events = require("events");
const chokidar = require("chokidar");
const path = require("path");
const os = require("os");
// Import all utility functions
const {
  getIcon,
  getPresets,
  getFields,
  getMessages,
  getDefaults,
  getMetadata,
  getStylesheet,
  getConfig,
} = require("./lib");

const DEBUG = process.env.DEBUG === "true";

const debugLog = (...args) => {
  if (DEBUG) {
    console.log(...args);
  }
};

const hostname = os.hostname();
const envPort = process.env.PORT || 5000;
const log = require("./lib/log");

debugLog("Debug mode is on");
log(`Hostname: ${hostname}`);
log(`Environment Port: ${envPort}`);

function runApp(mapeoConfigFolder, appPort, headless) {
  const app = express();
  const server = http.createServer(app);

  log(`appPort: ${appPort || "not set"}`);
  debugLog(`Starting app with port: ${appPort}`);
  const port = appPort || envPort;
  const presetsDir = mapeoConfigFolder
    ? path.join(mapeoConfigFolder, "presets")
    : process.env.PRESETS_FOLDER || path.join(__dirname, "presets");

  const fieldsDir = path.join(mapeoConfigFolder, "fields");
  log(`Config directory: ${mapeoConfigFolder}`);
  log(`Presets directory: ${presetsDir}`);
  log(`Fields directory: ${fieldsDir}`);
  debugLog(`Presets directory resolved to: ${presetsDir}`);
  debugLog(`Fields directory resolved to: ${fieldsDir}`);

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
    debugLog(`Detected file change at: ${path}`);
    updateEmitter.on("update", () => {
      clearTimeout(updateTimeout); // Clear any existing timeout
      updateTimeout = setTimeout(() => {
        // Throttle the emit on update
        io.emit(msgId, "Folder updated");
        debugLog("Emitted update event after file change");
      }, 1000); // Set a delay of 1 second before emitting the update
    });
    updateEmitter.emit("update");
    io.on("connection", (socket) => {
      log("Client connected");
      debugLog("Socket client connected");

      socket.on("disconnect", () => {
        log("Client disconnected");
        debugLog("Socket client disconnected");
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
      debugLog(`Served icon: ${iconName}`);
    } catch (err) {
      res.status(404).json({ error: "Icon not found.", message: err });
      debugLog(`Failed to serve icon: ${iconName}`, err);
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
      debugLog(`Served presets: ${data.length} items`);
    } catch (error) {
      res
        .status(500)
        .json({ error: error || "Unknown error on getting presets" });
      debugLog("Error serving presets", error);
    }
  });
  app.get("/api/fields", async (req, res) => {
    try {
      log("Getting fields");
      const data = await getFields(fieldsDir);
      log("Got fields", data.length);
      res.json(data);
      debugLog(`Served fields: ${data.length} items`);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to get fields", message: error.message });
      debugLog("Error serving fields", error);
    }
  });
  app.get("/path", (req, res) => {
    res.json({
      data: mapeoConfigFolder,
    });
    debugLog(`Served mapeoConfigFolder path: ${mapeoConfigFolder}`);
  });

  // New endpoints for CoMapeo format

  app.get("/api/messages", async (req, res) => {
    try {
      log("Getting messages");
      const messagesDir = path.join(mapeoConfigFolder, "messages");
      const data = await getMessages(messagesDir);
      log("Got messages", Object.keys(data).length);
      res.json(data);
      debugLog(`Served messages: ${Object.keys(data).length} languages`);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to get messages", message: error.message });
      debugLog("Error serving messages", error);
    }
  });

  app.get("/api/defaults", async (req, res) => {
    try {
      log("Getting defaults");
      const data = await getDefaults(mapeoConfigFolder);
      log("Got defaults", data);
      res.json(data);
      debugLog(`Served defaults`);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to get defaults", message: error.message });
      debugLog("Error serving defaults", error);
    }
  });

  app.get("/api/metadata", async (req, res) => {
    try {
      log("Getting metadata");
      const data = await getMetadata(mapeoConfigFolder);
      log("Got metadata", data);
      res.json(data);
      debugLog(`Served metadata`);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to get metadata", message: error.message });
      debugLog("Error serving metadata", error);
    }
  });

  app.get("/api/stylesheet", async (req, res) => {
    try {
      log("Getting stylesheet");
      const data = await getStylesheet(mapeoConfigFolder);
      log("Got stylesheet", data.length);
      res.header("Content-Type", "text/css");
      res.send(data);
      debugLog(`Served stylesheet: ${data.length} bytes`);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to get stylesheet", message: error.message });
      debugLog("Error serving stylesheet", error);
    }
  });

  app.get("/api/config", async (req, res) => {
    try {
      log("Getting complete configuration");
      const hostname = req.hostname;
      const protocol = req.protocol;
      const data = await getConfig(mapeoConfigFolder, {
        protocol,
        hostname,
        port,
      });
      log("Got configuration", {
        presets: data.presets.length,
        fields: data.fields.length,
        messages: Object.keys(data.messages).length,
        format: data._format,
      });
      res.json(data);
      debugLog(`Served complete configuration`);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to get configuration", message: error.message });
      debugLog("Error serving configuration", error);
    }
  });

  server.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}`);
    debugLog(`Server started on port: ${port}`);
  });
}

module.exports = runApp;
