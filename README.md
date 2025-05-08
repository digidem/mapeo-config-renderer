# Mapeo Config Renderer

[![Publish to NPM](https://github.com/digidem/mapeo-config-renderer/actions/workflows/publish-npm.yml/badge.svg?branch=main)](https://github.com/digidem/mapeo-config-renderer/actions/workflows/publish-npm.yml)
[![Tests](https://github.com/digidem/mapeo-config-renderer/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/digidem/mapeo-config-renderer/actions/workflows/test.yml)

Mapeo Config Renderer is a command line application that provides a visual interface for Mapeo configuration files from a local folder. It allows you to view the presets and icons defined in the Mapeo configuration project.

## Features

- Visual interface for Mapeo configuration files
- Displays presets and icons
- Reloads on config change

## Usage

### Command Line Tool

You can run Mapeo Config Renderer using `npx` or `npm`. Inside a Mapeo configuration folder run:

```
npx mapeo-config-renderer
```

Or to install Mapeo Config Renderer globally, use the following command:

```
npm i -g mapeo-config-renderer
```

Open your browser on [http://localhost:5000](http://localhost:5000).

You can also pass an argument `<mapeo config folder path>` with the path to your Mapeo configuration folder, eg.: `npx mapeo-config-renderer /path/to/my-config`

### Library Usage

You can also use Mapeo Config Renderer as a library in your Node.js projects. It supports both legacy Mapeo and new CoMapeo formats.

```javascript
// Import the entire library
const mapeoConfigRenderer = require("mapeo-config-renderer");

// Or import specific functions
const {
  getPresets,
  getFields,
  getIcon,
  getMessages,
  getDefaults,
  getMetadata,
  getStylesheet,
  getConfig,
} = require("mapeo-config-renderer");

// Example: Parse the entire configuration
const configDir = "/path/to/mapeo-config";
getConfig(configDir)
  .then((config) => {
    console.log("Configuration loaded:", {
      presets: config.presets.length,
      fields: config.fields.length,
      messages: Object.keys(config.messages).length,
      format: config._format, // 'legacy' or 'comapeo'
    });
  })
  .catch((err) => {
    console.error("Error loading configuration:", err);
  });

// Example: Get presets from a configuration folder
const presetsDir = "/path/to/config/presets";
getPresets(presetsDir)
  .then((presets) => {
    console.log("Found presets:", presets.length);
  })
  .catch((err) => {
    console.error("Error loading presets:", err);
  });

// Example: Get fields from a configuration folder
const fieldsDir = "/path/to/config/fields";
getFields(fieldsDir)
  .then((fields) => {
    console.log("Found fields:", fields.length);
  })
  .catch((err) => {
    console.error("Error loading fields:", err);
  });

// Example: Get an icon
const iconPath = "/path/to/config/icons/my-icon-100px.svg";
getIcon(iconPath)
  .then((iconData) => {
    console.log("Icon data loaded:", iconData.length);
  })
  .catch((err) => {
    console.error("Error loading icon:", err);
  });

// Example: Get translation messages
const messagesDir = "/path/to/config/messages";
getMessages(messagesDir)
  .then((messages) => {
    console.log("Found translations for languages:", Object.keys(messages));
  })
  .catch((err) => {
    console.error("Error loading messages:", err);
  });

// Example: Get defaults.json
getDefaults("/path/to/config")
  .then((defaults) => {
    console.log("Default settings:", defaults);
  })
  .catch((err) => {
    console.error("Error loading defaults:", err);
  });

// Example: Get metadata.json
getMetadata("/path/to/config")
  .then((metadata) => {
    console.log("Configuration metadata:", metadata);
  })
  .catch((err) => {
    console.error("Error loading metadata:", err);
  });

// Example: Get style.css
getStylesheet("/path/to/config")
  .then((css) => {
    console.log("Custom stylesheet loaded:", css.length, "bytes");
  })
  .catch((err) => {
    console.error("Error loading stylesheet:", err);
  });
```

## Development

In the project directory, you can run:

- `npm start`: Runs the app in the development mode. Open [http://localhost:5000](http://localhost:5000) and [http://localhost:3000](http://localhost:3000) to view it in your browser. Api doesn't auto reload.
- `npm run build`: Builds the app for production to the `build` folder.
- `npm run dev`: Starts both api server and React app in dev mode
- `npm test`: Runs the React app tests
- `npm run test:api`: Runs the API library tests
- `npm run test:all`: Runs all tests
- `npm run lint`: Formats code using Prettier
- `npm run lint:check`: Checks code formatting without making changes
- `npm run generate:fixtures`: Generates test fixtures for both legacy Mapeo and CoMapeo formats
- `npm run test:fixtures`: Generates fixtures and tests the library with them

### Test Fixtures

The project includes scripts to generate test fixtures for both legacy Mapeo and CoMapeo formats. These fixtures can be used to test the library with realistic data.

- **Legacy Mapeo Fixture**: A complete legacy Mapeo configuration with presets, fields, and icons.
- **CoMapeo Fixture**: A complete CoMapeo configuration with presets, fields, messages, icons, defaults.json, metadata.json, and style.css.

To generate the fixtures, run:

```
npm run generate:fixtures
```

To test the library with the fixtures, run:

```
npm run test:fixtures
```

### Pre-commit Hooks

This project uses [Husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/okonet/lint-staged) to run linting on staged files before committing. This ensures that all committed code follows the project's formatting standards.

### GitHub Actions

The project has two GitHub Actions workflows:

1. **Tests**: Runs on every push to main and on pull requests. It runs linting checks and all tests.
2. **Publish to NPM**: Automatically publishes the package to NPM when changes are pushed to the main branch.

## Learn More

Learn more about Mapeo at [Mapeo.app](https://mapeo.app).

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
