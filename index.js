/**
 * Mapeo Config Renderer
 *
 * This module provides functions for working with Mapeo configuration files.
 * It can be used as a library or as a command-line tool.
 */

// Export the main app function
const runApp = require("./api");

// Export utility functions
const getFields = require("./api/lib/getFields");
const getIcon = require("./api/lib/getIcon");
const getPresets = require("./api/lib/getPresets");
const log = require("./api/lib/log");

module.exports = {
  // Main app function
  runApp,

  // Utility functions
  getFields,
  getIcon,
  getPresets,
  log,
};
