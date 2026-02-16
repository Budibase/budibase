import fs from "fs"
import path from "path"
import { context, db as dbCore } from "@budibase/backend-core"
import * as serverDb from "../../src/db"
import { getCases } from "./cases"
import { resolveModelConfigs, validateProviderSecrets } from "./models"
import { runAutomationCase, runChatCase } from "./runtime"
import { scoreCase } from "./scoring"
import { seedEvalResources } from "./seed"
import {
  AgentEvalCase,
  AgentEvalCaseResult,
  EvalMode,
  EvalReport,
  EvalSummary,
  NormalizedAgentTrace,
} from "./types"

interface EvalGateConfig {
  enforce: boolean
  minPassRate: number
  maxIncompleteToolCalls: number
  maxToolErrors: number
  minAvgQualityRubricScore?: number
}

function parseMode(): EvalMode {
  const modeArg = process.argv.find(arg => arg.startsWith("--mode="))
  const mode = (modeArg?.split("=")[1] || process.env.AI_EVAL_MODE || "smoke") as EvalMode

  if (mode !== "smoke" && mode !== "full") {
    throw new Error(`Invalid mode: ${mode}. Expected \"smoke\" or \"full\".`)
  }

  return mode
}

function ensureEnvironment() {
  process.env.DISABLE_THREADING = process.env.DISABLE_THREADING || "1"
  process.env.SELF_HOSTED = "0"
  if (process.env.MOCK_REDIS) {
    delete process.env.MOCK_REDIS
  }

  if (!process.env.COUCH_DB_URL) {
    process.env.COUCH_DB_URL = "http://127.0.0.1:4005"
  }
  if (!process.env.COUCH_DB_SQL_URL) {
    process.env.COUCH_DB_SQL_URL = "http://127.0.0.1:4006"
  }
  if (!process.env.COUCH_DB_USER) {
    process.env.COUCH_DB_USER = "budibase"
  }
  if (!process.env.COUCH_DB_PASSWORD) {
    process.env.COUCH_DB_PASSWORD = "budibase"
  }
  if (!process.env.MINIO_URL) {
    process.env.MINIO_URL = "http://127.0.0.1:4004"
  }
  if (!process.env.MINIO_ACCESS_KEY) {
    process.env.MINIO_ACCESS_KEY = "budibase"
  }
  if (!process.env.MINIO_SECRET_KEY) {
    process.env.MINIO_SECRET_KEY = "budibase"
  }
  if (!process.env.REDIS_URL) {
    process.env.REDIS_URL = "127.0.0.1:6379"
  }
  if (!process.env.REDIS_PASSWORD) {
    process.env.REDIS_PASSWORD = "budibase"
  }
}

function outputDir(): string {
  const baseDir = path.join(process.cwd(), ".artifacts", "ai-evals")
  const runId = new Date().toISOString().replace(/[:.]/g, "-")
  const runDir = path.join(baseDir, runId)
  const latestDir = path.join(baseDir, "latest")

  fs.mkdirSync(runDir, { recursive: true })
  fs.mkdirSync(latestDir, { recursive: true })

  return runDir
}

