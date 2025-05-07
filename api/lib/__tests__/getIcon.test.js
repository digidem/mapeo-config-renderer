const fs = require('fs').promises;
const path = require('path');
const getIcon = require('../getIcon');

// Mock fs.promises
jest.mock('fs', () => ({
  promises: {
    stat: jest.fn(),
    readFile: jest.fn()
  }
}));

describe('getIcon', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return SVG data when icon exists and is an SVG file', async () => {
    // Mock data
    const mockSvgData = '<svg>Test SVG</svg>';
    const mockIconPath = '/path/to/icon.svg';
    
    // Setup mocks
    fs.stat.mockResolvedValue({ isFile: () => true });
    fs.readFile.mockResolvedValue(mockSvgData);

    // Call the function
    const result = await getIcon(mockIconPath);

    // Assertions
    expect(fs.stat).toHaveBeenCalledWith(mockIconPath);
    expect(fs.readFile).toHaveBeenCalledWith(mockIconPath, 'utf-8');
    expect(result).toBe(mockSvgData);
  });

  it('should return error object when path is not an SVG file', async () => {
    // Mock data
    const mockIconPath = '/path/to/icon.png';
    
    // Setup mocks
    fs.stat.mockResolvedValue({ isFile: () => true });

    // Call the function
    const result = await getIcon(mockIconPath);

    // Assertions
    expect(fs.stat).toHaveBeenCalledWith(mockIconPath);
    expect(fs.readFile).not.toHaveBeenCalled();
    expect(result).toEqual({ error: 'Icon not found.' });
  });

  it('should return error object when path is not a file', async () => {
    // Mock data
    const mockIconPath = '/path/to/directory';
    
    // Setup mocks
    fs.stat.mockResolvedValue({ isFile: () => false });

    // Call the function
    const result = await getIcon(mockIconPath);

    // Assertions
    expect(fs.stat).toHaveBeenCalledWith(mockIconPath);
    expect(fs.readFile).not.toHaveBeenCalled();
    expect(result).toEqual({ error: 'Icon not found.' });
  });

  it('should return error object when file does not exist', async () => {
    // Mock data
    const mockIconPath = '/path/to/nonexistent.svg';
    
    // Setup mocks
    fs.stat.mockRejectedValue(new Error('File not found'));

    // Call the function
    const result = await getIcon(mockIconPath);

    // Assertions
    expect(fs.stat).toHaveBeenCalledWith(mockIconPath);
    expect(fs.readFile).not.toHaveBeenCalled();
    expect(result).toEqual({ error: 'Icon not found.' });
  });
});
