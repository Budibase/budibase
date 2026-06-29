import { context, features } from "@budibase/backend-core"
import { structures } from "@budibase/backend-core/tests"
import { FeatureFlag } from "@budibase/types"
import { buildExternalTableId } from "../../../integrations/utils"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import {
  basicDatasource,
  basicDatasourcePlus,
  basicTable,
} from "../../../tests/utilities/structures"
import * as projects from "../../../sdk/workspace/projects/crud"

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

  const createAssignedProject = async () => {
    const { project } = await config.api.project.create({
      name: "Operations",
    })
    return project
  }

  const createAssignedWorkspaceApp = async (projectId: string) => {
    const { workspaceApp } = await config.api.workspaceApp.create(
      structures.workspaceApps.createRequest({
        name: "Ops app",
        url: "/ops-app",
        projectIds: [projectId],
      })
    )
    return workspaceApp
  }

  const createAssignedInternalTable = async (projectId: string) => {
    return await config.api.table.save({
      ...basicTable(),
      projectIds: [projectId],
    })
  }

  const createAssignedExternalDatasource = async (projectId: string) => {
    const datasource = await config.api.datasource.create({
      ...basicDatasource().datasource,
      projectIds: [projectId],
    })
    const entityKey = "TestTable"
    const externalTable = basicTable(datasource, {
      _id: buildExternalTableId(datasource._id!, entityKey),
      name: "Updated table",
      projectIds: [projectId],
    })
    await config.api.datasource.update({
      ...datasource,
      entities: {
        [entityKey]: externalTable,
      },
    })
    return { datasource, entityKey }
  }

  const createAssignedDatasourcePlus = async (projectId: string) => {
    const datasourcePlus = await config.api.datasource.create({
      ...basicDatasourcePlus().datasource,
      projectIds: [projectId],
    })
    const plusEntityKey = "PlusTable"
    const plusExternalTable = basicTable(datasourcePlus, {
      _id: buildExternalTableId(datasourcePlus._id!, plusEntityKey),
      name: "Updated plus table",
      projectIds: [projectId],
    })
    await config.api.datasource.update({
      ...datasourcePlus,
      entities: {
        [plusEntityKey]: plusExternalTable,
      },
    })
    return { datasourcePlus, plusEntityKey }
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

  it.each([
    "red; background-image: url(https://example.com/tracker)",
    "url(https://example.com/tracker)",
  ])("rejects unsafe project color '%s'", async color => {
    await withProjectsEnabled(async () => {
      await config.api.project.create(
        {
          name: "Unsafe color",
          color,
        },
        {
          status: 400,
          body: {
            message: "Project color is invalid.",
          },
        }
      )
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

  it("does not update non-project documents through project routes", async () => {
    await withProjectsEnabled(async () => {
      const datasource = await config.api.datasource.create(
        basicDatasource().datasource
      )

      await config.api.project.update(
        {
          _id: datasource._id!,
          _rev: datasource._rev!,
          name: "Not a project",
        },
        {
          status: 404,
          body: {
            message: `Project with id '${datasource._id}' not found.`,
          },
        }
      )

      const fetched = await config.api.datasource.get(datasource._id!)
      expect(fetched.name).toBe(datasource.name)
    })
  })

  it("does not delete non-project documents through project routes", async () => {
    await withProjectsEnabled(async () => {
      const datasource = await config.api.datasource.create(
        basicDatasource().datasource
      )

      await config.api.project.delete(datasource._id!, datasource._rev!, {
        status: 404,
      })

      const fetched = await config.api.datasource.get(datasource._id!)
      expect(fetched._id).toBe(datasource._id)
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

  it("clears workspace app and internal table assignments when deleting a project", async () => {
    await withProjectsEnabled(async () => {
      const project = await createAssignedProject()
      const workspaceApp = await createAssignedWorkspaceApp(project._id)
      const table = await createAssignedInternalTable(project._id)

      await config.api.project.delete(project._id, project._rev)

      const fetchedWorkspaceApp = await config.api.workspaceApp.find(
        workspaceApp._id!
      )
      expect(fetchedWorkspaceApp.projectIds).toBeUndefined()

      const fetchedTable = await config.api.table.get(table._id!)
      expect(fetchedTable.projectIds).toBeUndefined()
    })
  })

  it("clears external datasource and entity assignments when deleting a project", async () => {
    await withProjectsEnabled(async () => {
      const project = await createAssignedProject()
      const { datasource, entityKey } = await createAssignedExternalDatasource(
        project._id
      )

      await config.api.project.delete(project._id, project._rev)

      const fetchedDatasource = await config.api.datasource.get(datasource._id!)
      expect(fetchedDatasource.projectIds).toBeUndefined()
      expect(fetchedDatasource.entities![entityKey].projectIds).toBeUndefined()
    })
  })

  it("clears datasource_plus entity assignments when deleting a project", async () => {
    await withProjectsEnabled(async () => {
      const project = await createAssignedProject()
      const { datasourcePlus, plusEntityKey } =
        await createAssignedDatasourcePlus(project._id)

      await config.api.project.delete(project._id, project._rev)

      const fetchedDatasourcePlus = await config.api.datasource.get(
        datasourcePlus._id!
      )
      expect(fetchedDatasourcePlus.projectIds).toBeUndefined()
      expect(
        fetchedDatasourcePlus.entities![plusEntityKey].projectIds
      ).toBeUndefined()
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

  it("restores assignments when project cleanup fails after partial cleanup", async () => {
    await withProjectsEnabled(async () => {
      const project = await createAssignedProject()
      const workspaceApp = await createAssignedWorkspaceApp(project._id)
      await createAssignedInternalTable(project._id)

      await config.doInContext(undefined, async () => {
        const db = context.getWorkspaceDB()
        const bulkDocs = jest
          .spyOn(db, "bulkDocs")
          .mockResolvedValueOnce([
            { id: workspaceApp._id!, rev: "2-mock" },
            { id: "table_mock", error: "conflict", reason: "cleanup failed" },
          ])

        try {
          await expect(
            projects.remove(project._id, project._rev)
          ).rejects.toThrow("Failed to clear project assignments.")
        } finally {
          bulkDocs.mockRestore()
        }
      })

      const fetchedWorkspaceApp = await config.api.workspaceApp.find(
        workspaceApp._id!
      )
      expect(fetchedWorkspaceApp.projectIds).toEqual([project._id])
    })
  })
})
