// vite.config.mjs
import { svelte } from "file:///Users/mmckeaveney/Dev/budibase/budibase/node_modules/@sveltejs/vite-plugin-svelte/dist/index.js";
import { defineConfig } from "file:///Users/mmckeaveney/Dev/budibase/budibase/node_modules/vite/dist/node/index.js";
import path from "path";
import cssInjectedByJsPlugin from "file:///Users/mmckeaveney/Dev/budibase/budibase/node_modules/vite-plugin-css-injected-by-js/dist/esm/index.js";
var __vite_injected_original_dirname = "/Users/mmckeaveney/Dev/budibase/budibase/packages/client";
var ignoredWarnings = [
  "unused-export-let",
  "css-unused-selector",
  "module-script-reactive-declaration",
  "a11y-no-onchange",
  "a11y-click-events-have-key-events"
];
var vite_config_default = defineConfig(({ mode }) => {
  const isProduction = mode === "production";
  return {
    server: {
      open: false
    },
    build: {
      lib: {
        entry: "src/index.ts",
        formats: ["iife"],
        outDir: "dist",
        name: "budibase_client",
        fileName: () => "budibase-client.js"
      },
      minify: isProduction
    },
    plugins: [
      svelte({
        emitCss: true,
        onwarn: (warning, handler) => {
          if (!ignoredWarnings.includes(warning.code)) {
            handler(warning);
          }
        }
      }),
      cssInjectedByJsPlugin()
    ],
    resolve: {
      dedupe: ["svelte", "svelte/internal"],
      alias: [
        {
          find: "manifest.json",
          replacement: path.resolve("./manifest.json")
        },
        {
          find: "@budibase/types",
          replacement: path.resolve("../types/src")
        },
        {
          find: "@budibase/shared-core",
          replacement: path.resolve("../shared-core/src")
        },
        {
          find: "@budibase/bbui",
          replacement: path.resolve("../bbui/src")
        },
        {
          find: "@",
          replacement: path.resolve(__vite_injected_original_dirname, "src")
        }
      ]
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL21tY2tlYXZlbmV5L0Rldi9idWRpYmFzZS9idWRpYmFzZS9wYWNrYWdlcy9jbGllbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9tbWNrZWF2ZW5leS9EZXYvYnVkaWJhc2UvYnVkaWJhc2UvcGFja2FnZXMvY2xpZW50L3ZpdGUuY29uZmlnLm1qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbW1ja2VhdmVuZXkvRGV2L2J1ZGliYXNlL2J1ZGliYXNlL3BhY2thZ2VzL2NsaWVudC92aXRlLmNvbmZpZy5tanNcIjtpbXBvcnQgeyBzdmVsdGUgfSBmcm9tIFwiQHN2ZWx0ZWpzL3ZpdGUtcGx1Z2luLXN2ZWx0ZVwiXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiXG5pbXBvcnQgY3NzSW5qZWN0ZWRCeUpzUGx1Z2luIGZyb20gXCJ2aXRlLXBsdWdpbi1jc3MtaW5qZWN0ZWQtYnktanNcIlxuXG5jb25zdCBpZ25vcmVkV2FybmluZ3MgPSBbXG4gIFwidW51c2VkLWV4cG9ydC1sZXRcIixcbiAgXCJjc3MtdW51c2VkLXNlbGVjdG9yXCIsXG4gIFwibW9kdWxlLXNjcmlwdC1yZWFjdGl2ZS1kZWNsYXJhdGlvblwiLFxuICBcImExMXktbm8tb25jaGFuZ2VcIixcbiAgXCJhMTF5LWNsaWNrLWV2ZW50cy1oYXZlLWtleS1ldmVudHNcIixcbl1cblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xuICBjb25zdCBpc1Byb2R1Y3Rpb24gPSBtb2RlID09PSBcInByb2R1Y3Rpb25cIlxuXG4gIHJldHVybiB7XG4gICAgc2VydmVyOiB7XG4gICAgICBvcGVuOiBmYWxzZSxcbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICBsaWI6IHtcbiAgICAgICAgZW50cnk6IFwic3JjL2luZGV4LnRzXCIsXG4gICAgICAgIGZvcm1hdHM6IFtcImlpZmVcIl0sXG4gICAgICAgIG91dERpcjogXCJkaXN0XCIsXG4gICAgICAgIG5hbWU6IFwiYnVkaWJhc2VfY2xpZW50XCIsXG4gICAgICAgIGZpbGVOYW1lOiAoKSA9PiBcImJ1ZGliYXNlLWNsaWVudC5qc1wiLFxuICAgICAgfSxcbiAgICAgIG1pbmlmeTogaXNQcm9kdWN0aW9uLFxuICAgIH0sXG4gICAgcGx1Z2luczogW1xuICAgICAgc3ZlbHRlKHtcbiAgICAgICAgZW1pdENzczogdHJ1ZSxcbiAgICAgICAgb253YXJuOiAod2FybmluZywgaGFuZGxlcikgPT4ge1xuICAgICAgICAgIC8vIElnbm9yZSBzb21lIHdhcm5pbmdzXG4gICAgICAgICAgaWYgKCFpZ25vcmVkV2FybmluZ3MuaW5jbHVkZXMod2FybmluZy5jb2RlKSkge1xuICAgICAgICAgICAgaGFuZGxlcih3YXJuaW5nKVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgY3NzSW5qZWN0ZWRCeUpzUGx1Z2luKCksXG4gICAgXSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBkZWR1cGU6IFtcInN2ZWx0ZVwiLCBcInN2ZWx0ZS9pbnRlcm5hbFwiXSxcbiAgICAgIGFsaWFzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBmaW5kOiBcIm1hbmlmZXN0Lmpzb25cIixcbiAgICAgICAgICByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKFwiLi9tYW5pZmVzdC5qc29uXCIpLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZmluZDogXCJAYnVkaWJhc2UvdHlwZXNcIixcbiAgICAgICAgICByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKFwiLi4vdHlwZXMvc3JjXCIpLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZmluZDogXCJAYnVkaWJhc2Uvc2hhcmVkLWNvcmVcIixcbiAgICAgICAgICByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKFwiLi4vc2hhcmVkLWNvcmUvc3JjXCIpLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZmluZDogXCJAYnVkaWJhc2UvYmJ1aVwiLFxuICAgICAgICAgIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoXCIuLi9iYnVpL3NyY1wiKSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGZpbmQ6IFwiQFwiLFxuICAgICAgICAgIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyY1wiKSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNFYsU0FBUyxjQUFjO0FBQ25YLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sVUFBVTtBQUNqQixPQUFPLDJCQUEyQjtBQUhsQyxJQUFNLG1DQUFtQztBQUt6QyxJQUFNLGtCQUFrQjtBQUFBLEVBQ3RCO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUNGO0FBRUEsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDeEMsUUFBTSxlQUFlLFNBQVM7QUFFOUIsU0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLElBQ1I7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLEtBQUs7QUFBQSxRQUNILE9BQU87QUFBQSxRQUNQLFNBQVMsQ0FBQyxNQUFNO0FBQUEsUUFDaEIsUUFBUTtBQUFBLFFBQ1IsTUFBTTtBQUFBLFFBQ04sVUFBVSxNQUFNO0FBQUEsTUFDbEI7QUFBQSxNQUNBLFFBQVE7QUFBQSxJQUNWO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxTQUFTO0FBQUEsUUFDVCxRQUFRLENBQUMsU0FBUyxZQUFZO0FBRTVCLGNBQUksQ0FBQyxnQkFBZ0IsU0FBUyxRQUFRLElBQUksR0FBRztBQUMzQyxvQkFBUSxPQUFPO0FBQUEsVUFDakI7QUFBQSxRQUNGO0FBQUEsTUFDRixDQUFDO0FBQUEsTUFDRCxzQkFBc0I7QUFBQSxJQUN4QjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsUUFBUSxDQUFDLFVBQVUsaUJBQWlCO0FBQUEsTUFDcEMsT0FBTztBQUFBLFFBQ0w7QUFBQSxVQUNFLE1BQU07QUFBQSxVQUNOLGFBQWEsS0FBSyxRQUFRLGlCQUFpQjtBQUFBLFFBQzdDO0FBQUEsUUFDQTtBQUFBLFVBQ0UsTUFBTTtBQUFBLFVBQ04sYUFBYSxLQUFLLFFBQVEsY0FBYztBQUFBLFFBQzFDO0FBQUEsUUFDQTtBQUFBLFVBQ0UsTUFBTTtBQUFBLFVBQ04sYUFBYSxLQUFLLFFBQVEsb0JBQW9CO0FBQUEsUUFDaEQ7QUFBQSxRQUNBO0FBQUEsVUFDRSxNQUFNO0FBQUEsVUFDTixhQUFhLEtBQUssUUFBUSxhQUFhO0FBQUEsUUFDekM7QUFBQSxRQUNBO0FBQUEsVUFDRSxNQUFNO0FBQUEsVUFDTixhQUFhLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsUUFDNUM7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
