import { beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/svelte"
import {
  AutomationActionStepId,
  AutomationStepType,
  SourceName,
} from "@budibase/types"
import type {
  APIRequestStep,
  Datasource,
  Query,
  RestTemplateId,
} from "@budibase/types"
import APIRequest from "./APIRequest.svelte"
import { automationStore } from "@/stores/builder"
import { workspaceConnections } from "@/stores/builder/workspaceConnection"

if (!Element.prototype.animate) {
  Element.prototype.animate = () =>
    Object.assign(Object.create(null), {
      onfinish: null,
      cancel: () => {},
      finished: Promise.resolve(),
    }) as Animation
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

  return {
    inputData: {} as Record<string, any>,
    datasourceStore: createStore({ list: [] as Datasource[] }),
    queryStore: createStore({ list: [] as Query[] }),
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
    flatTemplates: [
      {
        id: "github",
        name: "GitHub",
      },
    ],
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

const bamboohrDatasource: Datasource = {
  _id: "bamboohr_ds",
  _rev: "1",
  type: "datasource",
  name: "BambooHR",
  source: SourceName.REST,
  restTemplateId: "bamboohr",
  config: {},
}

const githubDatasource: Datasource = {
  _id: "github_ds",
  _rev: "1",
  type: "datasource",
  name: "GitHub",
  source: SourceName.REST,
  restTemplateId: "github",
  config: {},
}

const makeQuery = (
  query: Pick<Query, "_id" | "name" | "datasourceId">
): Query => ({
  ...query,
  queryVerb: "read",
  parameters: [],
  fields: {},
  transformer: "",
  schema: {},
  readable: true,
})

describe("APIRequest", () => {
  const makeBlock = (id: string): APIRequestStep => ({
    id,
    stepId: AutomationActionStepId.API_REQUEST,
    name: "API request",
    tagline: "",
    icon: "",
    description: "",
    type: AutomationStepType.ACTION,
    schema: {
      inputs: { properties: {} },
      outputs: { properties: {} },
    },
    inputs: { query: { queryId: "" } },
  })

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
    vi.mocked(workspaceConnections.startDraft).mockImplementation(
      (templateId?: RestTemplateId) => {
        testState.workspaceConnectionStore.set({
          draft: {
            key: templateId ?? "__custom__",
            templateId,
            datasource: {},
            query: {},
            dirty: false,
          },
          list: [],
          selectedConnectionId: null,
        })
      }
    )
    testState.datasourceStore.set({
      list: [bamboohrDatasource, githubDatasource],
    })
    testState.queryStore.set({ list: [] })
    testState.inputData = {}
  })

  it("does not pass the first REST datasource into the create request explorer when no query is selected", async () => {
    render(APIRequest, {
      props: {
        block: makeBlock("step_1"),
        context: undefined,
      },
    })

    await fireEvent.click(screen.getByText("Open API explorer"))
    const viewer = await screen.findByTestId("api-endpoint-viewer")

    expect(viewer).toBeInTheDocument()
    expect(
      screen.getByTestId("api-endpoint-viewer-datasource").textContent
    ).toBe("")
  })

  it("filters request selection to the connector template and hides add API", async () => {
    testState.inputData = { restTemplateId: "github" }
    testState.queryStore.set({
      list: [
        makeQuery({
          _id: "bamboohr_query",
          name: "BambooHR employees",
          datasourceId: "bamboohr_ds",
        }),
        makeQuery({
          _id: "github_query",
          name: "GitHub repos",
          datasourceId: "github_ds",
        }),
      ],
    })

    render(APIRequest, {
      props: {
        block: makeBlock("step_1"),
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

  it("shows a connector CTA when the connector template has no connection", async () => {
    testState.inputData = { restTemplateId: "github" }
    testState.datasourceStore.set({
      list: [bamboohrDatasource],
    })

    render(APIRequest, {
      props: {
        block: makeBlock("step_1"),
        context: undefined,
      },
    })

    expect(screen.queryByText("Select a request")).toBeNull()
    expect(screen.queryByText("No REST requests available.")).toBeNull()

    await fireEvent.click(screen.getByText("Connect to GitHub"))

    expect(workspaceConnections.startDraft).toHaveBeenCalledWith("github")
    expect(
      screen.getByTestId("api-endpoint-viewer-open-add-connection").textContent
    ).toBe("true")
  })

  it("keeps the explorer available when the connector template has a connection but no requests", async () => {
    testState.inputData = { restTemplateId: "github" }

    render(APIRequest, {
      props: {
        block: makeBlock("step_1"),
        context: undefined,
      },
    })

    expect(screen.getByText("Select a request")).toBeInTheDocument()
    expect(screen.getByText("Open API explorer")).toBeInTheDocument()
    expect(screen.queryByText("Connect to GitHub")).toBeNull()
  })

  it("passes the connector template into the API explorer for existing connector requests", async () => {
    testState.inputData = {
      restTemplateId: "github",
      query: { queryId: "github_query" },
    }
    testState.queryStore.set({
      list: [
        makeQuery({
          _id: "github_query",
          name: "GitHub repos",
          datasourceId: "github_ds",
        }),
      ],
    })

    render(APIRequest, {
      props: {
        block: makeBlock("step_1"),
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
      ).toBe("")
    })
  })

  it("keeps existing request saves inside automations and closes through the saved query handler", async () => {
    testState.inputData = {
      restTemplateId: "github",
      query: { queryId: "github_query" },
    }
    testState.queryStore.set({
      list: [
        makeQuery({
          _id: "github_query",
          name: "GitHub repos",
          datasourceId: "github_ds",
        }),
      ],
    })

    render(APIRequest, {
      props: {
        block: makeBlock("step_1"),
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
        expect.objectContaining({
          id: "step_1",
          stepId: AutomationActionStepId.API_REQUEST,
        })
      )
    })
  })

  it("opens a pending connector template when the selected block changes", async () => {
    vi.mocked(
      automationStore.actions.consumeApiRequestTemplate
    ).mockImplementation((blockId: string) =>
      blockId === "step_2" ? ("github" satisfies RestTemplateId) : undefined
    )

    const { rerender } = render(APIRequest, {
      props: {
        block: makeBlock("step_1"),
        context: undefined,
      },
    })

    await rerender({
      block: makeBlock("step_2"),
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
      blockId === "step_1" ? ("github" satisfies RestTemplateId) : undefined
    )
    testState.queryStore.set({
      list: [
        makeQuery({
          _id: "github_query",
          name: "GitHub repos",
          datasourceId: "github_ds",
        }),
      ],
    })

    render(APIRequest, {
      props: {
        block: makeBlock("step_1"),
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
