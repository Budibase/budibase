import { ai } from "@budibase/pro"
import {
  GenerateTablesRequest,
  GenerateTablesResponse,
  UserCtx,
} from "@budibase/types"
import environment from "../../../environment"
import sdk from "../../../sdk"

export async function generateTables(
  ctx: UserCtx<GenerateTablesRequest, GenerateTablesResponse>
) {
  const timeoutMs = parseInt(environment.TABLE_GENERATION_TIMEOUT_MS, 10)
  if (!isNaN(timeoutMs) && timeoutMs > 0) {
    ctx.req.setTimeout(timeoutMs)
    ctx.res.setTimeout(timeoutMs)
  }

  const { prompt } = ctx.request.body
  let heartbeat: NodeJS.Timeout | undefined

  const sendEvent = (event: Record<string, any>) => {
    ctx.res.write(`data: ${JSON.stringify(event)}\n\n`)
  }

  try {
    // Keep long-running stream requests alive.
    ctx.req.setTimeout(0)
    ctx.res.setTimeout(0)

    ctx.status = 200
    ctx.set("Content-Type", "text/event-stream")
    ctx.set("Cache-Control", "no-cache")
    ctx.set("Connection", "keep-alive")
    ctx.res.setHeader("X-Accel-Buffering", "no")
    ctx.res.setHeader("Transfer-Encoding", "chunked")
    ctx.respond = false

    // Send periodic SSE comments to prevent idle socket timeouts.
    heartbeat = setInterval(() => {
      if (!ctx.res.writableEnded) {
        ctx.res.write(":\n\n")
      }
    }, 15000)

    const llm = await sdk.ai.llm.getDefaultLLMOrThrow({
      reasoningEffort: "low",
    })
    const tableGenerator = await ai.TableGeneration.init(llm, {
      generateTablesDelegate: sdk.ai.helpers.generateTables,
      generateDataDelegate: sdk.ai.helpers.generateRows,
    })

    sendEvent({ type: "progress", message: "Starting table generation..." })
    const createdTables = await tableGenerator.generate(
      prompt,
      ctx.user._id || "",
      message => sendEvent({ type: "progress", message })
    )
    sendEvent({ type: "result", createdTables })
    sendEvent({ type: "done" })
    if (heartbeat) {
      clearInterval(heartbeat)
    }
    ctx.res.end()
  } catch (error: any) {
    if (heartbeat) {
      clearInterval(heartbeat)
    }
    console.error("Error generating tables", {
      message: error?.message,
      stack: error?.stack,
    })
    if (ctx.res.headersSent) {
      sendEvent({
        type: "error",
        message: error?.message || "Error generating tables",
      })
      ctx.res.end()
      return
    }
    ctx.throw(error?.status || 500, error?.message || "Error generating tables")
  }
}
