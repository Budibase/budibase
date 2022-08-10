import { events } from "@budibase/backend-core"
import { AnalyticsPingRequest, PingSource } from "@budibase/types"
import { DocumentTypes, isDevAppID } from "../../db/utils"
import { context } from "@budibase/backend-core"

export const isEnabled = async (ctx: any) => {
  const enabled = await events.analytics.enabled()
  ctx.body = {
    enabled,
  }
}

export const ping = async (ctx: any) => {
  const body = ctx.request.body as AnalyticsPingRequest
  switch (body.source) {
    case PingSource.APP: {
      const db = context.getAppDB({ skip_setup: true })
      const appInfo = await db.get(DocumentTypes.APP_METADATA)
      let appId = context.getAppId()

      if (isDevAppID(appId)) {
        await events.serve.servedAppPreview(appInfo, body.timezone)
      } else {
        await events.serve.servedApp(appInfo, body.timezone)
      }
      break
    }
    case PingSource.BUILDER: {
      await events.serve.servedBuilder(body.timezone)
      break
    }
  }

  ctx.status = 200
}
