const INTERNAL_WORKSPACE_PREFIX = "app_"

export const getWorkspaceUrlId = (workspaceId?: string) => {
  if (!workspaceId) {
    return ""
  }
  return workspaceId.startsWith(INTERNAL_WORKSPACE_PREFIX)
    ? workspaceId.slice(INTERNAL_WORKSPACE_PREFIX.length)
    : workspaceId
}

export const getWorkspaceIdFromUrl = (workspaceUrlId: string) => {
  if (!workspaceUrlId || workspaceUrlId.startsWith(INTERNAL_WORKSPACE_PREFIX)) {
    return workspaceUrlId
  }
  return `${INTERNAL_WORKSPACE_PREFIX}${workspaceUrlId}`
}

export const getCanonicalBuilderWorkspaceUrl = ({
  pathname,
  search,
  hash,
}: Pick<Location, "pathname" | "search" | "hash">) => {
  const segments = pathname.split("/")
  const workspaceSegmentIndex = segments.indexOf("workspace")
  if (workspaceSegmentIndex === -1) {
    return `${pathname}${search}${hash}`
  }

  const workspaceIdSegmentIndex =
    segments[workspaceSegmentIndex + 1] === "updating"
      ? workspaceSegmentIndex + 2
      : workspaceSegmentIndex + 1
  const workspaceId = segments[workspaceIdSegmentIndex]
  if (!workspaceId) {
    return `${pathname}${search}${hash}`
  }

  segments[workspaceIdSegmentIndex] = getWorkspaceUrlId(workspaceId)
  return `${segments.join("/")}${search}${hash}`
}

export const redirectLegacyWorkspaceUrl = (
  workspaceUrlId: string,
  location: Pick<
    Location,
    "pathname" | "search" | "hash" | "replace"
  > = window.location
) => {
  if (getWorkspaceUrlId(workspaceUrlId) === workspaceUrlId) {
    return false
  }

  location.replace(getCanonicalBuilderWorkspaceUrl(location))
  return true
}
