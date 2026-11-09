import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { h } from "vue";
import RemoteComponent from "@/remote-component";

// jsdom does not fetch scripts, so simulate the remote UMD bundle: when the
// component injects its <script>, optionally define the library global, then
// fire the corresponding event.
function serveScript(globalName: string, library: any | null) {
  return vi.spyOn(document.head, "appendChild").mockImplementation((node: any) => {
    if (library != null)
      (window as any)[globalName] = library;
    node.dispatchEvent(new Event(library != null ? "load" : "error"));
    return node;
  });
}

describe("RemoteComponent", () => {
  afterEach(() => vi.restoreAllMocks());

  it("renders the extracted component with its props once loaded", async () => {
    const Greeting = { props: ["who"], setup: (props: any) => () => h("span", `Hello ${props.who}`) };
    const append = serveScript("greeting", { Greeting });

    const wrapper = mount(RemoteComponent, {
      props: {
        url: "https://example.com/greeting.umd.min.js",
        extract: (library: any) => library.Greeting,
        props: { who: "World" },
      },
    });
    expect(wrapper.text()).toBe("⌛");

    await flushPromises();
    expect(wrapper.text()).toBe("Hello World");
    expect(append.mock.calls[0][0]).toMatchObject({ src: "https://example.com/greeting.umd.min.js" });
  });

  it("shows an error marker when the script fails to load", async () => {
    serveScript("broken", null);

    const wrapper = mount(RemoteComponent, {
      props: { url: "https://example.com/broken.umd.js", extract: (library: any) => library },
    });

    await flushPromises();
    expect(wrapper.text()).toBe("🚫");
  });

  it("shows an error marker when no module name can be derived from the url", async () => {
    const append = serveScript("unused", {});

    const wrapper = mount(RemoteComponent, {
      props: { url: "https://example.com/plain.js", extract: (library: any) => library },
    });

    await flushPromises();
    expect(wrapper.text()).toBe("🚫");
    expect(append).not.toHaveBeenCalled();
  });
});
