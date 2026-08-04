import { SourceName } from "@budibase/types"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"

describe.each([
  {
    label: "REST",
    source: SourceName.REST,
    oldReadableBinding: "api.owen_api.Old endpoint",
    newReadableBinding: "api.owen_api.New endpoint",
    oldRuntimeBinding: "rest_owen_api_old_endpoint",
    newRuntimeBinding: "rest_owen_api_new_endpoint",
  },
  {
    label: "datasource",
    source: SourceName.POSTGRES,
    oldReadableBinding: "owen_api.Old endpoint",
    newReadableBinding: "owen_api.New endpoint",
    oldRuntimeBinding: "ds_owen_api_old_endpoint",
    newRuntimeBinding: "ds_owen_api_new_endpoint",
  },
])(
  "$label query tool renames",
  ({
    source,
    oldReadableBinding,
    newReadableBinding,
    oldRuntimeBinding,
    newRuntimeBinding,
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
      const agent = await config.api.agent.createWithOperation(
        { name: "Wow agent" },
        {
          id: "operation_1",
          name: "Get a wow",
          live: false,
          promptInstructions: `Use {{ ${oldReadableBinding} }} then {{${oldReadableBinding}}}. Keep {{ other.tool }}.`,
          enabledTools: [oldRuntimeBinding, "other_tool"],
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
          enabledTools: ["other_tool"],
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
        enabledTools: [newRuntimeBinding, "other_tool"],
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
      const agent = await config.api.agent.createWithOperation(
        { name: "Wow agent" },
        {
          id: "operation_1",
          name: "Get a wow",
          live: false,
          promptInstructions: `Use {{ ${oldReadableBinding} }}.`,
          enabledTools: [oldRuntimeBinding],
          allowKnowledgeSourceDownload: true,
        }
      )

      await config.api.query.save(query)

      const { agents } = await config.api.agent.fetch()
      expect(agents.find(candidate => candidate._id === agent._id)?._rev).toBe(
        agent._rev
      )
    })
  }
)
