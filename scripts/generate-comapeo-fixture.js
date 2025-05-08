/**
 * Generate a CoMapeo fixture
 *
 * This script generates a complete CoMapeo configuration fixture
 * with presets, fields, messages, icons, defaults.json, and metadata.json.
 */
const fs = require("fs").promises;
const path = require("path");

const FIXTURE_DIR = path.join(__dirname, "../fixtures/comapeo");
const CATEGORIES_DIR = path.join(FIXTURE_DIR, "categories");
const SVG_DIR = path.join(FIXTURE_DIR, "svg");

// Sample presets for CoMapeo
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
    fields: ["name", "notes", "religion"],
    geometry: ["point"],
    tags: {
      sacred: "yes",
      amenity: "place_of_worship",
    },
    terms: ["spiritual", "worship", "ceremonial"],
  },
];

// Sample fields for CoMapeo
const FIELDS = [
  {
    tagKey: "name",
    type: "text",
    label: "Name",
    placeholder: "Enter a name",
    helperText: "The name of this feature",
    universal: false,
  },
  {
    tagKey: "notes",
    type: "text",
    label: "Notes",
    placeholder: "Enter any additional information",
    helperText: "Any additional information about this feature",
    universal: false,
  },
  {
    tagKey: "population",
    type: "number",
    label: "Population",
    placeholder: "Enter the population",
    helperText: "The number of people living here",
    universal: false,
  },
  {
    tagKey: "religion",
    type: "selectOne",
    label: "Religion",
    options: [
      { label: "Christianity", value: "christianity" },
      { label: "Islam", value: "islam" },
      { label: "Hinduism", value: "hinduism" },
      { label: "Buddhism", value: "buddhism" },
      { label: "Indigenous", value: "indigenous" },
      { label: "Other", value: "other" },
    ],
    helperText: "The religion associated with this site",
    universal: false,
  },
];

// Sample messages for CoMapeo
const MESSAGES = {
  en: {
    "fields.name.label": {
      description: "Label for field name",
      message: "Name",
    },
    "fields.name.placeholder": {
      description: "Placeholder for field name",
      message: "Enter a name",
    },
    "fields.name.helperText": {
      description: "Helper text for field name",
      message: "The name of this feature",
    },
    "fields.notes.label": {
      description: "Label for field notes",
      message: "Notes",
    },
    "fields.notes.placeholder": {
      description: "Placeholder for field notes",
      message: "Enter any additional information",
    },
    "fields.notes.helperText": {
      description: "Helper text for field notes",
      message: "Any additional information about this feature",
    },
    "fields.population.label": {
      description: "Label for field population",
      message: "Population",
    },
    "fields.population.placeholder": {
      description: "Placeholder for field population",
      message: "Enter the population",
    },
    "fields.population.helperText": {
      description: "Helper text for field population",
      message: "The number of people living here",
    },
    "fields.religion.label": {
      description: "Label for field religion",
      message: "Religion",
    },
    "fields.religion.helperText": {
      description: "Helper text for field religion",
      message: "The religion associated with this site",
    },
    "presets.airstrip.name": {
      description: "The name of preset airstrip",
      message: "Airstrip",
    },
    "presets.airstrip.terms": {
      description: "List of search terms for preset airstrip",
      message: "airfield, airport, landing",
    },
    "presets.river.name": {
      description: "The name of preset river",
      message: "River",
    },
    "presets.river.terms": {
      description: "List of search terms for preset river",
      message: "stream, waterway",
    },
    "presets.village.name": {
      description: "The name of preset village",
      message: "Village",
    },
    "presets.village.terms": {
      description: "List of search terms for preset village",
      message: "settlement, community",
    },
    "presets.sacred-site.name": {
      description: "The name of preset sacred-site",
      message: "Sacred Site",
    },
    "presets.sacred-site.terms": {
      description: "List of search terms for preset sacred-site",
      message: "spiritual, worship, ceremonial",
    },
  },
  es: {
    "fields.name.label": {
      description: "Label for field name",
      message: "Nombre",
    },
    "fields.name.placeholder": {
      description: "Placeholder for field name",
      message: "Ingrese un nombre",
    },
    "fields.name.helperText": {
      description: "Helper text for field name",
      message: "El nombre de esta característica",
    },
    "fields.notes.label": {
      description: "Label for field notes",
      message: "Notas",
    },
    "fields.notes.placeholder": {
      description: "Placeholder for field notes",
      message: "Ingrese cualquier información adicional",
    },
    "fields.notes.helperText": {
      description: "Helper text for field notes",
      message: "Cualquier información adicional sobre esta característica",
    },
    "fields.population.label": {
      description: "Label for field population",
      message: "Población",
    },
    "fields.population.placeholder": {
      description: "Placeholder for field population",
      message: "Ingrese la población",
    },
    "fields.population.helperText": {
      description: "Helper text for field population",
      message: "El número de personas que viven aquí",
    },
    "fields.religion.label": {
      description: "Label for field religion",
      message: "Religión",
    },
    "fields.religion.helperText": {
      description: "Helper text for field religion",
      message: "La religión asociada con este sitio",
    },
    "presets.airstrip.name": {
      description: "The name of preset airstrip",
      message: "Pista de Aterrizaje",
    },
    "presets.airstrip.terms": {
      description: "List of search terms for preset airstrip",
      message: "aeródromo, aeropuerto, aterrizaje",
    },
    "presets.river.name": {
      description: "The name of preset river",
      message: "Río",
    },
    "presets.river.terms": {
      description: "List of search terms for preset river",
      message: "arroyo, vía fluvial",
    },
    "presets.village.name": {
      description: "The name of preset village",
      message: "Pueblo",
    },
    "presets.village.terms": {
      description: "List of search terms for preset village",
      message: "asentamiento, comunidad",
    },
    "presets.sacred-site.name": {
      description: "The name of preset sacred-site",
      message: "Sitio Sagrado",
    },
    "presets.sacred-site.terms": {
      description: "List of search terms for preset sacred-site",
      message: "espiritual, adoración, ceremonial",
    },
  },
};

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

