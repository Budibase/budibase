import fs from "fs"
import os from "os"
import path from "path"
import childProcess from "child_process"
import { buildSync } from "esbuild"
import type { ContextEmitter, DatasourcePlus } from "@budibase/types"

import { loadAutomationPlugin, loadDatasourcePlugin } from "../../pluginRunner"
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
      const integration = await Integration({ url: "https://example.com" })
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
      return await Integration({ url: "https://example.com" })
    }

    const expectChildrenStopped = () => {
      expect(spawn.mock.results.map(result => result.value.signalCode)).toEqual(
        ["SIGKILL", "SIGKILL"]
      )
    }

    it("discovers class fields using the datasource configuration", async () => {
      const integration = await load(`
        module.exports = class {
          constructor(config) { this.url = config.url }
          read = async query => ({ url: this.url, value: query.value })
          testConnection = async () => ({ connected: true })
        }
      `)

      const result = await integration.read?.({ value: "input" })
      const connection = await integration.testConnection?.()

      expect({ result, connection }).toEqual({
        result: { url: "https://example.com", value: "input" },
        connection: { connected: true },
      })
    })

    it("does not evaluate getters when discovering methods", async () => {
      const integration = await load(`
        module.exports = class {
          constructor(config) { this.config = config }
          get url() { return this.config.url }
          async read() { return { url: this.url } }
        }
      `)

      expect(await integration.read?.({})).toEqual({
        url: "https://example.com",
      })
      expectChildrenStopped()
    })

    it("respects methods shadowed by non-callable instance fields", async () => {
      const integration = await load(`
        class Base {
          async testConnection() { return { connected: true } }
        }
        module.exports = class extends Base {
          testConnection = undefined
          async read() { return "completed" }
        }
      `)

      const result = await integration.read?.({})

      expect({ result, testConnection: integration.testConnection }).toEqual({
        result: "completed",
        testConnection: undefined,
      })
      expectChildrenStopped()
    })

    it("discovers config-dependent fields for each instance of a cached plugin", async () => {
      const filename = path.join(directory, "plugin.min.js")
      fs.writeFileSync(
        filename,
        `
        module.exports = class {
          constructor(config) {
            if (config.verify) {
              this.testConnection = async () => ({ connected: true })
            }
          }
          async read() { return "completed" }
        }
      `
      )
      const createIntegration = await loadDatasourcePlugin({
        filename,
        hash: "config",
      })
      const first = await createIntegration({ verify: true })
      const second = await createIntegration({ verify: false })
      const connection = await first.testConnection?.()
      const result = await second.read?.({})

      expect({
        connection,
        result,
        testConnection: second.testConnection,
      }).toEqual({
        connection: { connected: true },
        result: "completed",
        testConnection: undefined,
      })
    })

    it("preserves custom JSON representations in datasource results", async () => {
      const filename = path.join(directory, "plugin.min.js")
      buildSync({
        stdin: {
          contents: `
            const { ObjectId, Decimal128 } = require("bson")
            module.exports = class {
              async read() {
                return [{
                  id: new ObjectId("507f1f77bcf86cd799439011"),
                  amount: Decimal128.fromString("123.45"),
                }]
              }
            }
          `,
          resolveDir: process.cwd(),
        },
        bundle: true,
        platform: "node",
        outfile: filename,
      })
      const createIntegration = await loadDatasourcePlugin({
        filename,
        hash: "json",
      })
      const integration = await createIntegration({})
      const result = await integration.read?.({})

      expect(result).toEqual([
        {
          id: "507f1f77bcf86cd799439011",
          amount: { $numberDecimal: "123.45" },
        },
      ])
      expectChildrenStopped()
    })

    it("preserves native IPC values and cycles when normalizing results", async () => {
      const integration = await load(`
        class Identifier { toJSON() { return "record-1" } }
        module.exports = class {
          async read() {
            const result = {
              date: new Date("2026-01-01T00:00:00.000Z"),
              buffer: Buffer.from("data"),
              missing: undefined,
              bigint: 123n,
              map: new Map([["id", new Identifier()]]),
              set: new Set([new Identifier()]),
              pattern: /value/i,
            }
            result.self = result
            return result
          }
        }
      `)
      const result = await integration.read?.({})
      expect({
        date: result.date.toISOString(),
        buffer: result.buffer.toString(),
        missing: result.missing,
        bigint: result.bigint,
        map: [...result.map],
        set: [...result.set],
        pattern: result.pattern.toString(),
        circular: result.self === result,
      }).toEqual({
        date: "2026-01-01T00:00:00.000Z",
        buffer: "data",
        missing: undefined,
        bigint: 123n,
        map: [["id", "record-1"]],
        set: ["record-1"],
        pattern: "/value/i",
        circular: true,
      })
      expectChildrenStopped()
    })

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

