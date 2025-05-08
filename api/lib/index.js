/**
 * Mapeo Config Renderer Library
 *
 * This module exports utility functions for working with Mapeo configuration files.
 * It supports both legacy Mapeo and new CoMapeo formats.
 */

const getFields = require("./getFields");
const getIcon = require("./getIcon");
const getPresets = require("./getPresets");
const getMessages = require("./getMessages");
const getDefaults = require("./getDefaults");
const getMetadata = require("./getMetadata");
const getStylesheet = require("./getStylesheet");
const getConfig = require("./getConfig");
const log = require("./log");

module.exports = {
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
