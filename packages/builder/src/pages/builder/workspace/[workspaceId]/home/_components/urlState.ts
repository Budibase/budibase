import type { HomeSortColumn, HomeSortOrder, HomeType } from "@budibase/types"

export interface HomeUrlState {
  searchTerm: string
  typeFilter: HomeType
  selectedProjectId: string
  sortColumn: HomeSortColumn
  sortOrder: HomeSortOrder
}

export const normaliseHomeSortColumn = (
  value: string | null
): HomeSortColumn | null => {
  if (!value) {
    return null
  }
  if (
    value === "name" ||
    value === "type" ||
    value === "projects" ||
    value === "status" ||
    value === "updated"
  ) {
    return value
  }
  return null
}

export const buildHomeUrl = ({
  pathname,
  search,
  state,
}: {
  pathname: string
  search: string
  state: HomeUrlState
}) => {
  const params = new URLSearchParams(search)

  params.delete("create")
  const q = state.searchTerm.trim()
  if (!q) {
    params.delete("q")
  } else {
    params.set("q", q)
  }

  if (state.typeFilter === "all") {
    params.delete("type")
  } else {
    params.set("type", state.typeFilter)
  }

  if (!state.selectedProjectId) {
    params.delete("project")
  } else {
    params.set("project", state.selectedProjectId)
  }

  const { sortColumn, sortOrder } = state
  const defaultSortColumn = "updated"
  const isDefaultSort = sortColumn === defaultSortColumn && sortOrder === "desc"
  if (isDefaultSort) {
    params.delete("sort")
    params.delete("order")
  } else {
    params.set("sort", sortColumn)
    params.set("order", sortOrder)
  }

  const query = params.toString()
  return `${pathname}${query ? `?${query}` : ""}`
}
