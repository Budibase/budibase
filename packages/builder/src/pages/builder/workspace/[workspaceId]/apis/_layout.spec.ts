import { render } from "@testing-library/svelte"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { writable } from "svelte/store"
import { IntegrationTypes } from "@/constants/backend"
import type { Datasource } from "@budibase/types"

const mocks = vi.hoisted(() => {
  const { writable } = require("svelte/store")
  return {
    goto: vi.fn(),
    redirect: vi.fn(),
    activePath: "./new",
    datasources: writable({ list: [] as Datasource[] }),
    builderStore: writable({ isResizingPanel: false }),
    workspaceConnections: {
      draft: null,
      startDraft: vi.fn(),
      discardDraft: vi.fn(),
      subscribe: writable({ draft: null }).subscribe,
    },
  }
})

vi.mock("@roxi/routify", async () => {
  const { writable } = await import("svelte/store")
  return {
    goto: {
      subscribe: (run: (val: any) => void) => {
        run(mocks.goto)
        return () => {}
      },
    },
    redirect: {
      subscribe: (run: (val: any) => void) => {
        run(mocks.redirect)
        return () => {}
      },
    },
    isActive: {
      subscribe: (run: (fn: any) => void) => {
        run((path: string) => path === mocks.activePath)
        return () => {}
      },
    },
  }
})

vi.mock("@/stores/builder", () => ({
  datasources: mocks.datasources,
  builderStore: mocks.builderStore,
  workspaceConnections: mocks.workspaceConnections,
}))

vi.mock("@/components/backend/DatasourceNavigator/DatasourceNavigator.svelte", () =>
  import("@/test/mocks/MockSlot.svelte")
)
vi.mock("@/components/design/Panel.svelte", () =>
  import("@/test/mocks/MockSlot.svelte")
)
vi.mock("@/components/common/NavHeader.svelte", () =>
  import("@/test/mocks/MockSlot.svelte")
)
vi.mock("@/components/common/TopBar.svelte", () =>
  import("@/test/mocks/MockSlot.svelte")
)
vi.mock("./_components/APIModal.svelte", () =>
  import("@/test/mocks/MockSlot.svelte")
)

import ApisLayout from "./_layout.svelte"

describe("Apis layout", () => {
  beforeEach(() => {
    mocks.goto.mockReset()
    mocks.redirect.mockReset()
    mocks.activePath = "./new"
    mocks.datasources.set({ list: [] })
  })

  it("does not redirect when on ./new and there are no rest datasources", () => {
    mocks.datasources.set({ list: [] })
    render(ApisLayout)

    expect(mocks.redirect).not.toHaveBeenCalled()
  })

  it("redirects to ./query/new without preselecting an unrelated workspace connection when rest datasources exist", () => {
    const restDatasource: Datasource = {
      _id: "ds_unrelated",
      name: "Unrelated REST API",
      source: IntegrationTypes.REST,
      config: {},
    } as any

    mocks.datasources.set({ list: [restDatasource] })
    render(ApisLayout)

    expect(mocks.redirect).toHaveBeenCalledWith("./query/new")
  })

  it("redirects to ./query/new without preselecting first datasource when multiple rest datasources exist", () => {
    const ds1: Datasource = {
      _id: "ds_project_a",
      name: "Project A REST API",
      source: IntegrationTypes.REST,
      config: {},
    } as any
    const ds2: Datasource = {
      _id: "ds_project_b",
      name: "Project B REST API",
      source: IntegrationTypes.REST,
      config: {},
    } as any

    mocks.datasources.set({ list: [ds1, ds2] })
    render(ApisLayout)

    expect(mocks.redirect).toHaveBeenCalledWith("./query/new")
    expect(mocks.redirect).not.toHaveBeenCalledWith("./query/new/ds_project_a")
  })
})
