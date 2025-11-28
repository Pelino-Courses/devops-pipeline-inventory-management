module.exports = {
  testEnvironment: 'node',
  testMatch: [
    "**/tests/**/*.js",
    "!**/tests/setup.js"
  ],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  setupFiles: ["./tests/setup.js"]
};
