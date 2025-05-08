const fs = require("fs").promises;
const path = require("path");
const getFields = require("../getFields");
const log = require("../log");

// Mock dependencies
jest.mock("fs", () => ({
  promises: {
    access: jest.fn(),
    readdir: jest.fn(),
    readFile: jest.fn(),
    lstat: jest.fn(),
  },
}));

jest.mock("../log", () => jest.fn());

describe("getFields", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return an array of parsed JSON fields", async () => {
    // Mock data
    const mockFiles = ["field1.json", "field2.json", "notAField.txt"];
    const mockField1 = { id: "field1", name: "Field 1" };
    const mockField2 = { id: "field2", name: "Field 2" };

    // Setup mocks
    fs.access.mockResolvedValue(undefined);
    fs.readdir.mockResolvedValue(mockFiles);
    fs.lstat.mockResolvedValue({ isDirectory: () => false });
    fs.readFile.mockImplementation((filePath) => {
      if (filePath.includes("field1.json")) {
        return Promise.resolve(JSON.stringify(mockField1));
      } else if (filePath.includes("field2.json")) {
        return Promise.resolve(JSON.stringify(mockField2));
      }
      return Promise.resolve("{}");
    });

    // Call the function
    const fieldsDir = "/mock/path/to/fields";
    const result = await getFields(fieldsDir);

    // Assertions
    expect(fs.readdir).toHaveBeenCalledWith(fieldsDir);
    expect(fs.readFile).toHaveBeenCalledTimes(2);
    expect(result).toHaveLength(2);
    // The result will include key and _format properties
    expect(result[0]).toMatchObject(mockField1);
    expect(result[1]).toMatchObject(mockField2);
  });

  it("should filter out non-JSON files", async () => {
    // Mock data
    const mockFiles = ["field1.json", "notAField.txt"];
    const mockField1 = { id: "field1", name: "Field 1" };

    // Setup mocks
    fs.access.mockResolvedValue(undefined);
    fs.readdir.mockResolvedValue(mockFiles);
    fs.lstat.mockResolvedValue({ isDirectory: () => false });
    fs.readFile.mockImplementation((filePath) => {
      if (filePath.includes("field1.json")) {
        return Promise.resolve(JSON.stringify(mockField1));
      }
      return Promise.resolve("{}");
    });

    // Call the function
    const result = await getFields("/mock/path");

    // Assertions
    expect(fs.readFile).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject(mockField1);
  });

  it("should handle empty directory", async () => {
    // Setup mocks
    fs.access.mockResolvedValue(undefined);
    fs.readdir.mockResolvedValue([]);

    // Call the function
    const result = await getFields("/mock/path");

    // Assertions
    expect(result).toEqual([]);
    expect(fs.readFile).not.toHaveBeenCalled();
  });

  it("should handle errors when reading directory", async () => {
    // Setup mocks
    fs.access.mockResolvedValue(undefined);
    fs.readdir.mockRejectedValue(new Error("Directory not found"));

    // Call the function - should return empty array, not throw
    const result = await getFields("/mock/path");
    expect(result).toEqual([]);
  });
});