function parseNumberEnv({
  value,
  name,
}: {
  value: string | undefined
  name: string
}): number | undefined {
  if (value == null || value.trim().length === 0) {
    return
  }

  const parsed = Number(value)
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid numeric value for ${name}: ${value}`)
  }
  return parsed
}

function resolveGateConfig(mode: EvalMode): EvalGateConfig {
  const minPassRateDefault = mode === "smoke" ? 1 : 0.8

  const minPassRate =
    parseNumberEnv({
      value: process.env.AI_EVAL_MIN_PASS_RATE,
      name: "AI_EVAL_MIN_PASS_RATE",
    }) ?? minPassRateDefault
  const maxIncompleteToolCalls =
    parseNumberEnv({
      value: process.env.AI_EVAL_MAX_INCOMPLETE_TOOL_CALLS,
      name: "AI_EVAL_MAX_INCOMPLETE_TOOL_CALLS",
    }) ?? 0
  const maxToolErrors =
    parseNumberEnv({
      value: process.env.AI_EVAL_MAX_TOOL_ERRORS,
      name: "AI_EVAL_MAX_TOOL_ERRORS",
    }) ?? 0
  const minAvgQualityRubricScore = parseNumberEnv({
    value: process.env.AI_EVAL_MIN_QUALITY_RUBRIC_SCORE,
    name: "AI_EVAL_MIN_QUALITY_RUBRIC_SCORE",
  })

  return {
    enforce: process.env.AI_EVAL_ENFORCE !== "0",
    minPassRate,
    maxIncompleteToolCalls,
    maxToolErrors,
    minAvgQualityRubricScore,
  }
}

function evaluateGate(summary: EvalSummary, gate: EvalGateConfig): string[] {
  const failures: string[] = []

  if (summary.metrics.passRate < gate.minPassRate) {
    failures.push(
      `passRate ${(summary.metrics.passRate * 100).toFixed(1)}% is below threshold ${(gate.minPassRate * 100).toFixed(1)}%`
    )
  }
  if (summary.metrics.incompleteToolCalls > gate.maxIncompleteToolCalls) {
    failures.push(
      `incompleteToolCalls ${summary.metrics.incompleteToolCalls} is above threshold ${gate.maxIncompleteToolCalls}`
    )
  }
  if (summary.metrics.toolErrors > gate.maxToolErrors) {
    failures.push(
      `toolErrors ${summary.metrics.toolErrors} is above threshold ${gate.maxToolErrors}`
    )
  }
  if (
    gate.minAvgQualityRubricScore != null &&
    summary.metrics.avgQualityRubricScore < gate.minAvgQualityRubricScore
  ) {
    failures.push(
      `avgQualityRubricScore ${summary.metrics.avgQualityRubricScore.toFixed(2)} is below threshold ${gate.minAvgQualityRubricScore.toFixed(2)}`
    )
  }

  return failures
}

function writeReports({
  runDir,
  report,
}: {
  runDir: string
  report: EvalReport
}) {
  const latestDir = path.join(process.cwd(), ".artifacts", "ai-evals", "latest")

  const json = JSON.stringify(report, null, 2)
  fs.writeFileSync(path.join(runDir, "report.json"), json)
  fs.writeFileSync(path.join(latestDir, "report.json"), json)

  const markdown = renderMarkdown(report)
  fs.writeFileSync(path.join(runDir, "summary.md"), markdown)
  fs.writeFileSync(path.join(latestDir, "summary.md"), markdown)
}

function renderMarkdown(report: EvalReport): string {
  const lines: string[] = []

  lines.push("# Agent Eval Report")
  lines.push("")
  lines.push(`- Mode: ${report.summary.mode}`)
  lines.push(`- Models: ${report.summary.modelIds.join(", ")}`)
  lines.push(`- Cases: ${report.summary.totals.cases}`)
  lines.push(`- Passes: ${report.summary.totals.passes}`)
  lines.push(`- Failures: ${report.summary.totals.failures}`)
  lines.push(`- Pass rate: ${(report.summary.metrics.passRate * 100).toFixed(1)}%`)
  lines.push(
    `- Avg quality rubric score: ${report.summary.metrics.avgQualityRubricScore.toFixed(2)}/5`
  )
  lines.push(`- Incomplete tool calls: ${report.summary.metrics.incompleteToolCalls}`)
  lines.push(`- Tool errors: ${report.summary.metrics.toolErrors}`)

  if (report.summary.warnings.length > 0) {
    lines.push("")
    lines.push("## Warnings")
    lines.push("")
    for (const warning of report.summary.warnings) {
      lines.push(`- ${warning}`)
    }
  }

  lines.push("")
  lines.push("## Case Results")
  lines.push("")
  lines.push("| Model | Surface | Case | Pass | Quality | Notes |")
  lines.push("| --- | --- | --- | --- | --- | --- |")

  for (const result of report.results) {
    const notes = [
      result.score.requiredToolMisses.length
        ? `missing tools: ${result.score.requiredToolMisses.join(", ")}`
        : "",
      result.score.forbiddenToolHits.length
        ? `forbidden tools: ${result.score.forbiddenToolHits.join(", ")}`
        : "",
      result.score.missingRequiredResponseSubstrings.length
        ? "missing required response"
        : "",
      result.trace.error ? `error: ${result.trace.error}` : "",
    ]
      .filter(Boolean)
      .join("; ")

    lines.push(
      `| ${result.modelId} | ${result.surface} | ${result.caseId} | ${result.score.pass ? "PASS" : "FAIL"} | ${result.score.qualityRubricScore.toFixed(2)} | ${notes || "-"} |`
    )
  }

  return lines.join("\n")
}

async function runSingleCase({
  modelId,
  provider,
  testCase,
}: {
  modelId: string
  provider: "openai" | "mistral"
  testCase: AgentEvalCase
}): Promise<AgentEvalCaseResult> {
  const appId = dbCore.getDevWorkspaceID(dbCore.generateWorkspaceID())

  let trace: NormalizedAgentTrace

  await context.doInWorkspaceContext(appId, async () => {
    const seeded = await seedEvalResources({ testCase, modelId })

    if (testCase.surface === "automation") {
      trace = await runAutomationCase({
        appId,
        agentId: seeded.agentId,
        testCase,
      })
    } else {
      trace = await runChatCase({
        chatAppId: seeded.chatAppId,
        agentId: seeded.agentId,
        testCase,
      })
    }
  })

  const score = scoreCase({
    testCase,
    trace: trace!,
  })

  return {
    caseId: testCase.id,
    caseTitle: testCase.title,
    surface: testCase.surface,
    modelId,
    provider,
    trace: trace!,
    score,
  }
}

function buildSummary({
  mode,
  startedAt,
  completedAt,
  modelIds,
  results,
}: {
  mode: EvalMode
  startedAt: Date
  completedAt: Date
  modelIds: string[]
  results: AgentEvalCaseResult[]
}): EvalSummary {
  const passes = results.filter(result => result.score.pass).length
  const failures = results.length - passes

  const qualityScores = results.map(result => result.score.qualityRubricScore)
  const avgQualityRubricScore =
    qualityScores.length > 0
      ? qualityScores.reduce((sum, value) => sum + value, 0) / qualityScores.length
      : 0

  const incompleteToolCalls = results.reduce(
    (sum, result) => sum + result.score.incompleteToolCalls,
    0
  )
  const toolErrors = results.reduce((sum, result) => sum + result.score.toolErrors, 0)

  const warnings: string[] = []

  if (results.length > 0 && passes / results.length < 0.8) {
    warnings.push("Deterministic pass rate is below 80%")
  }
  if (avgQualityRubricScore < 3.8) {
    warnings.push("Average quality rubric score is below 3.8/5")
  }
  if (incompleteToolCalls > 0) {
    warnings.push("One or more cases ended with incomplete tool calls")
  }
  if (toolErrors > 0) {
    warnings.push("One or more tool executions returned output-error")
  }

  return {
    mode,
    startedAt: startedAt.toISOString(),
    completedAt: completedAt.toISOString(),
    durationMs: completedAt.getTime() - startedAt.getTime(),
    modelIds,
    totals: {
      cases: results.length,
      passes,
      failures,
    },
    metrics: {
      passRate: results.length ? passes / results.length : 0,
      avgQualityRubricScore,
      incompleteToolCalls,
      toolErrors,
    },
    warnings,
  }
}

async function main() {
  ensureEnvironment()

  const mode = parseMode()
  const gateConfig = resolveGateConfig(mode)
  const startedAt = new Date()

  const modelConfigs = resolveModelConfigs()
  validateProviderSecrets(modelConfigs)

  serverDb.init()

  const cases = getCases(mode)
  const results: AgentEvalCaseResult[] = []

  for (const model of modelConfigs) {
    for (const testCase of cases) {
      const result = await runSingleCase({
        modelId: model.modelId,
        provider: model.provider,
        testCase,
      })
      results.push(result)

      const status = result.score.pass ? "PASS" : "FAIL"
      console.log(
        `[${status}] model=${result.modelId} surface=${result.surface} case=${result.caseId} latencyMs=${result.trace.latencyMs}`
      )
    }
  }

  const completedAt = new Date()

  const report: EvalReport = {
    summary: buildSummary({
      mode,
      startedAt,
      completedAt,
      modelIds: modelConfigs.map(model => model.modelId),
      results,
    }),
    results,
  }

  const runDir = outputDir()
  writeReports({ runDir, report })

  console.log(`Saved eval artifacts to ${runDir}`)
  console.log(
    `Summary: passRate=${(report.summary.metrics.passRate * 100).toFixed(1)}% failures=${report.summary.totals.failures}`
  )

  if (report.summary.warnings.length > 0) {
    console.log("Warnings:")
    for (const warning of report.summary.warnings) {
      console.log(`- ${warning}`)
    }
  }

  const gateFailures = evaluateGate(report.summary, gateConfig)
  if (gateFailures.length > 0) {
    const details = gateFailures.map(failure => `- ${failure}`).join("\n")
    if (gateConfig.enforce) {
      throw new Error(`Eval quality gate failed:\n${details}`)
    }
    console.log("Eval quality gate failures (non-blocking):")
    console.log(details)
  }
}

main().catch(err => {
  console.error("Agent eval runner failed", err)
  process.exit(1)
})
