import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
// import del from 'rollup-plugin-delete';
import babel from '@rollup/plugin-babel';
import typescript from 'rollup-plugin-typescript2'
import {createRequire} from 'node:module'
import json from '@rollup/plugin-json'
import alias from '@rollup/plugin-alias';
import { terser } from 'rollup-plugin-terser';
import * as path from 'node:path'
import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url);
const packageJson = require('./package.json');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const extensions = ['.js', '.jsx', '.ts', '.tsx']
const plugins = [
  alias({
    entries:[
      { find: '@', replacement: path.resolve(__dirname, './src') },
    ]
  }),
  peerDepsExternal(),
  json(),
  resolve({
    extensions
  }),
  commonjs(),
  typescript({
    check:false,
    tsconfig:'./rollup.tsconfig.json',
  }),
  babel({
    exclude: 'node_modules/**',
    babelHelpers: 'bundled',
    extensions
  }),
  postcss({
    config:'./postcss.config.cjs',
    // modules: true,
    extract: 'styles.css',
    sourceMap: true,
    plugins: [
      require('postcss-preset-env')({
        features: {
        },
      }),

    ],
  }),
  terser()
]
const external = ['react','react-dom','next','react-icons','antd','@react-pdf/renderer','react-share']
const config = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.module,
        format: 'esm',
        inlineDynamicImports:true,
        sourcemap: true,
      },
    ],
    plugins,
    external,
  },
  {
    input: 'src/csr.ts',
    output: [
      {
        file: packageJson.csr,
        format: 'esm',
        inlineDynamicImports:true,
        sourcemap: true,
      },
    ],
    plugins,
    external,
  }
]
export default config;