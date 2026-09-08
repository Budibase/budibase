import { SourceName, ToolExecutionPrincipal } from "@budibase/types"
import type { Agent, Datasource, Query } from "@budibase/types"
import { requesterTools } from "../tests/utils"
import { fetch, update } from "./crud"
import {
  getQueryToolBindingsForResource,
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
    runtimeBinding: "rest_owen_wilson_get_random_wow",
  }
  const updatedBindings = {
    readableBinding: "api.owen_wilson.GET another wow",
    runtimeBinding: "rest_owen_wilson_get_another_wow",
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
          enabledTools: requesterTools(
            existingBindings.runtimeBinding,
            updatedBindings.runtimeBinding,
            "other_tool"
          ),
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
      enabledTools: requesterTools(
        updatedBindings.runtimeBinding,
        "other_tool"
      ),
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
          enabledTools: requesterTools("rest_owen_wilson_same_name"),
          allowKnowledgeSourceDownload: true,
        },
      ],
    })

    const updated = updateAgentQueryToolReferences({
      agent,
      existingBindings: {
        readableBinding: "api.owen_wilson.Old name",
        runtimeBinding: "rest_owen_wilson_same_name",
      },
      updatedBindings: {
        readableBinding: "api.owen_wilson.New name",
        runtimeBinding: "rest_owen_wilson_same_name",
      },
    })

    expect(updated?.operations?.[0]).toMatchObject({
      promptInstructions: "{{ api.owen_wilson.New name }}",
      enabledTools: requesterTools("rest_owen_wilson_same_name"),
    })
  })

  it("preserves the legacy principal when renaming a runtime binding", () => {
    const legacyConfig = {
      toolName: existingBindings.runtimeBinding,
      executionPrincipal: ToolExecutionPrincipal.REQUESTER,
    }
    const agent = makeAgent({
      operations: [
        {
          id: "operation_1",
          name: "Main",
          live: true,
          enabledTools: [legacyConfig],
          allowKnowledgeSourceDownload: true,
        },
      ],
    })

    const updated = updateAgentQueryToolReferences({
      agent,
      existingBindings,
      updatedBindings,
    })

    expect(updated?.operations?.[0].enabledTools).toEqual([
      {
        ...legacyConfig,
        toolName: updatedBindings.runtimeBinding,
      },
    ])
  })

  it.each(["legacy-first", "updated-first"])(
    "preserves the existing destination principal when %s",
    order => {
      const legacyConfig = {
        toolName: existingBindings.runtimeBinding,
        executionPrincipal: ToolExecutionPrincipal.REQUESTER,
      }
      const destinationConfig = {
        toolName: updatedBindings.runtimeBinding,
        executionPrincipal: ToolExecutionPrincipal.ADMIN,
      }
      const enabledTools =
        order === "legacy-first"
          ? [legacyConfig, destinationConfig]
          : [destinationConfig, legacyConfig]
      const agent = makeAgent({
        operations: [
          {
            id: "operation_1",
            name: "Main",
            live: true,
            enabledTools,
            allowKnowledgeSourceDownload: true,
          },
        ],
      })

      const updated = updateAgentQueryToolReferences({
        agent,
        existingBindings,
        updatedBindings,
      })

      expect(updated?.operations?.[0].enabledTools).toEqual([destinationConfig])
    }
  )

  it("does not update unrelated agents", () => {
    const agent = makeAgent({
      operations: [
        {
          id: "operation_1",
          name: "Main",
          live: false,
          promptInstructions:
            "Mention api.owen_wilson.GET random wow as plain text.",
          enabledTools: requesterTools("other_tool"),
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
          enabledTools: requesterTools(
            "rest_old_api_first_query_uery_first_query",
            "rest_old_api_second_query_ery_second_query"
          ),
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
    const makeQuery = (name: string): Query => ({
      _id: `query_${name}`,
      datasourceId: "datasource_1",
      fields: {},
      name,
      parameters: [],
      queryVerb: "read",
      readable: true,
      schema: {},
      transformer: "return data",
    })
    const queries = [makeQuery("First query"), makeQuery("Second query")]
    fetchAgents.mockResolvedValue([agent])
    updateAgent.mockImplementation(async updatedAgent => updatedAgent)

    const referencingAgents = await migrateQueryToolReferences(
      queries.map(query => ({
        existingDatasource,
        updatedDatasource,
        existingQuery: query,
        updatedQuery: query,
      }))
    )

    expect(updateAgent).toHaveBeenCalledTimes(1)
    expect(referencingAgents).toEqual([
      expect.objectContaining({
        operations: [
          expect.objectContaining({
            promptInstructions:
              "Use {{ api.new_api.First query }} and {{ api.new_api.Second query }}.",
            enabledTools: requesterTools(
              "rest_new_api_first_query_uery_first_query",
              "rest_new_api_second_query_ery_second_query"
            ),
          }),
        ],
      }),
    ])
  })

  it("returns referencing agents when query bindings do not change", async () => {
    const datasource: Datasource = {
      _id: "datasource_1",
      name: "API",
      type: "datasource",
      source: SourceName.REST,
      config: {},
    }
    const query: Query = {
      _id: "query_1",
      datasourceId: datasource._id!,
      fields: {},
      name: "Query",
      parameters: [],
      queryVerb: "read",
      readable: true,
      schema: {},
      transformer: "return data",
    }
    const bindings = getQueryToolBindingsForResource({ datasource, query })
    const agent = makeAgent({
      operations: [
        {
          id: "operation_1",
          name: "Main",
          live: false,
          enabledTools: requesterTools(bindings.runtimeBinding),
          allowKnowledgeSourceDownload: true,
        },
      ],
    })
    fetchAgents.mockResolvedValue([agent])

    const referencingAgents = await migrateQueryToolReferences({
      existingDatasource: datasource,
      updatedDatasource: { ...datasource, _id: "datasource_2" },
      existingQuery: query,
      updatedQuery: { ...query, datasourceId: "datasource_2" },
    })

    expect(referencingAgents).toEqual([agent])
    expect(updateAgent).not.toHaveBeenCalled()
  })

  it("ignores matching readable names while recognising migrated runtime tools", async () => {
    const existingDatasource: Datasource = {
      _id: "datasource_1",
      name: "Old API",
      type: "datasource",
      source: SourceName.REST,
      config: {},
    }
    const updatedDatasource: Datasource = {
      ...existingDatasource,
      _id: "datasource_2",
      name: "New API",
    }
    const existingQuery: Query = {
      _id: "query_1",
      datasourceId: existingDatasource._id!,
      fields: {},
      name: "Query",
      parameters: [],
      queryVerb: "read",
      readable: true,
      schema: {},
      transformer: "return data",
    }
    const updatedQuery = {
      ...existingQuery,
      datasourceId: updatedDatasource._id!,
    }
    const updatedBindings = getQueryToolBindingsForResource({
      datasource: updatedDatasource,
      query: updatedQuery,
    })
    const readableNameCollision = makeAgent({
      _id: "agent_readable_collision",
      operations: [
        {
          id: "operation_1",
          name: "Main",
          live: false,
          promptInstructions: `Use {{ ${updatedBindings.readableBinding} }}.`,
          allowKnowledgeSourceDownload: true,
        },
      ],
    })
    const migratedRuntimeReference = makeAgent({
      _id: "agent_migrated_runtime",
      operations: [
        {
          id: "operation_1",
          name: "Main",
          live: false,
          enabledTools: requesterTools(updatedBindings.runtimeBinding),
          allowKnowledgeSourceDownload: true,
        },
      ],
    })
    fetchAgents.mockResolvedValue([
      readableNameCollision,
      migratedRuntimeReference,
    ])

    const referencingAgents = await migrateQueryToolReferences({
      existingDatasource,
      updatedDatasource,
      existingQuery,
      updatedQuery,
    })

    expect(referencingAgents).toEqual([migratedRuntimeReference])
    expect(updateAgent).not.toHaveBeenCalled()
  })
})
