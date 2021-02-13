<template>
  <component :is="component" v-if="component" v-bind="props" :ref="component" v-on="$listeners" />
</template>
<script lang="ts">
import { VueConstructor } from "vue";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class RemoteComponent extends Vue {
  @Prop({required: true, type: String}) public url!: string;
  @Prop({required: true, type: Function}) public extract!: (library: any) => VueConstructor;
  @Prop({required: false, type: Object, default: {}}) public props!: object;
  @Prop({required: false, type: String, default: null}) public name!: string;

  protected module : object | null = null;

  private static async loadRequireJS(requirejs: any, name: string, url: string) {
    if (!url.endsWith('.js'))
      throw Error("url must end with .js to be loaded through RequireJS");

    requirejs.config({
      paths: {
        [name]: url.substr(0, url.length - 3),
      }
    });
    return await new Promise((resolve) => {
      requirejs([name], function(module: any) {
        resolve(module);
      });
    });
  }

  private static async loadBrowser(name: string, url: string) {
    const script = document.createElement("script");
    const load = new Promise((resolve) => {
      script.addEventListener("load", () => resolve());
    });
    script.async = true;
    script.src = url;
    document.head.appendChild(script);
    await load;

    const globals = window as any;
    return globals[name];
  }

  private static async load(name: string, url: string) {
    const globals = window as any;
    if (typeof globals.requirejs == 'function') {
      return await RemoteComponent.loadRequireJS(globals.requirejs, name, url);
    } else {
      return await RemoteComponent.loadBrowser(name, url);
    }
  }

  private get moduleName() {
    if (this.name != null) {
      return this.name;
    }

    const library = this.url
      ?.split("/")
      ?.reverse()[0]
      ?.match(/^(.*?)\.umd/);

    if (library == null) {
      throw new Error(`${this.url} could not be parsed as a path pointing to an UMD module. Please provide an explicit module name.`);
    }

    return library[1];
  }

  protected get component() : VueConstructor | null {
    if (this.module == null) {
      return null;
    }
    return this.extract(this.module);
  }

  @Watch("url", { immediate: true })
  protected async onUrlChanged() {
    this.module = await RemoteComponent.load(this.moduleName, this.url);
  }
}
</script>
