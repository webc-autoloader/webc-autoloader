import { ILoader } from "./types";

const failedTags = new Set<string>();

async function findUndefinedTags(root: Document | ShadowRoot, loaders: Record<string, ILoader | string>): void {
  let element = root.querySelector(':not(:defined)');
  while (element) {
    let baseTagName = element.tagName.toLowerCase();
    let registerTagName: string;
    if (baseTagName.includes("-")) {
      registerTagName = baseTagName;
    } else {
      const tagName = element.getAttribute("is");
      if (tagName === null) {
        throw new Error("Custom element without a dash or 'is' attribute found: " + baseTagName);
      }
      if (!tagName.includes("-")) {
        throw new Error("Custom element 'is' attribute without a dash found: " + tagName);
      }
      registerTagName = tagName;
    }
    if (registerTagName === baseTagName) {
      customElements.define(registerTagName, element.constructor as CustomElementConstructor);
    } else {
      customElements.define(registerTagName, element.constructor as CustomElementConstructor, { extends: baseTagName });
    }
    element = root.querySelector(':not(:defined)');

  }

}
