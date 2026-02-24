import { ai } from "@budibase/pro"
import {
  GenerateTablesRequest,
  GenerateTablesResponse,
  UserCtx,
} from "@budibase/types"
import sdk from "../../../sdk"

export async function generateTables(
  ctx: UserCtx<GenerateTablesRequest, GenerateTablesResponse>
) {
  const { prompt } = ctx.request.body

  const sendEvent = (event: Record<string, any>) => {
    ctx.res.write(`data: ${JSON.stringify(event)}\n\n`)
  }

  try {
    const llm = await sdk.ai.llm.getDefaultLLMOrThrow()
    const tableGenerator = await ai.TableGeneration.init(llm, {
      generateTablesDelegate: sdk.ai.helpers.generateTables,
      generateDataDelegate: sdk.ai.helpers.generateRows,
    })

    ctx.status = 200
    ctx.set("Content-Type", "text/event-stream")
    ctx.set("Cache-Control", "no-cache")
    ctx.set("Connection", "keep-alive")
    ctx.res.setHeader("X-Accel-Buffering", "no")
    ctx.res.setHeader("Transfer-Encoding", "chunked")
    ctx.respond = false

    sendEvent({ type: "progress", message: "Starting table generation..." })
    const createdTables = await tableGenerator.generate(
      prompt,
      ctx.user._id || "",
      message => sendEvent({ type: "progress", message })
    )
    sendEvent({ type: "result", createdTables })
    sendEvent({ type: "done" })
    ctx.res.end()
  } catch (error: any) {
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
