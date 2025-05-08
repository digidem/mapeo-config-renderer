/**
 * Parse field files from a Mapeo configuration
 *
 * This function reads all JSON files in the fields directory and returns
 * an array of field objects. It handles both legacy Mapeo and new CoMapeo formats.
 */
const fs = require("fs").promises;
const path = require("path");
const log = require("./log");

/**
 * Determine if a field is in the new CoMapeo format
 */
function isCoMapeoField(field) {
  return (
    field &&
    typeof field.tagKey === "string" &&
    typeof field.type === "string" &&
    typeof field.label === "string"
  );
}

/**
 * Parse field files from a Mapeo configuration
 * @param {string} fieldsDir - Path to the fields directory
 * @returns {Promise<Array>} - Array of field objects
 */
module.exports = async (fieldsDir) => {
  try {
    log("Reading fields directory", fieldsDir);

    // Check if directory exists
    try {
      await fs.access(fieldsDir);
    } catch (err) {
      log("Fields directory not found", err);
      return []; // Return empty array if directory doesn't exist
    }

    const files = await fs.readdir(fieldsDir);
    log("Files in fields directory", files);

    if (files.length === 0) {
      log("No field files found");
      return []; // Return empty array if no files
    }

    const fields = await Promise.all(
      files.map(async (file) => {
        if (path.extname(file) !== ".json") {
          return null; // Skip non-JSON files
        }

        const filePath = path.join(fieldsDir, file);
        const fieldKey = path.basename(file, ".json");
        log("Reading field file", fieldKey);

        try {
          const stats = await fs.lstat(filePath);
          if (stats.isDirectory()) {
            return null; // Skip directories
          }

          const rawData = await fs.readFile(filePath, "utf-8");
          const json = JSON.parse(rawData);

          // Add key and format indicator
          const field = {
            ...json,
            key: fieldKey, // Add key for legacy format
          };

          // Add format indicator
          if (isCoMapeoField(json)) {
            field._format = "comapeo";
          } else {
            field._format = "legacy";
          }

          return field;
        } catch (err) {
          log(`Error parsing field file ${file}`, err);
          return null;
        }
      }),
    );

    const filteredFields = fields.filter((field) => field !== null);
    log("Fields data", filteredFields.length);

    return filteredFields;
  } catch (err) {
    log("Error reading fields directory", err);
    return []; // Return empty array on error
  }
};
