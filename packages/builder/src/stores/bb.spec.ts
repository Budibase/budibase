import { beforeEach, describe, expect, it, vi } from "vitest"
import { get } from "svelte/store"
import { BBStore, setSettingsRouteResolver } from "./bb"

vi.mock("@budibase/frontend-core", () => ({}))

describe("settings project setup return", () => {
  beforeEach(() => {
    setSettingsRouteResolver(path => ({
      entry: { path },
      params: { datasourceId: "datasource_1" },
    }))
  })

  it("remembers the connection page without its consumed setup return when reopened", () => {
    const store = new BBStore()
    store.settings("/connections/api-connections/datasource_1", {
      projectSetupReturnTo:
        "/builder/workspace/app_1/home?project=project_1&setup=project_1",
    })

    store.hideSettings()
    store.settings()

    expect(get(store).settings).toEqual({
      open: true,
      route: {
        entry: { path: "/connections/api-connections/datasource_1" },
        params: { datasourceId: "datasource_1" },
      },
      locked: undefined,
      pendingPath: undefined,
      pendingParams: undefined,
    })
  })
})
