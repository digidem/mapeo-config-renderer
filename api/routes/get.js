const loadCatfile = require("../lib/loadCatfile.js");
const log = require("../lib/log");
const envPort = process.env.PORT || 5000;
const translate = require("../lib/translate.js");

/**
  @param {Express} app
*/
function get(app) {
  // Get available languages
  app.get(
    ["/api/languages", "/api/catfile/:catfile/languages"],
    async (req, res) => {
      try {
        const catfile = await loadCatfile(req.params.catfile);
        const languages = Object.keys(catfile.translations);
        log("Served languages:", languages);
        res.json(languages);
      } catch (error) {
        res
          .status(500)
          .json({ error: "Failed to get languages", message: error.message });
        log("Error serving languages", error);
      }
    },
  );

  app.get(
    ["/api/categories", "/api/catfile/:catfile/categories/"],
    async (req, res) => {
      try {
        const { hostname, protocol } = req;
        const lang = req.query.lang || "en";
        const catfile = await loadCatfile(req.params.catfile);

        log("Getting categories with lang:", lang);
        for (let [catId, category] of catfile.categories) {
          category.iconPath = normalizeIconPath(
            category.icon,
            req.params.catfile,
            protocol,
            hostname,
            envPort,
          );
          translate("category", category, catId, catfile.translations, lang);
          catfile.categories.set(catId, category);
        }
        res.json(Object.fromEntries(catfile.categories));
        log(`Served categories: ${catfile.categories.size} items`);
      } catch (error) {
        res
          .status(500)
          .json({ error: error || "Unknown error on getting categories" });
        log("Error serving categories", error);
      }
    },
  );

  app.get(
    [
      "/api/categories/:categoryId",
      "/api/catfile/:catfile/categories/:categoryId",
    ],
    async (req, res) => {
      const { categoryId, catfile } = req.params;
      const { hostname, protocol } = req;
      const lang = req.query.lang || "en";
      try {
        const file = await loadCatfile(catfile);
        const category = file.categories.get(categoryId);
        category.iconPath = normalizeIconPath(
          category.icon,
          req.params.catfile,
          protocol,
          hostname,
          envPort,
        );
        translate("category", category, categoryId, file.translations, lang);
        res.json(category);
      } catch (error) {
        res.status(500).json({
          error: "Failed to get category: " + categoryId,
          message: error.message,
        });
        log("Error serving category: " + categoryId, error);
      }
    },
  );

  app.get(["/api/fields", "/api/catfile/:catfile/fields"], async (req, res) => {
    try {
      const lang = req.query.lang || "en";
      log("Getting fields with lang:", lang);
      const catfile = await loadCatfile(req.params.catfile);
      const data = catfile.fields;
      for (let [fieldId, field] of data) {
        translate("field", field, fieldId, catfile.translations, lang);
      }
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
    ["/api/fields/:fieldId", "/api/catfile/:catfile/fields/:fieldId"],
    async (req, res) => {
      const fieldId = req.params.fieldId;
      const lang = req.query.lang || "en";
      const catfile = await loadCatfile(req.params.catfile);
      const field = catfile.fields.get(fieldId);
      translate("field", field, fieldId, catfile.translations, lang);

      log("Got field", fieldId, "with lang:", lang);
      res.json(field);
      log(`Served field: ${fieldId}`);

      try {
      } catch (error) {
        res.status(500).json({
          error: "Failed to get field:" + fieldId,
          message: error.message,
        });
        log("Error serving fields", error);
      }
    },
  );

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
    try {
      log("Getting messages");
      const catfile = await loadCatfile(req.params.catfile);
      res.json(catfile.translations);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to get messages", message: error.message });
      debugLog("Error serving messages", error);
    }
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
