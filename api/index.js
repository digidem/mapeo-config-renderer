const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const events = require("events");
const chokidar = require("chokidar");
const path = require("path");
const os = require("os");
const multer = require("multer");

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

async function runApp(comapeocatFile, appPort, headless) {
  const app = express();
  const server = http.createServer(app);

  const { Reader } = await import("comapeocat");
  let catfile = await loadCatfile(Reader, comapeocatFile);

  // for await (const { lang, translations } of reader.translations()) {
  //   console.log(lang, translations);
  // }

  log(`appPort: ${appPort || "not set"}`);
  debugLog(`Starting app with port: ${appPort}`);
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
  const watcher = chokidar.watch(comapeocatFile, {
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

  // ENDPOINTS
  const storage = multer.diskStorage({
    destination: "/tmp",
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      if (!file.originalname.endsWith(".comapeocat")) {
        return cb(new Error("Only .comapeocat files allowed"));
      }
      cb(null, true);
    },
  });

  app.post("/upload", upload.single("categories"), async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }
    console.log("new file path", req.file.path);
    catfile = await loadCatfile(Reader, req.file.path);
    res.redirect("http://localhost:3000/");
    // res.redirect("/");
    // res.json({
    //   message: "File uploaded",
    //   path: req.file.path,
    // });
  });

  app.get("/api/presets", async (req, res) => {
    try {
      const hostname = req.hostname;
      const protocol = req.protocol;
      log("Getting presets");
      for (let [key, category] of catfile.categories) {
        category.iconPath = normalizeIconPath(
          category.icon,
          protocol,
          hostname,
          envPort,
        );
        catfile.categories.set(key, category);
      }
      res.json(Object.fromEntries(catfile.categories));
      debugLog(`Served presets: ${catfile.categories.size} items`);
    } catch (error) {
      res
        .status(500)
        .json({ error: error || "Unknown error on getting presets" });
      debugLog("Error serving presets", error);
    }
  });

  app.get("/api/preset/:presetName", async (req, res) => {
    try {
      const presetName = req.params.presetName;
      const protocol = req.protocol;
      const hostname = req.hostname;
      const category = catfile.categories.get(presetName);
      category.iconPath = normalizeIconPath(
        category.icon,
        protocol,
        hostname,
        envPort,
      );
      res.json(category);
    } catch (error) {
      res.status(500).json({
        error: "Failed to get preset " + presetName,
        message: error.message,
      });
      debugLog("Error serving fields", error);
    }
  });

  app.get("/api/categorySelection", async (req, res) => {
    res.json(catfile.categorySelection);
  });

  app.get("/api/fields", async (req, res) => {
    try {
      log("Getting fields");
      const data = catfile.fields;
      log("Got fields", data.size);
      res.json(Object.fromEntries(data));
      debugLog(`Served fields: ${data.size} items`);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to get fields", message: error.message });
      debugLog("Error serving fields", error);
    }
  });

  app.get("/icons/:iconName", async (req, res) => {
    const iconName = req.params.iconName;

    try {
      // First try the exact path as requested
      let data = await catfile.reader.getIcon(iconName);

      if (!data) {
        res.status(404).json({ error: "Icon not found." });
        debugLog(`Failed to serve icon: ${iconName}`);
      } else {
        res.header("Content-Type", "image/svg+xml");
        res.send(data);
        debugLog(`Served icon: ${iconName}`);
      }
    } catch (err) {
      res.status(404).json({ error: "Icon not found.", message: err });
      debugLog(`Failed to serve icon: ${iconName}`, err);
    }
  });

  app.get("/path", (req, res) => {
    res.json({
      data: comapeocatFile,
    });
    debugLog(`Served mapeoConfigFolder path: ${comapeocatFile}`);
  });

  app.get("/api/messages", async (req, res) => {
    // try {
    //   log("Getting messages");
    //   const messagesDir = path.join(comapeocatFile, "messages");
    //   const data = await getMessages(messagesDir);
    //   log("Got messages", Object.keys(data).length);
    //   res.json(data);
    //   debugLog(`Served messages: ${Object.keys(data).length} languages`);
    // } catch (error) {
    //   res
    //     .status(500)
    //     .json({ error: "Failed to get messages", message: error.message });
    //   debugLog("Error serving messages", error);
    // }
  });

  app.get("/api/metadata", async (req, res) => {
    try {
      log("Getting metadata");
      const data = catfile.metadata;
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

  server.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}`);
    debugLog(`Server started on port: ${port}`);
  });
}

function normalizeIconPath(iconName, protocol, hostname, port) {
  let baseUrl = "";
  if (protocol && hostname && port) {
    baseUrl = `${protocol}://${hostname}:${port}`;
  } else if (protocol) {
    baseUrl = protocol;
  }
  return `${baseUrl}/icons/${iconName}`;
}

async function loadCatfile(Reader, path) {
  const reader = new Reader(path);
  const categories = await reader.categories();
  const categorySelection = await reader.categorySelection();
  const fields = await reader.fields();
  const metadata = await reader.metadata();
  return { reader, categories, categorySelection, fields, metadata };
}

module.exports = runApp;
