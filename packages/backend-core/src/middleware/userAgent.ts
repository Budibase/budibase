import type { Context, Next } from "koa"
import type { UserAgentDetails } from "@budibase/types"

const detectBrowser = (source: string) => {
  const browsers = [
    { name: "Edge", regex: /Edg/i },
    { name: "Chrome", regex: /Chrome|CriOS/i },
    { name: "Firefox", regex: /Firefox|FxiOS/i },
    { name: "Safari", regex: /Safari/i },
    { name: "Opera", regex: /OPR|Opera/i },
    { name: "IE", regex: /MSIE|Trident/i },
  ]

  for (const browser of browsers) {
    if (browser.regex.test(source)) {
      return browser.name
    }
  }
  return "unknown"
}

export const createUserAgent = (source?: string): UserAgentDetails => {
  const value = source || "unknown"
  return {
    source: value,
    browser: detectBrowser(value),
  }
}

export const userAgent = async (
  ctx: Context & { userAgent?: UserAgentDetails },
  next: Next
) => {
  const source = ctx.request?.headers?.["user-agent"] || ctx.headers["user-agent"]
  ctx.userAgent = createUserAgent(typeof source === "string" ? source : undefined)
  await next()
}
