interface BuilderWorkspaceRouteOptions {
  applicationId: string
  segments?: Array<string | null | undefined>
}

const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, "")

const buildPath = (segments: Array<string | null | undefined>) =>
  segments
    .map(segment => (segment ? trimSlashes(segment) : null))
    .filter((segment): segment is string => Boolean(segment))
    .join("/")

export const buildBuilderWorkspaceRoute = ({
  applicationId,
  segments = [],
}: BuilderWorkspaceRouteOptions) => {
  const pathSegments: Array<string | null | undefined> = [
    "builder",
    "workspace",
    applicationId,
    ...segments,
  ]
  const path = buildPath(pathSegments)
  return `/${path}`
}

export const buildBuilderWorkspaceDesignRoute = ({
  applicationId,
  workspaceAppId,
  screenId,
  componentId,
}: {
  applicationId: string
  workspaceAppId: string
  screenId: string
  componentId?: string | null
}) => {
  const segments = ["design", workspaceAppId, screenId]
  if (componentId) {
    segments.push(componentId)
  }
  return buildBuilderWorkspaceRoute({ applicationId, segments })
}
