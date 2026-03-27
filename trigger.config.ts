import { defineConfig } from "@trigger.dev/sdk/v3"

const DEFAULT_TRIGGER_PROJECT_REF = "test-vp9q"

export default defineConfig({
  project: process.env.TRIGGER_PROJECT_REF || DEFAULT_TRIGGER_PROJECT_REF,
  maxDuration: 300,
  dirs: ["./trigger/tasks"],
})