// Map preset names to icon names
const PRESET_TO_ICON = {
  airstrip: "airstrip",
  river: "river",
  village: "village",
  "sacred-site": "sacred-site",
};

// Sample defaults.json for CoMapeo
const DEFAULTS = {
  area: ["airstrip", "village"],
  line: ["river"],
  point: ["airstrip", "village", "sacred-site"],
  vertex: [],
  relation: [],
};

// Sample metadata.json for CoMapeo
const METADATA = {
  dataset_id: "comapeo-mulokot-comapeo-category",
  name: "config-mulokot-comapeo-category",
  version: "25.05.07",
};

// Sample package.json for CoMapeo
const PACKAGE_JSON = {
  name: "comapeo-test-config",
  version: "1.0.0",
  description: "Test configuration for CoMapeo",
  main: "index.js",
  scripts: {
    build: "mapeo-settings-builder build",
  },
  keywords: ["comapeo", "config"],
  author: "Test Author",
  license: "MIT",
};

// Sample style.css
const STYLESHEET = `
/* CoMapeo Custom Styles */
.preset-airstrip {
  color: #B209B2;
}
.preset-river {
  color: #0000FF;
}
.preset-village {
  color: #8B4513;
}
.preset-sacred-site {
  color: #800080;
}
`;

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

/**
 * Write a text file
 */
async function writeTextFile(filePath, data) {
  await fs.writeFile(filePath, data, "utf-8");
  console.log(`Created ${filePath}`);
}

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
 * Generate the CoMapeo fixture
 */
async function generateCoMapeoFixture() {
  try {
    console.log("Generating CoMapeo fixture...");

    // Create categories directory if it doesn't exist
    try {
      await fs.mkdir(CATEGORIES_DIR, { recursive: true });
      console.log(`Created ${CATEGORIES_DIR}`);
    } catch (err) {
      if (err.code !== "EEXIST") {
        throw err;
      }
    }

    // Create svg directory if it doesn't exist
    try {
      await fs.mkdir(SVG_DIR, { recursive: true });
      console.log(`Created ${SVG_DIR}`);
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

    // Create messages
    for (const [lang, messages] of Object.entries(MESSAGES)) {
      const messagesPath = path.join(FIXTURE_DIR, "messages", `${lang}.json`);
      await writeJsonFile(messagesPath, messages);
    }

    // Create 100px icons in both icons and svg directories
    for (const [iconName, iconData] of Object.entries(ICONS_100PX)) {
      // Create in icons directory for our library
      const iconPath = path.join(FIXTURE_DIR, "icons", `${iconName}.svg`);
      await writeSvgFile(iconPath, iconData);

      // Create in svg directory for mapeo-settings-builder
      const svgPath = path.join(SVG_DIR, `${iconName}.svg`);
      await writeSvgFile(svgPath, iconData);
    }

    // Create 24px icons in both icons and svg directories
    for (const [iconName, iconData] of Object.entries(ICONS_24PX)) {
      // Create in icons directory for our library
      const iconPath = path.join(FIXTURE_DIR, "icons", `${iconName}.svg`);
      await writeSvgFile(iconPath, iconData);

      // Create in svg directory for mapeo-settings-builder
      const svgPath = path.join(SVG_DIR, `${iconName}.svg`);
      await writeSvgFile(svgPath, iconData);
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

    // Create style.css
    const stylesheetPath = path.join(FIXTURE_DIR, "style.css");
    await writeTextFile(stylesheetPath, STYLESHEET);

    console.log("CoMapeo fixture generated successfully!");

    // Validate the configuration
    await validateConfig(FIXTURE_DIR);
  } catch (error) {
    console.error("Error generating CoMapeo fixture:", error);
  }
}

// Run the generator
generateCoMapeoFixture();
