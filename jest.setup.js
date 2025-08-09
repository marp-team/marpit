global.context = describe

// https://github.com/nodejs/undici/issues/4374
if (process.versions.node.startsWith('18.')) {
  const { File, Blob } = require('buffer')

  global.File = File
  global.Blob = Blob
}
