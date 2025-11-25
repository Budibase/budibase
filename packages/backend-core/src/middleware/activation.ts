import { getConfig } from "../configs"
import { ConfigType, SettingsConfig } from "@budibase/types"
import type { Next, Middleware, Context } from "koa"

export function activeTenant(): Middleware {
  return async function (ctx: Context, next: Next) {
    try {
      const settingsConfig = await getConfig<SettingsConfig>(
        ConfigType.SETTINGS
      )
      if (settingsConfig?.config?.active === false) {
        // Treat inactive tenant as if it doesn't exist - return 404 or unauthorized
        ctx.status = 404
        ctx.body = { message: "Tenant not found" }
        return
      }
    } catch (error: any) {
      // If no Global DB context exists (e.g., public endpoints), skip activation check
      if (error.message === "Global DB not found") {
        return next()
      }
      throw error
    }
    return next()
  }
}
