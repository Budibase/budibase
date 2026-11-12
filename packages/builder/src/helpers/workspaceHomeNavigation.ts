const buildHomePath = (workspaceId: string) =>
  `/builder/workspace/${workspaceId}/home`

export const buildProjectSetupHomeUrl = ({
  workspaceId,
  projectId,
  search = window.location.search,
}: {
  workspaceId: string
  projectId: string
  search?: string
}) => {
  const params = new URLSearchParams(search)
  params.set("project", projectId)
  params.set("setup", projectId)
  return `${buildHomePath(workspaceId)}?${params}`
}

export const getProjectSetupRequest = ({
  workspaceId,
  homeUrl,
}: {
  workspaceId: string
  homeUrl: string | null | undefined
}) => {
  if (!workspaceId || !homeUrl) {
    return
  }

  try {
    const home = new URL(homeUrl, window.location.origin)
    const projectId = home.searchParams.get("project")
    if (
      home.origin !== window.location.origin ||
      home.pathname !== buildHomePath(workspaceId) ||
      !projectId ||
      home.searchParams.get("setup") !== projectId
    ) {
      return
    }

    const url = `${home.pathname}${home.search}`
    home.searchParams.delete("setup")
    return {
      projectId,
      url,
      cleanUrl: `${home.pathname}${home.search}`,
    }
  } catch (_error) {
    return
  }
}

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
