import { ConfigType, ContentType, DocumentSourceType } from "@budibase/types"
import { helpers } from "@budibase/shared-core"
import { existsSync } from "fs"
import { isAbsolute, resolve } from "path"
import * as dotenv from "dotenv"

type ProviderName = "BudibaseAI" | "OpenAI" | "AzureOpenAI"

interface AIProviderConfig {
  provider: ProviderName
  name: string
  isDefault: boolean
  active: boolean
  apiKey?: string
  baseUrl?: string
  defaultModel?: string
}

interface Scenario {
  id: string
  name: string
  enabled: boolean
  config: AIProviderConfig
}

interface EvalResult {
  name: string
  ok: boolean
  detail?: string
}

type EvalFeature =
  | "table-generation"
  | "js-generation"
  | "cron-generation"
  | "automation-translate"
  | "automation-classify"
  | "automation-prompt-llm"
  | "automation-summarise"
  | "automation-generate-text"
  | "extract-document"

interface LoginResponse {
  token: string
}

interface AutomationResponse {
  automation: {
    _id: string
    _rev: string
  }
}

interface AutomationTestResponse {
  steps?: Array<{
    stepId?: string
    outputs?: Record<string, any>
  }>
}

class ApiClient {
  private baseUrl: string
  private token = ""
  private appId = ""
  private csrfToken = ""

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "")
  }

  async init() {
    const login = await this.login()
    this.token = login.token

    const configuredAppId = process.env.BUDIBASE_APP_ID
    this.appId = await this.resolveDevAppId(configuredAppId)
    this.csrfToken = await this.getCsrfToken()
  }

  get currentAppId() {
    return this.appId
  }

  private async login(): Promise<LoginResponse> {
    const username = process.env.BUDIBASE_USERNAME || "local@budibase.com"
    const password = process.env.BUDIBASE_PASSWORD || "cheekychuckles"

    const response = await fetch(
      `${this.baseUrl}/api/global/auth/default/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      }
    )

    if (!response.ok) {
      const body = await response.text()
      throw new Error(`Login failed (${response.status}): ${body}`)
    }

    const token =
      response.headers.get("x-budibase-token") || response.headers.get("token")

    if (!token) {
      throw new Error("No auth token returned by login route")
    }

    return { token }
  }

  private isDevAppId(appId: string) {
    return appId.startsWith("app_dev_")
  }

  private toDevAppId(appId: string) {
    if (this.isDevAppId(appId)) {
      return appId
    }
    if (appId.startsWith("app_")) {
      return appId.replace(/^app_/, "app_dev_")
    }
    return appId
  }

  private async getAllAppIds(): Promise<string[]> {
    const apps = await this.request<Array<{ appId?: string; _id?: string }>>(
      "GET",
      "/api/applications?status=all",
      undefined,
      false
    )

    return apps.map(app => app.appId || app._id).filter(Boolean) as string[]
  }

  private async resolveDevAppId(configuredAppId?: string): Promise<string> {
    const appIds = await this.getAllAppIds()
    if (appIds.length === 0) {
      throw new Error(
        "No app found. Set BUDIBASE_APP_ID or create an app before running evals."
      )
    }

    if (configuredAppId) {
      const normalized = this.toDevAppId(configuredAppId)
      if (!appIds.includes(normalized)) {
        throw new Error(
          `BUDIBASE_APP_ID resolved to ${normalized}, but that app was not found.`
        )
      }
      if (normalized !== configuredAppId) {
        console.log(
          yellow(
            `BUDIBASE_APP_ID ${configuredAppId} is production; using dev app ${normalized} for /test endpoints.`
          )
        )
      }
      return normalized
    }

    const devApp = appIds.find(appId => this.isDevAppId(appId))
    if (!devApp) {
      throw new Error(
        `No development app found (expected app id starting with app_dev_). Found: ${appIds.join(", ")}`
      )
    }
    return devApp
  }

  private async getCsrfToken(): Promise<string> {
    const self = await this.request<{ csrfToken?: string }>(
      "GET",
      "/api/self",
      undefined,
      true
    )

    if (!self.csrfToken) {
      throw new Error("Unable to fetch csrfToken from /api/self")
    }

    return self.csrfToken
  }

  async request<T>(
    method: string,
    path: string,
    body?: unknown,
    includeAppHeaders = true
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-budibase-token": this.token,
    }

    if (includeAppHeaders) {
      headers["x-budibase-app-id"] = this.appId
    }

    if (method !== "GET") {
      headers["x-csrf-token"] = this.csrfToken
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    const text = await response.text()
    let payload: any = undefined
    if (text) {
      try {
        payload = JSON.parse(text)
      } catch {
        payload = text
      }
    }

    if (!response.ok) {
      throw new Error(
        `${method} ${path} failed (${response.status}): ${text || "<empty>"}`
      )
    }

    return payload as T
  }
}

function green(text: string) {
  return `\x1b[32m${text}\x1b[0m`
}

function red(text: string) {
  return `\x1b[31m${text}\x1b[0m`
}

function yellow(text: string) {
  return `\x1b[33m${text}\x1b[0m`
}

function section(text: string) {
  return `\n=== ${text} ===`
}

function loadEvalEnvFile() {
  const configuredPath = process.env.AI_EVAL_ENV_FILE
  const envFilePath = configuredPath
    ? isAbsolute(configuredPath)
      ? configuredPath
      : resolve(process.cwd(), configuredPath)
    : resolve(__dirname, "../.env.ai-evals")

  if (!existsSync(envFilePath)) {
    if (configuredPath) {
      throw new Error(`AI_EVAL_ENV_FILE not found: ${envFilePath}`)
    }
    return
  }

  dotenv.config({
    path: envFilePath,
  })

  console.log(yellow(`Loaded env: ${envFilePath}`))
}

function parseProviderFilter() {
  const raw = process.env.AI_EVAL_PROVIDERS
  if (!raw) {
    return undefined
  }
  return raw
    .split(",")
    .map(v => v.trim().toLowerCase())
    .filter(Boolean)
}

const ALL_FEATURES: EvalFeature[] = [
  "table-generation",
  "js-generation",
  "cron-generation",
  "automation-translate",
  "automation-classify",
  "automation-prompt-llm",
  "automation-summarise",
  "automation-generate-text",
  "extract-document",
]

function normalizeFeatureToken(value: string): EvalFeature | undefined {
  const token = value.trim().toLowerCase()
  const aliases: Record<string, EvalFeature> = {
    tables: "table-generation",
    table: "table-generation",
    "table-generation": "table-generation",
    js: "js-generation",
    "js-generation": "js-generation",
    cron: "cron-generation",
    "cron-generation": "cron-generation",
    translate: "automation-translate",
    "automation-translate": "automation-translate",
    classify: "automation-classify",
    "automation-classify": "automation-classify",
    prompt: "automation-prompt-llm",
    "prompt-llm": "automation-prompt-llm",
    "automation-prompt-llm": "automation-prompt-llm",
    summarise: "automation-summarise",
    summarize: "automation-summarise",
    "automation-summarise": "automation-summarise",
    generate: "automation-generate-text",
    "generate-text": "automation-generate-text",
    "automation-generate-text": "automation-generate-text",
    extract: "extract-document",
    "extract-document": "extract-document",
  }
  return aliases[token]
}

function parseFeatureList(raw?: string): Set<EvalFeature> | undefined {
  if (!raw) {
    return undefined
  }
  const tokens = raw
    .split(",")
    .map(v => v.trim())
    .filter(Boolean)
  if (tokens.length === 0) {
    return undefined
  }

  if (tokens.some(v => v.toLowerCase() === "all")) {
    return new Set(ALL_FEATURES)
  }

  const features = new Set<EvalFeature>()
  for (const token of tokens) {
    const normalized = normalizeFeatureToken(token)
    if (normalized) {
      features.add(normalized)
    }
  }
  return features.size > 0 ? features : undefined
}

function resolveFeatures(
  globalFeatures: Set<EvalFeature> | undefined
): Set<EvalFeature> {
  return globalFeatures || new Set(ALL_FEATURES)
}

function shouldRunScenario(id: string, selected?: string[]) {
  if (!selected || selected.length === 0) {
    return true
  }
  return selected.includes(id.toLowerCase())
}

function shouldRunBBAI(selected?: string[]) {
  if (!selected || selected.length === 0) {
    return true
  }
  return (
    selected.includes("bbai") ||
    selected.includes("bbai-cloud") ||
    selected.includes("bbai-selfhost")
  )
}

function buildScenarios(selected?: string[]): Scenario[] {
  const openaiKey = process.env.OPENAI_API_KEY
  const azureKey = process.env.AZURE_OPENAI_API_KEY
  const azureBaseUrl = process.env.AZURE_OPENAI_BASE_URL
  const azureModel = process.env.AZURE_OPENAI_MODEL || "gpt-4.1"

  return [
    {
      id: "bbai",
      name: "BBAI",
      enabled: shouldRunBBAI(selected),
      config: {
        provider: "BudibaseAI",
        name: "Eval BBAI",
        isDefault: true,
        active: true,
        defaultModel:
          process.env.BBAI_MODEL ||
          process.env.BBAI_CLOUD_MODEL ||
          process.env.BBAI_SELFHOST_MODEL ||
          "gpt-5-mini",
      },
    },
    {
      id: "openai",
      name: "OpenAI",
      enabled: shouldRunScenario("openai", selected) && Boolean(openaiKey),
      config: {
        provider: "OpenAI",
        name: "Eval OpenAI",
        isDefault: true,
        active: true,
        apiKey: openaiKey,
        defaultModel: process.env.OPENAI_MODEL || "gpt-5-mini",
      },
    },
    {
      id: "azure-openai",
      name: "Azure OpenAI",
      enabled:
        shouldRunScenario("azure-openai", selected) &&
        Boolean(azureKey) &&
        Boolean(azureBaseUrl),
      config: {
        provider: "AzureOpenAI",
        name: "Eval Azure OpenAI",
        isDefault: true,
        active: true,
        apiKey: azureKey,
        baseUrl: azureBaseUrl,
        defaultModel: azureModel,
      },
    },
  ]
}

async function configureAIProvider(
  client: ApiClient,
  config: AIProviderConfig
) {
  const body = {
    type: ConfigType.AI,
    config: {
      evalProvider: config,
    },
  }

  await client.request("POST", "/api/global/configs", body, false)
}

async function getAutomationDefinitions(client: ApiClient) {
  const triggers = await client.request<Record<string, any>>(
    "GET",
    "/api/automations/trigger/list"
  )
  const actions = await client.request<Record<string, any>>(
    "GET",
    "/api/automations/action/list"
  )
  return { triggers, actions }
}

async function runAutomationStepEval(
  client: ApiClient,
  definitions: { triggers: Record<string, any>; actions: Record<string, any> },
  stepId: string,
  inputs: Record<string, any>
): Promise<AutomationTestResponse> {
  const triggerDefinition = definitions.triggers.APP
  const actionDefinition = definitions.actions[stepId]

  if (!triggerDefinition) {
    throw new Error("APP trigger definition not found")
  }
  if (!actionDefinition) {
    throw new Error(`Action definition not found for ${stepId}`)
  }

  const triggerId = crypto.randomUUID()
  const stepIdInternal = crypto.randomUUID()

  const automation = {
    name: `AI Eval ${stepId} ${Date.now()}`,
    appId: client.currentAppId,
    type: "automation",
    definition: {
      trigger: {
        ...triggerDefinition,
        id: triggerId,
        stepId: "APP",
        inputs: {},
      },
      steps: [
        {
          ...actionDefinition,
          id: stepIdInternal,
          stepId,
          name: actionDefinition.name,
          inputs,
        },
      ],
      stepNames: {
        [stepIdInternal]: actionDefinition.name,
      },
    },
  }

  const created = await client.request<AutomationResponse>(
    "POST",
    "/api/automations",
    automation
  )

  try {
    return await client.request<AutomationTestResponse>(
      "POST",
      `/api/automations/${created.automation._id}/test`,
      { fields: {} }
    )
  } finally {
    await client.request(
      "DELETE",
      `/api/automations/${created.automation._id}/${created.automation._rev}`
    )
  }
}

function getActionOutput(
  response: AutomationTestResponse,
  actionStepId: string
): Record<string, any> | undefined {
  const matched = response.steps?.find(step => step.stepId === actionStepId)
  return matched?.outputs
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function countWords(value: string) {
  if (!value.trim()) {
    return 0
  }
  return value.trim().split(/\s+/).length
}

function hasKeyCaseInsensitive(obj: Record<string, any>, key: string) {
  const target = key.toLowerCase()
  return Object.keys(obj).some(k => k.toLowerCase() === target)
}

async function runFeatureEvals(
  client: ApiClient,
  enabledFeatures: Set<EvalFeature>
): Promise<EvalResult[]> {
  const results: EvalResult[] = []
  const definitions = await getAutomationDefinitions(client)

  async function run(name: string, fn: () => Promise<void>) {
    try {
      await fn()
      results.push({ name, ok: true })
    } catch (err: any) {
      results.push({ name, ok: false, detail: err?.message || String(err) })
    }
  }

  const runIf = async (
    feature: EvalFeature,
    name: string,
    fn: () => Promise<void>
  ) => {
    if (!enabledFeatures.has(feature)) {
      return
    }
    await run(name, fn)
  }

  await runIf("table-generation", "Table generation", async () => {
    const response = await client.request<{
      createdTables: Array<{ id: string }>
    }>("POST", "/api/ai/tables", {
      prompt:
        "Create exactly one table named EvalTasks with exactly two string fields named title and status. Use title as primary display.",
    })

    if (!response.createdTables || response.createdTables.length < 1) {
      throw new Error("No tables were created")
    }

    const created = response.createdTables[0]
    const table = await client.request<{ schema: Record<string, any> }>(
      "GET",
      `/api/tables/${created.id}`
    )
    if (!table.schema) {
      throw new Error("Created table schema missing")
    }
    if (!hasKeyCaseInsensitive(table.schema, "title")) {
      throw new Error(
        `Expected title column. Found: ${Object.keys(table.schema).join(", ")}`
      )
    }
    if (!hasKeyCaseInsensitive(table.schema, "status")) {
      throw new Error(
        `Expected status column. Found: ${Object.keys(table.schema).join(", ")}`
      )
    }
  })

  await runIf("js-generation", "JS generation", async () => {
    const response = await client.request<{ code: string }>(
      "POST",
      "/api/ai/js",
      {
        prompt: "Return the number 42 and nothing else",
      }
    )

    if (!response.code || !new RegExp(/^return 42;?$/).test(response.code)) {
      throw new Error(`Unexpected JS output: ${response.code}`)
    }
  })

  await runIf("cron-generation", "Cron generation", async () => {
    const response = await client.request<{ message: string }>(
      "POST",
      "/api/ai/cron",
      {
        prompt: "Run every Monday at 9:30 AM",
      }
    )

    if (!response.message) {
      throw new Error(`Unexpected cron output: ${response.message}`)
    }

    const validation = helpers.cron.validate(response.message)
    if (!validation.valid) {
      throw new Error(
        `Invalid cron output: ${response.message}. Errors: ${validation.err.join(", ")}`
      )
    }
  })

  await runIf("automation-translate", "Automation translate step", async () => {
    const result = await runAutomationStepEval(
      client,
      definitions,
      "TRANSLATE",
      {
        text: "Hello world",
        language: "Spanish",
      }
    )

    const output = getActionOutput(result, "TRANSLATE")
    if (!output?.success || !output?.response) {
      throw new Error(`Unexpected output: ${JSON.stringify(output)}`)
    }
    const translated = normalizeText(String(output.response))
    const source = normalizeText("Hello world")
    if (translated === source) {
      throw new Error(`Translation appears unchanged: ${output.response}`)
    }
  })

  await runIf("automation-classify", "Automation classify step", async () => {
    const result = await runAutomationStepEval(
      client,
      definitions,
      "CLASSIFY_CONTENT",
      {
        textInput: "The customer said the support experience was excellent",
        categoryItems: [{ category: "positive" }, { category: "negative" }],
      }
    )

    const output = getActionOutput(result, "CLASSIFY_CONTENT")
    const category = output?.category?.toLowerCase?.()
    if (!output?.success || category !== "positive") {
      throw new Error(`Unexpected output: ${JSON.stringify(output)}`)
    }
  })

  await runIf(
    "automation-prompt-llm",
    "Automation LLM prompt step",
    async () => {
      const result = await runAutomationStepEval(
        client,
        definitions,
        "PROMPT_LLM",
        {
          prompt: "Reply with exactly EVAL_OK",
        }
      )

      const output = getActionOutput(result, "PROMPT_LLM")
      if (!output?.success || !output?.response) {
        throw new Error(`Unexpected output: ${JSON.stringify(output)}`)
      }
      if (!String(output.response).toUpperCase().includes("EVAL_OK")) {
        throw new Error(`Prompt output missing EVAL_OK: ${output.response}`)
      }
    }
  )

  await runIf("automation-summarise", "Automation summarise step", async () => {
    const sourceText =
      "Budibase helps teams build internal tools quickly with less code. It provides data integration, automation, role-based access, and app builder capabilities in one platform. Teams use it to ship operational apps faster while maintaining governance and security standards."
    const result = await runAutomationStepEval(
      client,
      definitions,
      "SUMMARISE",
      {
        text: sourceText,
        length: "Short",
      }
    )

    const output = getActionOutput(result, "SUMMARISE")
    if (!output?.success || !output?.response) {
      throw new Error(`Unexpected output: ${JSON.stringify(output)}`)
    }
    const summaryText = String(output.response).trim()
    if (!summaryText) {
      throw new Error("Summary response is empty")
    }

    const normalizedSummary = normalizeText(summaryText)
    const normalizedSource = normalizeText(sourceText)
    if (normalizedSummary === normalizedSource) {
      throw new Error("Summary is identical to source text")
    }

    const summaryWordCount = countWords(summaryText)
    const sourceWordCount = countWords(sourceText)
    if (summaryWordCount >= sourceWordCount) {
      throw new Error(
        `Summary is not shorter than source (${summaryWordCount}/${sourceWordCount} words): ${summaryText}`
      )
    }
  })

  await runIf(
    "automation-generate-text",
    "Automation generate text step",
    async () => {
      const result = await runAutomationStepEval(
        client,
        definitions,
        "GENERATE_TEXT",
        {
          contentType: ContentType.EMAIL,
          instructions:
            "Write a one sentence welcome email to Alex for joining the team.",
        }
      )

      const output = getActionOutput(result, "GENERATE_TEXT")
      if (!output?.success || !output?.response) {
        throw new Error(`Unexpected output: ${JSON.stringify(output)}`)
      }
      if (!normalizeText(String(output.response)).includes("alex")) {
        throw new Error(
          `Generated text should mention Alex: ${output.response}`
        )
      }
    }
  )

  await runIf("extract-document", "Extract document step", async () => {
    const result = await runAutomationStepEval(
      client,
      definitions,
      "EXTRACT_FILE_DATA",
      {
        source: DocumentSourceType.URL,
        file: "https://pdfobject.com/pdf/sample.pdf",
        fileType: "pdf",
        schema: {
          language: "string",
          words: "number",
          lines: "number",
        },
      }
    )

    const output = getActionOutput(result, "EXTRACT_FILE_DATA")
    if (!output?.success || !output?.data) {
      throw new Error(`Unexpected output: ${JSON.stringify(output)}`)
    }
    if (!output.data[0].language.toLowerCase().startsWith("en")) {
      throw new Error(
        `Extract output wrong language: ${JSON.stringify(output.data)}`
      )
    }
    if (!(typeof output.data[0].lines === "number")) {
      throw new Error(
        `Extract output wrong lines: ${JSON.stringify(output.data)}`
      )
    }
    if (!(typeof output.data[0].words === "number")) {
      throw new Error(
        `Extract output wrong words: ${JSON.stringify(output.data)}`
      )
    }
  })

  return results
}

async function runScenario(
  client: ApiClient,
  scenario: Scenario,
  enabledFeatures: Set<EvalFeature>
) {
  if (!scenario.enabled) {
    return {
      ok: true,
      skipped: "Missing required environment variables",
      results: [] as EvalResult[],
    }
  }

  await configureAIProvider(client, scenario.config)
  const results = await runFeatureEvals(client, enabledFeatures)
  return {
    ok: results.every(r => r.ok),
    results,
  }
}

async function main() {
  loadEvalEnvFile()

  const baseUrl = process.env.BUDIBASE_BASE_URL || "http://localhost:10000"
  const selected = parseProviderFilter()
  const scenarios = buildScenarios(selected)
  const globalFeatures = parseFeatureList(process.env.AI_EVAL_FEATURES)

  const client = new ApiClient(baseUrl)
  await client.init()

  const summary: Array<{
    name: string
    ok: boolean
    skipped?: string
    results: EvalResult[]
  }> = []

  for (const scenario of scenarios) {
    console.log(section(`Provider: ${scenario.name}`))
    const enabledFeatures = resolveFeatures(globalFeatures)
    const result = await runScenario(client, scenario, enabledFeatures)
    summary.push({ name: scenario.name, ...result })

    if (result.skipped) {
      console.log(yellow(`SKIPPED: ${result.skipped}`))
      continue
    }

    for (const item of result.results) {
      if (item.ok) {
        console.log(green(`PASS: ${item.name}`))
      } else {
        console.log(red(`FAIL: ${item.name}`))
        if (item.detail) {
          console.log(red(`  ${item.detail}`))
        }
      }
    }
  }

  const executed = summary.filter(s => !s.skipped)
  const failed = executed.filter(s => !s.ok)

  console.log(section("Summary"))
  for (const row of summary) {
    if (row.skipped) {
      console.log(yellow(`SKIPPED: ${row.name} (${row.skipped})`))
    } else if (row.ok) {
      console.log(green(`PASS: ${row.name}`))
    } else {
      console.log(red(`FAIL: ${row.name}`))
    }
  }

  if (executed.length === 0) {
    console.log(red("No scenarios executed. Set provider env vars and re-run."))
    process.exit(1)
  }

  if (failed.length > 0) {
    process.exit(1)
  }
}

main().catch((err: any) => {
  console.error(red(err?.stack || err?.message || String(err)))
  process.exit(1)
})
