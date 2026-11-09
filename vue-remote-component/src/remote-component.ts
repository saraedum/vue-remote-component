import { Component, PropType, computed, defineComponent, h, ref, shallowRef, watch } from "vue";

enum State {
  LOADING,
  READY,
  ERROR,
};

function showMessage(message: string): Component {
  return {
    render() {
      return h("div", message);
    }
  };
}

async function loadRequireJS(requirejs: any, name: string, url: string, integrity: string | null) {
  if (!url.endsWith('.js'))
    throw Error("url must end with .js to be loaded through RequireJS");

  requirejs.config({
    paths: {
      [name]: url.substring(0, url.length - 3),
    },
    onNodeCreated: function(node: HTMLScriptElement, _config: any, moduleName: string, _url: string) {
      if (moduleName === name) {
        if (integrity)
          node.integrity = integrity;
        node.crossOrigin = "anonymous";
      }
    },
  });
  return await new Promise((resolve, reject) => {
    requirejs([name], function(module: any) {
      resolve(module);
    }, function(err: any) {
      reject(err);
    });
  });
}

async function loadBrowser(name: string, url: string, integrity: string | null) {
  const script = document.createElement("script");
  const load = new Promise<void>((resolve, reject) => {
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () => reject());
  });
  script.async = true;
  script.src = url;
  if (integrity)
    script.integrity = integrity;
  script.crossOrigin = "anonymous";
  document.head.appendChild(script);
  await load;

  const globals = window as any;
  return globals[name];
}

async function load(name: string, url: string, integrity: string | null) {
  const globals = window as any;
  if (typeof globals.requirejs == 'function') {
    return await loadRequireJS(globals.requirejs, name, url, integrity);
  } else {
    return await loadBrowser(name, url, integrity);
  }
}

export default defineComponent({
  name: "RemoteComponent",
  // $attrs are forwarded to the remote component explicitly in render().
  inheritAttrs: false,
  props: {
    url: { required: true, type: String },
    extract: { required: true, type: Function as PropType<(library: any) => Component> },
    props: { required: false, type: Object, default: () => ({}) },
    name: { required: false, type: String as PropType<string | null>, default: null },
    integrity: { required: false, type: String as PropType<string | null>, default: null },
    tag: { required: false, type: Function as PropType<(message: string) => Component>, default: showMessage },
  },
  setup(props, { attrs }) {
    const state = ref(State.LOADING);
    // Not deeply reactive: the library holds components, which Vue must not wrap in proxies.
    const module = shallowRef<any>(null);

    const moduleName = computed(() => {
      if (props.name != null) {
        return props.name;
      }

      const library = props.url
        ?.split("/")
        ?.reverse()[0]
        ?.match(/^(.*?)\.umd/);

      if (library == null) {
        throw new Error(`${props.url} could not be parsed as a path pointing to an UMD module. Please provide an explicit module name.`);
      }

      return library[1];
    });

    const component = computed(() => {
      if (state.value === State.LOADING) {
        return props.tag("⌛");
      }
      if (state.value === State.ERROR) {
        return props.tag("🚫");
      }
      return props.extract(module.value);
    });

    watch(() => props.url, async () => {
      state.value = State.LOADING;
      try {
        module.value = await load(moduleName.value, props.url, props.integrity);
        state.value = State.READY;
      } catch {
        state.value = State.ERROR;
      }
    }, { immediate: true });

    return () => h(component.value, { ...attrs, ...props.props });
  },
});
