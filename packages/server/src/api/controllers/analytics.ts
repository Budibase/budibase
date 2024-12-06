import { events, context } from "@budibase/backend-core"
import {
  AnalyticsPingRequest,
  App,
  PingSource,
  Ctx,
  AnalyticsEnabledResponse,
} from "@budibase/types"
import { DocumentType, isDevAppID } from "../../db/utils"

export const isEnabled = async (ctx: Ctx<void, AnalyticsEnabledResponse>) => {
  const enabled = await events.analytics.enabled()
  ctx.body = {
    enabled,
  }
}

export const ping = async (ctx: Ctx<AnalyticsPingRequest, void>) => {
  const body = ctx.request.body

  switch (body.source) {
    case PingSource.APP: {
      const db = context.getAppDB({ skip_setup: true })
      const appInfo = await db.get<App>(DocumentType.APP_METADATA)
      let appId = context.getAppId()

      if (isDevAppID(appId)) {
        await events.serve.servedAppPreview(appInfo, body.timezone)
      } else {
        await events.serve.servedApp(appInfo, body.timezone, body.embedded)
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
