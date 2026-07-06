import { buildHomeUrl, type HomeUrlState } from "./urlState"

const defaultState: HomeUrlState = {
  searchTerm: "",
  typeFilter: "all",
  selectedProjectId: "",
  sortColumn: "updated",
  sortOrder: "desc",
  projectsEnabled: true,
}

describe("buildHomeUrl", () => {
  it("writes project, type, search, and sort state", () => {
    const result = buildHomeUrl("/builder/workspace/home", "?existing=value", {
      ...defaultState,
      searchTerm: "  invoice  ",
      typeFilter: "app",
      selectedProjectId: "project_1",
      sortColumn: "name",
      sortOrder: "asc",
    })

    expect(result).toBe(
      "/builder/workspace/home?existing=value&q=invoice&type=app&project=project_1&sort=name&order=asc"
    )
  })

  it("omits default updated sort when projects are enabled", () => {
    const result = buildHomeUrl("/builder/workspace/home", "", {
      ...defaultState,
      sortColumn: "updated",
      sortOrder: "desc",
      projectsEnabled: true,
    })

    expect(result).toBe("/builder/workspace/home")
  })

  it("removes project state when projects are disabled", () => {
    const result = buildHomeUrl(
      "/builder/workspace/home",
      "?project=project_1&create=app",
      {
        ...defaultState,
        selectedProjectId: "project_1",
        projectsEnabled: false,
      }
    )

    expect(result).toBe("/builder/workspace/home")
  })

  it("removes project-only sort state when projects are disabled", () => {
    const result = buildHomeUrl("/builder/workspace/home", "?sort=projects", {
      ...defaultState,
      sortColumn: "projects",
      sortOrder: "asc",
      projectsEnabled: false,
    })

    expect(result).toBe("/builder/workspace/home")
  })

  it("writes the data type filter", () => {
    const result = buildHomeUrl("/builder/workspace/home", "", {
      ...defaultState,
      typeFilter: "data",
    })

    expect(result).toBe("/builder/workspace/home?type=data")
  })
})
