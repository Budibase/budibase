import { features } from "@budibase/backend-core"
import { structures } from "@budibase/backend-core/tests"
import { FeatureFlag } from "@budibase/types"
import { buildExternalTableId } from "../../../integrations/utils"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import {
  basicDatasource,
  basicTable,
} from "../../../tests/utilities/structures"

describe("/projects", () => {
  const config = new TestConfiguration()

  afterAll(() => {
    config.end()
  })

  const withProjectsEnabled = async <T>(f: () => Promise<T>) => {
    return await features.testutils.withFeatureFlags(
      config.getTenantId(),
      { [FeatureFlag.PROJECTS]: true },
      f
    )
  }

  beforeEach(async () => {
    await config.newTenant()
  })

  it("returns 404 when the feature flag is disabled", async () => {
    await config.api.project.fetch({ status: 404 })
  })

  it("creates, fetches, and updates projects", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
        description: "Operational workflows",
        color: "#8CA171",
      })

      expect(project._id).toBeDefined()
      expect(project.name).toBe("Operations")
      expect(project.description).toBe("Operational workflows")
      expect(project.color).toBe("#8CA171")
      expect(project.createdAt).toBeDefined()
      expect(project.updatedAt).toBeDefined()

      const { projects } = await config.api.project.fetch()
      expect(projects.map(existing => existing._id)).toContain(project._id)

      const updated = await config.api.project.update({
        _id: project._id,
        _rev: project._rev,
        name: "Operations revised",
        description: "Updated",
        color: " #7E8F68 ",
      })

      expect(updated.project.name).toBe("Operations revised")
      expect(updated.project.description).toBe("Updated")
      expect(updated.project.color).toBe("#7E8F68")
      expect(updated.project.createdAt).toBe(project.createdAt)
    })
  })

  it("rejects stale revisions on update", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
      })

      await config.api.project.update({
        ...project,
        name: "Updated operations",
      })

      await config.api.project.update(
        {
          ...project,
          name: "Stale operations",
        },
        {
          status: 409,
        }
      )
    })
  })

  it("rejects assigning an unknown project id", async () => {
    await withProjectsEnabled(async () => {
      const datasource = await config.api.datasource.create(
        basicDatasource().datasource
      )

      await config.api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "Ops app",
          url: "/ops-app",
          projectIds: ["project_missing"],
        }),
        {
          status: 404,
          body: {
            message: "Project 'project_missing' not found.",
          },
        }
      )

      const externalTable = basicTable(datasource, {
        _id: buildExternalTableId(datasource._id!, "TestTable"),
        projectIds: ["project_missing"],
      })

      await config.api.datasource.update(
        {
          ...datasource,
          entities: {
            [externalTable.name]: externalTable,
          },
        },
        {
          status: 404,
          body: {
            message: "Project 'project_missing' not found.",
          },
        }
      )
    })
  })

  it("rejects assigning a project while the feature is disabled", async () => {
    await config.api.workspaceApp.create(
      structures.workspaceApps.createRequest({
        name: "Ops app",
        url: "/ops-app",
        projectIds: ["project_1"],
      }),
      {
        status: 404,
        body: {
          message: "Projects feature is not enabled.",
        },
      }
    )
  })

  it("preserves omitted external table project assignments", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
      })
      const datasource = await config.api.datasource.create(
        basicDatasource().datasource
      )
      const externalTable = basicTable(datasource, {
        _id: buildExternalTableId(datasource._id!, "TestTable"),
        projectIds: [project._id],
      })
      const assignedDatasource = await config.api.datasource.update({
        ...datasource,
        entities: {
          [externalTable.name]: externalTable,
        },
      })
      const { projectIds: _projectIds, ...tableUpdate } =
        assignedDatasource.entities![externalTable.name]

      const updatedDatasource = await config.api.datasource.update({
        ...assignedDatasource,
        entities: {
          [externalTable.name]: {
            ...tableUpdate,
            name: "Updated table",
          },
        },
      })

      expect(
        updatedDatasource.entities![externalTable.name].projectIds
      ).toEqual([project._id])
    })
  })

  it("clears assignments when deleting a project", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
      })

      const { workspaceApp } = await config.api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "Ops app",
          url: "/ops-app",
          projectIds: [project._id],
        })
      )

      const table = await config.api.table.save({
        ...basicTable(),
        projectIds: [project._id],
      })

      const datasource = await config.api.datasource.create({
        ...basicDatasource().datasource,
        projectIds: [project._id],
      })
      const entityKey = "TestTable"
      const externalTable = basicTable(datasource, {
        _id: buildExternalTableId(datasource._id!, entityKey),
        name: "Updated table",
        projectIds: [project._id],
      })
      await config.api.datasource.update({
        ...datasource,
        entities: {
          [entityKey]: externalTable,
        },
      })

      await config.api.project.delete(project._id, project._rev)

      const fetchedWorkspaceApp = await config.api.workspaceApp.find(
        workspaceApp._id!
      )
      expect(fetchedWorkspaceApp.projectIds).toBeUndefined()

      const fetchedTable = await config.api.table.get(table._id!)
      expect(fetchedTable.projectIds).toBeUndefined()

      const fetchedDatasource = await config.api.datasource.get(datasource._id!)
      expect(fetchedDatasource.projectIds).toBeUndefined()
      expect(fetchedDatasource.entities![entityKey].projectIds).toBeUndefined()
      expect(fetchedDatasource.entities![externalTable.name]).toBeUndefined()
      expect(Object.keys(fetchedDatasource.entities!)).toEqual([entityKey])
    })
  })

  it("does not clear assignments when deleting with a stale rev", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
      })
      const { workspaceApp } = await config.api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "Ops app",
          url: "/ops-app",
          projectIds: [project._id],
        })
      )

      await config.api.project.delete(project._id, "1-stale", {
        status: 409,
      })

      const fetchedWorkspaceApp = await config.api.workspaceApp.find(
        workspaceApp._id!
      )
      expect(fetchedWorkspaceApp.projectIds).toEqual([project._id])
    })
  })
})
