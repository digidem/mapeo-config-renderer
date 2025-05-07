const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/", (req, res) => {
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

module.exports = router;
