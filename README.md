# webc-autoloader
web component auto loader with importmap

# 仕様
```html
<script type="importmap">
  {
    "imports": {
      "@lit/core": "/path/to/lit-core.js",
      "@components/app/": "/path/to/components/",
      "@components/app:lit/": "/path/to/components/lit/",
      "@components/app-sub1": "/path/to/components/sumComponent1.js", // app-sub1
      "@components/app/sub2": "/path/to/components/sumComponent2.js", // app-sub2
      "@autoloader": "/path/to/autoloader"
    }
  }
</script>
<script type="module" src="/path/to/autoloader/boot.js"></script>

<script type="module">
import { setAutoLoaderConfig, importDefaultClass } from "@autoloader";
import { componentFromModule } from "@lit/core";

setAutoLoaderConfig({
  scanImportmap: true,
  loaders: {
    "webc": {
      postfix: ".js",
      loader: importDefaultClass
    },
    "lit": {
      postfix: ".js",
      loader: convertFromModule
    },
    "*": "webc"
  },
  observable: true,
});
</script>
```

```js:autoloader.js
export function importDefaultClass(path) {
  const module = await import(path);
  return module.default;
}
```