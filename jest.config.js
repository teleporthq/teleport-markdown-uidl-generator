module.exports = {
  "transform": {
    "^.+\\.ts?$": "ts-jest"
  },
  'globals': {
    'ts-jest': {
      'diagnostics': {
        'warnOnly': true
      }
    }
  },
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "node"
  ],
  "testPathIgnorePatterns": ['mocks.ts'],
  "collectCoverage": false,
  "testEnvironment": "node"
}