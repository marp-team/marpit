module.exports = {
  presets: [['@babel/preset-env', { targets: { node: '6.14' } }]],
  plugins: [
    ['@babel/plugin-proposal-object-rest-spread', { useBuiltIns: true }],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-private-methods',
  ],
}
