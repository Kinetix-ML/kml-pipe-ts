/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  setupFiles: ["jsdom-worker"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
