interface UnpublishedResource {
  publishStatus?: {
    unpublishedChanges?: boolean
  }
  disabled?: boolean
  live?: boolean
}

interface UnpublishedTable {
  unpublishedChanges?: boolean
}

interface PublishChangeCountParams {
  automations: UnpublishedResource[]
  workspaceApps: UnpublishedResource[]
  tables: Record<string, UnpublishedTable>
  agents: UnpublishedResource[]
  agentsEnabled: boolean
}

const countUnpublishedResources = (resources: UnpublishedResource[]) =>
  resources.filter(resource => resource.publishStatus?.unpublishedChanges)
    .length

const countUnpublishedTables = (tables: Record<string, UnpublishedTable>) =>
  Object.values(tables).filter(table => table.unpublishedChanges).length

export const getPublishChangeCount = ({
  automations,
  workspaceApps,
  tables,
  agents,
  agentsEnabled,
}: PublishChangeCountParams) => {
  const automationChanges = countUnpublishedResources(automations)
  const workspaceAppChanges = countUnpublishedResources(workspaceApps)
  const tableChanges = countUnpublishedTables(tables)
  const agentChanges = agentsEnabled ? countUnpublishedResources(agents) : 0

  return automationChanges + workspaceAppChanges + tableChanges + agentChanges
}

export const getPublishButtonText = (changeCount: number) =>
  changeCount > 0 ? `Publish changes (${changeCount})` : "Publish"
