module.exports = {
  presets: [['@babel/preset-env', { targets: { node: '6.14' } }]],
  plugins: [
    ['@babel/plugin-proposal-object-rest-spread', { useBuiltIns: true }],
  ],
}
