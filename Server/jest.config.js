module.exports = {
  // Use Node environment for testing
  testEnvironment: "node",

  // Specify where Jest should look for test files
  roots: ["<rootDir>/test"],

  // File extensions Jest will process
  moduleFileExtensions: ["js", "json"],

  // Glob patterns Jest uses to detect test files
  testMatch: ["**/*.test.js"],

  // Display individual test results with the test suite hierarchy
  verbose: true,
};
