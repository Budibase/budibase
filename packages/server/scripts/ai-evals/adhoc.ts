import fs from "fs"
import path from "path"
import { context } from "@budibase/backend-core"
import * as serverDb from "../../src/db"
import { run as runAgentStep } from "../../src/automations/steps/ai/agent"
import {
  extractResponseTextFromMessage,
  extractToolCallsFromMessages,
  extractUsageTotalTokens,
} from "./utils"
import { ToolCallSnapshot } from "./types"

interface CliOptions {
  appId: string
  agentId: string
  prompts: string[]
  outputPath: string
  failOnError: boolean
}

interface AdhocPromptResult {
  prompt: string
  success: boolean
  latencyMs: number
  responseText: string
  error?: string
  usageTotalTokens?: number
  toolCalls: ToolCallSnapshot[]
}

interface AdhocReport {
  appId: string
  agentId: string
  startedAt: string
  completedAt: string
  durationMs: number
  totals: {
    prompts: number
    successes: number
    failures: number
  }
  results: AdhocPromptResult[]
}

function ensureEnvironment() {
  process.env.DISABLE_THREADING = process.env.DISABLE_THREADING || "1"
  process.env.SELF_HOSTED = "0"
  if (process.env.MOCK_REDIS) {
    delete process.env.MOCK_REDIS
  }
  process.env.COUCH_DB_URL = process.env.COUCH_DB_URL || "http://127.0.0.1:4005"
  process.env.COUCH_DB_SQL_URL =
    process.env.COUCH_DB_SQL_URL || "http://127.0.0.1:4006"
  process.env.COUCH_DB_USER = process.env.COUCH_DB_USER || "budibase"
  process.env.COUCH_DB_PASSWORD = process.env.COUCH_DB_PASSWORD || "budibase"
  process.env.MINIO_URL = process.env.MINIO_URL || "http://127.0.0.1:4004"
  process.env.MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY || "budibase"
  process.env.MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY || "budibase"
  process.env.REDIS_URL = process.env.REDIS_URL || "127.0.0.1:6379"
  process.env.REDIS_PASSWORD = process.env.REDIS_PASSWORD || "budibase"
}

function parseValueArg(args: string[], key: string): string | undefined {
  const prefix = `--${key}=`
  const inline = args.find(arg => arg.startsWith(prefix))
  if (inline) {
    return inline.slice(prefix.length).trim()
  }

  const index = args.findIndex(arg => arg === `--${key}`)
  if (index >= 0 && args[index + 1]) {
    return args[index + 1].trim()
  }

  return
}

function parseFlag(args: string[], key: string): boolean {
  return args.includes(`--${key}`)
}

function parseRepeatedPrompts(args: string[]): string[] {
  const prompts: string[] = []
  const prefix = "--prompt="

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]
    if (arg.startsWith(prefix)) {
      const value = arg.slice(prefix.length).trim()
      if (value.length > 0) {
        prompts.push(value)
      }
      continue
    }
    if (arg === "--prompt" && args[i + 1]) {
      const value = args[i + 1].trim()
      if (value.length > 0) {
        prompts.push(value)
      }
      i += 1
    }
  }

  return prompts
}

