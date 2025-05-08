const fs = require("fs").promises;
const path = require("path");
const getConfig = require("../getConfig");

// Mock dependencies
jest.mock("../getPresets", () => jest.fn());
jest.mock("../getFields", () => jest.fn());
jest.mock("../getMessages", () => jest.fn());
jest.mock("../getDefaults", () => jest.fn());
jest.mock("../getMetadata", () => jest.fn());
jest.mock("../getStylesheet", () => jest.fn());
jest.mock("../log", () => jest.fn());

// Mock fs.promises
jest.mock("fs", () => ({
  promises: {
    access: jest.fn(),
  },
}));

// Import mocked dependencies
const getPresets = require("../getPresets");
const getFields = require("../getFields");
const getMessages = require("../getMessages");
const getDefaults = require("../getDefaults");
const getMetadata = require("../getMetadata");
const getStylesheet = require("../getStylesheet");

describe("getConfig", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should parse a complete configuration project", async () => {
    // Mock data
    const mockPresets = [
      { name: "Preset 1", icon: "icon1", _format: "legacy" },
    ];
    const mockFields = [{ key: "field1", label: "Field 1", _format: "legacy" }];
    const mockMessages = {
      en: { "presets.preset1.name": { message: "Preset 1" } },
    };
    const mockDefaults = { language: "en" };
    const mockMetadata = { name: "Test Config", version: "1.0.0" };
    const mockStylesheet = "body { color: red; }";

    // Setup mocks
    fs.access.mockResolvedValue(undefined);
    getPresets.mockResolvedValue(mockPresets);
    getFields.mockResolvedValue(mockFields);
    getMessages.mockResolvedValue(mockMessages);
    getDefaults.mockResolvedValue(mockDefaults);
    getMetadata.mockResolvedValue(mockMetadata);
    getStylesheet.mockResolvedValue(mockStylesheet);

    // Call the function
    const configDir = "/mock/path/to/config";
    const options = { protocol: "http", hostname: "localhost", port: "5000" };
    const result = await getConfig(configDir, options);

    // Assertions
    expect(fs.access).toHaveBeenCalledWith(configDir);
    expect(getPresets).toHaveBeenCalledWith(
      path.join(configDir, "presets"),
      options.protocol,
      options.hostname,
      options.port,
    );
    expect(getFields).toHaveBeenCalledWith(path.join(configDir, "fields"));
    expect(getMessages).toHaveBeenCalledWith(path.join(configDir, "messages"));
    expect(getDefaults).toHaveBeenCalledWith(configDir);
    expect(getMetadata).toHaveBeenCalledWith(configDir);
    expect(getStylesheet).toHaveBeenCalledWith(configDir);

    // Check result structure
    expect(result).toEqual({
      presets: mockPresets,
      fields: mockFields,
      messages: mockMessages,
      defaults: mockDefaults,
      metadata: mockMetadata,
      stylesheet: mockStylesheet,
      _format: "legacy",
    });
  });

  it("should handle CoMapeo format", async () => {
    // Mock data
    const mockPresets = [
      {
        name: "River",
        icon: "river",
        color: "#0000FF",
        fields: ["name"],
        geometry: ["line"],
        tags: { natural: "water" },
        _format: "comapeo",
      },
    ];
    const mockFields = [
      {
        tagKey: "name",
        type: "text",
        label: "Name",
        _format: "comapeo",
      },
    ];
    const mockMessages = {
      en: { "presets.river.name": { message: "River" } },
    };
    const mockDefaults = { language: "en" };
    const mockMetadata = { name: "Test CoMapeo Config", version: "1.0.0" };
    const mockStylesheet = "body { color: blue; }";

    // Setup mocks
    fs.access.mockResolvedValue(undefined);
    getPresets.mockResolvedValue(mockPresets);
    getFields.mockResolvedValue(mockFields);
    getMessages.mockResolvedValue(mockMessages);
    getDefaults.mockResolvedValue(mockDefaults);
    getMetadata.mockResolvedValue(mockMetadata);
    getStylesheet.mockResolvedValue(mockStylesheet);

    // Call the function
    const result = await getConfig("/mock/path");

    // Check result structure
    expect(result).toEqual({
      presets: mockPresets,
      fields: mockFields,
      messages: mockMessages,
      defaults: mockDefaults,
      metadata: mockMetadata,
      stylesheet: mockStylesheet,
      _format: "comapeo",
    });
  });

  it("should handle missing configuration directory", async () => {
    // Setup mocks
    fs.access.mockRejectedValue(new Error("Directory not found"));

    // Call the function and expect it to throw
    await expect(getConfig("/nonexistent/path")).rejects.toThrow(
      "Configuration directory not found",
    );
  });
});
