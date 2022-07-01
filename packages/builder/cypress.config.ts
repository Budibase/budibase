import { defineConfig } from "cypress"

export default defineConfig({
  video: true,
  projectId: "bmbemn",
  reporter: "cypress-multi-reporters",
  reporterOptions: {
    configFile: "reporterConfig.json",
  },
  env: {
    PORT: "4100",
    WORKER_PORT: "4200",
    JWT_SECRET: "test",
    HOST_IP: "",
  },
  retries: {
    runMode: 1,
    openMode: 0,
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.js")(on, config)
    },
    baseUrl: "http://localhost:4100",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
  },
})
