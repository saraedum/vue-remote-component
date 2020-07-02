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

  private static async load(name: string, loader: () => Promise<object>) {
    const globals = window as any;
    if (!globals[name]) {
        globals[name] = loader();
    }
    await Promise.resolve(globals[name]);
    return globals[name];
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
    this.module = await RemoteComponent.load(this.moduleName, () => new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.async = true;
      script.addEventListener("load", () => resolve());
      script.addEventListener("error", () => {
        reject(new Error(`Error loading ${this.url}`));
      });
      script.src = this.url;
      document.head.appendChild(script);
    }));
  }
}
</script>
