/**
 * Generate a legacy Mapeo fixture
 *
 * This script generates a complete legacy Mapeo configuration fixture
 * with presets, fields, and icons.
 */
const fs = require("fs").promises;
const path = require("path");

const FIXTURE_DIR = path.join(__dirname, "../fixtures/legacy-mapeo");
const CATEGORIES_DIR = path.join(FIXTURE_DIR, "categories");

// Sample presets for legacy Mapeo
const PRESETS = [
  {
    name: "Airstrip",
    icon: "airstrip",
    color: "#B209B2",
    fields: ["name"],
    geometry: ["point", "area"],
    tags: {
      type: "aeroway",
      aeroway: "airstrip",
    },
    terms: ["airfield", "airport", "landing"],
  },
  {
    name: "River",
    icon: "river",
    color: "#0000FF",
    fields: ["name", "notes"],
    geometry: ["line"],
    tags: {
      natural: "water",
      water: "river",
    },
    terms: ["stream", "waterway"],
  },
  {
    name: "Village",
    icon: "village",
    color: "#8B4513",
    fields: ["name", "population", "notes"],
    geometry: ["point", "area"],
    tags: {
      place: "village",
    },
    terms: ["settlement", "community"],
  },
  {
    name: "Sacred Site",
    icon: "sacred-site",
    color: "#800080",
    fields: ["name", "notes"],
    geometry: ["point"],
    tags: {
      sacred: "yes",
      amenity: "place_of_worship",
    },
    terms: ["spiritual", "worship", "ceremonial"],
  },
];

// Sample fields for legacy Mapeo
const FIELDS = [
  {
    tagKey: "name",
    type: "text",
    label: "Name",
  },
  {
    tagKey: "notes",
    type: "text",
    label: "Notes",
  },
  {
    tagKey: "population",
    type: "number",
    label: "Population",
  },
];

// Sample SVG icons - 100px versions
const ICONS_100PX = {
  "airstrip-100px": `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
    <rect x="20" y="40" width="60" height="20" fill="#B209B2" />
    <polygon points="80,50 90,40 90,60" fill="#B209B2" />
  </svg>`,
  "river-100px": `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
    <path d="M10,50 Q25,30 40,50 T70,50 T90,50" stroke="blue" stroke-width="5" fill="none" />
  </svg>`,
  "village-100px": `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
    <rect x="25" y="40" width="50" height="40" fill="brown" />
    <polygon points="25,40 50,10 75,40" fill="red" />
  </svg>`,
  "sacred-site-100px": `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="40" fill="purple" />
    <polygon points="50,10 60,40 90,40 65,60 75,90 50,70 25,90 35,60 10,40 40,40" fill="yellow" />
  </svg>`,
};

// Sample SVG icons - 24px versions
const ICONS_24PX = {
  "airstrip-24px": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <rect x="5" y="10" width="14" height="4" fill="#B209B2" />
    <polygon points="19,12 22,10 22,14" fill="#B209B2" />
  </svg>`,
  "river-24px": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M2,12 Q6,8 10,12 T18,12 T22,12" stroke="blue" stroke-width="1.5" fill="none" />
  </svg>`,
  "village-24px": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <rect x="6" y="10" width="12" height="10" fill="brown" />
    <polygon points="6,10 12,2 18,10" fill="red" />
  </svg>`,
  "sacred-site-24px": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" fill="purple" />
    <polygon points="12,2 14,10 22,10 16,14 18,22 12,18 6,22 8,14 2,10 10,10" fill="yellow" />
  </svg>`,
};

/**
 * Write a JSON file
 */
async function writeJsonFile(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`Created ${filePath}`);
}

/**
 * Write an SVG file
 */
async function writeSvgFile(filePath, data) {
  await fs.writeFile(filePath, data, "utf-8");
  console.log(`Created ${filePath}`);
}

// Sample defaults.json for legacy Mapeo
const DEFAULTS = {
  area: ["airstrip", "village"],
  line: ["river"],
  point: ["airstrip", "village", "sacred-site"],
  vertex: [],
  relation: [],
};

// Sample metadata.json for legacy Mapeo
const METADATA = {
  dataset_id: "legacy-mapeo-test-config",
  name: "legacy-mapeo-test-config",
  version: "23.05.07",
};

// Sample package.json for legacy Mapeo
const PACKAGE_JSON = {
  name: "legacy-mapeo-test-config",
  version: "1.0.0",
  description: "Test configuration for legacy Mapeo",
  main: "index.js",
  scripts: {
    build: "mapeo-settings-builder build",
  },
  keywords: ["mapeo", "config"],
  author: "Test Author",
  license: "MIT",
};

/**
 * Run mapeo-settings-builder lint to validate the configuration
 */
async function validateConfig(configDir) {
  try {
    console.log(`Validating configuration in ${configDir}...`);

    // Change to the configuration directory
    process.chdir(configDir);

    // Run mapeo-settings-builder lint
    const { execSync } = require("child_process");
    const result = execSync("npx mapeo-settings-builder lint", {
      encoding: "utf-8",
    });

    console.log("Validation result:", result);
    return true;
  } catch (error) {
    console.error("Validation failed:", error.message);
    if (error.stdout) console.error("Validation output:", error.stdout);
    if (error.stderr) console.error("Validation error:", error.stderr);
    return false;
  } finally {
    // Change back to the original directory
    process.chdir(path.join(__dirname, ".."));
  }
}

/**
 * Generate the legacy Mapeo fixture
 */
async function generateLegacyFixture() {
  try {
    console.log("Generating legacy Mapeo fixture...");

    // Create categories directory if it doesn't exist
    try {
      await fs.mkdir(CATEGORIES_DIR, { recursive: true });
      console.log(`Created ${CATEGORIES_DIR}`);
    } catch (err) {
      if (err.code !== "EEXIST") {
        throw err;
      }
    }

    // Create presets
    for (const preset of PRESETS) {
      const presetPath = path.join(
        FIXTURE_DIR,
        "presets",
        `${preset.icon}.json`,
      );
      await writeJsonFile(presetPath, preset);
    }

    // Create fields
    for (const field of FIELDS) {
      const fieldPath = path.join(
        FIXTURE_DIR,
        "fields",
        `${field.tagKey}.json`,
      );
      await writeJsonFile(fieldPath, field);
    }

    // Create 100px icons
    for (const [iconName, iconData] of Object.entries(ICONS_100PX)) {
      const iconPath = path.join(FIXTURE_DIR, "icons", `${iconName}.svg`);
      await writeSvgFile(iconPath, iconData);
    }

    // Create 24px icons
    for (const [iconName, iconData] of Object.entries(ICONS_24PX)) {
      const iconPath = path.join(FIXTURE_DIR, "icons", `${iconName}.svg`);
      await writeSvgFile(iconPath, iconData);
    }

    // Create defaults.json
    const defaultsPath = path.join(FIXTURE_DIR, "defaults.json");
    await writeJsonFile(defaultsPath, DEFAULTS);

    // Create metadata.json
    const metadataPath = path.join(FIXTURE_DIR, "metadata.json");
    await writeJsonFile(metadataPath, METADATA);

    // Create package.json
    const packageJsonPath = path.join(FIXTURE_DIR, "package.json");
    await writeJsonFile(packageJsonPath, PACKAGE_JSON);

    console.log("Legacy Mapeo fixture generated successfully!");

    // Validate the configuration
    await validateConfig(FIXTURE_DIR);
  } catch (error) {
    console.error("Error generating legacy Mapeo fixture:", error);
  }
}

// Run the generator
generateLegacyFixture();
