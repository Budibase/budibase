import {
  WorkspaceResource,
  type Agent,
  type Datasource,
  type HomeRow,
  type HomeRowType,
  type HomeSortColumn,
  type HomeSortOrder,
  type HomeType,
  type Table,
  type UIAutomation,
  type UIInternalDatasource,
  type UIWorkspaceApp,
  type WorkspaceFavourite,
} from "@budibase/types"
import { BUDIBASE_INTERNAL_DB_ID } from "@/constants/backend"
import { TableNames } from "@/constants"
import { isAssignableDatasource } from "@/helpers/data/datasources"
import { getAgentStatusLabel, getPublishResourceStatusLabel } from "./status"

interface BuildHomeRowsParams {
  apps: UIWorkspaceApp[]
  automations: UIAutomation[]
  agents: Agent[]
  datasources: (Datasource | UIInternalDatasource)[]
  tables: Table[]
  getFavourite: (
    resourceType: WorkspaceResource,
    resourceId: string
  ) => WorkspaceFavourite
}

export const getRowIcon = (type: HomeRowType) => {
  switch (type) {
    case "automation":
      return "path"
    case "app":
      return "browsers"
    case "agent":
      return "sparkle"
    case "datasource":
      return "database"
    case "table":
      return "table"
    default:
      return "cube"
  }
}

export const getRowIconColor = (type: HomeRowType) => {
  switch (type) {
    case "automation":
      return "var(--color-purple-300)"
    case "app":
      return "var(--color-orange-400)"
    case "agent":
      return "var(--color-brand-400)"
    case "datasource":
    case "table":
      return "var(--color-green-600)"
    default:
      return "var(--spectrum-global-color-gray-700)"
  }
}

export const getHomeTypeIcon = (type: HomeType) => {
  if (type === "all") {
    return "squares-four"
  }
  if (type === "data") {
    return "database"
  }
  return getRowIcon(type)
}

export const getHomeTypeIconColor = (type: HomeType) => {
  if (type === "all") {
    return "var(--spectrum-global-color-gray-700)"
  }
  if (type === "data") {
    return "var(--color-green-600)"
  }
  return getRowIconColor(type)
}

export const getTypeLabel = (type: HomeRowType) => {
  switch (type) {
    case "app":
      return "App"
    case "automation":
      return "Automation"
    case "agent":
      return "Agent"
    case "datasource":
      return "Datasource"
    case "table":
      return "Table"
  }
}

