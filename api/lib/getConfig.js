/**
 * Parse an entire Mapeo configuration project
 *
 * This function reads all files in a Mapeo configuration project and returns
 * a complete configuration object. It handles both legacy Mapeo and new CoMapeo formats.
 */
const fs = require("fs").promises;
const path = require("path");
const log = require("./log");
const getPresets = require("./getPresets");
const getFields = require("./getFields");
const getMessages = require("./getMessages");
const getDefaults = require("./getDefaults");
const getMetadata = require("./getMetadata");
const getStylesheet = require("./getStylesheet");

/**
 * Parse an entire Mapeo configuration project
 * @param {string} configDir - Path to the configuration directory
 * @param {Object} options - Options for parsing
 * @param {string} options.protocol - Protocol for icon URLs
 * @param {string} options.hostname - Hostname for icon URLs
 * @param {string} options.port - Port for icon URLs
 * @returns {Promise<Object>} - Complete configuration object
 */
module.exports = async (configDir, options = {}) => {
  const { protocol, hostname, port } = options;

  try {
    log("Reading configuration directory", configDir);

    // Check if directory exists
    try {
      await fs.access(configDir);
    } catch (err) {
      log("Configuration directory not found", err);
      throw new Error("Configuration directory not found");
    }

    // Determine paths
    const presetsDir = path.join(configDir, "presets");
    const fieldsDir = path.join(configDir, "fields");
    const messagesDir = path.join(configDir, "messages");

    // Parse all components in parallel
    const [presets, fields, messages, defaults, metadata, stylesheet] =
      await Promise.all([
        getPresets(presetsDir, protocol, hostname, port),
        getFields(fieldsDir),
        getMessages(messagesDir),
        getDefaults(configDir),
        getMetadata(configDir),
        getStylesheet(configDir),
      ]);

    // Determine format based on metadata and presets
    const isCoMapeo =
      metadata.name && presets.length > 0 && presets[0]._format === "comapeo";

    // Build configuration object
    const config = {
      presets,
      fields,
      messages,
      defaults,
      metadata,
      stylesheet,
      _format: isCoMapeo ? "comapeo" : "legacy",
    };

    log("Configuration parsed successfully", {
      presets: presets.length,
      fields: fields.length,
      messages: Object.keys(messages).length,
      format: config._format,
    });

    return config;
  } catch (err) {
    log("Error parsing configuration", err);
    throw new Error(`Failed to parse configuration: ${err.message}`);
  }
};
