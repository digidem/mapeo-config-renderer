const log = require('../log');

describe('log', () => {
  let originalConsoleLog;
  let consoleLogMock;

  beforeEach(() => {
    // Save original console.log
    originalConsoleLog = console.log;
    // Create a mock function
    consoleLogMock = jest.fn();
    // Replace console.log with mock
    console.log = consoleLogMock;
  });

  afterEach(() => {
    // Restore original console.log
    console.log = originalConsoleLog;
    // Clear environment variables
    delete process.env.DEBUG;
  });

  it('should log messages when DEBUG is true', () => {
    // Set DEBUG environment variable
    process.env.DEBUG = true;

    // Call the function
    log('test message', 123, { key: 'value' });

    // Assertions
    expect(consoleLogMock).toHaveBeenCalledWith(
      '*DEBUG - ',
      'test message',
      123,
      { key: 'value' }
    );
  });

  it('should not log messages when DEBUG is not set', () => {
    // Call the function
    log('test message');

    // Assertions
    expect(consoleLogMock).not.toHaveBeenCalled();
  });

  it('should not log messages when DEBUG is false', () => {
    // Set DEBUG environment variable to false
    process.env.DEBUG = '';

    // Call the function
    log('test message');

    // Assertions
    expect(consoleLogMock).not.toHaveBeenCalled();
  });
});
