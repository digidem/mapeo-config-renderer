/**
 * Parse metadata.json from a Mapeo configuration
 *
 * This function reads the metadata.json file and returns its contents.
 * The metadata.json file contains project metadata such as name and version.
 */
const fs = require("fs").promises;
const path = require("path");
const log = require("./log");

/**
 * Parse metadata.json from a Mapeo configuration
 * @param {string} configDir - Path to the configuration directory
 * @returns {Promise<Object>} - Contents of metadata.json
 */
module.exports = async (configDir) => {
  try {
    const metadataPath = path.join(configDir, "metadata.json");
    log("Reading metadata file", metadataPath);

    try {
      const rawData = await fs.readFile(metadataPath, "utf-8");
      const metadata = JSON.parse(rawData);
      log("Parsed metadata", metadata);
      return metadata;
    } catch (err) {
      if (err.code === "ENOENT") {
        log("metadata.json not found, returning empty metadata");
        return {}; // Return empty object if file doesn't exist
      }
      throw err;
    }
  } catch (err) {
    log("Error reading metadata.json", err);
    return {}; // Return empty object on error
  }
};
