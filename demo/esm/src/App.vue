<template>
  <div id="app">
    <remote-component :extract="extract" :url="url" name="VuePlotly" :data="plots" :layout="{}" :integrity="integrity" />
  </div>
</template>

<script setup lang="ts">
import RemoteComponent from "vue-remote-component";

function extract(library: any) {
  return library.VuePlotly;
}

const plots = [{ x: [0, 1, 2, 3], y: [1, 3, 3, 7], type: 'scatter' }];

const url = "https://unpkg.com/@clalarco/vue3-plotly@0.1.5/dist/plotly-vue-ts.umd.js";
const integrity = "sha384-sHaSiIoiSEUXfQc8yD3yMmwaxBjjHHUtwf7kZxQwdaV4O9ocGYgVjVtpDTd3B3Tf";
</script>
