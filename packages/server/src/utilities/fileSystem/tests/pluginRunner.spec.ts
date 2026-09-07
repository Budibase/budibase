import fs from "fs"
import os from "os"
import path from "path"
import childProcess from "child_process"
import type { DatasourcePlus } from "@budibase/types"

import { loadDatasourcePlugin } from "../../pluginRunner"
import environment from "../../../environment"

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

  describe("session lifecycle", () => {
    let directory: string
    let spawn: jest.SpyInstance<ReturnType<typeof childProcess.spawn>>

    beforeEach(() => {
      directory = fs.mkdtempSync(path.join(os.tmpdir(), "plugin-session-"))
      fs.chmodSync(directory, 0o755)
      spawn = jest.spyOn(childProcess, "spawn")
    })

    afterEach(() => {
      spawn.mockRestore()
      jest.restoreAllMocks()
      fs.rmSync(directory, { recursive: true, force: true })
    })

    const load = async (source: string) => {
      const filename = path.join(directory, "plugin.min.js")
      fs.writeFileSync(filename, source, { mode: 0o644 })
      const Integration = await loadDatasourcePlugin({ filename, hash: "test" })
      return new Integration({ url: "https://example.com" })
    }

    const expectChildrenStopped = () => {
      expect(spawn.mock.results.map(result => result.value.signalCode)).toEqual(
        ["SIGKILL", "SIGKILL"]
      )
    }

    it("preserves state across concurrent SQL helper calls and execution", async () => {
      const integration = (await load(`
        module.exports = class {
          constructor() { this.index = 1 }
          async getBindingIdentifier() {
            const index = this.index
            await new Promise(resolve => setTimeout(resolve, 5))
            this.index++
            return "$" + index
          }
          async read() { return { index: this.index } }
        }
      `)) as DatasourcePlus

      const bindings = await Promise.all([
        integration.getBindingIdentifier(),
        integration.getBindingIdentifier(),
      ])
      const result = await integration.read?.({})

      expect({ bindings, result }).toEqual({
        bindings: ["$1", "$2"],
        result: { index: 3 },
      })
      expectChildrenStopped()
    })

    it("reaps discovery and invocation even when the plugin overrides exit", async () => {
      const integration = await load(`
        process.exit = () => {}
        setInterval(() => {}, 100)
        module.exports = class {
          async read() { return "completed" }
        }
      `)

      const result = await integration.read?.({})

      expect(result).toBe("completed")
      expectChildrenStopped()
    })

    it("can reuse an integration after an operation completes", async () => {
      const integration = await load(`
        module.exports = class {
          async read(query) { return query.value }
        }
      `)

      const first = await integration.read?.({ value: "first" })
      const second = await integration.read?.({ value: "second" })

      expect([first, second]).toEqual(["first", "second"])
      expect(spawn.mock.results.map(result => result.value.signalCode)).toEqual(
        ["SIGKILL", "SIGKILL", "SIGKILL"]
      )
    })

    it("reaps the child after a plugin method throws", async () => {
      const integration = await load(`
        process.exit = () => {}
        setInterval(() => {}, 100)
        module.exports = class {
          async read() { throw new Error("query failed") }
        }
      `)

      await expect(integration.read?.({})).rejects.toThrow("query failed")
      expectChildrenStopped()
    })

    it("runs the plugin cleanup hook before terminating the child", async () => {
      const integration = await load(`
        module.exports = class {
          async read() { return "completed" }
          async end() { throw new Error("cleanup hook executed") }
        }
      `)

      await expect(integration.read?.({})).rejects.toThrow(
        "cleanup hook executed"
      )
      expectChildrenStopped()
    })

    it("terminates a plugin whose cleanup hook never completes", async () => {
      jest.replaceProperty(environment, "QUERY_THREAD_TIMEOUT", 500)
      const integration = await load(`
        module.exports = class {
          async read() { return "completed" }
          async end() { while (true) {} }
        }
      `)

      await expect(integration.read?.({})).rejects.toThrow(
        "Datasource plugin execution exceeded the time limit"
      )
      expectChildrenStopped()
    })

    it("terminates a plugin that never completes", async () => {
      jest.replaceProperty(environment, "QUERY_THREAD_TIMEOUT", 500)
      const integration = await load(`
        module.exports = class {
          async read() { while (true) {} }
        }
      `)

      await expect(integration.read?.({})).rejects.toThrow(
        "Datasource plugin execution exceeded the time limit"
      )
      expectChildrenStopped()
    })

    it("keeps the session deadline after a successful reply", async () => {
      jest.replaceProperty(environment, "QUERY_THREAD_TIMEOUT", 500)
      const integration = (await load(`
        process.exit = () => {}
        setInterval(() => {}, 100)
        module.exports = class {
          async getBindingIdentifier() { return "$1" }
        }
      `)) as DatasourcePlus

      await integration.getBindingIdentifier()
      await new Promise(resolve => setTimeout(resolve, 650))

      await expect(integration.getBindingIdentifier()).rejects.toThrow(
        "Datasource plugin execution exceeded the time limit"
      )
      expectChildrenStopped()
    })

    it("denies server file reads as well as environment access", async () => {
      const canary = path.join(directory, "server-secret.txt")
      fs.writeFileSync(canary, "server-secret")
      const integration = await load(`
        module.exports = class {
          async read() {
            return require("fs").readFileSync(${JSON.stringify(canary)}, "utf8")
          }
        }
      `)

      await expect(integration.read?.({})).rejects.toThrow(
        "Access to this API has been restricted"
      )
      expectChildrenStopped()
    })
  })
})
