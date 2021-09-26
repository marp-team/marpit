const esModules = []

module.exports = {
  clearMocks: true,
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '.*\\.d\\.ts'],
  coverageThreshold: { global: { lines: 95 } },
  moduleDirectories: ['node_modules', __dirname],
  preset: 'ts-jest/presets/js-with-babel',
  restoreMocks: true,
  testRegex: '/test(/(?![_.])[^/]*){1,}\\.[jt]s$',
  transformIgnorePatterns: [
    `/node_modules/${esModules.length > 0 ? `(?!${esModules.join('|')})` : ''}`,
  ],
}
