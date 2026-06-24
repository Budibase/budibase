import type { HomeSortColumn, HomeSortOrder, HomeType } from "@budibase/types"

export interface HomeUrlState {
  searchTerm: string
  typeFilter: HomeType
  selectedProjectId: string
  sortColumn: HomeSortColumn
  sortOrder: HomeSortOrder
  projectsEnabled: boolean
}

export const buildHomeUrl = (
  pathname: string,
  search: string,
  state: HomeUrlState
) => {
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

  if (!state.projectsEnabled || !state.selectedProjectId) {
    params.delete("project")
  } else {
    params.set("project", state.selectedProjectId)
  }

  const defaultSortColumn = state.projectsEnabled ? "created" : "updated"
  const isDefaultSort =
    state.sortColumn === defaultSortColumn && state.sortOrder === "desc"
  if (isDefaultSort) {
    params.delete("sort")
    params.delete("order")
  } else {
    params.set("sort", state.sortColumn)
    params.set("order", state.sortOrder)
  }

  const query = params.toString()
  return `${pathname}${query ? `?${query}` : ""}`
}
