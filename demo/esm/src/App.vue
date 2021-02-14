<template>
  <div id="app">
    <remote-component :extract="extract" :url="url" :data="plots" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import RemoteComponent from "vue-remote-component";

@Component({
  components: {
    RemoteComponent
  },
})
export default class App extends Vue {
  extract(library: any) {
    return library.Plotly;
  }

  get plots() {
    return [{ x: [0, 1, 2, 3], y: [1, 3, 3, 7], type: 'scatter' }]
  }

  url = "https://unpkg.com/vue-plotly@^1/dist/vue-plotly.umd.min.js";
}
</script>
