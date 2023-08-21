const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

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

app.use(express.static(path.join(__dirname, "..", "build")));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

app.get("/icons/:iconName", (req, res) => {
  const presetsDir =
    process.env.PRESETS_FOLDER || path.join(__dirname, "presets");
  const iconName = req.params.iconName;
  const iconsDir = path.join(presetsDir, "..", "icons");
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
  console.log("process.env.PRESETS_FOLDER", process.env.PRESETS_FOLDER);

  const presetsDir =
    process.env.PRESETS_FOLDER || path.join(__dirname, "presets");
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
              iconPath: `http://localhost:5000/icons/${icon}-100px.svg`,
            };
          }),
      );
    });
  } else {
    res.status(500).json({ error: "No presets found." });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
