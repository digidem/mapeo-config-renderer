const socketIO = require("socket.io");
const events = require("events");
const chokidar = require("chokidar");

/**
  @param {Express} app
  @param {any} server
  @param {Boolean} headless
  */
function socket(app, server, headless) {
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
    updateEmitter.on("update", () => {
      clearTimeout(updateTimeout); // Clear any existing timeout
      updateTimeout = setTimeout(() => {
        // Throttle the emit on update
        io.emit(msgId, "Folder updated");
        log("Emitted update event after file change");
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
}

module.exports = socket;
