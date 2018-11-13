const { build } = require('./common')

// eslint-disable-next-line import/newline-after-import
build().catch(e => {
  console.error(e)
  process.exit(1)
})
