import { writable } from "svelte/store"
import { beforeEach, describe, expect, it, vi } from "vitest"
import type { Query } from "@budibase/types"
import { API } from "@/api"
import { agentsStore } from "@/stores/portal/agents"
import { QueryStore } from "./queries"
import { workspaceDeploymentStore } from "./workspaceDeployment"

vi.mock("@/api", () => ({
  API: {
    saveQuery: vi.fn(),
  },
}))

vi.mock("./integrations", () => ({
  integrations: writable({}),
}))

vi.mock("@/stores/portal/agents", () => ({
  agentsStore: {
    fetchAgents: vi.fn(),
  },
}))

vi.mock("./workspaceDeployment", () => ({
  workspaceDeploymentStore: {
    fetch: vi.fn(),
  },
}))

const saveQuery = vi.mocked(API.saveQuery)
const refreshAgents = vi.mocked(agentsStore.fetchAgents)
const refreshDeployment = vi.mocked(workspaceDeploymentStore.fetch)

const makeQuery = (name: string): Query => ({
  _id: "query_1",
  _rev: "1-query",
  datasourceId: "datasource_1",
  fields: {},
  name,
  parameters: [],
  queryVerb: "read",
  readable: true,
  schema: {},
  transformer: "return data",
})

describe("QueryStore", () => {
  let store: QueryStore

  beforeEach(() => {
    vi.clearAllMocks()
    store = new QueryStore()
    store.set({
      list: [makeQuery("Old name")],
      selectedQueryId: null,
      newQueryDatasourceId: undefined,
    })
    refreshAgents.mockResolvedValue([])
    refreshDeployment.mockResolvedValue()
  })

  it("refreshes agents and deployment state after renaming a query", async () => {
    const renamedQuery = makeQuery("New name")
    saveQuery.mockResolvedValue(renamedQuery)

    await store.save(renamedQuery.datasourceId, renamedQuery)

    expect(refreshAgents).toHaveBeenCalledOnce()
    expect(refreshDeployment).toHaveBeenCalledOnce()
  })

  it("does not refresh agents when the query name is unchanged", async () => {
    const unchangedQuery = makeQuery("Old name")
    saveQuery.mockResolvedValue(unchangedQuery)

    await store.save(unchangedQuery.datasourceId, unchangedQuery)

    expect(refreshAgents).not.toHaveBeenCalled()
    expect(refreshDeployment).not.toHaveBeenCalled()
  })
})
