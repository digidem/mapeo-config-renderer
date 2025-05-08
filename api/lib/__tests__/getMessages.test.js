const fs = require("fs").promises;
const path = require("path");
const getMessages = require("../getMessages");

// Mock fs.promises
jest.mock("fs", () => ({
  promises: {
    access: jest.fn(),
    readdir: jest.fn(),
    lstat: jest.fn(),
    readFile: jest.fn(),
  },
}));

describe("getMessages", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return an object with language codes as keys and translation objects as values", async () => {
    // Mock data
    const mockFiles = ["en.json", "es.json", "notAMessage.txt"];
    const mockEnMessages = {
      "fields.name.label": {
        description: "Label for field name",
        message: "Name",
      },
      "presets.river.name": {
        description: "The name of preset river",
        message: "River",
      },
    };
    const mockEsMessages = {
      "fields.name.label": {
        description: "Label for field name",
        message: "Nombre",
      },
      "presets.river.name": {
        description: "The name of preset river",
        message: "Río",
      },
    };

    // Setup mocks
    fs.access.mockResolvedValue(undefined);
    fs.readdir.mockResolvedValue(mockFiles);
    fs.lstat.mockResolvedValue({ isDirectory: () => false });
    fs.readFile.mockImplementation((filePath) => {
      if (filePath.includes("en.json")) {
        return Promise.resolve(JSON.stringify(mockEnMessages));
      } else if (filePath.includes("es.json")) {
        return Promise.resolve(JSON.stringify(mockEsMessages));
      }
      return Promise.resolve("{}");
    });

    // Call the function
    const messagesDir = "/mock/path/to/messages";
    const result = await getMessages(messagesDir);

    // Assertions
    expect(fs.readdir).toHaveBeenCalledWith(messagesDir);
    expect(fs.readFile).toHaveBeenCalledTimes(2);
    expect(result).toHaveProperty("en");
    expect(result).toHaveProperty("es");
    expect(result.en).toEqual(mockEnMessages);
    expect(result.es).toEqual(mockEsMessages);
  });

  it("should handle empty directory", async () => {
    // Setup mocks
    fs.access.mockResolvedValue(undefined);
    fs.readdir.mockResolvedValue([]);

    // Call the function
    const result = await getMessages("/mock/path");

    // Assertions
    expect(result).toEqual({});
    expect(fs.readFile).not.toHaveBeenCalled();
  });

  it("should handle non-existent directory", async () => {
    // Setup mocks
    fs.access.mockRejectedValue(new Error("Directory not found"));

    // Call the function
    const result = await getMessages("/mock/path");

    // Assertions
    expect(result).toEqual({});
    expect(fs.readdir).not.toHaveBeenCalled();
  });

  it("should filter out non-JSON files", async () => {
    // Mock data
    const mockFiles = ["en.json", "notAMessage.txt"];
    const mockEnMessages = {
      "fields.name.label": {
        description: "Label for field name",
        message: "Name",
      },
    };

    // Setup mocks
    fs.access.mockResolvedValue(undefined);
    fs.readdir.mockResolvedValue(mockFiles);
    fs.lstat.mockResolvedValue({ isDirectory: () => false });
    fs.readFile.mockImplementation((filePath) => {
      if (filePath.includes("en.json")) {
        return Promise.resolve(JSON.stringify(mockEnMessages));
      }
      return Promise.resolve("{}");
    });

    // Call the function
    const result = await getMessages("/mock/path");

    // Assertions
    expect(fs.readFile).toHaveBeenCalledTimes(1);
    expect(result).toHaveProperty("en");
    expect(result.en).toEqual(mockEnMessages);
  });

  it("should handle errors when parsing JSON", async () => {
    // Mock data
    const mockFiles = ["en.json", "invalid.json"];
    const mockEnMessages = {
      "fields.name.label": {
        description: "Label for field name",
        message: "Name",
      },
    };

    // Setup mocks
    fs.access.mockResolvedValue(undefined);
    fs.readdir.mockResolvedValue(mockFiles);
    fs.lstat.mockResolvedValue({ isDirectory: () => false });
    fs.readFile.mockImplementation((filePath) => {
      if (filePath.includes("en.json")) {
        return Promise.resolve(JSON.stringify(mockEnMessages));
      } else if (filePath.includes("invalid.json")) {
        return Promise.resolve("{ invalid json }");
      }
      return Promise.resolve("{}");
    });

    // Call the function
    const result = await getMessages("/mock/path");

    // Assertions
    expect(fs.readFile).toHaveBeenCalledTimes(2);
    expect(result).toHaveProperty("en");
    expect(result.en).toEqual(mockEnMessages);
    expect(result).not.toHaveProperty("invalid");
  });
});
