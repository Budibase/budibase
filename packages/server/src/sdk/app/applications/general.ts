const URL_REGEX_SLASH = /\/|\\/g

export function getAppUrl(ctx: {
  request: { body: { name?: string; url?: string } }
}) {
  // construct the url
  let url
  if (ctx.request.body.url) {
    // if the url is provided, use that
    url = encodeURI(ctx.request.body.url)
  } else if (ctx.request.body.name) {
    // otherwise use the name
    url = encodeURI(`${ctx.request.body.name}`)
  }
  if (url) {
    url = `/${url.replace(URL_REGEX_SLASH, "")}`.toLowerCase()
  }
  return url as string
}
