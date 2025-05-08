/**
 * Parse defaults.json from a Mapeo configuration
 *
 * This function reads the defaults.json file and returns its contents.
 * The defaults.json file specifies default settings like language and category.
 */
const fs = require("fs").promises;
const path = require("path");
const log = require("./log");

/**
 * Parse defaults.json from a Mapeo configuration
 * @param {string} configDir - Path to the configuration directory
 * @returns {Promise<Object>} - Contents of defaults.json
 */
module.exports = async (configDir) => {
  try {
    const defaultsPath = path.join(configDir, "defaults.json");
    log("Reading defaults file", defaultsPath);

    try {
      const rawData = await fs.readFile(defaultsPath, "utf-8");
      const defaults = JSON.parse(rawData);
      log("Parsed defaults", defaults);
      return defaults;
    } catch (err) {
      if (err.code === "ENOENT") {
        log("defaults.json not found, returning empty defaults");
        return {}; // Return empty object if file doesn't exist
      }
      throw err;
    }
  } catch (err) {
    log("Error reading defaults.json", err);
    return {}; // Return empty object on error
  }
};