const getTimestamp = (value?: string) => {
  if (!value) {
    return 0
  }
  const asNumber = Number(value)
  if (!Number.isNaN(asNumber) && Number.isFinite(asNumber)) {
    return asNumber
  }

  const parsed = Date.parse(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

const getUpdatedTimestamp = (row: HomeRow) => getTimestamp(row.updatedAt)

const getProjectCount = (row: HomeRow) => row.projectIds?.length ?? 0

const getStatusSortValue = (row: HomeRow) => {
  if (row.type === "app" || row.type === "automation") {
    return getPublishResourceStatusLabel(row.resource.publishStatus)
  }
  if (row.type === "agent") {
    return getAgentStatusLabel(row.resource)
  }
  return "-"
}

const getSortValue = (row: HomeRow, column: HomeSortColumn) => {
  switch (column) {
    case "name":
      return row.name.toLowerCase()
    case "type":
      return getTypeLabel(row.type).toLowerCase()
    case "status":
      return getStatusSortValue(row)
    case "projects":
      return getProjectCount(row)
    case "updated":
      return getUpdatedTimestamp(row)
  }
}

const compareValues = (a: unknown, b: unknown, order: HomeSortOrder) => {
  const direction = order === "asc" ? 1 : -1

  if (typeof a === "number" && typeof b === "number") {
    return (a - b) * direction
  }

  const aStr = `${a ?? ""}`
  const bStr = `${b ?? ""}`
  return aStr.localeCompare(bStr) * direction
}

export const sortHomeRows = (
  rows: HomeRow[],
  {
    sortColumn,
    sortOrder,
  }: {
    sortColumn: HomeSortColumn
    sortOrder: HomeSortOrder
  }
) =>
  rows.slice().sort((a, b) => {
    const aIsFav = !!a.favourite?._id
    const bIsFav = !!b.favourite?._id

    if (aIsFav !== bIsFav) {
      return bIsFav ? 1 : -1
    }

    const aValue = getSortValue(a, sortColumn)
    const bValue = getSortValue(b, sortColumn)
    const primary = compareValues(aValue, bValue, sortOrder)
    if (primary !== 0) {
      return primary
    }

    return a.name.localeCompare(b.name)
  })

export const filterHomeRows = ({
  rows,
  typeFilter,
  searchTerm,
}: {
  rows: HomeRow[]
  typeFilter: HomeType
  searchTerm: string
}) => {
  const normalisedSearchTerm = searchTerm.trim().toLowerCase()

  return rows.filter(row => {
    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "data"
        ? row.type === "datasource" || row.type === "table"
        : row.type === typeFilter)

    if (!matchesType) {
      return false
    }

    if (normalisedSearchTerm) {
      return row.name.toLowerCase().includes(normalisedSearchTerm)
    }

    return true
  })
}

export const buildHomeRows = ({
  apps,
  automations,
  agents,
  datasources,
  tables,
  getFavourite,
}: BuildHomeRowsParams): HomeRow[] => {
  const appRows: HomeRow[] = apps.map(app => {
    const id = app._id as string
    return {
      _id: id,
      id,
      name: app.name,
      type: "app",
      projectIds: app.projectIds,
      status: app.publishStatus.state,
      updatedAt: app.updatedAt,
      createdAt: app.createdAt ? String(app.createdAt) : undefined,
      resource: app,
      favourite: getFavourite(WorkspaceResource.WORKSPACE_APP, id),
      icon: getRowIcon("app"),
      iconColor: getRowIconColor("app"),
    }
  })

  const automationRows: HomeRow[] = automations.map(automation => {
    const id = automation._id as string
    return {
      _id: id,
      id,
      name: automation.name,
      type: "automation",
      projectIds: automation.projectIds,
      status: automation.publishStatus.state,
      updatedAt: automation.updatedAt,
      createdAt: automation.createdAt
        ? String(automation.createdAt)
        : undefined,
      resource: automation,
      favourite: getFavourite(WorkspaceResource.AUTOMATION, id),
      icon: getRowIcon("automation"),
      iconColor: getRowIconColor("automation"),
    }
  })

  const agentRows: HomeRow[] = agents.map(agent => {
    const id = agent._id as string
    return {
      _id: id,
      id,
      name: agent.name,
      type: "agent",
      projectIds: agent.projectIds,
      live: agent.live === true,
      updatedAt: agent.updatedAt,
      createdAt: agent.createdAt ? String(agent.createdAt) : undefined,
      resource: agent,
      favourite: getFavourite(WorkspaceResource.AGENT, id),
      icon: getRowIcon("agent"),
      iconColor: getRowIconColor("agent"),
    }
  })

  const externalDatasources = datasources.filter(isAssignableDatasource)
  const assignableInternalTables = tables.filter(
    table =>
      table.sourceId === BUDIBASE_INTERNAL_DB_ID &&
      table._id !== TableNames.USERS
  )
  const datasourceRows: HomeRow[] = externalDatasources.map(datasource => {
    const id = datasource._id as string
    return {
      _id: id,
      id,
      name: datasource.name || "Datasource",
      type: "datasource",
      projectIds: datasource.projectIds,
      updatedAt: datasource.updatedAt,
      createdAt: datasource.createdAt
        ? String(datasource.createdAt)
        : undefined,
      resource: datasource,
      favourite: getFavourite(WorkspaceResource.DATASOURCE, id),
      icon: getRowIcon("datasource"),
      iconColor: getRowIconColor("datasource"),
    }
  })

  const tableRows: HomeRow[] = assignableInternalTables.map(table => {
    const id = table._id as string
    return {
      _id: id,
      id,
      name: table.name || "Table",
      type: "table",
      projectIds: table.projectIds,
      updatedAt: table.updatedAt,
      createdAt: table.createdAt ? String(table.createdAt) : undefined,
      resource: table,
      favourite: getFavourite(WorkspaceResource.TABLE, id),
      icon: getRowIcon("table"),
      iconColor: getRowIconColor("table"),
    }
  })

  return [
    ...appRows,
    ...automationRows,
    ...agentRows,
    ...datasourceRows,
    ...tableRows,
  ]
}
