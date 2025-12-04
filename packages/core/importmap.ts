import { IImportMap } from "./types";

export function loadImportmap(): IImportMap | null {
  const importmap: IImportMap = { imports: {} };
  document.querySelectorAll('script[type="importmap"]').forEach((script) => {
    try {
      const json = JSON.parse(script.innerHTML);
      if (json.imports) {
        importmap.imports = Object.assign(importmap.imports, json.imports);
      }
    } catch (e) {
      throw new Error("Failed to parse importmap JSON: " + e);
    }
  });
  return Object.keys(importmap.imports).length > 0
    ? importmap
    : null;
}

export function buildPrefixMap(importmap: IImportMap): Record<string, string> {
  const prefixMap: Record<string, string> = {};
  for (const [key, value] of Object.entries(importmap.imports)) {
    if (key.endsWith("/")) {
      prefixMap[key] = value;
    }
  }
  return {};
}