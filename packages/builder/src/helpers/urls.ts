function buildUrl({
  paths,
  route,
  fullUrl,
}: {
  paths: string[]
  route: string
  fullUrl: boolean
}) {
  const { host, protocol } = window.location

  const trimSlashes = (value: string) =>
    value.replace(/^\/*/, "").replace(/^\/$/, "")
  const parsedPaths = paths
    .map(trimSlashes)
    .filter(x => x)
    .join("/")

  let url = ""
  if (fullUrl) {
    url += `${protocol}//${host}`
  }

  url += `/${parsedPaths}`

  route = trimSlashes(route)
  if (route) {
    url += `/#/${route}`
  }
  return url
}

export function buildPreviewUrl(
  { appId }: { appId: string },
  workspaceAppUrl: string,
  route: string,
  fullUrl: boolean
) {
  const previewUrl = buildUrl({
    paths: [appId, workspaceAppUrl],
    route,
    fullUrl,
  })

  return previewUrl
}

export function buildLiveUrl(
  { url }: { url: string },
  workspaceAppUrl: string,
  fullUrl: boolean
) {
  const liveUrl = buildUrl({
    paths: [`/app${url}`, workspaceAppUrl],
    route: "", // Ignore the route for live urls
    fullUrl,
  })

  return liveUrl
}
