module.exports = {
  // TODO: Drop support for EOL Node in Marpit v3
  presets: [
    ['@babel/preset-env', { targets: { node: '10' }, shippedProposals: true }],
  ],
}
