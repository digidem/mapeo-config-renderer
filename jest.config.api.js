// Jest configuration for API tests
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/api/lib/__tests__/**/*.test.js"],
  // Exclude React app tests
  testPathIgnorePatterns: ["/node_modules/", "/src/"],
};
