import type { Serializable } from "child_process"
import fs from "fs"
import { z } from "zod"

import type { AutomationStepInputBase, IntegrationBase } from "@budibase/types"

import environment from "../environment"
import { PluginSession } from "./pluginSession"

export type IntegrationFactory = (
  config: Serializable | undefined
) => Promise<IntegrationBase>

type IntegrationBaseConstructor = new (
  config: Serializable | undefined
) => IntegrationBase
type TypeCastingSchema = Record<string, { name: string; type: string }>

export type AutomationPluginResult = Record<string, Serializable | undefined>

export interface AutomationPlugin {
  action<TInputs, TOutputs = AutomationPluginResult>(
    params: { inputs: TInputs } & AutomationStepInputBase
  ): Promise<TOutputs>
}

const datasourceDescriptionSchema = z.object({
  methods: z.array(z.string()),
})

const automationPluginResultSchema = z.custom<AutomationPluginResult>(
  result =>
    typeof result === "object" && result !== null && !Array.isArray(result)
)

interface DatasourcePluginProxy {
  config: Serializable | undefined
  typeCastingSchema?: TypeCastingSchema
}

interface CachedDatasourcePlugin {
  hash: string
  integration: Promise<IntegrationFactory>
}

interface CachedAutomationPlugin {
  hash: string
  plugin: Promise<AutomationPlugin>
}

// Both loaders return host-side proxies. Calls are forwarded over IPC to a
// restricted pluginRunnerProcess.js child, where the plugin is actually loaded.
const datasourcePluginCache = new Map<string, CachedDatasourcePlugin>()
const automationPluginCache = new Map<string, CachedAutomationPlugin>()
const pluginSessions = new WeakMap<object, PluginSession>()

// SQL helpers prepare state that the following operation consumes, so they
// continue using the same child process. Other methods end and reap the session.
const SESSION_CONTINUATION_METHODS = new Set([
  "getBindingIdentifier",
  "getStringConcat",
])

const discoverDatasourceMethods = async ({
  session,
  config,
}: {
  session: PluginSession
  config: Serializable | undefined
}) => {
  const description = datasourceDescriptionSchema.safeParse(
    await session.invoke({ operation: "describeDatasource", config })
  )
  if (!description.success) {
    throw new Error("Datasource plugin returned invalid methods")
  }
  return description.data.methods
}

const createIntegrationProxy = ({
  filename,
  methods,
}: {
  filename: string
  methods: string[]
}) => {
  const Integration: IntegrationBaseConstructor = class {
    declare read?: IntegrationBase["read"]

    config: Serializable | undefined
    typeCastingSchema?: TypeCastingSchema

    constructor(config: Serializable | undefined) {
      this.config = config
    }
  }

  for (const method of methods) {
    if (method === "defineTypeCastingFromSchema") {
      Object.defineProperty(Integration.prototype, method, {
        value(this: DatasourcePluginProxy, schema: TypeCastingSchema) {
          this.typeCastingSchema = schema
        },
      })
      continue
    }
    if (method === "end") {
      continue
    }

    Object.defineProperty(Integration.prototype, method, {
      async value(
        this: DatasourcePluginProxy,
        ...args: (Serializable | undefined)[]
      ) {
        let session = pluginSessions.get(this)
        if (!session) {
          session = new PluginSession({
            filename,
            pluginType: "Datasource",
            timeout: environment.QUERY_THREAD_TIMEOUT,
          })
          pluginSessions.set(this, session)
        }
        let result: Serializable | undefined
        try {
          result = await session.invoke({
            operation: "invokeDatasource",
            config: this.config,
            method,
            args,
            typeCastingSchema: this.typeCastingSchema,
          })
        } catch (error) {
          pluginSessions.delete(this)
          throw error
        }
        if (!SESSION_CONTINUATION_METHODS.has(method)) {
          try {
            await session.dispose({ hasEnd: methods.includes("end") })
          } finally {
            pluginSessions.delete(this)
          }
        }
        return result
      },
    })
  }

  return Integration
}

const createDatasourcePlugin = async (
  filename: string
): Promise<IntegrationFactory> => {
  filename = fs.realpathSync(filename)
  const validation = new PluginSession({
    filename,
    pluginType: "Datasource",
    timeout: environment.QUERY_THREAD_TIMEOUT,
  })
  try {
    await validation.invoke({ operation: "validateDatasource" })
  } finally {
    await validation.close()
  }

  return async config => {
    const session = new PluginSession({
      filename,
      pluginType: "Datasource",
      timeout: environment.QUERY_THREAD_TIMEOUT,
    })
    try {
      const methods = await discoverDatasourceMethods({ session, config })
      const Integration = createIntegrationProxy({ filename, methods })
      const integration = new Integration(config)
      pluginSessions.set(integration, session)
      return integration
    } catch (error) {
      await session.close()
      throw error
    }
  }
}

const createAutomationPlugin = async (
  filename: string
): Promise<AutomationPlugin> => {
  filename = fs.realpathSync(filename)
  const discovery = new PluginSession({
    filename,
    pluginType: "Automation",
    timeout: environment.QUERY_THREAD_TIMEOUT,
  })
  try {
    await discovery.invoke({ operation: "describeAutomation" })
  } finally {
    await discovery.close()
  }

  return {
    action: async <TInputs, TOutputs = AutomationPluginResult>(
      params: { inputs: TInputs } & AutomationStepInputBase
    ) => {
      const { emitter, ...serializableParams } = params
      const session = new PluginSession({
        filename,
        pluginType: "Automation",
        timeout: environment.AUTOMATION_THREAD_TIMEOUT,
        emitter,
      })
      try {
        const result = automationPluginResultSchema.safeParse(
          await session.invoke({
            operation: "invokeAutomation",
            params: serializableParams,
          })
        )
        if (!result.success) {
          throw new Error("Automation plugin returned an invalid result")
        }
        return result.data as TOutputs
      } finally {
        await session.close()
      }
    },
  }
}

export const loadDatasourcePlugin = async ({
  filename,
  hash,
}: {
  filename: string
  hash: string
}) => {
  const cached = datasourcePluginCache.get(filename)
  if (cached?.hash === hash) {
    return cached.integration
  }

  const integration = createDatasourcePlugin(filename)
  datasourcePluginCache.set(filename, { hash, integration })
  try {
    return await integration
  } catch (err) {
    datasourcePluginCache.delete(filename)
    throw err
  }
}

export const loadAutomationPlugin = async ({
  filename,
  hash,
}: {
  filename: string
  hash: string
}) => {
  const cached = automationPluginCache.get(filename)
  if (cached?.hash === hash) {
    return cached.plugin
  }

  const plugin = createAutomationPlugin(filename)
  automationPluginCache.set(filename, { hash, plugin })
  try {
    return await plugin
  } catch (err) {
    automationPluginCache.delete(filename)
    throw err
  }
}
