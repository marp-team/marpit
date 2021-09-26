import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import builtinModules from 'builtin-modules'
import esbuild from 'rollup-plugin-esbuild'
import pkg from './package.json'

const watch = !!process.env.ROLLUP_WATCH

const generateExternal = (deps) => (id) =>
  deps.some((dep) => dep === id || id.startsWith(`${dep}/`))

const external = generateExternal([
  ...builtinModules,
  ...Object.keys(pkg.dependencies),
])

const plugins = [
  json({ preferConst: true }),
  nodeResolve(),
  commonjs(),
  esbuild({
    sourceMap: watch,
    minify: !watch,
    target: 'es2019',
    tsconfig: require.resolve('./tsconfig.json'),
    loaders: { '.json': 'json' },
  }),
]

export default [
  {
    external,
    plugins,
    input: ['src/index.ts'],
    output: { dir: 'lib', exports: 'named', format: 'cjs', compact: true },
  },
  {
    external,
    plugins,
    input: ['src/index.ts'],
    output: {
      chunkFileNames: '[name]-[hash].mjs',
      dir: 'module',
      entryFileNames: '[name].mjs',
      exports: 'named',
      format: 'es',
      compact: true,
    },
    preserveModules: true,
  },
]
