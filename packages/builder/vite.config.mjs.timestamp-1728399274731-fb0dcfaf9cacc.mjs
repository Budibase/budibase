// vite.config.mjs
import { svelte } from "file:///Users/aptk/dev/budibase/node_modules/@sveltejs/vite-plugin-svelte/dist/index.js";
import replace from "file:///Users/aptk/dev/budibase/node_modules/@rollup/plugin-replace/dist/es/index.js";
import { defineConfig, loadEnv } from "file:///Users/aptk/dev/budibase/node_modules/vite/dist/node/index.js";
import { viteStaticCopy } from "file:///Users/aptk/dev/budibase/node_modules/vite-plugin-static-copy/dist/index.js";
import path from "path";
var ignoredWarnings = [
  "unused-export-let",
  "css-unused-selector",
  "module-script-reactive-declaration",
  "a11y-no-onchange",
  "a11y-click-events-have-key-events"
];
var copyFonts = (dest) => viteStaticCopy({
  targets: [
    {
      src: "../../node_modules/@fontsource/source-sans-pro",
      dest
    },
    {
      src: "../../node_modules/remixicon/fonts/*",
      dest
    }
  ]
});
var vite_config_default = defineConfig(({ mode }) => {
  const isProduction = mode === "production";
  const env = loadEnv(mode, process.cwd());
  const devOnlyPlugins = [
    // Copy fonts to an additional path so that svelte's automatic
    // prefixing of the base URL path can still resolve assets
    copyFonts("builder/fonts")
  ];
  return {
    test: {
      setupFiles: ["./vitest.setup.js"],
      globals: true,
      environment: "jsdom"
    },
    server: {
      fs: {
        strict: false
      },
      hmr: {
        protocol: env.VITE_HMR_PROTOCOL || "ws",
        clientPort: env.VITE_HMR_CLIENT_PORT || 3e3,
        path: env.VITE_HMR_PATH || "/"
      },
      port: 3e3
    },
    base: "/builder/",
    build: {
      minify: isProduction,
      outDir: "../server/builder",
      sourcemap: !isProduction
    },
    plugins: [
      svelte({
        hot: !isProduction,
        emitCss: true,
        onwarn: (warning, handler) => {
          if (!ignoredWarnings.includes(warning.code)) {
            handler(warning);
          }
        }
      }),
      replace({
        preventAssignment: true,
        "process.env.NODE_ENV": JSON.stringify(
          isProduction ? "production" : "development"
        ),
        "process.env.POSTHOG_TOKEN": JSON.stringify(process.env.POSTHOG_TOKEN)
      }),
      copyFonts("fonts"),
      ...isProduction ? [] : devOnlyPlugins
    ],
    optimizeDeps: {
      exclude: ["@roxi/routify", "fsevents"]
    },
    resolve: {
      dedupe: ["@roxi/routify"],
      alias: [
        {
          find: "assets",
          replacement: path.resolve("./assets")
        },
        {
          find: "components",
          replacement: path.resolve("./src/components")
        },
        {
          find: "pages",
          replacement: path.resolve("./src/pages")
        },
        {
          find: "templates",
          replacement: path.resolve("./src/templates")
        },
        {
          find: "stores",
          replacement: path.resolve("./src/stores")
        },
        {
          find: "dataBinding",
          replacement: path.resolve("./src/dataBinding.js")
        },
        {
          find: "api",
          replacement: path.resolve("./src/api.js")
        },
        {
          find: "constants",
          replacement: path.resolve("./src/constants")
        },
        {
          find: "analytics",
          replacement: path.resolve("./src/analytics")
        },
        {
          find: "actions",
          replacement: path.resolve("./src/actions")
        },
        {
          find: "helpers",
          replacement: path.resolve("./src/helpers")
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
        }
      ]
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2FwdGsvZGV2L2J1ZGliYXNlL3BhY2thZ2VzL2J1aWxkZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9hcHRrL2Rldi9idWRpYmFzZS9wYWNrYWdlcy9idWlsZGVyL3ZpdGUuY29uZmlnLm1qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvYXB0ay9kZXYvYnVkaWJhc2UvcGFja2FnZXMvYnVpbGRlci92aXRlLmNvbmZpZy5tanNcIjtpbXBvcnQgeyBzdmVsdGUgfSBmcm9tIFwiQHN2ZWx0ZWpzL3ZpdGUtcGx1Z2luLXN2ZWx0ZVwiXG5pbXBvcnQgcmVwbGFjZSBmcm9tIFwiQHJvbGx1cC9wbHVnaW4tcmVwbGFjZVwiXG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tIFwidml0ZVwiXG5pbXBvcnQgeyB2aXRlU3RhdGljQ29weSB9IGZyb20gXCJ2aXRlLXBsdWdpbi1zdGF0aWMtY29weVwiXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiXG5cbmNvbnN0IGlnbm9yZWRXYXJuaW5ncyA9IFtcbiAgXCJ1bnVzZWQtZXhwb3J0LWxldFwiLFxuICBcImNzcy11bnVzZWQtc2VsZWN0b3JcIixcbiAgXCJtb2R1bGUtc2NyaXB0LXJlYWN0aXZlLWRlY2xhcmF0aW9uXCIsXG4gIFwiYTExeS1uby1vbmNoYW5nZVwiLFxuICBcImExMXktY2xpY2stZXZlbnRzLWhhdmUta2V5LWV2ZW50c1wiLFxuXVxuXG5jb25zdCBjb3B5Rm9udHMgPSBkZXN0ID0+XG4gIHZpdGVTdGF0aWNDb3B5KHtcbiAgICB0YXJnZXRzOiBbXG4gICAgICB7XG4gICAgICAgIHNyYzogXCIuLi8uLi9ub2RlX21vZHVsZXMvQGZvbnRzb3VyY2Uvc291cmNlLXNhbnMtcHJvXCIsXG4gICAgICAgIGRlc3QsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBzcmM6IFwiLi4vLi4vbm9kZV9tb2R1bGVzL3JlbWl4aWNvbi9mb250cy8qXCIsXG4gICAgICAgIGRlc3QsXG4gICAgICB9LFxuICAgIF0sXG4gIH0pXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgY29uc3QgaXNQcm9kdWN0aW9uID0gbW9kZSA9PT0gXCJwcm9kdWN0aW9uXCJcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpKVxuXG4gIC8vIFBsdWdpbnMgdG8gb25seSBydW4gaW4gZGV2XG4gIGNvbnN0IGRldk9ubHlQbHVnaW5zID0gW1xuICAgIC8vIENvcHkgZm9udHMgdG8gYW4gYWRkaXRpb25hbCBwYXRoIHNvIHRoYXQgc3ZlbHRlJ3MgYXV0b21hdGljXG4gICAgLy8gcHJlZml4aW5nIG9mIHRoZSBiYXNlIFVSTCBwYXRoIGNhbiBzdGlsbCByZXNvbHZlIGFzc2V0c1xuICAgIGNvcHlGb250cyhcImJ1aWxkZXIvZm9udHNcIiksXG5dXG5cbiAgcmV0dXJuIHtcbiAgICB0ZXN0OiB7XG4gICAgICBzZXR1cEZpbGVzOiBbXCIuL3ZpdGVzdC5zZXR1cC5qc1wiXSxcbiAgICAgIGdsb2JhbHM6IHRydWUsXG4gICAgICBlbnZpcm9ubWVudDogXCJqc2RvbVwiLFxuICAgIH0sXG4gICAgc2VydmVyOiB7XG4gICAgICBmczoge1xuICAgICAgICBzdHJpY3Q6IGZhbHNlLFxuICAgICAgfSxcbiAgICAgIGhtcjoge1xuICAgICAgICBwcm90b2NvbDogZW52LlZJVEVfSE1SX1BST1RPQ09MIHx8IFwid3NcIixcbiAgICAgICAgY2xpZW50UG9ydDogZW52LlZJVEVfSE1SX0NMSUVOVF9QT1JUIHx8IDMwMDAsXG4gICAgICAgIHBhdGg6IGVudi5WSVRFX0hNUl9QQVRIIHx8IFwiL1wiLFxuICAgICAgfSxcbiAgICAgIHBvcnQ6IDMwMDAsXG4gICAgfSxcbiAgICBiYXNlOiBcIi9idWlsZGVyL1wiLFxuICAgIGJ1aWxkOiB7XG4gICAgICBtaW5pZnk6IGlzUHJvZHVjdGlvbixcbiAgICAgIG91dERpcjogXCIuLi9zZXJ2ZXIvYnVpbGRlclwiLFxuICAgICAgc291cmNlbWFwOiAhaXNQcm9kdWN0aW9uLFxuICAgIH0sXG4gICAgcGx1Z2luczogW1xuICAgICAgc3ZlbHRlKHtcbiAgICAgICAgaG90OiAhaXNQcm9kdWN0aW9uLFxuICAgICAgICBlbWl0Q3NzOiB0cnVlLFxuICAgICAgICBvbndhcm46ICh3YXJuaW5nLCBoYW5kbGVyKSA9PiB7XG4gICAgICAgICAgLy8gSWdub3JlIHNvbWUgd2FybmluZ3NcbiAgICAgICAgICBpZiAoIWlnbm9yZWRXYXJuaW5ncy5pbmNsdWRlcyh3YXJuaW5nLmNvZGUpKSB7XG4gICAgICAgICAgICBoYW5kbGVyKHdhcm5pbmcpXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICByZXBsYWNlKHtcbiAgICAgICAgcHJldmVudEFzc2lnbm1lbnQ6IHRydWUsXG4gICAgICAgIFwicHJvY2Vzcy5lbnYuTk9ERV9FTlZcIjogSlNPTi5zdHJpbmdpZnkoXG4gICAgICAgICAgaXNQcm9kdWN0aW9uID8gXCJwcm9kdWN0aW9uXCIgOiBcImRldmVsb3BtZW50XCJcbiAgICAgICAgKSxcbiAgICAgICAgXCJwcm9jZXNzLmVudi5QT1NUSE9HX1RPS0VOXCI6IEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52LlBPU1RIT0dfVE9LRU4pLFxuICAgICAgfSksXG4gICAgICBjb3B5Rm9udHMoXCJmb250c1wiKSxcbiAgICAgIC4uLihpc1Byb2R1Y3Rpb24gPyBbXSA6IGRldk9ubHlQbHVnaW5zKSxcbiAgICBdLFxuICAgIG9wdGltaXplRGVwczoge1xuICAgICAgZXhjbHVkZTogW1wiQHJveGkvcm91dGlmeVwiLCBcImZzZXZlbnRzXCJdLFxuICAgIH0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgZGVkdXBlOiBbXCJAcm94aS9yb3V0aWZ5XCJdLFxuICAgICAgYWxpYXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGZpbmQ6IFwiYXNzZXRzXCIsXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6IHBhdGgucmVzb2x2ZShcIi4vYXNzZXRzXCIpLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZmluZDogXCJjb21wb25lbnRzXCIsXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6IHBhdGgucmVzb2x2ZShcIi4vc3JjL2NvbXBvbmVudHNcIiksXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBmaW5kOiBcInBhZ2VzXCIsXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6IHBhdGgucmVzb2x2ZShcIi4vc3JjL3BhZ2VzXCIpLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZmluZDogXCJ0ZW1wbGF0ZXNcIixcbiAgICAgICAgICByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKFwiLi9zcmMvdGVtcGxhdGVzXCIpLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZmluZDogXCJzdG9yZXNcIixcbiAgICAgICAgICByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKFwiLi9zcmMvc3RvcmVzXCIpLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZmluZDogXCJkYXRhQmluZGluZ1wiLFxuICAgICAgICAgIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoXCIuL3NyYy9kYXRhQmluZGluZy5qc1wiKSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGZpbmQ6IFwiYXBpXCIsXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6IHBhdGgucmVzb2x2ZShcIi4vc3JjL2FwaS5qc1wiKSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGZpbmQ6IFwiY29uc3RhbnRzXCIsXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6IHBhdGgucmVzb2x2ZShcIi4vc3JjL2NvbnN0YW50c1wiKSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGZpbmQ6IFwiYW5hbHl0aWNzXCIsXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6IHBhdGgucmVzb2x2ZShcIi4vc3JjL2FuYWx5dGljc1wiKSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGZpbmQ6IFwiYWN0aW9uc1wiLFxuICAgICAgICAgIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoXCIuL3NyYy9hY3Rpb25zXCIpLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZmluZDogXCJoZWxwZXJzXCIsXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6IHBhdGgucmVzb2x2ZShcIi4vc3JjL2hlbHBlcnNcIiksXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBmaW5kOiBcIkBidWRpYmFzZS90eXBlc1wiLFxuICAgICAgICAgIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoXCIuLi90eXBlcy9zcmNcIiksXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBmaW5kOiBcIkBidWRpYmFzZS9zaGFyZWQtY29yZVwiLFxuICAgICAgICAgIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoXCIuLi9zaGFyZWQtY29yZS9zcmNcIiksXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBmaW5kOiBcIkBidWRpYmFzZS9iYnVpXCIsXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6IHBhdGgucmVzb2x2ZShcIi4uL2JidWkvc3JjXCIpLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUErUyxTQUFTLGNBQWM7QUFDdFUsT0FBTyxhQUFhO0FBQ3BCLFNBQVMsY0FBYyxlQUFlO0FBQ3RDLFNBQVMsc0JBQXNCO0FBQy9CLE9BQU8s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
