module.exports = {
  // TODO: Drop support for EOL Node <= 8 in Marpit v2
  presets: [
    ['@babel/preset-env', { targets: { node: '8' }, shippedProposals: true }],
  ],
}
