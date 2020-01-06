module.exports = {
  // TODO: Drop support for EOL Node <= 8 in Marpit v2
  presets: [['@babel/preset-env', { targets: { node: '8' } }]],
  plugins: [
    ['@babel/plugin-proposal-object-rest-spread', { useBuiltIns: true }],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-private-methods',
  ],
}
