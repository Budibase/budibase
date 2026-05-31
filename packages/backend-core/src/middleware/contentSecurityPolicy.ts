import { Ctx, Feature } from "@budibase/types"
import crypto from "crypto"
import { Middleware, Next } from "koa"
import { workspace } from "../cache"
import env from "../environment"

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
    "https://companion.frontapp.com",
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
    "https://d2l5prqdbvm3op.cloudfront.net",
    "https://companion.frontapp.com",
    "https://*.frontapp.com",
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

type CSPDirectives = Record<string, string[]>

export const contentSecurityPolicy = (async (ctx: Ctx, next: Next) => {
  const nonce = crypto.randomBytes(16).toString("base64")
  ctx.state.nonce = nonce
  let directives: CSPDirectives = { ...CSP_DIRECTIVES }
  directives["script-src"] = [
    ...(CSP_DIRECTIVES["script-src"] as string[]),
    `'nonce-${nonce}'`,
  ]

  // Add custom global CSP additions from environment variables
  const customCSPs: Record<string, string | undefined> = {
    "media-src": env.CUSTOM_CSP_MEDIA_SRC,
    "script-src": env.CUSTOM_CSP_SCRIPT_SRC,
    "connect-src": env.CUSTOM_CSP_CONNECT_SRC,
    "img-src": env.CUSTOM_CSP_IMG_SRC,
    "font-src": env.CUSTOM_CSP_FONT_SRC,
    "frame-src": env.CUSTOM_CSP_FRAME_SRC,
  }

  for (const [directive, domains] of Object.entries(customCSPs)) {
    if (domains) {
      const parsedDomains = domains
        .split(",")
        .map(d => d.trim())
        .filter(d => CSPDomainRegex.test(d))
      directives[directive] = [
        ...(directives[directive] || []),
        ...parsedDomains,
      ]
    }
  }

  // Apply per-workspace CSP based on the workspace metadata. This covers the
  // licensed custom app script whitelist as well as the embed origin allowlist.
  const isEmbed = ctx.request?.get("x-budibase-embed")?.toLowerCase() === "true"
  const licensed = ctx.user?.license?.features.includes(
    Feature.CUSTOM_APP_SCRIPTS
  )

  // Default embeds to a wildcard allowlist so existing implementations keep
  // working. The per-workspace allowlist below narrows this when configured,
  // and this default holds even if the workspace metadata lookup fails.
  if (isEmbed) {
    directives["frame-ancestors"] = ["*"]
  }

  if (ctx.appId && (isEmbed || licensed)) {
    try {
      const appMetadata = await workspace.getWorkspaceMetadata(ctx.appId)
      if ("name" in appMetadata) {
        if (licensed) {
          for (let script of appMetadata.scripts || []) {
            const inclusions = (script.cspWhitelist || "")
              .split("\n")
              .filter(domain => CSPDomainRegex.test(domain))

            // Apply app whitelist to all relevant directives
            const directivesToUpdate = [
              "default-src",
              "script-src",
              "connect-src",
              "media-src",
              "img-src",
              "font-src",
              "frame-src",
            ]

            for (const directive of directivesToUpdate) {
              directives[directive] = [
                ...(directives[directive] || []),
                ...inclusions,
              ]
            }
          }
        }

        // Restrict who can embed this workspace's apps in an iframe. An empty
        // allowlist keeps the previous behaviour of allowing any origin.
        if (isEmbed) {
          const allowedOrigins = (appMetadata.embedAllowedOrigins || [])
            .map(origin => origin.trim())
            .filter(origin => CSPDomainRegex.test(origin))
          directives["frame-ancestors"] = allowedOrigins.length
            ? allowedOrigins
            : ["*"]
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
