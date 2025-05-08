/**
 * Test the library with both legacy Mapeo and CoMapeo fixtures
 *
 * This script tests the library with both fixtures and outputs the results.
 */
const path = require("path");
const {
  getPresets,
  getFields,
  getIcon,
  getMessages,
  getDefaults,
  getMetadata,
  getStylesheet,
  getConfig,
} = require("../index");

const LEGACY_FIXTURE_DIR = path.join(__dirname, "../fixtures/legacy-mapeo");
const COMAPEO_FIXTURE_DIR = path.join(__dirname, "../fixtures/comapeo");

/**
 * Test the library with a fixture
 */
async function testFixture(fixtureDir, fixtureName) {
  console.log(`\n=== Testing ${fixtureName} ===\n`);

  try {
    // Test getConfig
    console.log("Testing getConfig...");
    const config = await getConfig(fixtureDir);
    console.log(`Format: ${config._format}`);
    console.log(`Presets: ${config.presets.length}`);
    console.log(`Fields: ${config.fields.length}`);
    console.log(`Messages: ${Object.keys(config.messages).length} languages`);
    console.log(`Defaults: ${Object.keys(config.defaults).length} properties`);
    console.log(`Metadata: ${Object.keys(config.metadata).length} properties`);
    console.log(`Stylesheet: ${config.stylesheet.length} bytes`);

    // Test getPresets
    console.log("\nTesting getPresets...");
    const presets = await getPresets(path.join(fixtureDir, "presets"));
    console.log(`Found ${presets.length} presets:`);
    for (const preset of presets) {
      console.log(`- ${preset.name} (${preset._format})`);
    }

    // Test getFields
    console.log("\nTesting getFields...");
    const fields = await getFields(path.join(fixtureDir, "fields"));
    console.log(`Found ${fields.length} fields:`);
    for (const field of fields) {
      const fieldName = field.label || field.key;
      console.log(`- ${fieldName} (${field._format})`);
    }

    // Test getIcon
    console.log("\nTesting getIcon...");
    const iconName = presets[0].icon;
    const iconPath = path.join(
      fixtureDir,
      "icons",
      config._format === "legacy" ? `${iconName}-100px.svg` : `${iconName}.svg`,
    );
    const iconData = await getIcon(iconPath);
    console.log(`Icon ${iconName}: ${iconData.length} bytes`);

    // Test getMessages (only for CoMapeo)
    if (config._format === "comapeo") {
      console.log("\nTesting getMessages...");
      const messages = await getMessages(path.join(fixtureDir, "messages"));
      console.log(
        `Found messages for ${Object.keys(messages).length} languages:`,
      );
      for (const lang of Object.keys(messages)) {
        console.log(
          `- ${lang}: ${Object.keys(messages[lang]).length} messages`,
        );
      }

      // Test getDefaults
      console.log("\nTesting getDefaults...");
      const defaults = await getDefaults(fixtureDir);
      console.log("Defaults:", defaults);

      // Test getMetadata
      console.log("\nTesting getMetadata...");
      const metadata = await getMetadata(fixtureDir);
      console.log("Metadata:", metadata);

      // Test getStylesheet
      console.log("\nTesting getStylesheet...");
      const stylesheet = await getStylesheet(fixtureDir);
      console.log(`Stylesheet: ${stylesheet.length} bytes`);
    }

    console.log(`\n✅ ${fixtureName} tests completed successfully!\n`);
  } catch (error) {
    console.error(`\n❌ Error testing ${fixtureName}:`, error);
  }
}

/**
 * Run all tests
 */
async function runTests() {
  try {
    // Test legacy Mapeo fixture
    await testFixture(LEGACY_FIXTURE_DIR, "Legacy Mapeo");

    // Test CoMapeo fixture
    await testFixture(COMAPEO_FIXTURE_DIR, "CoMapeo");

    console.log("\n=== All tests completed! ===\n");
  } catch (error) {
    console.error("\n❌ Error running tests:", error);
  }
}

// Run the tests
runTests();
