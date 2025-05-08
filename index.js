/**
 * Mapeo Config Renderer
 *
 * This module provides functions for working with Mapeo configuration files.
 * It can be used as a library or as a command-line tool.
 * It supports both legacy Mapeo and new CoMapeo formats.
 */

// Export the main app function
const runApp = require("./api");

// Export all utility functions from the lib
const {
  getFields,
  getIcon,
  getPresets,
  getMessages,
  getDefaults,
  getMetadata,
  getStylesheet,
  getConfig,
  log,
} = require("./api/lib");

module.exports = {
  // Main app function
  runApp,

  // Individual file parsers
  getFields,
  getIcon,
  getPresets,
  getMessages,
  getDefaults,
  getMetadata,
  getStylesheet,

  // Complete configuration parser
  getConfig,

  // Utility
  log,
};
