const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/:iconName", (req, res) => {
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

module.exports = router;
