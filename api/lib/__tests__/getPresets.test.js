const fs = require('fs').promises;
const path = require('path');
const getPresets = require('../getPresets');
const log = require('../log');

// Mock dependencies
jest.mock('fs', () => ({
  promises: {
    readdir: jest.fn(),
    readFile: jest.fn(),
    lstat: jest.fn()
  }
}));

jest.mock('../log', () => jest.fn());

describe('getPresets', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return sorted presets with iconPath when files exist', async () => {
    // Mock data
    const mockFiles = ['preset1.json', 'preset2.json'];
    const mockPreset1 = {
      name: 'Preset 1',
      sort: 2,
      icon: 'icon1'
    };
    const mockPreset2 = {
      name: 'Preset 2',
      sort: 1,
      icon: 'icon2'
    };

    // Setup mocks
    fs.readdir.mockResolvedValue(mockFiles);
    fs.lstat.mockResolvedValue({ isDirectory: () => false });
    fs.readFile.mockImplementation((filePath) => {
      if (filePath.includes('preset1.json')) {
        return Promise.resolve(JSON.stringify(mockPreset1));
      } else if (filePath.includes('preset2.json')) {
        return Promise.resolve(JSON.stringify(mockPreset2));
      }
      return Promise.resolve('{}');
    });

    // Call the function
    const presetsDir = '/mock/path/to/presets';
    const protocol = 'http';
    const hostname = 'localhost';
    const port = '5000';

    const result = await getPresets(presetsDir, protocol, hostname, port);

    // Assertions
    expect(fs.readdir).toHaveBeenCalledWith(presetsDir);
    expect(fs.readFile).toHaveBeenCalledTimes(2);
    expect(result).toHaveLength(2);

    // Check sorting (mockPreset2 should come first due to lower sort value)
    expect(result[0].name).toBe('Preset 2');
    expect(result[1].name).toBe('Preset 1');

    // Check iconPath construction
    expect(result[0].iconPath).toBe('http://localhost:5000/icons/icon2-100px.svg');
    expect(result[1].iconPath).toBe('http://localhost:5000/icons/icon1-100px.svg');

    // Check slug addition
    expect(result[0].slug).toBe('preset2');
    expect(result[1].slug).toBe('preset1');
  });

  it('should sort presets by name when sort values are the same', async () => {
    // Mock data
    const mockFiles = ['presetB.json', 'presetA.json'];
    const mockPresetB = {
      name: 'Preset B',
      sort: 1,
      icon: 'iconB'
    };
    const mockPresetA = {
      name: 'Preset A',
      sort: 1,
      icon: 'iconA'
    };

    // Setup mocks
    fs.readdir.mockResolvedValue(mockFiles);
    fs.lstat.mockResolvedValue({ isDirectory: () => false });
    fs.readFile.mockImplementation((filePath) => {
      if (filePath.includes('presetB.json')) {
        return Promise.resolve(JSON.stringify(mockPresetB));
      } else if (filePath.includes('presetA.json')) {
        return Promise.resolve(JSON.stringify(mockPresetA));
      }
      return Promise.resolve('{}');
    });

    // Call the function
    const result = await getPresets('/mock/path', 'http', 'localhost', '5000');

    // Assertions
    expect(result).toHaveLength(2);
    // Should be sorted alphabetically by name since sort values are the same
    expect(result[0].name).toBe('Preset A');
    expect(result[1].name).toBe('Preset B');
  });

  it('should handle presets without sort values', async () => {
    // Mock data
    const mockFiles = ['presetB.json', 'presetA.json', 'presetWithSort.json'];
    const mockPresetB = { name: 'Preset B', icon: 'iconB' }; // No sort
    const mockPresetA = { name: 'Preset A', icon: 'iconA' }; // No sort
    const mockPresetWithSort = { name: 'Preset With Sort', sort: 1, icon: 'iconC' };

    // Setup mocks
    fs.readdir.mockResolvedValue(mockFiles);
    fs.lstat.mockResolvedValue({ isDirectory: () => false });
    fs.readFile.mockImplementation((filePath) => {
      if (filePath.includes('presetB.json')) {
        return Promise.resolve(JSON.stringify(mockPresetB));
      } else if (filePath.includes('presetA.json')) {
        return Promise.resolve(JSON.stringify(mockPresetA));
      } else if (filePath.includes('presetWithSort.json')) {
        return Promise.resolve(JSON.stringify(mockPresetWithSort));
      }
      return Promise.resolve('{}');
    });

    // Call the function
    const result = await getPresets('/mock/path', 'http', 'localhost', '5000');

    // Assertions
    expect(result).toHaveLength(3);
    // Preset with sort should come first
    expect(result[0].name).toBe('Preset With Sort');
    // Then alphabetical order for those without sort
    expect(result[1].name).toBe('Preset A');
    expect(result[2].name).toBe('Preset B');
  });

  it('should handle empty directory', async () => {
    // Setup mocks
    fs.readdir.mockResolvedValue([]);

    // Call the function and expect it to throw
    await expect(getPresets('/mock/path')).rejects.toThrow('Failed to read presets directory');
  });

  it('should handle errors when reading directory', async () => {
    // Setup mocks
    fs.readdir.mockRejectedValue(new Error('Directory not found'));

    // Call the function and expect it to throw
    await expect(getPresets('/mock/path')).rejects.toThrow('Failed to read presets directory');
  });

  it('should filter out directories', async () => {
    // Mock data
    const mockFiles = ['preset1.json', 'subdir'];
    const mockPreset1 = { name: 'Preset 1', icon: 'icon1' };

    // Setup mocks
    fs.readdir.mockResolvedValue(mockFiles);
    fs.lstat.mockImplementation((filePath) => {
      if (filePath.includes('subdir')) {
        return Promise.resolve({ isDirectory: () => true });
      }
      return Promise.resolve({ isDirectory: () => false });
    });
    fs.readFile.mockImplementation((filePath) => {
      if (filePath.includes('preset1.json')) {
        return Promise.resolve(JSON.stringify(mockPreset1));
      }
      return Promise.resolve('{}');
    });

    // Call the function
    const result = await getPresets('/mock/path', 'http');

    // Assertions
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Preset 1');
    // Should use just the protocol as baseUrl
    expect(result[0].iconPath).toBe('httpicons/icon1-100px.svg');
  });
});
