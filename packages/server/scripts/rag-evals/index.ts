import { AIConfigType } from "@budibase/types"
import { existsSync, readFileSync, writeFileSync } from "fs"
import { spawnSync } from "child_process"
import { createHash } from "crypto"
import { tmpdir } from "os"
import { basename, extname, isAbsolute, join, relative, resolve } from "path"
import * as dotenv from "dotenv"

type SupportedEmbeddingModel = "text-embedding-3-small"

interface EvalExpectation {
  containsAny?: string[]
  containsAll?: string[]
  sourceIncludesAny?: string[]
  expectNoContext?: boolean
}

interface EvalCase {
  id: string
  question: string
  reference?: string
  expectation?: EvalExpectation
}

interface EvalFile {
  embedding?: {
    model?: SupportedEmbeddingModel
  }
  documents: string[]
  cases: EvalCase[]
}

interface RagasSample {
  caseId: string
  question: string
  answer: string
  contexts: string[]
  reference?: string
  sourceHints: string[]
}

interface RagasOutput {
  aggregate?: Record<string, number>
  byCase?: Array<Record<string, unknown>>
  raw?: unknown
}

interface CreatedResources {
  completionConfigId?: string
  completionConfigCreated?: boolean
  embeddingConfigId?: string
  embeddingConfigCreated?: boolean
  vectorDbId?: string
  vectorDbCreated?: boolean
  knowledgeBaseId?: string
  knowledgeBaseCreated?: boolean
  agentId?: string
  agentCreated?: boolean
}

interface ChatConversationMessage {
  role: string
  parts?: Array<{ type: string; text?: string }>
  metadata?: {
    ragSources?: Array<{ filename?: string; sourceId?: string }>
  }
}

interface ChatConversation {
  _id?: string
  messages: ChatConversationMessage[]
}

interface UploadedFile {
  filename: string
  status: "processing" | "ready" | "failed"
  errorMessage?: string
}

interface RuntimeEnv {
  budibaseBaseUrl: string
  appId: string
  budibaseUsername: string
  budibasePassword: string
  provider: string
  openAIKey: string
  openAIBaseUrl: string
  chatModel: string
  vectorDbHost: string
  vectorDbPort: number
  vectorDbDatabase: string
  vectorDbUser: string
  vectorDbPassword: string
  completionConfigName: string
  embeddingConfigName: string
  vectorDbName: string
  knowledgeBaseName: string
  agentName: string
  keepResources: boolean
  ragasDockerImage: string
  ragasMinContextPrecision?: number
  ragasMinContextRecall?: number
  ragasMinFaithfulness?: number
  ragasMinAnswerRelevancy?: number
  ragasMinAnswerCorrectness?: number
  ragasThreshold?: number
}

function color(code: number, text: string) {
  return `\x1b[${code}m${text}\x1b[0m`
}

const green = (text: string) => color(32, text)
const red = (text: string) => color(31, text)
const yellow = (text: string) => color(33, text)
const cyan = (text: string) => color(36, text)

function section(text: string) {
  return `\n=== ${text} ===`
}

function wait(ms: number) {
  return new Promise(resolvePromise => setTimeout(resolvePromise, ms))
}

function toAbsolutePath(baseDir: string, candidate: string) {
  if (isAbsolute(candidate)) {
    return candidate
  }
  return resolve(baseDir, candidate)
}

function loadEnvFile() {
  const configured = process.env.RAG_EVAL_ENV_FILE
  const envPath = configured
    ? toAbsolutePath(process.cwd(), configured)
    : resolve(__dirname, ".env")

  if (!existsSync(envPath)) {
    if (configured) {
      throw new Error(`RAG_EVAL_ENV_FILE not found: ${envPath}`)
    }
    return
  }

  dotenv.config({ path: envPath })
  console.log(yellow(`Loaded env: ${envPath}`))
}

function getRequiredEnv(name: string) {
  const value = process.env[name]
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required env var: ${name}`)
  }
  return value.trim()
}

function getOptionalEnv(name: string) {
  const value = process.env[name]
  if (!value || value.trim().length === 0) {
    return undefined
  }
  return value.trim()
}

function parseOptionalNumber(name: string): number | undefined {
  const value = getOptionalEnv(name)
  if (!value) {
    return undefined
  }
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid ${name}: ${value}`)
  }
  return parsed
}