function readPromptsFile(promptsFilePath?: string): string[] {
  if (!promptsFilePath) {
    return []
  }

  const absolutePath = path.isAbsolute(promptsFilePath)
    ? promptsFilePath
    : path.join(process.cwd(), promptsFilePath)
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Prompts file not found: ${absolutePath}`)
  }

  const content = fs.readFileSync(absolutePath, "utf8")
  return content
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean)
}

function parseCli(): CliOptions {
  const args = process.argv.slice(2)
  if (parseFlag(args, "help") || parseFlag(args, "h")) {
    console.log(
      [
        "Usage:",
        "  yarn eval:agent:adhoc --appId <appId> --agentId <agentId> --prompt \"...\" [--prompt \"...\"]",
        "  yarn eval:agent:adhoc --appId <appId> --agentId <agentId> --promptsFile <path>",
        "",
        "Options:",
        "  --appId <id>            Workspace app ID (e.g. app_dev_...)",
        "  --agentId <id>          Existing agent ID",
        "  --prompt <text>         Prompt to execute (repeat for multiple prompts)",
        "  --promptsFile <path>    File with one prompt per line",
        "  --output <path>         JSON output path",
        "  --noFailOnError         Exit 0 even if one or more prompts fail",
      ].join("\n")
    )
    process.exit(0)
  }

  const appId = parseValueArg(args, "appId")
  const agentId = parseValueArg(args, "agentId")
  const outputPath =
    parseValueArg(args, "output") ||
    path.join(
      process.cwd(),
      ".artifacts",
      "ai-evals",
      "adhoc",
      "latest-report.json"
    )

  if (!appId) {
    throw new Error("Missing required argument: --appId")
  }
  if (!agentId) {
    throw new Error("Missing required argument: --agentId")
  }

  const promptsFromArgs = parseRepeatedPrompts(args)
  const promptsFromFile = readPromptsFile(parseValueArg(args, "promptsFile"))
  const prompts = [...promptsFromArgs, ...promptsFromFile]

  if (prompts.length === 0) {
    throw new Error(
      "At least one prompt is required via --prompt or --promptsFile"
    )
  }

  return {
    appId,
    agentId,
    prompts,
    outputPath,
    failOnError: !parseFlag(args, "noFailOnError"),
  }
}

async function runSinglePrompt({
  appId,
  agentId,
  prompt,
}: {
  appId: string
  agentId: string
  prompt: string
}): Promise<AdhocPromptResult> {
  const startedAt = Date.now()

  try {
    const result = await runAgentStep({
      appId,
      inputs: {
        agentId,
        prompt,
      },
    })

    const responseText =
      result.response || extractResponseTextFromMessage(result.message)
    const toolCalls = result.message
      ? extractToolCallsFromMessages([result.message])
      : []

    return {
      prompt,
      success: result.success,
      latencyMs: Date.now() - startedAt,
      responseText: responseText || "",
      ...(result.success ? {} : { error: result.response || "Agent step failed" }),
      usageTotalTokens: extractUsageTotalTokens(result.usage),
      toolCalls,
    }
  } catch (err: any) {
    return {
      prompt,
      success: false,
      latencyMs: Date.now() - startedAt,
      responseText: "",
      error: err?.message || String(err),
      toolCalls: [],
    }
  }
}

function writeReport(outputPath: string, report: AdhocReport) {
  const absolutePath = path.isAbsolute(outputPath)
    ? outputPath
    : path.join(process.cwd(), outputPath)
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true })
  fs.writeFileSync(absolutePath, JSON.stringify(report, null, 2))
  console.log(`Saved adhoc eval report to ${absolutePath}`)
}

function printResultSummary(report: AdhocReport) {
  console.log(
    `Summary: prompts=${report.totals.prompts} successes=${report.totals.successes} failures=${report.totals.failures}`
  )

  for (const result of report.results) {
    const toolSummary =
      result.toolCalls.length === 0
        ? "(none)"
        : result.toolCalls.map(call => `${call.toolName}:${call.state}`).join(", ")
    const status = result.success ? "PASS" : "FAIL"
    console.log(
      `[${status}] latencyMs=${result.latencyMs} prompt="${result.prompt}"`
    )
    console.log(`  tools=${toolSummary}`)
    if (!result.success && result.error) {
      console.log(`  error=${result.error}`)
    }
    if (result.responseText) {
      console.log(`  response=${result.responseText}`)
    }
  }
}

async function main() {
  ensureEnvironment()
  const options = parseCli()

  serverDb.init()
  const startedAt = new Date()

  const results: AdhocPromptResult[] = []
  await context.doInWorkspaceContext(options.appId, async () => {
    for (const prompt of options.prompts) {
      const result = await runSinglePrompt({
        appId: options.appId,
        agentId: options.agentId,
        prompt,
      })
      results.push(result)
    }
  })

  const completedAt = new Date()
  const successes = results.filter(result => result.success).length
  const report: AdhocReport = {
    appId: options.appId,
    agentId: options.agentId,
    startedAt: startedAt.toISOString(),
    completedAt: completedAt.toISOString(),
    durationMs: completedAt.getTime() - startedAt.getTime(),
    totals: {
      prompts: results.length,
      successes,
      failures: results.length - successes,
    },
    results,
  }

  writeReport(options.outputPath, report)
  printResultSummary(report)

  if (options.failOnError && report.totals.failures > 0) {
    throw new Error(
      `${report.totals.failures} prompt(s) failed. Re-run with --noFailOnError to allow failures.`
    )
  }
}

main().catch(err => {
  console.error("Adhoc eval runner failed", err)
  process.exit(1)
})
