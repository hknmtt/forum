/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // preset: 'ts-jest',
  // testEnvironment: 'node',
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
  }, // https://stackoverflow.com/a/72840825
};
