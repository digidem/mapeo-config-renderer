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

function compareStrings(a = "", b = "") {
  return a.toLowerCase().localeCompare(b.toLowerCase());
}
function presetCompare(a, b) {
  if (typeof a.sort !== "undefined" && typeof b.sort !== "undefined") {
    // If sort value is the same, then sort by name
    if (a.sort === b.sort) return compareStrings(a.name, b.name);
    // Lower sort numbers come before higher numbers
    else return a.sort - b.sort;
  } else if (typeof a.sort !== "undefined") {
    // If a has a sort field but b doesn't, a comes first
    return -1;
  } else if (typeof b.sort !== "undefined") {
    // if b has a sort field but a doesn't, b comes first
    return 1;
  } else {
    // if neither have sort defined, compare by name
    return compareStrings(a.name, b.name);
  }
}

function runApp(mapeoConfigFolder, appPort, headless) {
  const app = express();
  const server = http.createServer(app);
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

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept",
    );
    next();
  });
  const updateEmitter = new events.EventEmitter();
  let updateView = false;

  const watcher = chokidar.watch(mapeoConfigFolder, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
  });

  watcher.on("change", (path) => {
    console.log(`File ${path} has been changed`);
    updateEmitter.on("update", () => {
      clearTimeout(updateTimeout); // Clear any existing timeout
      updateTimeout = setTimeout(() => {
        // Throttle the emit on update
        io.emit("presets:update", "Presets updated");
      }, 1000); // Set a delay of 1 second before emitting the update
    });
    updateEmitter.emit("update");
    io.on("connection", (socket) => {
      console.log("Client connected");

      socket.on("disconnect", () => {
        console.log("Client disconnected");
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

  app.get("/icons/:iconName", (req, res) => {
    const iconName = req.params.iconName;
    const iconsDir = path.join(mapeoConfigFolder, "icons");
    const iconPath = path.join(iconsDir, iconName);

    if (fs.existsSync(iconPath) && path.extname(iconPath) === ".svg") {
      const svgData = fs.readFileSync(iconPath, "utf-8");
      res.header("Content-Type", "image/svg+xml");
      res.send(svgData);
    } else {
      res.status(404).json({ error: "Icon not found." });
    }
  });
  app.get("/api/presets", (req, res) => {
    const reqHostname = req.hostname;
    const protocol = req.protocol;
    if (fs.existsSync(presetsDir) && fs.readdirSync(presetsDir).length > 0) {
      fs.readdir(presetsDir, (err, files) => {
        if (err) {
          res.status(500).json({ error: "Failed to read presets directory." });
          return;
        }
        const presets = files.map((file) => {
          const filePath = path.join(presetsDir, file);
          if (fs.lstatSync(filePath).isDirectory()) {
            return null;
          }
          const rawData = fs.readFileSync(filePath, "utf-8");
          return JSON.parse(rawData);
        });
        res.json(
          presets
            .filter((i) => i)
            .sort(presetCompare)
            .map((i) => {
              const { icon } = i;
              return {
                ...i,
                iconPath: `${protocol}://${reqHostname}:${port}/icons/${icon}-100px.svg`,
              };
            }),
        );
      });
    } else {
      res.status(500).json({ error: "No presets found." });
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
