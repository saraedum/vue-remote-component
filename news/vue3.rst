**Added:**

* Added unit tests, run with `yarn test:unit`.

**Changed:**

* Changed `<remote-component>` to require Vue 3. Remote components are UMD
  bundles that resolve `vue` from the global `Vue`, so applications that load
  Vue as an ES module must set `window.Vue`.
* Changed the build from Vue CLI, rollup and Babel to Vite. Type declarations
  are now generated into `dist/`.
* Changed the demos to a Vue 3 Plotly component.

**Removed:**

* Removed support for Vue 2.
* Removed the `.vue` source files from the published package.

**Fixed:**

* Fixed the `props` default, which was `undefined` instead of an empty object.
