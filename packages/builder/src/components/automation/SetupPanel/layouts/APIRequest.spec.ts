import { beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/svelte"
import type { Datasource } from "@budibase/types"
import APIRequest from "./APIRequest.svelte"
import { automationStore } from "@/stores/builder"
import { workspaceConnections } from "@/stores/builder/workspaceConnection"

if (!Element.prototype.animate) {
  Element.prototype.animate = () =>
    ({ onfinish: null, cancel: () => {}, finished: Promise.resolve() }) as any
}

const testState = vi.hoisted(() => {
  const createStore = <T>(initial: T) => {
    let value = initial
    const subscribers = new Set<(value: T) => void>()
    const store = {
      subscribe: (callback: (value: T) => void) => {
        subscribers.add(callback)
        callback(value)
        return () => subscribers.delete(callback)
      },
      set: (next: T) => {
        value = next
        subscribers.forEach(callback => callback(value))
      },
    }
    return store
  }

  const bamboohrDatasource: Datasource = {
    _id: "bamboohr_ds",
    _rev: "1",
    type: "datasource",
    name: "BambooHR",
    source: "REST" as any,
    restTemplateId: "bamboohr" as any,
    config: {},
  }

  const githubDatasource: Datasource = {
    _id: "github_ds",
    _rev: "1",
    type: "datasource",
    name: "GitHub",
    source: "REST" as any,
    restTemplateId: "github" as any,
    config: {},
  }

  return {
    bamboohrDatasource,
    githubDatasource,
    inputData: {} as Record<string, any>,
    datasourceStore: createStore({
      list: [bamboohrDatasource, githubDatasource],
    }),
    queryStore: createStore({ list: [] as any[] }),
    workspaceConnectionStore: createStore({
      draft: null,
      list: [],
      selectedConnectionId: null,
    }),
  }
})

vi.mock("@/components/integration/APIEndpointViewer.svelte", async () => ({
  default: (await import("@/test/MockAPIEndpointViewer.svelte")).default,
}))

vi.mock("@/stores/builder/automations", () => ({}))

vi.mock("@/stores/builder", () => {
  return {
    automationStore: {
      actions: {
        getInputData: vi.fn(() => testState.inputData),
        requestUpdate: vi.fn(),
        consumeApiRequestTemplate: vi.fn(),
      },
    },
    datasources: testState.datasourceStore,
    queries: testState.queryStore,
  }
})

vi.mock("@/stores/builder/workspaceConnection", () => ({
  workspaceConnections: {
    ...testState.workspaceConnectionStore,
    startDraft: vi.fn(),
    discardDraft: vi.fn(),
  },
  datasourceMatchesRestTemplate: vi.fn(
    (datasource: Datasource, templateId: string) =>
      datasource.restTemplateId === templateId
  ),
}))

vi.mock("@/stores/builder/restTemplates", () => ({
  restTemplates: {
    flatTemplates: [],
  },
  featuredTemplates: [],
}))

vi.mock("@/dataBinding", () => ({
  getAuthBindings: vi.fn(() => []),
  runtimeToReadableBinding: vi.fn((_, value) => value),
}))

vi.mock("@/components/integration/query", () => ({
  buildQueryBindings: vi.fn(() => ({ mergedBindings: [] })),
}))

describe("APIRequest", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    if (!document.querySelector(".modal-container")) {
      const modalContainer = document.createElement("div")
      modalContainer.classList.add("modal-container")
      document.body.appendChild(modalContainer)
    }
    if (!document.querySelector(".spectrum")) {
      const spectrumContainer = document.createElement("div")
      spectrumContainer.classList.add("spectrum")
      document.body.appendChild(spectrumContainer)
    }
    testState.workspaceConnectionStore.set({
      draft: null,
      list: [],
      selectedConnectionId: null,
    })
    testState.datasourceStore.set({
      list: [testState.bamboohrDatasource, testState.githubDatasource],
    })
    testState.queryStore.set({ list: [] })
    testState.inputData = {}
  })

  it("does not pass the first REST datasource into the create request explorer when no query is selected", async () => {
    render(APIRequest, {
      props: {
        block: { id: "step_1", inputs: {} } as any,
        context: undefined,
      },
    })

    await fireEvent.click(screen.getByText("Open API explorer"))

    await waitFor(() => {
      expect(
        screen.getByTestId("api-endpoint-viewer-datasource").textContent
      ).toBe("")
    })
  })

  it("filters request selection to the connector template and hides add API", async () => {
    testState.inputData = { restTemplateId: "github" }
    testState.queryStore.set({
      list: [
        {
          _id: "bamboohr_query",
          name: "BambooHR employees",
          datasourceId: "bamboohr_ds",
          queryVerb: "read",
        },
        {
          _id: "github_query",
          name: "GitHub repos",
          datasourceId: "github_ds",
          queryVerb: "read",
        },
      ],
    })

    render(APIRequest, {
      props: {
        block: { id: "step_1", inputs: {} } as any,
        context: undefined,
      },
    })

    await fireEvent.click(screen.getByText("Select a request"))

    await waitFor(() => {
      expect(screen.getByText("GitHub repos")).not.toBeNull()
      expect(screen.queryByText("BambooHR employees")).toBeNull()
      expect(screen.queryByText("Add new API")).toBeNull()
    })
  })

  it("passes the connector template into the API explorer for existing connector requests", async () => {
    testState.inputData = {
      restTemplateId: "github",
      query: { queryId: "github_query" },
    }
    testState.queryStore.set({
      list: [
        {
          _id: "github_query",
          name: "GitHub repos",
          datasourceId: "github_ds",
          queryVerb: "read",
        },
      ],
    })

    render(APIRequest, {
      props: {
        block: { id: "step_1", inputs: {} } as any,
        context: undefined,
      },
    })

    await fireEvent.click(screen.getByText("Open API explorer"))

    await waitFor(() => {
      expect(screen.getByTestId("api-endpoint-viewer-query").textContent).toBe(
        "github_query"
      )
      expect(
        screen.getByTestId("api-endpoint-viewer-template").textContent
      ).toBe("github")
      expect(
        screen.getByTestId("api-endpoint-viewer-popover-target").textContent
      ).toBe(".spectrum")
      expect(
        screen.getByTestId("api-endpoint-viewer-popover-z-index").textContent
      ).toBe("9999")
    })
  })

  it("keeps existing request saves inside automations and closes through the saved query handler", async () => {
    testState.inputData = {
      restTemplateId: "github",
      query: { queryId: "github_query" },
    }
    testState.queryStore.set({
      list: [
        {
          _id: "github_query",
          name: "GitHub repos",
          datasourceId: "github_ds",
          queryVerb: "read",
        },
      ],
    })

    render(APIRequest, {
      props: {
        block: { id: "step_1", inputs: {} } as any,
        context: undefined,
      },
    })

    await fireEvent.click(screen.getByText("Open API explorer"))

    await waitFor(() => {
      expect(
        screen.getByTestId("api-endpoint-viewer-save-and-close").textContent
      ).toBe("true")
      expect(
        screen.getByTestId("api-endpoint-viewer-redirect-new-query").textContent
      ).toBe("false")
    })

    await fireEvent.click(screen.getByText("Save request"))

    await waitFor(() => {
      expect(automationStore.actions.requestUpdate).toHaveBeenCalledWith(
        { query: { queryId: "saved_query" } },
        { id: "step_1", inputs: {} }
      )
    })
  })

  it("opens a pending connector template when the selected block changes", async () => {
    vi.mocked(
      automationStore.actions.consumeApiRequestTemplate
    ).mockImplementation((blockId: string) =>
      blockId === "step_2" ? ("github" as any) : undefined
    )

    const { rerender } = render(APIRequest, {
      props: {
        block: { id: "step_1", inputs: {} } as any,
        context: undefined,
      },
    })

    await rerender({
      block: { id: "step_2", inputs: {} } as any,
      context: undefined,
    })

    await waitFor(() => {
      expect(workspaceConnections.startDraft).toHaveBeenCalledWith("github")
    })
  })

  it("does not open a connector draft when the template has an existing request", async () => {
    vi.mocked(
      automationStore.actions.consumeApiRequestTemplate
    ).mockImplementation((blockId: string) =>
      blockId === "step_1" ? ("github" as any) : undefined
    )
    testState.queryStore.set({
      list: [
        {
          _id: "github_query",
          name: "GitHub repos",
          datasourceId: "github_ds",
          queryVerb: "read",
        },
      ],
    })

    render(APIRequest, {
      props: {
        block: { id: "step_1", inputs: {} } as any,
        context: undefined,
      },
    })

    await waitFor(() => {
      expect(
        automationStore.actions.consumeApiRequestTemplate
      ).toHaveBeenCalledWith("step_1")
    })
    expect(workspaceConnections.startDraft).not.toHaveBeenCalled()
  })
})
