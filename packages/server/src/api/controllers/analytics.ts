import { events } from "@budibase/backend-core"

export const isEnabled = async (ctx: any) => {
  const enabled = await events.analytics.enabled()
  ctx.body = {
    enabled,
  }
}
