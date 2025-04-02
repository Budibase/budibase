import crypto from "crypto"

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
  "worker-src": ["blob:"],
}

export async function contentSecurityPolicy(ctx: any, next: any) {
  try {
    const nonce = crypto.randomBytes(16).toString("base64")

    const directives = { ...CSP_DIRECTIVES }
    directives["script-src"] = [
      ...CSP_DIRECTIVES["script-src"],
      `'nonce-${nonce}'`,
    ]

    ctx.state.nonce = nonce

    const cspHeader = Object.entries(directives)
      .map(([key, sources]) => `${key} ${sources.join(" ")}`)
      .join("; ")
    ctx.set("Content-Security-Policy", cspHeader)
    await next()
  } catch (err: any) {
    console.error(
      `Error occurred in Content-Security-Policy middleware: ${err}`
    )
  }
}

export default contentSecurityPolicy
