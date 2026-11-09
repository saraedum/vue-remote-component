# Vue Remote Component

A `<remote-component>` loads a Vue.js component at runtime from an URL, e.g.,
from https://unpkg.com/.

## Example Usage

Import and register `RemoteComponent from "vue-remote-component"`, then the following template shows a [Plotly](https://plotly.com) graph:

```
<remote-component
  url="https://unpkg.com/@clalarco/vue3-plotly@0.1.5/dist/plotly-vue-ts.umd.js"
  name="VuePlotly"
  :data="[{ x: [0, 1, 2, 3], y: [1, 3, 3, 7], type: 'scatter' }]"
  :layout="{}"
  :extract="library => library.VuePlotly" />
```

This package requires Vue 3. Remote components are loaded as UMD bundles, which
resolve their `vue` import from the global `Vue`. When Vue is not loaded as a
`<script>`, expose it before rendering a `<remote-component>`:

```
import * as Vue from "vue";
window.Vue = Vue;
```

Other dependencies of the remote component must be provided the same way; the
Plotly component above expects a global `Plotly`, e.g., from
https://cdn.jsdelivr.net/npm/plotly.js-basic-dist@2.35.3/plotly-basic.min.js.

## Building this Package

This repository is a yarn workspace. From its root:

```
yarn
yarn build
```

To typecheck and run the tests:

```
yarn test
```

## Demo Applications

There are several (identical) demo applications. One in the source tree,
which rebuilds as you change the component:

```
yarn
yarn dev
```

The other demos are mostly for the author to check that the builds actually
work. One demo uses the iife build of the package as an example how this
package itself could be used from unpkg:

```
yarn
yarn build
firefox demo/iife/index.html
```

Finally, a Vite based application using the ESM build:

```
yarn
yarn demo
```

## Use in Jupyter Notebooks & JupyterLab

This package was originally meant to be used with
[ipyvue](https://github.com/mariobuikhuizen/ipyvue) to write Jupyter widgets
using Vue.js components from NPM without having to distribute any JavaScript
extension. See
[ipyvue-remote-component](https://github.com/saraedum/ipyvue-remote-component)
for details.

## Limitations

* *Events* on the remote component cannot be bound yet. This should be trivial to
  add so please open an issue if that's something that you need. PRs are also
  welcome.

* *Slots* on the remote component cannot be used yet. This should not be hard to
  add so please open an issue if that's something that you need. PRs are also
  welcome.

## Similar Projects

The author is aware of several projects that try to achieve something very similar:

* [vue-remote-import](https://www.npmjs.com/package/vue-remote-import)
* [vue-external-component](https://www.npmjs.com/package/vue-external-component)

These projects seem to be quite similar to the vue-remote-component. However,
they don't seem to work in a [require.js](https://requirejs.org/) application
such as a Jupyter Notebook.
