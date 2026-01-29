const loadCatfile = require("../lib/loadCatfile.js");
const log = require("../lib/log");
const envPort = process.env.PORT || 5000;

/**
  @param {Express} app
*/
function get(app) {
  app.get(
    ["/api/presets", "/api/catfile/:catfile/presets/"],
    async (req, res) => {
      try {
        const { hostname, protocol } = req;
        const catfile = await loadCatfile(req.params.catfile);
        log("Getting presets");
        for (let [key, category] of catfile.categories) {
          category.iconPath = normalizeIconPath(
            category.icon,
            req.params.catfile,
            protocol,
            hostname,
            envPort,
          );
          catfile.categories.set(key, category);
        }
        res.json(Object.fromEntries(catfile.categories));
        log(`Served presets: ${catfile.categories.size} items`);
      } catch (error) {
        res
          .status(500)
          .json({ error: error || "Unknown error on getting presets" });
        log("Error serving presets", error);
      }
    },
  );

  app.get(
    ["/api/preset/:presetName", "/api/catfile/:catfile/preset/:presetName"],
    async (req, res) => {
      try {
        const presetName = req.params.presetName;
        const protocol = req.protocol;
        const hostname = req.hostname;
        const catfile = await loadCatfile(req.params.catfile);
        const category = catfile.categories.get(presetName);
        category.iconPath = normalizeIconPath(
          category.icon,
          req.params.catfile,
          protocol,
          hostname,
          envPort,
        );
        res.json(category);
      } catch (error) {
        res.status(500).json({
          error: "Failed to get preset " + req.params.presetName,
          message: error.message,
        });
        log("Error serving fields", error);
      }
    },
  );

  app.get(["/api/fields", "/api/catfile/:catfile/fields"], async (req, res) => {
    try {
      log("Getting fields");
      const catfile = await loadCatfile(req.params.catfile);
      const data = catfile.fields;
      log("Got fields", data.size);
      res.json(Object.fromEntries(data));
      log(`Served fields: ${data.size} items`);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to get fields", message: error.message });
      log("Error serving fields", error);
    }
  });

  app.get(
    ["/icons/:iconName", "/icons/catfile/:catfile/:iconName"],
    async (req, res) => {
      const iconName = req.params.iconName;

      try {
        const catfile = await loadCatfile(req.params.catfile);
        let data = await catfile.reader.getIcon(iconName);

        if (!data) {
          res.status(404).json({ error: "Icon not found." });
          log(`Failed to serve icon: ${iconName}`);
        } else {
          res.header("Content-Type", "image/svg+xml");
          res.send(data);
          log(`Served icon: ${iconName}`);
        }
      } catch (err) {
        res.status(404).json({ error: "Icon not found.", message: err });
        log(`Failed to serve icon: ${iconName}`, err);
      }
    },
  );

  app.get(
    ["/api/metadata", "/api/catfile/:catfile/metadata"],
    async (req, res) => {
      try {
        log("Getting metadata");
        const catfile = await loadCatfile(req.params.catfile);

        const data = catfile.metadata;
        log("Got metadata", data);
        res.json(data);
        log(`Served metadata`);
      } catch (error) {
        res
          .status(500)
          .json({ error: "Failed to get metadata", message: error.message });
        log("Error serving metadata", error);
      }
    },
  );

  app.get(
    ["/api/categorySelectoin", "/api/catfile/:catfile/categorySelection"],
    async (req, res) => {
      const catfile = await loadCatfile(req.params.catfile);

      res.json(catfile.categorySelection);
    },
  );
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
}

function normalizeIconPath(iconName, catfile, protocol, hostname, port) {
  let baseUrl = "";
  if (protocol && hostname && port) {
    baseUrl = `${protocol}://${hostname}:${port}`;
  } else if (protocol) {
    baseUrl = protocol;
  }
  return `${baseUrl}/icons/catfile/${catfile}/${iconName}`;
}

module.exports = get;
