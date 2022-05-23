import { events } from "@budibase/backend-core"

export const isEnabled = async (ctx: any) => {
  ctx.body = {
    enabled: events.analytics.enabled(),
  }
}
