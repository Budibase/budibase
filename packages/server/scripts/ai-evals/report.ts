import fs from "fs"
import path from "path"
import { EvalReport } from "./types"

function parseReport(reportPath: string): EvalReport {
  const raw = fs.readFileSync(reportPath, "utf8")
  return JSON.parse(raw) as EvalReport
}

function printSummary(report: EvalReport) {
  const { summary } = report

  console.log(`Mode: ${summary.mode}`)
  console.log(`Models: ${summary.modelIds.join(", ")}`)
  console.log(`Cases: ${summary.totals.cases}`)
  console.log(`Passes: ${summary.totals.passes}`)
  console.log(`Failures: ${summary.totals.failures}`)
  console.log(`Pass rate: ${(summary.metrics.passRate * 100).toFixed(1)}%`)
  console.log(`Avg quality rubric score: ${summary.metrics.avgQualityRubricScore.toFixed(2)}/5`)
  console.log(`Incomplete tool calls: ${summary.metrics.incompleteToolCalls}`)
  console.log(`Tool errors: ${summary.metrics.toolErrors}`)

  if (summary.warnings.length > 0) {
    console.log("Warnings:")
    for (const warning of summary.warnings) {
      console.log(`- ${warning}`)
    }
  }
}

function main() {
  const reportPath =
    process.argv.find(arg => arg.startsWith("--report="))?.split("=")[1] ||
    path.join(process.cwd(), ".artifacts", "ai-evals", "latest", "report.json")

  if (!fs.existsSync(reportPath)) {
    throw new Error(`Eval report not found: ${reportPath}`)
  }

  const report = parseReport(reportPath)
  printSummary(report)
}

main()
