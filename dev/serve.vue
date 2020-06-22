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
    <remote-component />
  </div>
</template>
