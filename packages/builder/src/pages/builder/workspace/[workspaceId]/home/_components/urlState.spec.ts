import {
  buildHomeUrl,
  normaliseHomeSortColumn,
  type HomeUrlState,
} from "./urlState"

const defaultState: HomeUrlState = {
  searchTerm: "",
  typeFilter: "all",
  selectedProjectId: "",
  sortColumn: "updated",
  sortOrder: "desc",
}

describe("buildHomeUrl", () => {
  it("writes project, type, search, and sort state", () => {
    const result = buildHomeUrl({
      pathname: "/builder/workspace/home",
      search: "?existing=value",
      state: {
        ...defaultState,
        searchTerm: "  invoice  ",
        typeFilter: "app",
        selectedProjectId: "project_1",
        sortColumn: "name",
        sortOrder: "asc",
      },
    })

    expect(result).toBe(
      "/builder/workspace/home?existing=value&q=invoice&type=app&project=project_1&sort=name&order=asc"
    )
  })

  it("omits default updated sort", () => {
    const result = buildHomeUrl({
      pathname: "/builder/workspace/home",
      search: "",
      state: {
        ...defaultState,
        sortColumn: "updated",
        sortOrder: "desc",
      },
    })

    expect(result).toBe("/builder/workspace/home")
  })

  it("treats legacy created sort URL params as unsupported", () => {
    expect(normaliseHomeSortColumn("created")).toBeNull()
  })

  it("removes project state when no project is selected", () => {
    const result = buildHomeUrl({
      pathname: "/builder/workspace/home",
      search: "?project=project_1&create=app",
      state: {
        ...defaultState,
        selectedProjectId: "",
      },
    })

    expect(result).toBe("/builder/workspace/home")
  })

  it("retains project sorting", () => {
    const result = buildHomeUrl({
      pathname: "/builder/workspace/home",
      search: "?sort=projects",
      state: {
        ...defaultState,
        sortColumn: "projects",
        sortOrder: "asc",
      },
    })

    expect(result).toBe("/builder/workspace/home?sort=projects&order=asc")
  })

  it("writes the data type filter", () => {
    const result = buildHomeUrl({
      pathname: "/builder/workspace/home",
      search: "",
      state: {
        ...defaultState,
        typeFilter: "data",
      },
    })

    expect(result).toBe("/builder/workspace/home?type=data")
  })
})
