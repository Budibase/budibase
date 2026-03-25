interface UnpublishedResource {
  unpublishedChanges?: boolean
}

interface PublishChangeCountParams {
  automations: Record<string, UnpublishedResource>
  workspaceApps: Record<string, UnpublishedResource>
  tables: Record<string, UnpublishedResource>
  agents: Record<string, UnpublishedResource>
  agentsEnabled: boolean
}

const countUnpublishedResources = (
  resources: Record<string, UnpublishedResource>
) =>
  Object.values(resources).filter(resource => resource.unpublishedChanges)
    .length

export const getPublishChangeCount = ({
  automations,
  workspaceApps,
  tables,
  agents,
  agentsEnabled,
}: PublishChangeCountParams) => {
  const automationChanges = countUnpublishedResources(automations)
  const workspaceAppChanges = countUnpublishedResources(workspaceApps)
  const tableChanges = countUnpublishedResources(tables)
  const agentChanges = agentsEnabled ? countUnpublishedResources(agents) : 0

  return automationChanges + workspaceAppChanges + tableChanges + agentChanges
}

export const getPublishButtonText = (changeCount: number) =>
  changeCount > 0 ? `Publish changes (${changeCount})` : "Publish"
