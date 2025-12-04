import { IImportMap, ILoadMap, IPrefixMap } from "./types";

const COMPONENT_KEYWORD = "@components/";

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

function prefixFromKey(key: string): string {
  // @components/prefix/ -> prefx
  const prefixMaybeWithSlash = key.slice(COMPONENT_KEYWORD.length, key.length - COMPONENT_KEYWORD.length - 1);
  const prefixMaybeUppercase = prefixMaybeWithSlash.replaceAll(/\/$/, "-");
  const prefix = prefixMaybeUppercase.toLowerCase();
  return prefix;
}

function tagNameFromKey(key: string): string {
  // @components/tagName -> tagname
  const prefixMaybeWithSlash = key.slice(COMPONENT_KEYWORD.length, key.length - COMPONENT_KEYWORD.length);
  const prefixMaybeUppercase = prefixMaybeWithSlash.replaceAll(/\/$/, "-");
  const prefix = prefixMaybeUppercase.toLowerCase();
  return prefix;
}


export function buildMap(importmap: IImportMap): {
  prefixMap: IPrefixMap, loadMap: ILoadMap
} {
  const prefixMap: IPrefixMap = {};
  const loadMap: ILoadMap = {};
  for (const [key, value] of Object.entries(importmap.imports)) {
    if (key.startsWith(COMPONENT_KEYWORD)) {
      if (key.endsWith("/")) {
        // prefix rule
        prefixMap[prefixFromKey(key)] = key;
      } else {
        // exact load
        loadMap[tagNameFromKey(key)] = key;
      }

    }
  }
  return { prefixMap, loadMap };
}