// Test importing the library
console.log("Starting import test...");

try {
  console.log("Importing from index.js...");
  const lib = require("./index");
  console.log("Import successful, lib:", Object.keys(lib));

  const { getPresets, getFields, getIcon } = lib;

  console.log("Library functions imported successfully:");
  console.log("- getPresets:", typeof getPresets === "function");
  console.log("- getFields:", typeof getFields === "function");
  console.log("- getIcon:", typeof getIcon === "function");
} catch (error) {
  console.error("Error importing library:", error);
}
