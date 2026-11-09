import * as Vue from 'vue'
import App from './App.vue'

// Remote UMD components resolve their "vue" import from this global.
(window as any).Vue = Vue

Vue.createApp(App).mount('#app')
