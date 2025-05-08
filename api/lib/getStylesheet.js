/**
 * Parse style.css from a Mapeo configuration
 *
 * This function reads the style.css file and returns its contents.
 * The style.css file contains custom CSS for styling the interface.
 */
const fs = require("fs").promises;
const path = require("path");
const log = require("./log");

/**
 * Parse style.css from a Mapeo configuration
 * @param {string} configDir - Path to the configuration directory
 * @returns {Promise<string>} - Contents of style.css
 */
module.exports = async (configDir) => {
  try {
    const stylePath = path.join(configDir, "style.css");
    log("Reading stylesheet", stylePath);

    try {
      const styleData = await fs.readFile(stylePath, "utf-8");
      log("Parsed stylesheet", styleData.length);
      return styleData;
    } catch (err) {
      if (err.code === "ENOENT") {
        log("style.css not found, returning empty string");
        return ""; // Return empty string if file doesn't exist
      }
      throw err;
    }
  } catch (err) {
    log("Error reading style.css", err);
    return ""; // Return empty string on error
  }
};