describe("automation plugin runner", () => {
  let directory: string
  let spawn: jest.SpyInstance<ReturnType<typeof childProcess.spawn>>

  beforeEach(() => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), "automation-plugin-"))
    fs.chmodSync(directory, 0o755)
    spawn = jest.spyOn(childProcess, "spawn")
  })

  afterEach(() => {
    spawn.mockRestore()
    jest.restoreAllMocks()
    delete process.env.PLUGIN_RUNNER_SECRET
    fs.rmSync(directory, { recursive: true, force: true })
  })

  const load = async (source: string) => {
    const filename = path.join(directory, "plugin.min.js")
    fs.writeFileSync(filename, source, { mode: 0o644 })
    return loadAutomationPlugin({ filename, hash: "test" })
  }

  const createEmitter = (): ContextEmitter => ({
    emitRow: jest.fn(),
    emitTable: jest.fn(),
  })

  it("runs actions without host process privileges", async () => {
    const canaryPath = path.join(directory, "canary.txt")
    process.env.PLUGIN_RUNNER_SECRET = "host-process-secret"
    const plugin = await load(`
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

      module.exports = {
        action: async ({ inputs, appId, context }) => ({
          appId,
          childProcessBlocked,
          context,
          fileWriteBlocked,
          hostSecret: process.env.PLUGIN_RUNNER_SECRET,
          inputs,
        }),
      }
    `)

    const result = await plugin.action({
      inputs: { value: "input" },
      appId: "app_1",
      context: { state: { value: "context" } },
      emitter: createEmitter(),
    })

    expect({ canaryExists: fs.existsSync(canaryPath), result }).toEqual({
      canaryExists: false,
      result: {
        appId: "app_1",
        childProcessBlocked: true,
        context: { state: { value: "context" } },
        fileWriteBlocked: true,
        hostSecret: undefined,
        inputs: { value: "input" },
      },
    })
    expect(spawn.mock.results.map(result => result.value.signalCode)).toEqual([
      "SIGKILL",
      "SIGKILL",
    ])
  })

  it("forwards emitter calls to the host and waits for them", async () => {
    const plugin = await load(`
      module.exports = {
        action: async ({ emitter, appId }) => {
          await emitter.emitRow({
            eventName: "row:save",
            appId,
            row: { _id: "ro_1" },
            table: { _id: "ta_1" },
            user: {},
          })
          emitter.emitTable("table:save", appId, { _id: "ta_1" })
          return { success: true }
        },
      }
    `)
    const emitter = createEmitter()

    const result = await plugin.action({
      inputs: {},
      appId: "app_1",
      context: {},
      emitter,
    })

    expect(result).toEqual({ success: true })
    expect(emitter.emitRow).toHaveBeenCalledWith({
      eventName: "row:save",
      appId: "app_1",
      row: { _id: "ro_1" },
      table: { _id: "ta_1" },
      user: {},
    })
    expect(emitter.emitTable).toHaveBeenCalledWith("table:save", "app_1", {
      _id: "ta_1",
    })
  })

  it("returns emitter failures to the action", async () => {
    const plugin = await load(`
      module.exports = {
        action: async ({ emitter }) => {
          emitter.emitTable("table:save", "app_1")
          return { success: true }
        },
      }
    `)
    const emitter: ContextEmitter = {
      emitRow: jest.fn(),
      emitTable: jest.fn(async () => {
        throw new Error("emitter failed")
      }),
    }

    await expect(
      plugin.action({ inputs: {}, appId: "app_1", context: {}, emitter })
    ).rejects.toThrow("emitter failed")
  })

  it.each([
    `try {
      await emitter.emitTable("table:save", "app_1")
    } catch (error) {
      return { recovered: error.message }
    }`,
    `return emitter.emitTable("table:save", "app_1")
      .catch(error => ({ recovered: error.message }))`,
  ])("allows an action to recover from emitter failures: %s", async action => {
    const plugin = await load(`
      module.exports = {
        action: async ({ emitter }) => { ${action} },
      }
    `)
    const emitter: ContextEmitter = {
      emitRow: jest.fn(),
      emitTable: jest.fn(async () => {
        throw new Error("emitter failed")
      }),
    }

    await expect(
      plugin.action({ inputs: {}, appId: "app_1", context: {}, emitter })
    ).resolves.toEqual({ recovered: "emitter failed" })
  })

  it("rejects an action that does not catch an awaited emitter failure", async () => {
    const plugin = await load(`
      module.exports = {
        action: async ({ emitter }) => {
          await emitter.emitTable("table:save", "app_1")
          return { success: true }
        },
      }
    `)
    const emitter: ContextEmitter = {
      emitRow: jest.fn(),
      emitTable: jest.fn(async () => {
        throw new Error("emitter failed")
      }),
    }

    await expect(
      plugin.action({ inputs: {}, appId: "app_1", context: {}, emitter })
    ).rejects.toThrow("emitter failed")
  })

  it("preserves custom JSON values in action results", async () => {
    const plugin = await load(`
      class Decimal {
        toJSON() { return "123.45" }
      }
      module.exports = {
        action: async () => ({ value: new Decimal() }),
      }
    `)

    await expect(
      plugin.action({
        inputs: {},
        appId: "app_1",
        context: {},
        emitter: createEmitter(),
      })
    ).resolves.toEqual({ value: "123.45" })
  })

  it("rejects plugins without an action export", async () => {
    await expect(load("module.exports = {}")).rejects.toThrow(
      "Automation plugin does not export an action function"
    )

    expect(spawn.mock.results.map(result => result.value.signalCode)).toEqual([
      "SIGKILL",
    ])
  })

  it("terminates an action that exceeds the automation timeout", async () => {
    jest.replaceProperty(environment, "AUTOMATION_THREAD_TIMEOUT", 500)
    const plugin = await load(`
      module.exports = {
        action: async () => { while (true) {} },
      }
    `)

    await expect(
      plugin.action({
        inputs: {},
        appId: "app_1",
        context: {},
        emitter: createEmitter(),
      })
    ).rejects.toThrow("Automation plugin execution exceeded the time limit")

    expect(spawn.mock.results.map(result => result.value.signalCode)).toEqual([
      "SIGKILL",
      "SIGKILL",
    ])
  })
})
