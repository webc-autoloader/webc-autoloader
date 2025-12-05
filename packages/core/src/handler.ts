import { buildMap, loadImportmap } from "./importmap";
import { DEFAULT_CONFIG as config } from "./config";
import { eagerLoad, lazyLoad } from "./autoload";

export async function registerHandler(): Promise<void> {
  const importmap = loadImportmap(); // 事前に importmap を読み込んでおく
  if (importmap === null) {
    return;
  }
  const { prefixMap, loadMap } = buildMap(importmap);
  try {
    await eagerLoad(loadMap, config.loaders);
  } catch(e) {
    throw new Error("Failed to eager load components: " + e);
  }

  if (Object.keys(prefixMap).length === 0) {
    return;
  }
  document.addEventListener("DOMContentLoaded", async (): Promise<void> => {
    try {
      await lazyLoad(document, prefixMap, config.loaders);
    } catch(e) {
      throw new Error("Failed to lazy load components: " + e);
    }

    if (!config.observable) {
      return;
    }
    const mo = new MutationObserver(async (): Promise<void> => {
      try {
        await lazyLoad(document, prefixMap, config.loaders);
      } catch(e) {
        throw new Error("Failed to lazy load components: " + e);
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  });
}

