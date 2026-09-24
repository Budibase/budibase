import { SourceName } from "@budibase/types"
import { requesterTools } from "../../../../sdk/workspace/ai/tests/utils"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"

describe.each([
  {
    label: "REST",
    source: SourceName.REST,
    oldReadableBinding: "api.owen_api.Old endpoint",
    newReadableBinding: "api.owen_api.New endpoint",
    oldRuntimeBinding: "rest_owen_api_old_endpoint",
    newRuntimeBinding: "rest_owen_api_new_endpoint",
    renamedDatasourceReadableBinding: "api.new_api.Old endpoint",
    renamedDatasourceRuntimeBinding: "rest_new_api_old_endpoint",
  },
  {
    label: "datasource",
    source: SourceName.POSTGRES,
    oldReadableBinding: "owen_api.Old endpoint",
    newReadableBinding: "owen_api.New endpoint",
    oldRuntimeBinding: "ds_owen_api_old_endpoint",
    newRuntimeBinding: "ds_owen_api_new_endpoint",
    renamedDatasourceReadableBinding: "new_api.Old endpoint",
    renamedDatasourceRuntimeBinding: "ds_new_api_old_endpoint",
  },
])(
  "$label query tool renames",
  ({
    source,
    oldReadableBinding,
    newReadableBinding,
    oldRuntimeBinding,
    newRuntimeBinding,
    renamedDatasourceReadableBinding,
    renamedDatasourceRuntimeBinding,
  }) => {
    const config = new TestConfiguration()

    beforeEach(async () => {
      await config.newTenant()
    })

    afterAll(() => {
      config.end()
    })

    it("updates agent instructions and enabled tools", async () => {
      const datasource = await config.api.datasource.create({
        name: "Owen API",
        type: "datasource",
        source,
        config: {},
      })
      const query = await config.api.query.save({
        name: "Old endpoint",
        datasourceId: datasource._id!,
        parameters: [],
        fields: {},
        schema: {},
        queryVerb: "read",
        transformer: null,
        readable: true,
      })
      const runtimeIdentifier = query._id!.slice(-16)
      const agent = await config.api.agent.createWithOperation(
        { name: "Wow agent" },
        {
          id: "operation_1",
          name: "Get a wow",
          live: false,
          promptInstructions: `Use {{ ${oldReadableBinding} }} then {{${oldReadableBinding}}}. Keep {{ other.tool }}.`,
          enabledTools: requesterTools(
            `${oldRuntimeBinding}_${runtimeIdentifier}`,
            "other_tool"
          ),
          allowKnowledgeSourceDownload: true,
        }
      )
      const unrelatedAgent = await config.api.agent.createWithOperation(
        { name: "Unrelated agent" },
        {
          id: "operation_2",
          name: "Other operation",
          live: false,
          promptInstructions: "Use {{ other.tool }}.",
          enabledTools: requesterTools("other_tool"),
          allowKnowledgeSourceDownload: false,
        }
      )

      await config.api.query.save({
        ...query,
        name: "New endpoint",
      })

      const { agents } = await config.api.agent.fetch()
      const updatedAgent = agents.find(candidate => candidate._id === agent._id)
      const unchangedAgent = agents.find(
        candidate => candidate._id === unrelatedAgent._id
      )

      expect(updatedAgent?.operations?.[0]).toMatchObject({
        id: "operation_1",
        name: "Get a wow",
        live: false,
        promptInstructions: `Use {{ ${newReadableBinding} }} then {{${newReadableBinding}}}. Keep {{ other.tool }}.`,
        enabledTools: requesterTools(
          `${newRuntimeBinding}_${runtimeIdentifier}`,
          "other_tool"
        ),
        allowKnowledgeSourceDownload: true,
      })
      expect(unchangedAgent?._rev).toBe(unrelatedAgent._rev)
      expect(unchangedAgent?.operations).toEqual(unrelatedAgent.operations)
    })

    it("does not update agents when the query name is unchanged", async () => {
      const datasource = await config.api.datasource.create({
        name: "Owen API",
        type: "datasource",
        source,
        config: {},
      })
      const query = await config.api.query.save({
        name: "Old endpoint",
        datasourceId: datasource._id!,
        parameters: [],
        fields: {},
        schema: {},
        queryVerb: "read",
        transformer: null,
        readable: true,
      })
      const runtimeIdentifier = query._id!.slice(-16)
      const agent = await config.api.agent.createWithOperation(
        { name: "Wow agent" },
        {
          id: "operation_1",
          name: "Get a wow",
          live: false,
          promptInstructions: `Use {{ ${oldReadableBinding} }}.`,
          enabledTools: requesterTools(
            `${oldRuntimeBinding}_${runtimeIdentifier}`
          ),
          allowKnowledgeSourceDownload: true,
        }
      )

      await config.api.query.save(query)

      const { agents } = await config.api.agent.fetch()
      expect(agents.find(candidate => candidate._id === agent._id)?._rev).toBe(
        agent._rev
      )
    })

    it("does not update agents when a query move has a stale revision", async () => {
      const sourceDatasource = await config.api.datasource.create({
        name: "Owen API",
        type: "datasource",
        source,
        config: {},
      })
      const destinationDatasource = await config.api.datasource.create({
        name: "New API",
        type: "datasource",
        source,
        config: {},
      })
      const query = await config.api.query.save({
        name: "Old endpoint",
        datasourceId: sourceDatasource._id!,
        parameters: [],
        fields: {},
        schema: {},
        queryVerb: "read",
        transformer: null,
        readable: true,
      })
      const runtimeIdentifier = query._id!.slice(-16)
      const agent = await config.api.agent.createWithOperation(
        { name: "Wow agent" },
        {
          id: "operation_1",
          name: "Get a wow",
          live: false,
          promptInstructions: `Use {{ ${oldReadableBinding} }}.`,
          enabledTools: requesterTools(
            `${oldRuntimeBinding}_${runtimeIdentifier}`
          ),
          allowKnowledgeSourceDownload: true,
        }
      )
      await config.api.query.save(query)

      await config.api.query.save(
        {
          ...query,
          name: "New endpoint",
          datasourceId: destinationDatasource._id!,
        },
        { status: 409 }
      )

      const { agents } = await config.api.agent.fetch()
      const unchangedAgent = agents.find(
        candidate => candidate._id === agent._id
      )
      expect(unchangedAgent?._rev).toBe(agent._rev)
      expect(unchangedAgent?.operations).toEqual(agent.operations)
    })

    it("updates agent references when the datasource name changes", async () => {
      const datasource = await config.api.datasource.create({
        name: "Owen API",
        type: "datasource",
        source,
        config: {},
      })
      const query = await config.api.query.save({
        name: "Old endpoint",
        datasourceId: datasource._id!,
        parameters: [],
        fields: {},
        schema: {},
        queryVerb: "read",
        transformer: null,
        readable: true,
      })
      const runtimeIdentifier = query._id!.slice(-16)
      const agent = await config.api.agent.createWithOperation(
        { name: "Wow agent" },
        {
          id: "operation_1",
          name: "Get a wow",
          live: false,
          promptInstructions: `Use {{ ${oldReadableBinding} }}.`,
          enabledTools: requesterTools(
            `${oldRuntimeBinding}_${runtimeIdentifier}`
          ),
          allowKnowledgeSourceDownload: true,
        }
      )

      await config.api.datasource.update({
        ...datasource,
        name: "New API",
      })

      const { agents } = await config.api.agent.fetch()
      expect(
        agents.find(candidate => candidate._id === agent._id)?.operations?.[0]
      ).toMatchObject({
        promptInstructions: `Use {{ ${renamedDatasourceReadableBinding} }}.`,
        enabledTools: requesterTools(
          `${renamedDatasourceRuntimeBinding}_${runtimeIdentifier}`
        ),
      })
    })
  }
)
