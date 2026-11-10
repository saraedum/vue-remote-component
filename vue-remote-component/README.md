# Vue Remote Component

A `<remote-component>` loads a Vue.js component at runtime from an URL, e.g.,
from https://unpkg.com/.

## Maintenance Status

This project is in maintenance-only mode. No new features are planned, but it
is kept working with current versions of its dependencies. That maintenance is
mostly vibe coded, i.e., the changes are largely written by an AI coding
assistant.

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
https://cdn.jsdelivr.net/npm/plotly.js-basic-dist-min@2.35.3/plotly-basic.min.js.

## Props

* `url` (required): the URL of the UMD bundle. It is loaded with a `<script>`
  tag or, when the page uses [RequireJS](https://requirejs.org/), with
  RequireJS, in which case the URL must end in `.js`.
* `extract` (required): a function that receives the loaded library and returns
  the component to render.
* `name`: the global variable (or RequireJS module) the bundle defines.
  Defaults to the file name up to `.umd`, e.g., `vue-plotly` for
  `.../vue-plotly.umd.min.js`.
* `integrity`: a [subresource
  integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)
  hash the bundle must match.
* `props`: an object of props to pass to the component. Any other attributes
  and event listeners on the `<remote-component>` are passed on as well.
* `tag`: a function that turns a message into a component; it renders ⌛ while
  loading and 🚫 if loading fails.

## Building this Package

This repository is a yarn workspace and requires Node.js 22.12 or newer. From
its root:

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

Finally, a Vite based application using the ESM build, which is also deployed
to GitHub Pages on every push to `master`:

```
yarn
yarn demo
```

## Releasing

Releases are published to npm by GitHub Actions when a version tag is pushed:

```
yarn workspace vue-remote-component version --new-version 2.0.0 --no-git-tag-version
git commit -am "Release 2.0.0"
git tag 2.0.0
git push origin master 2.0.0
```

The release workflow checks that the tag matches the version in
`vue-remote-component/package.json`, runs the tests, publishes to npm, and
creates a GitHub Release with notes generated from the merged pull requests.
Edit those notes to point out breaking changes. Tags with a pre-release suffix
such as `2.0.0-rc.1` are published under the npm tag `next` and marked as
pre-releases.

One-time setup on the hosting side:

* On npmjs.com, add a trusted publisher to the package settings: GitHub
  Actions, owner `saraedum`, repository `vue-remote-component`, workflow
  `publish.yml`. No npm token is needed.
* On GitHub, set Settings → Pages → Source to "GitHub Actions" so the demo can
  be deployed.

## Use in Jupyter Notebooks & JupyterLab

This package was originally meant to be used with
[ipyvue](https://github.com/mariobuikhuizen/ipyvue) to write Jupyter widgets
using Vue.js components from NPM without having to distribute any JavaScript
extension. See
[ipyvue-remote-component](https://github.com/saraedum/ipyvue-remote-component)
for details. Note that ipyvue-remote-component currently uses version 1.x of
this package, i.e., Vue 2 and ipyvue 1.x.

## Limitations

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
