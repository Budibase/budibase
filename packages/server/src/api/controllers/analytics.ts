import { context, events } from "@budibase/backend-core"
import {
  AnalyticsEnabledResponse,
  AnalyticsPingRequest,
  AnalyticsPingResponse,
  Ctx,
  PingSource,
  Workspace,
} from "@budibase/types"
import { DocumentType, isDevWorkspaceID } from "../../db/utils"

export const isEnabled = async (ctx: Ctx<void, AnalyticsEnabledResponse>) => {
  const enabled = await events.analytics.enabled()
  ctx.body = {
    enabled,
  }
}

export const ping = async (
  ctx: Ctx<AnalyticsPingRequest, AnalyticsPingResponse>
) => {
  const body = ctx.request.body

  let pingType: PingSource | undefined
  switch (body.source) {
    case PingSource.APP: {
      const db = context.getWorkspaceDB({ skip_setup: true })
      const appInfo = await db.get<Workspace>(DocumentType.WORKSPACE_METADATA)
      const workspaceId = context.getWorkspaceId()

      if (isDevWorkspaceID(workspaceId)) {
        await events.serve.servedAppPreview(appInfo, body.timezone)
      } else {
        await events.serve.servedApp(appInfo, body.timezone, body.embedded)
      }
      pingType = PingSource.APP
      break
    }
    case PingSource.BUILDER: {
      await events.serve.servedBuilder(body.timezone)
      pingType = PingSource.BUILDER
      break
    }
  }

  ctx.body = {
    message: "pong",
    source: pingType,
  }
}
