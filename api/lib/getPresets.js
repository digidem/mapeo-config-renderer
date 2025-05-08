/**
 * Parse preset files from a Mapeo configuration
 *
 * This function reads all JSON files in the presets directory and returns
 * an array of preset objects. It handles both legacy Mapeo and new CoMapeo formats.
 */
const fs = require("fs").promises;
const log = require("./log");
const path = require("path");

/**
 * Compare two strings for sorting
 */
function compareStrings(a = "", b = "") {
  return a.toLowerCase().localeCompare(b.toLowerCase());
}

/**
 * Compare two presets for sorting
 */
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

/**
 * Determine if a preset is in the new CoMapeo format
 */
function isCoMapeoPreset(preset) {
  return (
    preset &&
    typeof preset.name === "string" &&
    typeof preset.icon === "string" &&
    typeof preset.color === "string" &&
    Array.isArray(preset.fields) &&
    Array.isArray(preset.geometry) &&
    typeof preset.tags === "object"
  );
}

/**
 * Parse preset files from a Mapeo configuration
 * @param {string} presetsDir - Path to the presets directory
 * @param {string} protocol - Protocol for icon URLs
 * @param {string} hostname - Hostname for icon URLs
 * @param {string} port - Port for icon URLs
 * @returns {Promise<Array>} - Array of preset objects
 */
module.exports = async (presetsDir, protocol, hostname, port) => {
  let baseUrl = "";
  if (protocol && hostname && port) {
    baseUrl = `${protocol}://${hostname}:${port}/`;
  } else if (protocol) {
    baseUrl = protocol;
  }

  try {
    log("Reading presets directory", presetsDir);

    // Check if directory exists
    try {
      await fs.access(presetsDir);
    } catch (err) {
      log("Presets directory not found", err);
      return []; // Return empty array if directory doesn't exist
    }

    const files = await fs.readdir(presetsDir);
    log("Files in presets directory", files);

    if (files.length === 0) {
      log("No preset files found");
      return []; // Return empty array if no files
    }

    const presets = await Promise.all(
      files.map(async (file) => {
        if (path.extname(file) !== ".json") {
          return null; // Skip non-JSON files
        }

        const filePath = path.join(presetsDir, file);
        const slug = path.basename(file, ".json");
        log("Reading preset file", slug);

        const stats = await fs.lstat(filePath);
        if (stats.isDirectory()) {
          return null; // Skip directories
        }

        try {
          const rawData = await fs.readFile(filePath, "utf-8");
          log("Raw preset data", rawData.length);
          const json = JSON.parse(rawData);

          // Add slug to the preset
          return {
            ...json,
            slug,
          };
        } catch (err) {
          log(`Error parsing preset file ${file}`, err);
          return null;
        }
      }),
    );

    const data = presets
      .filter((i) => i) // Remove nulls
      .sort(presetCompare)
      .map((preset) => {
        const { icon } = preset;

        // Handle icon path differently based on format
        if (isCoMapeoPreset(preset)) {
          // CoMapeo format - icon is just the name without -100px suffix
          return {
            ...preset,
            iconPath: `${baseUrl}icons/${icon}.svg`,
            _format: "comapeo", // Add format indicator
          };
        } else {
          // Legacy format - icon has -100px suffix
          return {
            ...preset,
            iconPath: `${baseUrl}icons/${icon}-100px.svg`,
            _format: "legacy", // Add format indicator
          };
        }
      });

    log("Presets data", data.length);
    if (data.length > 0) {
      log("First preset", data[0]);
    }

    return data;
  } catch (err) {
    log("Error reading presets directory", err);
    return []; // Return empty array on error
  }
};
