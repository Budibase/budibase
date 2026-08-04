import { SourceName } from "@budibase/types"
import type { Agent, Datasource, Query } from "@budibase/types"
import { fetch, update } from "./crud"
import {
  migrateQueryToolReferences,
  updateAgentQueryToolReferences,
} from "./queryToolReferences"

jest.mock("./crud", () => ({
  fetch: jest.fn(),
  update: jest.fn(),
}))

const fetchAgents = jest.mocked(fetch)
const updateAgent = jest.mocked(update)

const makeAgent = (overrides: Partial<Agent> = {}): Agent => ({
  _id: "agent_1",
  _rev: "1-agent",
  name: "Agent",
  aiconfig: "config_1",
  operations: [],
  ...overrides,
})

describe("updateAgentQueryToolReferences", () => {
  const existingBindings = {
    readableBinding: "api.owen_wilson.GET random wow",
    runtimeBinding: "rest_owen_wilson_get_random_wow_001",
  }
  const updatedBindings = {
    readableBinding: "api.owen_wilson.GET another wow",
    runtimeBinding: "rest_owen_wilson_get_another_wow_002",
  }

  it("updates readable and runtime bindings across agent operations", () => {
    const agent = makeAgent({
      operations: [
        {
          id: "operation_1",
          name: "Main",
          live: true,
          promptInstructions:
            "Use {{ api.owen_wilson.GET random wow }} then {{api.owen_wilson.GET random wow}}.",
          enabledTools: [
            existingBindings.runtimeBinding,
            updatedBindings.runtimeBinding,
            "other_tool",
          ],
          allowKnowledgeSourceDownload: true,
        },
      ],
    })

    const updated = updateAgentQueryToolReferences({
      agent,
      existingBindings,
      updatedBindings,
    })

    expect(updated?.operations?.[0]).toMatchObject({
      promptInstructions:
        "Use {{ api.owen_wilson.GET another wow }} then {{api.owen_wilson.GET another wow}}.",
      enabledTools: [updatedBindings.runtimeBinding, "other_tool"],
    })
  })

  it("updates readable bindings when the sanitised runtime name is unchanged", () => {
    const agent = makeAgent({
      operations: [
        {
          id: "operation_1",
          name: "Main",
          live: false,
          promptInstructions: "{{ api.owen_wilson.Old name }}",
          enabledTools: ["rest_owen_wilson_same_name_003"],
          allowKnowledgeSourceDownload: true,
        },
      ],
    })

    const updated = updateAgentQueryToolReferences({
      agent,
      existingBindings: {
        readableBinding: "api.owen_wilson.Old name",
        runtimeBinding: "rest_owen_wilson_same_name_003",
      },
      updatedBindings: {
        readableBinding: "api.owen_wilson.New name",
        runtimeBinding: "rest_owen_wilson_same_name_003",
      },
    })

    expect(updated?.operations?.[0]).toMatchObject({
      promptInstructions: "{{ api.owen_wilson.New name }}",
      enabledTools: ["rest_owen_wilson_same_name_003"],
    })
  })

  it("does not update unrelated agents", () => {
    const agent = makeAgent({
      operations: [
        {
          id: "operation_1",
          name: "Main",
          live: false,
          promptInstructions:
            "Mention api.owen_wilson.GET random wow as plain text.",
          enabledTools: ["other_tool"],
          allowKnowledgeSourceDownload: true,
        },
      ],
    })

    expect(
      updateAgentQueryToolReferences({
        agent,
        existingBindings,
        updatedBindings,
      })
    ).toBeUndefined()
  })
})

describe("migrateQueryToolReferences", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("migrates all query bindings when a datasource is renamed", async () => {
    const agent = makeAgent({
      operations: [
        {
          id: "operation_1",
          name: "Main",
          live: false,
          promptInstructions:
            "Use {{ api.old_api.First query }} and {{ api.old_api.Second query }}.",
          enabledTools: [
            "rest_old_api_first_query_001",
            "rest_old_api_second_query_002",
          ],
          allowKnowledgeSourceDownload: true,
        },
      ],
    })
    const existingDatasource: Datasource = {
      _id: "datasource_1",
      name: "Old API",
      type: "datasource",
      source: SourceName.REST,
      config: {},
    }
    const updatedDatasource = {
      ...existingDatasource,
      name: "New API",
    }
    const makeQuery = (name: string, id: string): Query => ({
      _id: id,
      datasourceId: "datasource_1",
      fields: {},
      name,
      parameters: [],
      queryVerb: "read",
      readable: true,
      schema: {},
      transformer: "return data",
    })
    const queries = [
      makeQuery("First query", "query_001"),
      makeQuery("Second query", "query_002"),
    ]
    fetchAgents.mockResolvedValue([agent])
    updateAgent.mockResolvedValue(agent)

    await migrateQueryToolReferences(
      queries.map(query => ({
        existingDatasource,
        updatedDatasource,
        existingQuery: query,
        updatedQuery: query,
      }))
    )

    expect(updateAgent).toHaveBeenCalledTimes(1)
    expect(updateAgent).toHaveBeenCalledWith(
      expect.objectContaining({
        operations: [
          expect.objectContaining({
            promptInstructions:
              "Use {{ api.new_api.First query }} and {{ api.new_api.Second query }}.",
            enabledTools: [
              "rest_new_api_first_query_001",
              "rest_new_api_second_query_002",
            ],
          }),
        ],
      })
    )
  })
})
