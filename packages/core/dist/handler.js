import { buildMap, loadImportmap } from "./importmap.js";
import { DEFAULT_CONFIG as config } from "./config.js";
import { eagerLoad, lazyLoad } from "./autoload.js";
export async function registerHandler() {
    const importmap = loadImportmap(); // 事前に importmap を読み込んでおく
    if (importmap === null) {
        return;
    }
    const { prefixMap, loadMap } = buildMap(importmap);
    document.addEventListener("DOMContentLoaded", async () => {
        if (Object.keys(prefixMap).length === 0) {
            return;
        }
        try {
            await lazyLoad(document, prefixMap, config.loaders);
        }
        catch (e) {
            throw new Error("Failed to lazy load components: " + e);
        }
        if (!config.observable) {
            return;
        }
        const mo = new MutationObserver(async () => {
            try {
                await lazyLoad(document, prefixMap, config.loaders);
            }
            catch (e) {
                throw new Error("Failed to lazy load components: " + e);
            }
        });
        mo.observe(document.documentElement, { childList: true, subtree: true });
    });
    try {
        await eagerLoad(loadMap, config.loaders);
    }
    catch (e) {
        throw new Error("Failed to eager load components: " + e);
    }
}
