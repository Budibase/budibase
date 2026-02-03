import {
  WorkspaceResource,
  type Agent,
  type UIAutomation,
  type UIWorkspaceApp,
  type WorkspaceFavourite,
} from "@budibase/types"
import type {
  HomeRow,
  HomeRowType,
  HomeSortColumn,
  HomeSortOrder,
  HomeType,
} from "./types"

interface BuildHomeRowsParams {
  apps: UIWorkspaceApp[]
  automations: UIAutomation[]
  agents: Agent[]
  agentsEnabled: boolean
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
    default:
      return "cube"
  }
}

export const getRowIconColor = (type: HomeRowType) => {
  switch (type) {
    case "automation":
      return "#89B5E2"
    case "app":
      return "#D4A27F"
    case "agent":
      return "#BDB0F5"
    default:
      return "var(--spectrum-global-color-gray-700)"
  }
}

export const getTypeLabel = (type: HomeRowType) => {
  switch (type) {
    case "app":
      return "App"
    case "automation":
      return "Automation"
    case "agent":
      return "Agent"
  }
}

const getDateTimestamp = (row: HomeRow) => {
  const value = row.createdAt || row.updatedAt
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

const getStatusSortValue = (row: HomeRow) => {
  if (row.type === "agent") {
    return row.live ? "live" : "draft"
  }
  return `${row.status}`.toLowerCase()
}

const getSortValue = (row: HomeRow, column: HomeSortColumn) => {
  switch (column) {
    case "name":
      return row.name.toLowerCase()
    case "type":
      return getTypeLabel(row.type).toLowerCase()
    case "status":
      return getStatusSortValue(row)
    case "created":
      return getDateTimestamp(row)
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
    const aIsFav = !!a.favourite._id
    const bIsFav = !!b.favourite._id

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
    if (typeFilter !== "all") {
      if (typeFilter === "chat") {
        return false
      }
      if (row.type !== typeFilter) {
        return false
      }
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
  agentsEnabled,
  getFavourite,
}: BuildHomeRowsParams): HomeRow[] => {
  const appRows: HomeRow[] = apps.map(app => {
    const id = app._id as string
    return {
      _id: id,
      id,
      name: app.name,
      type: "app",
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

  const agentRows: HomeRow[] = agentsEnabled
    ? agents.map(agent => {
        const id = agent._id as string
        return {
          _id: id,
          id,
          name: agent.name,
          type: "agent",
          live: agent.live === true,
          updatedAt: agent.updatedAt,
          createdAt: agent.createdAt ? String(agent.createdAt) : undefined,
          resource: agent,
          favourite: getFavourite(WorkspaceResource.AGENT, id),
          icon: getRowIcon("agent"),
          iconColor: getRowIconColor("agent"),
        }
      })
    : []

  return [...appRows, ...automationRows, ...agentRows]
}
