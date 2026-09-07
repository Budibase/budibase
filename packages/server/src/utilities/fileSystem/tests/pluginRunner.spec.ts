import fs from "fs"
import os from "os"
import path from "path"

import { loadDatasourcePlugin } from "../../pluginRunner"

describe("datasource plugin runner", () => {
  it("runs datasource plugins without host process privileges", async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "plugin-runner-"))
    const pluginPath = path.join(tempDir, "plugin.min.js")
    const canaryPath = path.join(tempDir, "canary.txt")
    const secret = "host-process-secret"
    process.env.PLUGIN_RUNNER_SECRET = secret

    fs.writeFileSync(
      pluginPath,
      `
const fs = require("fs")
const { execSync } = require("child_process")

let childProcessBlocked = false
let fileWriteBlocked = false
try {
  execSync("whoami")
} catch (err) {
  childProcessBlocked = true
}
try {
  fs.writeFileSync(${JSON.stringify(canaryPath)}, "unsafe")
} catch (err) {
  fileWriteBlocked = true
}

class Integration {
  constructor(config) {
    this.config = config
  }

  defineTypeCastingFromSchema(schema) {
    this.schema = schema
  }

  async read(query) {
    return {
      childProcessBlocked,
      config: this.config,
      fileWriteBlocked,
      hostSecret: process.env.PLUGIN_RUNNER_SECRET,
      query,
      schema: this.schema,
    }
  }
}

module.exports = { integration: Integration }
`
    )
    fs.chmodSync(tempDir, 0o755)
    fs.chmodSync(pluginPath, 0o644)

    try {
      const Integration = await loadDatasourcePlugin({
        filename: pluginPath,
        hash: "plugin-hash",
      })
      const integration = new Integration({ url: "https://example.com" })
      const schema = { id: { name: "id", type: "number" } }
      integration.defineTypeCastingFromSchema?.(schema)
      const result = await integration.read?.({ id: 1 })

      expect({ canaryExists: fs.existsSync(canaryPath), result }).toEqual({
        canaryExists: false,
        result: {
          childProcessBlocked: true,
          config: { url: "https://example.com" },
          fileWriteBlocked: true,
          hostSecret: undefined,
          query: { id: 1 },
          schema,
        },
      })
    } finally {
      delete process.env.PLUGIN_RUNNER_SECRET
      fs.rmSync(tempDir, { recursive: true, force: true })
    }
  })
})
