/**
 * Parse SVG icon file from a Mapeo configuration
 *
 * This function reads an SVG icon file and returns its contents.
 * It handles both legacy Mapeo and new CoMapeo formats.
 */
const fs = require("fs").promises;
const path = require("path");
const log = require("./log");

/**
 * Parse SVG icon file from a Mapeo configuration
 * @param {string} iconPath - Path to the icon file
 * @returns {Promise<string|Object>} - SVG data or error object
 */
module.exports = async (iconPath) => {
  try {
    log("Reading icon", iconPath);

    const stats = await fs.stat(iconPath);
    if (stats.isFile() && path.extname(iconPath) === ".svg") {
      const svgData = await fs.readFile(iconPath, "utf-8");
      log("Icon data loaded", svgData.length);
      return svgData;
    } else {
      log("Icon not found or not an SVG file", iconPath);
      return { error: "Icon not found." };
    }
  } catch (err) {
    log("Error reading icon", err);
    return { error: "Icon not found." };
  }
};
