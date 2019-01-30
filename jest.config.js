module.exports = {
  collectCoverageFrom: ['src/**/*.js'],
  coverageThreshold: { global: { lines: 95 } },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testRegex: '(/(test|__tests__)/(?!_).*|(\\.|/)(test|spec))\\.js$',
  testURL: 'http://localhost',
  moduleFileExtensions: ['js', 'json', 'node'],
}
