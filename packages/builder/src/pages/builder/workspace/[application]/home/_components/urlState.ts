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

  const hasProjectOnlySort =
    !state.projectsEnabled &&
    (state.sortColumn === "projects" || state.sortColumn === "created")
  const sortColumn = hasProjectOnlySort ? "updated" : state.sortColumn
  const sortOrder = hasProjectOnlySort ? "desc" : state.sortOrder
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
