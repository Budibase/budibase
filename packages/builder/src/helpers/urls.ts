function buildUrl({ paths, route }: { paths: string[]; route: string }) {
  const { host, protocol } = window.location

  const trimSlashes = (value: string) =>
    value.replace(/^\/*/, "").replace(/^\/$/, "")
  const parsedPaths = paths
    .map(trimSlashes)
    .filter(x => x)
    .join("/")
  let url = `${protocol}//${host}/${parsedPaths}`

  route = trimSlashes(route)
  if (route) {
    url += `/#/${route}`
  }
  return url
}

export function buildPreviewUrl(
  { appId }: { appId: string },
  workspaceAppUrl: string,
  route: string
) {
  const previewUrl = buildUrl({
    paths: [appId, workspaceAppUrl],
    route,
  })

  return previewUrl
}

export function buildLiveUrl(
  { url }: { url: string },
  workspaceAppUrl: string
) {
  const liveUrl = buildUrl({
    paths: [`/app${url}`, workspaceAppUrl],
    route: "", // Ignore the route for live urls
  })

  return liveUrl
}