function getRuntimeEnv(): RuntimeEnv {
  const vectorDbPortRaw = getRequiredEnv("RAG_EVAL_VECTORDB_PORT")
  const vectorDbPort = Number(vectorDbPortRaw)
  if (!Number.isInteger(vectorDbPort) || vectorDbPort <= 0) {
    throw new Error(
      `Invalid RAG_EVAL_VECTORDB_PORT: ${vectorDbPortRaw}. Must be a positive integer.`
    )
  }

  return {
    budibaseBaseUrl: getRequiredEnv("BUDIBASE_BASE_URL"),
    appId: getRequiredEnv("RAG_EVAL_APP_ID"),
    budibaseUsername: getRequiredEnv("BUDIBASE_USERNAME"),
    budibasePassword: getRequiredEnv("BUDIBASE_PASSWORD"),
    provider: getRequiredEnv("RAG_EVAL_PROVIDER"),
    openAIKey: getRequiredEnv("OPENAI_API_KEY"),
    openAIBaseUrl: getRequiredEnv("OPENAI_BASE_URL"),
    chatModel: getOptionalEnv("CHAT_MODEL") || "gpt-4o-mini",

    vectorDbHost: getRequiredEnv("RAG_EVAL_VECTORDB_HOST"),
    vectorDbPort,
    vectorDbDatabase: getRequiredEnv("RAG_EVAL_VECTORDB_DATABASE"),
    vectorDbUser: getRequiredEnv("RAG_EVAL_VECTORDB_USER"),
    vectorDbPassword: getRequiredEnv("RAG_EVAL_VECTORDB_PASSWORD"),
    completionConfigName:
      getOptionalEnv("RAG_EVAL_COMPLETION_CONFIG_NAME") ||
      "RAG Eval Completion",
    embeddingConfigName:
      getOptionalEnv("RAG_EVAL_EMBEDDING_CONFIG_NAME") || "RAG Eval Embedding",
    vectorDbName:
      getOptionalEnv("RAG_EVAL_VECTORDB_NAME") || "RAG Eval Vector DB",
    knowledgeBaseName:
      getOptionalEnv("RAG_EVAL_KB_NAME") || "RAG Eval Knowledge Base",
    agentName: getOptionalEnv("RAG_EVAL_AGENT_NAME") || "RAG Eval Agent",
    keepResources: getOptionalEnv("RAG_EVAL_KEEP_RESOURCES") === "1",
    ragasDockerImage:
      getOptionalEnv("RAG_EVAL_RAGAS_DOCKER_IMAGE") || "ragas-app",
    ragasMinContextPrecision:
      parseOptionalNumber("RAG_EVAL_RAGAS_MIN_CONTEXT_PRECISION") || 0.75,
    ragasMinContextRecall:
      parseOptionalNumber("RAG_EVAL_RAGAS_MIN_CONTEXT_RECALL") || 0.9,
    ragasMinFaithfulness:
      parseOptionalNumber("RAG_EVAL_RAGAS_MIN_FAITHFULNESS") || 0.75,
    ragasMinAnswerRelevancy:
      parseOptionalNumber("RAG_EVAL_RAGAS_MIN_ANSWER_RELEVANCY") || 0.7,
    ragasMinAnswerCorrectness:
      parseOptionalNumber("RAG_EVAL_RAGAS_MIN_ANSWER_CORRECTNESS") || 0.7,
    ragasThreshold: parseOptionalNumber("RAG_EVAL_RAGAS_THRESHOLD"),
  }
}

function parseEvalFile(evalFilePath: string): EvalFile {
  if (!existsSync(evalFilePath)) {
    throw new Error(`Eval file not found: ${evalFilePath}`)
  }
  const parsed = JSON.parse(readFileSync(evalFilePath, "utf-8")) as EvalFile
  if (!Array.isArray(parsed.cases) || parsed.cases.length === 0) {
    throw new Error("Eval file must include at least one case in 'cases'")
  }
  return parsed
}

function getMimeType(filename: string) {
  const ext = extname(filename).toLowerCase()
  if (ext === ".pdf") {
    return "application/pdf"
  }
  if (ext === ".md" || ext === ".markdown") {
    return "text/markdown"
  }
  if (ext === ".yaml" || ext === ".yml") {
    return "application/x-yaml"
  }
  return "text/plain"
}

class ApiClient {
  private baseUrl: string
  private token = ""
  private appId = ""
  private csrfToken = ""

