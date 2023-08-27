const fs = require('fs').promises;
const log = require('./log');
const path = require('path');

function compareStrings(a = "", b = "") {
  // log('Comparing strings', a, b);
  return a.toLowerCase().localeCompare(b.toLowerCase());
}
function presetCompare(a, b) {
  // log('Comparing presets', a, b);
  if (typeof a.sort !== "undefined" && typeof b.sort !== "undefined") {
    // If sort value is the same, then sort by name
    if (a.sort === b.sort) return compareStrings(a.name, b.name);
    // Lower sort numbers come before higher numbers
    else return a.sort - b.sort;
  } else if (typeof a.sort !== "undefined") {
    // If a has a sort field but b doesn't, a comes first
    return -1;
  } else if (typeof b.sort !== "undefined") {
    // if b has a sort field but a doesn't, b comes first
    return 1;
  } else {
    // if neither have sort defined, compare by name
    return compareStrings(a.name, b.name);
  }
}

module.exports = async (presetsDir, protocol, hostname, port) => {
  let baseUrl = '/'
  if (protocol && hostname && port) {
    baseUrl = `${protocol}://${hostname}:${port}/`
  } else if (protocol) {
    baseUrl = protocol
  }
  try {
    log('Reading presets directory', presetsDir);
    const files = await fs.readdir(presetsDir);
    log('Files in presets directory', files);
    if (files.length > 0) {
      const presets = await Promise.all(files.map(async (file) => {
        const filePath = path.join(presetsDir, file);
        log('Reading file', filePath);
        const stats = await fs.lstat(filePath);
        if (stats.isDirectory()) {
          return null;
        }
        const rawData = await fs.readFile(filePath, "utf-8");
        log('Raw data', rawData.length);
        return JSON.parse(rawData);
      }));
      const data = presets
      .filter((i) => i)
      .sort(presetCompare)
      .map((i) => {
        const { icon } = i;
        return {
          ...i,
          iconPath: `${baseUrl}/${icon}-100px.svg`,
        };
      })
      log('Presets data', data.length)
      log(data[0])
      return data
    } else {
      throw new Error('Presets folder not found');
    }
  } catch (err) {
    log('Error reading presets directory', err);
    throw new Error("Failed to read presets directory.");
  }
}