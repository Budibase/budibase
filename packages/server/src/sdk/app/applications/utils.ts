const URL_REGEX_SLASH = /\/|\\/g

export function getAppUrl(opts?: { name?: string; url?: string }) {
  // construct the url
  let url
  if (opts?.url) {
    // if the url is provided, use that
    url = encodeURI(opts?.url)
  } else if (opts?.name) {
    // otherwise use the name
    url = encodeURI(`${opts?.name}`)
  }
  if (url) {
    url = `/${url.replace(URL_REGEX_SLASH, "")}`.toLowerCase()
  }
  return url as string
}
