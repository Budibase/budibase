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
})
