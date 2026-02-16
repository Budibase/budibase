import { context, db as dbCore } from "@budibase/backend-core"
import * as serverDb from "../../src/db"
import { runAutomationCase, runChatCase } from "./runtime"
import { scoreCase } from "./scoring"
import { seedEvalResources } from "./seed"
import { AgentEvalCase, AgentEvalCaseResult } from "./types"

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

export async function runPromptfooEvalCase({
  modelId,
  provider,
  testCase,
}: {
  modelId: string
  provider: "openai" | "mistral"
  testCase: AgentEvalCase
}): Promise<AgentEvalCaseResult> {
  ensureEnvironment()
  serverDb.init()

  const appId = dbCore.getDevWorkspaceID(dbCore.generateWorkspaceID())
  let trace

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
    trace,
  })

  return {
    caseId: testCase.id,
    caseTitle: testCase.title,
    surface: testCase.surface,
    modelId,
    provider,
    trace,
    score,
  }
}
