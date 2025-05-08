/**
 * Parse message/translation files from a Mapeo configuration
 *
 * This function reads all JSON files in the messages directory and returns
 * an object with language codes as keys and translation objects as values.
 */
const fs = require("fs").promises;
const path = require("path");
const log = require("./log");

/**
 * Parse message files from a Mapeo configuration
 * @param {string} messagesDir - Path to the messages directory
 * @returns {Promise<Object>} - Object with language codes as keys and translation objects as values
 */
module.exports = async (messagesDir) => {
  try {
    log("Reading messages directory", messagesDir);

    // Check if directory exists
    try {
      await fs.access(messagesDir);
    } catch (err) {
      log("Messages directory not found", err);
      return {}; // Return empty object if directory doesn't exist
    }

    const files = await fs.readdir(messagesDir);
    log("Files in messages directory", files);

    if (files.length === 0) {
      return {}; // Return empty object if no files
    }

    const messages = {};

    await Promise.all(
      files.map(async (file) => {
        if (path.extname(file) === ".json") {
          const filePath = path.join(messagesDir, file);
          const stats = await fs.lstat(filePath);

          if (stats.isDirectory()) {
            return; // Skip directories
          }

          try {
            const rawData = await fs.readFile(filePath, "utf-8");
            const json = JSON.parse(rawData);

            // Use filename without extension as language code
            const langCode = path.basename(file, ".json");
            messages[langCode] = json;

            log(`Parsed messages for language: ${langCode}`);
          } catch (err) {
            log(`Error parsing message file ${file}`, err);
          }
        }
      }),
    );

    return messages;
  } catch (err) {
    log("Error reading messages directory", err);
    return {}; // Return empty object on error
  }
};
