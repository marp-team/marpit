// Test compiled artifacts without requiring Babel on older Node.js.
module.exports = {
  ...require('./jest.config'),
  collectCoverageFrom: ['lib/**/*.js'],
  coverageProvider: 'v8',
  moduleNameMapper: {
    '^(?:\\.\\./)+src/(.*)$': '<rootDir>/lib/$1',
  },
  testRegex: '/tmp/compiled-test/(?!_).*\\.js$',
  transform: {},
}
