/**
 * Mapeo Config Renderer Library
 * 
 * This module exports utility functions for working with Mapeo configuration files.
 */

const getFields = require('./getFields');
const getIcon = require('./getIcon');
const getPresets = require('./getPresets');
const log = require('./log');

module.exports = {
  getFields,
  getIcon,
  getPresets,
  log
};
