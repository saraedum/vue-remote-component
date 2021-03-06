# Vue Remote Component

A `<remote-component>` loads a Vue.js component at runtime from an URL, e.g.,
from https://unpkg.com/.

## Example Usage

Import and register `RemoteComponent from "vue-remote-component"`, then the following template shows a [Plotly](https://plotly.com) graph:

```
<remote-component
  url="https://unpkg.com/vue-plotly@^1/dist/vue-plotly.umd.min.js"
  :data="[{ x: [0, 1, 2, 3], y: [1, 3, 3, 7], type: 'scatter' }]"
  :extract="library => library.Plotly" />
```

## Building this Package

```
cd vue-remote-component
yarn
yarn build
```

## Demo Applications

There are several (identical) demo applications. One in the source tree:

```
cd vue-remote-component
yarn install --check-files
yarn serve
```

The other demos are mostly for the author to check that the builds actually
work. One demo uses the iife build of the package as an example how this
package itself could be used from unpkg:

```
cd vue-remote-component
yarn
yarn build
cd ../demo/iife
firefox index.html
```

Finally, a vue-cli based application using the ESM build:

```
cd vue-remote-component
yarn
yarn build
cd ../demo/esm
yarn serve
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
