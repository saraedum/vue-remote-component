<template>
  <component :is="component" v-bind="{...$attrs, ...props}" :ref="component" v-on="$listeners" />
</template>
<script lang="ts">
import { VueConstructor } from "vue";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

enum State {
  LOADING,
  READY,
  ERROR,
};

@Component
export default class RemoteComponent extends Vue {
  @Prop({required: true, type: String}) public url!: string;
  @Prop({required: true, type: Function}) public extract!: (library: any) => VueConstructor;
  @Prop({required: false, type: Object, default: () => {}}) public props!: object;
  @Prop({required: false, type: String, default: null}) public name!: string;
  @Prop({required: false, type: Function, default: RemoteComponent.showMessage}) public tag!: (mesage: string) => any;

  protected state : State = State.LOADING;
  protected module : object | null = null;

  private static showMessage(message: string) {
    return {
      render(h: Vue.CreateElement) {
        return h("div", message);
      }
    };
  }

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
    const load = new Promise<void>((resolve, reject) => {
      script.addEventListener("load", () => resolve());
      script.addEventListener("error", () => reject());
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

  protected get component() {
    if (this.state === State.LOADING) {
      return this.tag("⌛");
    }
    if (this.state === State.ERROR) {
      return this.tag("🚫");
    }
    return this.extract(this.module);
  }

  @Watch("url", { immediate: true })
  protected async onUrlChanged() {
    this.state = State.LOADING;
    try {
      this.module = await RemoteComponent.load(this.moduleName, this.url);
      this.state = State.READY;
    } catch {
      this.state = State.ERROR;
    }
  }
}
</script>
