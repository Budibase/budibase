import { context, features } from "@budibase/backend-core"
import { FeatureFlag, SourceName, type Table } from "@budibase/types"
import { DatabaseImpl } from "../../../../../backend-core/src/db/couch/DatabaseImpl"
import sdk from "../../../sdk"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { basicTable } from "../../../tests/utilities/structures"

describe("project assignment response results", () => {
  const config = new TestConfiguration()

  beforeEach(async () => {
    await config.newTenant()
  })
  afterAll(() => config.end())

  it.each([false, true])(
    "keeps ordinary resource responses unchanged when propagation has no work (projects=%s)",
    async enabled => {
      await features.testutils.withFeatureFlags(
        config.getTenantId(),
        { [FeatureFlag.PROJECTS]: enabled },
        async () => {
          const table = await config.api.table.save(basicTable())
          expect(table).not.toHaveProperty("projectAssignment")
          const persisted = await config.api.table.get(table._id!)
          expect(persisted).not.toHaveProperty("projectAssignment")
        }
      )
    }
  )

  it("returns partial assignment results when updating a datasource", async () => {
    const datasource = await config.api.datasource.create({
      type: "datasource",
      source: SourceName.REST,
      name: "Example API",
      config: {},
    })
    const projects = jest.replaceProperty(sdk, "projects", {
      ...sdk.projects,
      propagateProjectDependencyChanges: jest.fn().mockResolvedValueOnce({
        status: "incomplete",
        resourceIds: ["table_failed"],
        assignedResourceIds: ["table_saved"],
      }),
    })
    try {
      await config.api.datasource.update(
        { ...datasource, name: "Updated API" },
        {
          body: {
            projectAssignment: {
              assignedDependencyIds: ["table_saved"],
              failedDependencyIds: ["table_failed"],
            },
          },
        }
      )
    } finally {
      projects.restore()
    }
  })

  it("preserves datasource assignment failures while importing its queries", async () => {
    const projects = jest.replaceProperty(sdk, "projects", {
      ...sdk.projects,
      propagateProjectDependencyChanges: jest.fn().mockResolvedValueOnce({
        status: "incomplete",
        resourceIds: ["table_failed"],
        assignedResourceIds: ["table_saved"],
      }),
      propagateCreatedResourceDependencies: jest.fn().mockResolvedValueOnce({
        status: "complete",
        assignedResourceIds: ["table_query_saved"],
      }),
    })
    try {
      const response = await config
        .request!.post("/api/queries/import")
        .set(config.defaultHeaders())
        .send({
          datasource: {
            type: "datasource",
            source: SourceName.REST,
            name: "Example API",
            config: {},
          },
          data: JSON.stringify({
            openapi: "3.0.0",
            info: { title: "Example API", version: "1.0.0" },
            servers: [{ url: "https://example.com" }],
            paths: {
              "/items": {
                get: { responses: { "200": { description: "Success" } } },
              },
            },
          }),
        })
        .expect(200)
      expect(response.body.queries).toHaveLength(1)
      expect(response.body.projectAssignment).toEqual({
        assignedDependencyIds: ["table_saved", "table_query_saved"],
        failedDependencyIds: ["table_failed"],
      })
      expect(
        await config.api.datasource.get(response.body.datasourceId)
      ).not.toHaveProperty("projectAssignment")
    } finally {
      projects.restore()
    }
  })

  it("keeps already assigned dependencies successful when another write throws", async () => {
    const assigned = await config.api.table.save(basicTable())
    const pending = await config.api.table.save(basicTable())
    await config.doInContext(config.getDevWorkspaceId(), async () => {
      const db = context.getWorkspaceDB()
      await db.put({
        ...(await db.get<Table>(assigned._id!)),
        projectIds: ["project_operations"],
      })
      const bulkDocs = jest
        .spyOn(DatabaseImpl.prototype, "bulkDocs")
        .mockRejectedValueOnce(new Error("Dependency write unavailable"))
      try {
        const outcome = await sdk.projects.propagateProjectIdsToDependencyIds({
          dependencyIds: [assigned._id!, pending._id!],
          projectIds: ["project_operations"],
        })
        expect(outcome).toEqual({
          status: "incomplete",
          assignedResourceIds: [assigned._id],
          resourceIds: [pending._id],
        })
      } finally {
        bulkDocs.mockRestore()
      }
    })
  })
})
