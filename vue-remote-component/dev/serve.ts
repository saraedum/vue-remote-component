import * as Vue from 'vue';
import RemoteComponent from '@/remote-component';

// Remote UMD components resolve their "vue" import from this global.
(window as any).Vue = Vue;

Vue.createApp({
  render: () => Vue.h(RemoteComponent, {
    url: "https://unpkg.com/@clalarco/vue3-plotly@0.1.5/dist/plotly-vue-ts.umd.js",
    name: "VuePlotly",
    integrity: "sha384-sHaSiIoiSEUXfQc8yD3yMmwaxBjjHHUtwf7kZxQwdaV4O9ocGYgVjVtpDTd3B3Tf",
    extract: (library: any) => library.VuePlotly,
    data: [{ x: [0, 1, 2, 3], y: [1, 3, 3, 7], type: 'scatter' }],
    layout: {},
  }),
}).mount('#app');