  constructor(
    baseUrl: string,
    private targetAppId: string,
    private username: string,
    private password: string
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, "")
  }

  async init() {
    const loginResponse = await fetch(
      `${this.baseUrl}/api/global/auth/default/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
        }),
      }
    )
    if (!loginResponse.ok) {
      const body = await loginResponse.text()
      throw new Error(`Login failed (${loginResponse.status}): ${body}`)
    }

    const token =
      loginResponse.headers.get("x-budibase-token") ||
      loginResponse.headers.get("token")
    if (!token) {
      throw new Error("No auth token returned by login route")
    }
    this.token = token

    const apps = await this.request<Array<{ appId?: string; _id?: string }>>(
      "GET",
      "/api/applications?status=all",
      undefined,
      false
    )
    const appIds = apps.map(app => app.appId || app._id).filter(Boolean)
    if (!appIds.includes(this.targetAppId)) {
      throw new Error(
        `Configured app ${this.targetAppId} was not found. Available apps: ${appIds.join(", ")}`
      )
    }
    this.appId = this.targetAppId

    const self = await this.request<{ csrfToken?: string }>(
      "GET",
      "/api/self",
      undefined,
      true
    )
    if (!self.csrfToken) {
      throw new Error("Unable to fetch csrfToken from /api/self")
    }
    this.csrfToken = self.csrfToken
  }

  clearSession() {
    this.token = ""
    this.csrfToken = ""
    this.appId = ""
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

  async requestStream(path: string, body: unknown): Promise<void> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-budibase-token": this.token,
      "x-budibase-app-id": this.appId,
      "x-csrf-token": this.csrfToken,
    }
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
    if (!response.ok) {
      const text = await response.text()
      throw new Error(
        `POST ${path} failed (${response.status}): ${text || "<empty>"}`
      )
    }
    if (!response.body) {
      return
    }
    const reader = response.body.getReader()
    while (true) {
      const { done } = await reader.read()
      if (done) {
        break
      }
    }
  }

  async uploadKnowledgeBaseFile(
    knowledgeBaseId: string,
    filename: string,
    content: Buffer,
    contentType: string
  ): Promise<UploadedFile> {
    const headers: Record<string, string> = {
      "x-budibase-token": this.token,
      "x-budibase-app-id": this.appId,
      "x-csrf-token": this.csrfToken,
    }
    const formData = new FormData()
    formData.append(
      "file",
      new Blob([content as any], { type: contentType }),
      filename
    )

    const response = await fetch(
      `${this.baseUrl}/api/knowledge-base/${knowledgeBaseId}/files`,
      {
        method: "POST",
        headers,
        body: formData,
      }
    )
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
        `POST /api/knowledge-base/${knowledgeBaseId}/files failed (${response.status}): ${text || "<empty>"}`
      )
    }
    if (!payload?.file) {
      throw new Error(`Unexpected upload response: ${text || "<empty>"}`)
    }
    return payload.file as UploadedFile
  }
}

function extractAssistantText(chat: ChatConversation) {
  const assistantMessages = (chat.messages || []).filter(
    message => message.role === "assistant"
  )
  const last = assistantMessages[assistantMessages.length - 1]
  if (!last?.parts) {
    return ""
  }
  return last.parts
    .filter(part => part.type === "text" && part.text)
    .map(part => part.text || "")
    .join("")
    .trim()
}

function extractRagSourceHints(chat: ChatConversation) {
  const assistantMessages = (chat.messages || []).filter(
    message => message.role === "assistant"
  )
  const last = assistantMessages[assistantMessages.length - 1]
  const ragSources = last?.metadata?.ragSources || []
  return ragSources
    .map(source => source.filename || source.sourceId || "")
    .filter(Boolean)
}

function normalizeText(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim()
}

function evaluateDeterministicExpectation(
  answerText: string,
  sourceHints: string[],
  expectation?: EvalExpectation
) {
  if (!expectation) {
    return { passed: true, detail: "No expectation set" }
  }

  const normalizedAnswer = normalizeText(answerText)
  const normalizedSources = sourceHints.map(source => source.toLowerCase())
  const errors: string[] = []

  if (expectation.expectNoContext && sourceHints.length > 0) {
    errors.push(
      `Expected no retrieved sources, but got: ${sourceHints.join(", ")}`
    )
  }

  if (expectation.containsAny?.length) {
    const anyMatch = expectation.containsAny.some(needle =>
      normalizedAnswer.includes(normalizeText(needle))
    )
    if (!anyMatch) {
      errors.push(
        `Missing any-of expected text: ${expectation.containsAny.join(" | ")}`
      )
    }
  }

  if (expectation.containsAll?.length) {
    const missing = expectation.containsAll.filter(
      needle => !normalizedAnswer.includes(normalizeText(needle))
    )
    if (missing.length > 0) {
      errors.push(`Missing expected text: ${missing.join(", ")}`)
    }
  }

  if (expectation.sourceIncludesAny?.length) {
    const anySource = expectation.sourceIncludesAny.some(needle => {
      const normalizedNeedle = needle.toLowerCase()
      return normalizedSources.some(source => source.includes(normalizedNeedle))
    })
    if (!anySource) {
      errors.push(
        `Missing expected source hint: ${expectation.sourceIncludesAny.join(" | ")}`
      )
    }
  }

  return {
    passed: errors.length === 0,
    detail: errors.length === 0 ? "OK" : errors.join("; "),
  }
}

function resolveReference(testCase: EvalCase) {
  if (testCase.reference?.trim()) {
    return testCase.reference.trim()
  }
  const containsAll = testCase.expectation?.containsAll || []
  if (containsAll.length > 0) {
    return containsAll.join(". ")
  }
  const containsAny = testCase.expectation?.containsAny || []
  if (containsAny.length > 0) {
    return containsAny[0]
  }
  return undefined
}

async function waitForKnowledgeBaseFilesReady(
  api: ApiClient,
  knowledgeBaseId: string,
  requiredFilenames: string[]
) {
  const timeoutMs = 180_000
  const startedAt = Date.now()
  while (Date.now() - startedAt < timeoutMs) {
    const result = await api.request<{ files: UploadedFile[] }>(
      "GET",
      `/api/knowledge-base/${knowledgeBaseId}/files`
    )
    const files = result.files || []
    const requiredStatuses = requiredFilenames.map(filename => {
      const candidates = files.filter(file => file.filename === filename)
      return {
        filename,
        ready: candidates.some(file => file.status === "ready"),
        failed: candidates.filter(file => file.status === "failed"),
      }
    })

    const readyCount = requiredStatuses.filter(status => status.ready).length
    const failed = requiredStatuses.flatMap(status =>
      status.ready ? [] : status.failed
    )

    if (failed.length > 0) {
      const details = failed
        .map(
          file => `${file.filename}: ${file.errorMessage || "unknown error"}`
        )
        .join(", ")
      throw new Error(`Knowledge base file ingestion failed: ${details}`)
    }

    if (readyCount === requiredFilenames.length) {
      return
    }

    await wait(1500)
  }

  throw new Error(
    `Timed out waiting for knowledge base ingestion after ${timeoutMs}ms`
  )
}

async function cleanupResources(api: ApiClient, created: CreatedResources) {
  if (created.agentCreated && created.agentId) {
    try {
      await api.request("DELETE", `/api/agent/${created.agentId}`)
    } catch (error) {
      console.warn(
        yellow(`Cleanup warning (agent): ${(error as any)?.message || error}`)
      )
    }
  }
  if (created.knowledgeBaseCreated && created.knowledgeBaseId) {
    try {
      await api.request(
        "DELETE",
        `/api/knowledge-base/${created.knowledgeBaseId}`
      )
    } catch (error) {
      console.warn(
        yellow(
          `Cleanup warning (knowledge base): ${(error as any)?.message || error}`
        )
      )
    }
  }
  if (created.vectorDbCreated && created.vectorDbId) {
    try {
      await api.request("DELETE", `/api/vectordb/${created.vectorDbId}`)
    } catch (error) {
      console.warn(
        yellow(
          `Cleanup warning (vector DB): ${(error as any)?.message || error}`
        )
      )
    }
  }
  if (created.embeddingConfigCreated && created.embeddingConfigId) {
    try {
      await api.request("DELETE", `/api/configs/${created.embeddingConfigId}`)
    } catch (error) {
      console.warn(
        yellow(
          `Cleanup warning (embedding config): ${(error as any)?.message || error}`
        )
      )
    }
  }
  if (created.completionConfigCreated && created.completionConfigId) {
    try {
      await api.request("DELETE", `/api/configs/${created.completionConfigId}`)
    } catch (error) {
      console.warn(
        yellow(
          `Cleanup warning (completion config): ${(error as any)?.message || error}`
        )
      )
    }
  }
}

function shouldIgnoreAttachAgentError(error: unknown) {
  const rawMessage = (error as any)?.message
  const message = typeof rawMessage === "string" ? rawMessage.toLowerCase() : ""
  return (
    message.includes("already") &&
    (message.includes("agent") || message.includes("exists"))
  )
}

function findByName<T extends { name?: string }>(items: T[], name: string) {
  const normalized = name.trim().toLowerCase()
  return items.find(item => item.name?.trim().toLowerCase() === normalized)
}

function withSettingsSuffix(baseName: string, suffix: string): string {
  return `${baseName} ${suffix}`
}

function mean(numbers: number[]) {
  if (numbers.length === 0) {
    return 0
  }
  return numbers.reduce((acc, n) => acc + n, 0) / numbers.length
}

function evaluateMetricRails(
  runtimeEnv: RuntimeEnv,
  aggregate: Record<string, number>
) {
  const checks: Array<{
    metricName: string
    min?: number
  }> = [
    {
      metricName: "context_precision",
      min: runtimeEnv.ragasMinContextPrecision,
    },
    {
      metricName: "context_recall",
      min: runtimeEnv.ragasMinContextRecall,
    },
    {
      metricName: "faithfulness",
      min: runtimeEnv.ragasMinFaithfulness,
    },
    {
      metricName: "answer_relevancy",
      min: runtimeEnv.ragasMinAnswerRelevancy,
    },
    {
      metricName: "answer_correctness",
      min: runtimeEnv.ragasMinAnswerCorrectness,
    },
  ]

  const failures: string[] = []
  for (const check of checks) {
    if (typeof check.min !== "number") {
      continue
    }
    const value = aggregate[check.metricName]
    if (typeof value !== "number") {
      failures.push(
        `${check.metricName}: missing metric, expected >= ${check.min.toFixed(4)}`
      )
      continue
    }
    if (value < check.min) {
      failures.push(
        `${check.metricName}: ${value.toFixed(4)} < ${check.min.toFixed(4)}`
      )
    }
  }

  return failures
}

function runRagas(runtimeEnv: RuntimeEnv, samples: RagasSample[]): RagasOutput {
  const outputDir = tmpdir()

  const runId = `${Date.now()}-${Math.random().toString(16).slice(2)}`

  const inputPath = join(outputDir, `ragas-input-${runId}.json`)
  const outputPath = join(outputDir, `ragas-output-${runId}.json`)

  writeFileSync(inputPath, JSON.stringify({ samples }, null, 2), "utf-8")
  console.log(cyan(`RAGAS input path: ${inputPath}`))
  console.log(cyan(`RAGAS output path: ${outputPath}`))

  const executed = spawnSync(
    "docker",
    [
      "run",
      "--rm",
      "-e",
      `OPENAI_API_KEY=${runtimeEnv.openAIKey}`,
      "-e",
      `OPENAI_BASE_URL=${runtimeEnv.openAIBaseUrl}`,
      "-e",
      `OPENAI_API_BASE=${runtimeEnv.openAIBaseUrl}`,
      "-v",
      `${outputDir}:/work`,
      "-v",
      `${__dirname}:/runner`,
      runtimeEnv.ragasDockerImage,
      "sh",
      "-lc",
      [
        `python /runner/ragas_runner.py /work/${basename(inputPath)} /work/${basename(outputPath)}`,
      ].join(" && "),
    ],
    {
      encoding: "utf-8",
    }
  )

  if (executed.error) {
    throw executed.error
  }
  if (executed.status !== 0) {
    const stderr = executed.stderr?.trim() || "<empty>"
    const stdout = executed.stdout?.trim() || "<empty>"
    throw new Error(
      `RAGAS runner failed with code ${executed.status}\nstdout:\n${stdout}\nstderr:\n${stderr}`
    )
  }

  if (!existsSync(outputPath)) {
    throw new Error("RAGAS runner did not create output file")
  }

  return JSON.parse(readFileSync(outputPath, "utf-8")) as RagasOutput
}

async function main() {
  loadEnvFile()
  const runtimeEnv = getRuntimeEnv()

  const dataDir = __dirname
  const evalFilePath = toAbsolutePath(
    dataDir,
    process.env.RAG_EVAL_FILE || "rag-evals.json"
  )
  const evalConfig = parseEvalFile(evalFilePath)
  const embeddingModel = evalConfig.embedding?.model || "text-embedding-3-small"

  if (embeddingModel !== "text-embedding-3-small") {
    throw new Error(
      `Unsupported embedding model: ${embeddingModel}. Currently only text-embedding-3-small is supported.`
    )
  }

  const chatModel = runtimeEnv.chatModel

  console.log(section("RAG API Evals (RAGAS)"))
  console.log(cyan(`Eval file: ${evalFilePath}`))
  console.log(cyan(`Embedding model: ${embeddingModel}`))
  console.log(cyan(`Chat model: ${chatModel}`))

  const documentPaths = evalConfig.documents.map(d => join(dataDir, d))
  if (documentPaths.length === 0) {
    throw new Error(`No supported documents found in: ${dataDir}`)
  }
  console.log(cyan(`Documents: ${documentPaths.length}`))

  const docTextByFilename = new Map<string, string>()
  const docSignatures: string[] = []
  for (const path of documentPaths) {
    const text = readFileSync(path).toString("utf-8")
    const contentHash = createHash("sha256")
      .update(text)
      .digest("hex")
      .slice(0, 16)
    docSignatures.push(`${path}:${contentHash}`)
    docTextByFilename.set(basename(path), text)
  }
  docSignatures.sort((a, b) => a.localeCompare(b))

  const settingsSuffix = createHash("sha256")
    .update(
      JSON.stringify({
        provider: runtimeEnv.provider,
        chatModel,
        embeddingModel,
        vectorDbHost: runtimeEnv.vectorDbHost,
        vectorDbPort: runtimeEnv.vectorDbPort,
        vectorDbDatabase: runtimeEnv.vectorDbDatabase,
        vectorDbUser: runtimeEnv.vectorDbUser,
        documents: docSignatures,
      })
    )
    .digest("hex")
    .slice(0, 12)

  const completionConfigName = withSettingsSuffix(
    runtimeEnv.completionConfigName,
    settingsSuffix
  )
  const embeddingConfigName = withSettingsSuffix(
    runtimeEnv.embeddingConfigName,
    settingsSuffix
  )
  const vectorDbName = withSettingsSuffix(
    runtimeEnv.vectorDbName,
    settingsSuffix
  )
  const knowledgeBaseName = withSettingsSuffix(
    runtimeEnv.knowledgeBaseName,
    settingsSuffix
  )
  const agentName = withSettingsSuffix(runtimeEnv.agentName, settingsSuffix)

  console.log(cyan(`Settings scope suffix: ${settingsSuffix}`))
  console.log(
    cyan(
      "Using mandatory unique resource names per provider/model/vector DB/doc set"
    )
  )

  const api = new ApiClient(
    runtimeEnv.budibaseBaseUrl,
    runtimeEnv.appId,
    runtimeEnv.budibaseUsername,
    runtimeEnv.budibasePassword
  )
  await api.init()

  const created: CreatedResources = {}
  try {
    console.log(section("Provisioning"))
    const configs = await api.request<any[]>("GET", "/api/configs")

    const existingCompletionConfig = findByName(configs, completionConfigName)
    if (existingCompletionConfig?._id) {
      created.completionConfigId = existingCompletionConfig._id
      console.log(`Reusing completion config: ${completionConfigName}`)
    } else {
      const completionConfig = await api.request<any>("POST", "/api/configs", {
        name: completionConfigName,
        provider: runtimeEnv.provider,
        model: chatModel,
        credentialsFields: {
          api_key: runtimeEnv.openAIKey,
          api_base: runtimeEnv.openAIBaseUrl,
        },
        configType: AIConfigType.COMPLETIONS,
      })
      created.completionConfigId = completionConfig._id
      created.completionConfigCreated = true
      console.log(`Created completion config: ${completionConfigName}`)
    }

    const existingEmbeddingConfig = findByName(configs, embeddingConfigName)
    if (existingEmbeddingConfig?._id) {
      created.embeddingConfigId = existingEmbeddingConfig._id
      console.log(`Reusing embedding config: ${embeddingConfigName}`)
    } else {
      const embeddingConfig = await api.request<any>("POST", "/api/configs", {
        name: embeddingConfigName,
        provider: runtimeEnv.provider,
        model: embeddingModel,
        credentialsFields: {
          api_key: runtimeEnv.openAIKey,
          api_base: runtimeEnv.openAIBaseUrl,
        },
        configType: AIConfigType.EMBEDDINGS,
      })
      created.embeddingConfigId = embeddingConfig._id
      created.embeddingConfigCreated = true
      console.log(`Created embedding config: ${embeddingConfigName}`)
    }

    const vectorDbs = await api.request<any[]>("GET", "/api/vectordb")
    const existingVectorDb = findByName(vectorDbs, vectorDbName)
    if (existingVectorDb?._id) {
      created.vectorDbId = existingVectorDb._id
      console.log(`Reusing vector DB: ${vectorDbName}`)
    } else {
      const vectorDb = await api.request<any>("POST", "/api/vectordb", {
        name: vectorDbName,
        provider: "pgvector",
        host: runtimeEnv.vectorDbHost,
        port: runtimeEnv.vectorDbPort,
        database: runtimeEnv.vectorDbDatabase,
        user: runtimeEnv.vectorDbUser,
        password: runtimeEnv.vectorDbPassword,
      })
      created.vectorDbId = vectorDb._id
      created.vectorDbCreated = true
      console.log(`Created vector DB: ${vectorDbName}`)
    }

    const knowledgeBases = await api.request<any[]>(
      "GET",
      "/api/knowledge-base"
    )
    const existingKnowledgeBase = findByName(knowledgeBases, knowledgeBaseName)
    if (existingKnowledgeBase?._id) {
      created.knowledgeBaseId = existingKnowledgeBase._id
      console.log(`Reusing knowledge base: ${knowledgeBaseName}`)
    } else {
      const knowledgeBase = await api.request<any>(
        "POST",
        "/api/knowledge-base",
        {
          name: knowledgeBaseName,
          embeddingModel: created.embeddingConfigId,
          vectorDb: created.vectorDbId,
        }
      )
      created.knowledgeBaseId = knowledgeBase._id
      created.knowledgeBaseCreated = true
      console.log(`Created knowledge base: ${knowledgeBaseName}`)
    }

    const agentsResponse = await api.request<{ agents: any[] }>(
      "GET",
      "/api/agent"
    )
    const agents = agentsResponse.agents || []
    const existingAgent = findByName(agents, agentName)
    if (existingAgent?._id) {
      created.agentId = existingAgent._id
      console.log(`Reusing agent: ${agentName}`)
    } else {
      const agent = await api.request<any>("POST", "/api/agent", {
        name: agentName,
        description: "RAG eval agent",
        aiconfig: created.completionConfigId,
        knowledgeBases: [created.knowledgeBaseId],
        live: true,
      })
      created.agentId = agent._id
      created.agentCreated = true
      console.log(`Created agent: ${agentName}`)
    }

    const chatApp = await api.request<any>("GET", "/api/chatapps")
    const chatAppId = chatApp?._id
    if (!chatAppId) {
      throw new Error("Could not resolve chat app ID")
    }

    try {
      await api.request("POST", `/api/chatapps/${chatAppId}/agent`, {
        agentId: created.agentId,
      })
    } catch (error) {
      if (!shouldIgnoreAttachAgentError(error)) {
        throw error
      }
      console.log(
        yellow(
          `Agent ${created.agentId} already attached to chat app ${chatAppId}, continuing`
        )
      )
    }

    console.log(section("Uploading Docs"))
    const existingFilesResponse = await api.request<{ files: UploadedFile[] }>(
      "GET",
      `/api/knowledge-base/${created.knowledgeBaseId!}/files`
    )
    const existingFiles = existingFilesResponse.files || []
    const requiredFilenames: string[] = []

    for (const docPath of documentPaths) {
      const filename = relative(dataDir, docPath) || docPath
      requiredFilenames.push(filename)
      const alreadyPresent = existingFiles.some(
        file =>
          file.filename === filename &&
          (file.status === "ready" || file.status === "processing")
      )
      if (alreadyPresent) {
        console.log(`Skipping upload (already present): ${filename}`)
        continue
      }
      const fileBuffer = readFileSync(docPath)
      await api.uploadKnowledgeBaseFile(
        created.knowledgeBaseId!,
        filename,
        fileBuffer,
        getMimeType(docPath)
      )
      console.log(`Uploaded: ${filename}`)
    }

    await waitForKnowledgeBaseFilesReady(
      api,
      created.knowledgeBaseId!,
      requiredFilenames
    )

    console.log(section("Collecting Responses"))
    const samples: RagasSample[] = []
    let guardrailTotal = 0
    let guardrailPassed = 0
    let guardrailFailed = false

    for (const testCase of evalConfig.cases) {
      const createdConversation = await api.request<any>(
        "POST",
        `/api/chatapps/${chatAppId}/conversations`,
        {
          chatAppId,
          agentId: created.agentId,
          title: `RAGAS ${testCase.id}`,
        }
      )

      const chatConversationId = createdConversation._id
      await api.requestStream(
        `/api/chatapps/${chatAppId}/conversations/${chatConversationId}/stream`,
        {
          _id: chatConversationId,
          chatAppId,
          agentId: created.agentId,
          messages: [
            {
              id: `${testCase.id}-user`,
              role: "user",
              parts: [{ type: "text", text: testCase.question }],
            },
          ],
        }
      )

      let conversation: ChatConversation | undefined
      for (let attempt = 0; attempt < 8; attempt += 1) {
        const fetched = await api.request<ChatConversation>(
          "GET",
          `/api/chatapps/${chatAppId}/conversations/${chatConversationId}`
        )
        if (
          (fetched.messages || []).some(message => message.role === "assistant")
        ) {
          conversation = fetched
          break
        }
        await wait(750)
      }

      if (!conversation) {
        throw new Error(
          `Conversation ${chatConversationId} did not persist assistant response`
        )
      }

      const answer = extractAssistantText(conversation)
      const sourceHints = extractRagSourceHints(conversation)
      const deterministicResult = evaluateDeterministicExpectation(
        answer,
        sourceHints,
        testCase.expectation
      )

      if (testCase.expectation?.expectNoContext) {
        guardrailTotal += 1
        if (deterministicResult.passed) {
          guardrailPassed += 1
          console.log(
            green(`GUARD PASS ${testCase.id}: ${deterministicResult.detail}`)
          )
        } else {
          guardrailFailed = true
          console.log(
            red(`GUARD FAIL ${testCase.id}: ${deterministicResult.detail}`)
          )
        }
        continue
      }

      const contexts = sourceHints
        .map(
          hint =>
            docTextByFilename.get(hint) || docTextByFilename.get(basename(hint))
        )
        .filter((value): value is string => !!value)

      samples.push({
        caseId: testCase.id,
        question: testCase.question,
        answer,
        contexts,
        reference: resolveReference(testCase),
        sourceHints,
      })

      console.log(
        cyan(
          `Collected ${testCase.id}: answer chars=${answer.length}, contexts=${contexts.length}`
        )
      )
    }

    if (guardrailTotal > 0) {
      console.log(section("No-Context Guardrails"))
      console.log(`Total: ${guardrailTotal}`)
      console.log(`Passed: ${guardrailPassed}`)
      console.log(`Failed: ${guardrailTotal - guardrailPassed}`)
    }

    let failed = guardrailFailed

    if (samples.length === 0) {
      console.log(
        yellow(
          "Skipping RAGAS aggregate scoring because no informational RAG samples were collected"
        )
      )
    } else {
      console.log(section("RAGAS Scoring"))
      const ragas = runRagas(runtimeEnv, samples)
      const aggregate = ragas.aggregate || {}
      const metricNames = Object.keys(aggregate).sort()

      if (metricNames.length === 0) {
        throw new Error("RAGAS returned no aggregate metrics")
      }

      for (const metricName of metricNames) {
        const value = aggregate[metricName]
        console.log(`${metricName}: ${value.toFixed(4)}`)
      }

      const overall = mean(metricNames.map(name => aggregate[name]))
      console.log(cyan(`overall_mean: ${overall.toFixed(4)}`))
      const railFailures = evaluateMetricRails(runtimeEnv, aggregate)

      if (
        typeof runtimeEnv.ragasThreshold === "number" &&
        overall < runtimeEnv.ragasThreshold
      ) {
        failed = true
        console.log(
          red(
            `RAGAS overall mean ${overall.toFixed(4)} is below threshold ${runtimeEnv.ragasThreshold.toFixed(4)}`
          )
        )
      }

      for (const failure of railFailures) {
        failed = true
        console.log(red(`RAGAS rail failed: ${failure}`))
      }
    }

    if (failed) {
      process.exitCode = 1
    } else {
      console.log(green("RAGAS scoring completed"))
    }
  } finally {
    if (!runtimeEnv.keepResources) {
      await cleanupResources(api, created)
    } else {
      console.log(
        yellow("Keeping resources because RAG_EVAL_KEEP_RESOURCES=1 is set")
      )
      console.log(cyan(`Agent ID: ${created.agentId || "<none>"}`))
      console.log(
        cyan(`Knowledge Base ID: ${created.knowledgeBaseId || "<none>"}`)
      )
      console.log(cyan(`Vector DB ID: ${created.vectorDbId || "<none>"}`))
    }
    api.clearSession()
  }
}

main().catch(error => {
  const message =
    typeof error === "string"
      ? error
      : (error as any)?.message || String(error || "Unknown error")
  console.error(red(`RAGAS evals failed: ${message}`))
  process.exit(1)
})
