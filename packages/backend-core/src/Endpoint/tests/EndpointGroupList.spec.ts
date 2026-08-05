import EndpointGroupList from "../EndpointGroupList"

describe("EndpointGroupList", () => {
  it("returns matchers for groups with matching route policy", () => {
    const groups = new EndpointGroupList()
    const publicRoutes = groups.group({ public: true })
    const publicNoTenancyRoutes = groups.group({
      public: true,
      noTenancy: true,
    })
    const loggedInRoutes = groups.group()

    publicRoutes.get("/api/public", () => {})
    publicNoTenancyRoutes.post("/api/public/no-tenancy", () => {})
    loggedInRoutes.get("/api/private", () => {})

    expect(groups.endpointMatchers({ public: true })).toEqual([
      { route: "/api/public", method: "GET" },
      { route: "/api/public/no-tenancy", method: "POST" },
    ])
    expect(groups.endpointMatchers({ noTenancy: true })).toEqual([
      { route: "/api/public/no-tenancy", method: "POST" },
    ])
  })
})
