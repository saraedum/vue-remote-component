// rollup.config.js
import fs from 'fs';
import path from 'path';
import vue from 'rollup-plugin-vue';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import minimist from 'minimist';
import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";

// Get browserslist config and remove ie from es build targets
const esbrowserslist = fs.readFileSync('./.browserslistrc')
  .toString()
  .split('\n')
  .filter((entry) => entry && entry.substring(0, 2) !== 'ie');

const argv = minimist(process.argv.slice(2));

const projectRoot = path.resolve(__dirname, '..');

const baseConfig = {
  input: 'src/main.ts',
  plugins: {
    preVue: [
      alias({
        resolve: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
        entries: {
          '@': path.resolve(projectRoot, 'src'),
        },
      }),
    ],
    replace: {
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.ES_BUILD': JSON.stringify('false'),
    },
    typescript: {
      tsconfig: "tsconfig.json",
      useTsconfigDeclarationDir: true
    },
    vue: {
      css: false,
      template: {
        isProduction: true,
      },
    },
    babel: {
      exclude: 'node_modules/**',
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      plugins: [],
    },
  },
};

// ESM/UMD/IIFE shared settings: externals
// Refer to https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency
const vueExternal = id => id === "vue";
const babelExternal = id => id.includes('@babel/runtime')

// UMD/IIFE shared settings: output.globals
// Refer to https://rollupjs.org/guide/en#output-globals for details
const globals = {
  vue: 'Vue',
};

// Customize configs for individual targets
const buildFormats = [];
if (!argv.format || argv.format === 'es') {
  const esConfig = {
    ...baseConfig,
    external: id => vueExternal(id) || babelExternal(id),
    output: {
      file: 'dist/vue-remote-component.esm.js',
      format: 'esm',
      exports: 'named',
      sourcemap: true,
    },
    plugins: [
      replace({
        ...baseConfig.plugins.replace,
        'process.env.ES_BUILD': JSON.stringify('true'),
      }),
      resolve(),
      typescript(baseConfig.plugins.typescript),
      ...baseConfig.plugins.preVue,
      vue(baseConfig.plugins.vue),
      babel({
        ...baseConfig.plugins.babel,
        presets: [
          [
            '@babel/preset-env',
            {
              targets: esbrowserslist,
            },
          ],
        ],
        babelHelpers: 'runtime',
        plugins: [...baseConfig.plugins.babel.plugins, ['@babel/plugin-transform-runtime', { useESModules: true }]],
      }),
      commonjs(),
    ],
  };
  buildFormats.push(esConfig);
}

if (!argv.format || argv.format === 'cjs') {
  const umdConfig = {
    ...baseConfig,
    external: id => vueExternal(id) || babelExternal(id),
    output: {
      compact: true,
      file: 'dist/vue-remote-component.ssr.js',
      format: 'cjs',
      name: 'RemoteComponent',
      exports: 'named',
      sourcemap: true,
      globals,
    },
    plugins: [
      replace(baseConfig.plugins.replace),
      resolve(),
      typescript(baseConfig.plugins.typescript),
      ...baseConfig.plugins.preVue,
      vue({
        ...baseConfig.plugins.vue,
        template: {
          ...baseConfig.plugins.vue.template,
          optimizeSSR: true,
        },
      }),
      babel({
        ...baseConfig.plugins.babel,
        babelHelpers: 'runtime',
        plugins: [['@babel/plugin-transform-runtime', { useESModules: false }]],
      }),
      commonjs(),
    ],
  };
  buildFormats.push(umdConfig);
}

if (!argv.format || argv.format === 'iife') {
  const unpkgConfig = {
    ...baseConfig,
    external: id => vueExternal(id),
    output: {
      compact: true,
      file: 'dist/vue-remote-component.min.js',
      format: 'iife',
      name: 'RemoteComponent',
      exports: 'named',
      sourcemap: true,
      globals,
    },
    plugins: [
      replace(baseConfig.plugins.replace),
      resolve(),
      typescript(baseConfig.plugins.typescript),
      ...baseConfig.plugins.preVue,
      vue(baseConfig.plugins.vue),
      babel({
        ...baseConfig.plugins.babel,
        babelHelpers: 'bundled',
      }),
      commonjs(),
      terser({
        output: {
          ecma: 5,
        },
      }),
    ],
  };
  buildFormats.push(unpkgConfig);
}

// Export config
export default buildFormats;
