<script lang="ts">
import Vue from 'vue';
import RemoteComponent from '@/remote-component.vue';

export default Vue.extend({
  name: 'ServeDev',
  components: {
    RemoteComponent
  }
});
</script>

<template>
  <div id="app">
    <remote-component
      url="https://unpkg.com/vue-plotly@1.1.0/dist/vue-plotly.umd.min.js"
      integrity="sha384-3YjbENL4Izchmbn7RCdWL5tHYGPP7fy2B/vzCgBd3corbolRfPgjimXK4JEwGpYg"
      :extract="library => library.Plotly"
      :data="[{ x: [0, 1, 2, 3], y: [1, 3, 3, 7], type: 'scatter' }]" />
  </div>
</template>
