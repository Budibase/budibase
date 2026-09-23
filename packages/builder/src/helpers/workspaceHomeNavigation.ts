const buildHomePath = (workspaceId: string) =>
  `/builder/workspace/${workspaceId}/home`

export const withWorkspaceHomeReturn = (
  targetUrl: string,
  homeUrl = new URLSearchParams(window.location.search).get("returnTo")
) => {
  if (!homeUrl) {
    return targetUrl
  }

  try {
    const home = new URL(homeUrl, window.location.origin)
    const separator = targetUrl.includes("?") ? "&" : "?"
    const returnTo = encodeURIComponent(`${home.pathname}${home.search}`)
    return `${targetUrl}${separator}returnTo=${returnTo}`
  } catch (_error) {
    return targetUrl
  }
}

export const getWorkspaceHomeUrl = (
  workspaceId: string,
  search = window.location.search
) => {
  const fallbackUrl = buildHomePath(workspaceId)
  const returnTo = new URLSearchParams(search).get("returnTo")
  if (!returnTo) {
    return fallbackUrl
  }

  try {
    const url = new URL(returnTo, window.location.origin)
    if (url.origin !== window.location.origin || url.pathname !== fallbackUrl) {
      return fallbackUrl
    }
    return `${url.pathname}${url.search}`
  } catch (_error) {
    return fallbackUrl
  }
}
