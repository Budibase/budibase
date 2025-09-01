import crypto from "crypto"
import { app } from "../cache"
import { Feature, Ctx } from "@budibase/types"
import { Middleware, Next } from "koa"

const CSP_DIRECTIVES = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-eval'",
    "https://*.budibase.net",
    "https://cdn.budi.live",
    "https://js.intercomcdn.com",
    "https://widget.intercom.io",
    "https://d2l5prqdbvm3op.cloudfront.net",
    "https://us-assets.i.posthog.com",
    "https://www.google.com/recaptcha/api.js",
  ],
  "style-src": [
    "'self'",
    "'unsafe-inline'",
    "https://cdn.jsdelivr.net",
    "https://fonts.googleapis.com",
    "https://rsms.me",
    "https://maxcdn.bootstrapcdn.com",
  ],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "connect-src": [
    "'self'",
    "https://*.budibase.app",
    "https://*.budibaseqa.app",
    "https://*.budibase.net",
    "https://api-iam.intercom.io",
    "https://api-ping.intercom.io",
    "https://app.posthog.com",
    "https://us.i.posthog.com",
    "wss://nexus-websocket-a.intercom.io",
    "wss://nexus-websocket-b.intercom.io",
    "https://nexus-websocket-a.intercom.io",
    "https://nexus-websocket-b.intercom.io",
    "https://uploads.intercomcdn.com",
    "https://uploads.intercomusercontent.com",
    "https://*.amazonaws.com",
    "https://*.s3.amazonaws.com",
    "https://*.s3.us-east-2.amazonaws.com",
    "https://*.s3.us-east-1.amazonaws.com",
    "https://*.s3.us-west-1.amazonaws.com",
    "https://*.s3.us-west-2.amazonaws.com",
    "https://*.s3.af-south-1.amazonaws.com",
    "https://*.s3.ap-east-1.amazonaws.com",
    "https://*.s3.ap-south-1.amazonaws.com",
    "https://*.s3.ap-northeast-2.amazonaws.com",
    "https://*.s3.ap-southeast-1.amazonaws.com",
    "https://*.s3.ap-southeast-2.amazonaws.com",
    "https://*.s3.ap-northeast-1.amazonaws.com",
    "https://*.s3.ca-central-1.amazonaws.com",
    "https://*.s3.cn-north-1.amazonaws.com",
    "https://*.s3.cn-northwest-1.amazonaws.com",
    "https://*.s3.eu-central-1.amazonaws.com",
    "https://*.s3.eu-west-1.amazonaws.com",
    "https://*.s3.eu-west-2.amazonaws.com",
    "https://*.s3.eu-south-1.amazonaws.com",
    "https://*.s3.eu-west-3.amazonaws.com",
    "https://*.s3.eu-north-1.amazonaws.com",
    "https://*.s3.sa-east-1.amazonaws.com",
    "https://*.s3.me-south-1.amazonaws.com",
    "https://*.s3.us-gov-east-1.amazonaws.com",
    "https://*.s3.us-gov-west-1.amazonaws.com",
    "https://api.github.com",
  ],
  "font-src": [
    "'self'",
    "data:",
    "https://cdn.jsdelivr.net",
    "https://fonts.gstatic.com",
    "https://rsms.me",
    "https://maxcdn.bootstrapcdn.com",
    "https://js.intercomcdn.com",
    "https://fonts.intercomcdn.com",
  ],
  "frame-src": ["'self'", "https:"],
  "img-src": ["http:", "https:", "data:", "blob:"],
  "manifest-src": ["'self'"],
  "media-src": [
    "'self'",
    "https://js.intercomcdn.com",
    "https://cdn.budi.live",
  ],
  "worker-src": ["blob:", "'self'"],
}

const CSPDomainRegex = /^[A-Za-z0-9-*:/.]+$/

export const contentSecurityPolicy = (async (ctx: Ctx, next: Next) => {
  const nonce = crypto.randomBytes(16).toString("base64")
  ctx.state.nonce = nonce
  let directives = { ...CSP_DIRECTIVES }
  directives["script-src"] = [
    ...CSP_DIRECTIVES["script-src"],
    `'nonce-${nonce}'`,
  ]

  // Add custom app CSP whitelist
  const licensed = ctx.user?.license?.features.includes(
    Feature.CUSTOM_APP_SCRIPTS
  )
  if (licensed && ctx.appId) {
    try {
      const appMetadata = await app.getAppMetadata(ctx.appId)
      if ("name" in appMetadata) {
        for (let script of appMetadata.scripts || []) {
          const inclusions = (script.cspWhitelist || "")
            .split("\n")
            .filter(domain => CSPDomainRegex.test(domain))
          directives["default-src"] = [
            ...directives["default-src"],
            ...inclusions,
          ]
        }
      }
    } catch (err) {
      // Log an error but always proceed using the default CSP
      console.error(
        `Error occurred in Content-Security-Policy middleware: ${err}`
      )
    }
  }

  const cspHeader = Object.entries(directives)
    .map(([key, sources]) => `${key} ${sources.join(" ")}`)
    .join("; ")
  ctx.set("Content-Security-Policy", cspHeader)
  await next()
}) as Middleware
