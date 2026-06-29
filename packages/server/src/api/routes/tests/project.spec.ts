import { context, features, ViewName } from "@budibase/backend-core"
import { DatabaseImpl } from "../../../../../backend-core/src/db/couch/DatabaseImpl"
import { structures } from "@budibase/backend-core/tests"
import {
  AutomationTriggerStepId,
  DesignDocument,
  FeatureFlag,
  isEmailTrigger,
  type Automation,
  type EmailTrigger,
  type EmailTriggerInputs,
  type Project,
  type ProjectPackageDependencyIndex,
} from "@budibase/types"
import { Header } from "@budibase/shared-core"
import fsp from "fs/promises"
import { tmpdir } from "os"
import { join } from "path"
import { Readable } from "stream"
import { pipeline } from "stream/promises"
import * as tar from "tar"
import { TRIGGER_DEFINITIONS } from "../../../automations"
import sdk from "../../../sdk"
import * as projects from "../../../sdk/workspace/projects/crud"
import { buildExternalTableId } from "../../../integrations/utils"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { setupDefaultCompletionsAIConfig } from "../../../tests/utilities/aiConfig"
import {
  automationTrigger,
  basicDatasource,
  basicDatasourcePlus,
  basicQuery,
  basicScreen,
  basicTable,
  createQueryScreen,
  newAutomation,
} from "../../../tests/utilities/structures"

describe("/projects", () => {
  const config = new TestConfiguration()
  let cleanupAIConfig: undefined | (() => Promise<void>)
  type PipelineDestination = Parameters<typeof pipeline>[1]

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
    cleanupAIConfig = await setupDefaultCompletionsAIConfig(config, "default")
  })

  afterEach(async () => {
    await cleanupAIConfig?.()
    cleanupAIConfig = undefined
  })

  const readTarEntries = async (buffer: Buffer) => {
    const files = new Map<string, Buffer>()
    const parser = tar.list({
      onReadEntry: entry => {
        if (entry.type === "Directory") {
          return
        }

        const chunks: Buffer[] = []
        entry.on("data", chunk => chunks.push(chunk))
        entry.on("end", () => {
          files.set(
            entry.path,
            Buffer.concat(chunks.map(chunk => new Uint8Array(chunk)))
          )
        })
      },
    })
    await pipeline(Readable.from(buffer), parser as PipelineDestination)
    return files
  }

  const createTarPackage = async (
    entries: Record<string, unknown>,
    beforeCreate?: (_tmpPath: string) => Promise<void>
  ) => {
    const tmpPath = await fsp.mkdtemp(join(tmpdir(), "project-package-"))
    const tarPath = join(tmpPath, "project-export.tar.gz")

    try {
      await Promise.all(
        Object.entries(entries).map(async ([entryPath, value]) => {
          const fullPath = join(tmpPath, entryPath)
          await fsp.mkdir(join(fullPath, ".."), { recursive: true })
          await fsp.writeFile(fullPath, JSON.stringify(value, null, 2))
        })
      )
      await beforeCreate?.(tmpPath)
      await tar.create(
        {
          gzip: true,
          file: tarPath,
          cwd: tmpPath,
        },
        Object.keys(entries)
      )
      return await fsp.readFile(tarPath)
    } finally {
      await fsp.rm(tmpPath, { recursive: true, force: true })
    }
  }

  const createOversizedTarPackage = async () => {
    const oversizedEntryPath = "docs/automation/au_oversized.json"
    const entries = createMinimalPackageEntries({
      docs: {
        [oversizedEntryPath]: {
          _id: "au_oversized",
          name: "Oversized automation",
        },
      },
    })

    return await createTarPackage(
      entries,
      async tmpPath =>
        await fsp.truncate(join(tmpPath, oversizedEntryPath), 101 * 1024 * 1024)
    )
  }

  const createMinimalPackageEntries = (
    overrides: {
      manifest?: Record<string, unknown>
      project?: Record<string, unknown>
      dependencyIndex?: Record<string, unknown>
      docs?: Record<string, unknown>
      extraEntries?: Record<string, unknown>
    } = {}
  ) => {
    const project = {
      _id: "project_source",
      name: "Operations",
      createdAt: new Date().toISOString(),
      ...overrides.project,
    }
    const manifest = {
      formatVersion: 1,
      artifactType: "project",
      budibaseVersion: "test",
      exportedAt: new Date().toISOString(),
      project,
      sourceWorkspace: {
        id: "app_source",
      },
      resourcesByType: {
        project: 1,
      },
      containsRows: false,
      containsAttachments: false,
      requiresSecrets: false,
      unsupportedContent: [],
      ...overrides.manifest,
    }
    const dependencyIndex = {
      rootProjectId: "project_source",
      directMembers: [],
      resources: {
        project_source: {
          dependencies: [],
        },
      },
      ...overrides.dependencyIndex,
    }

    return {
      "manifest.json": manifest,
      "project.json": project,
      "dependency-index.json": dependencyIndex,
      ...overrides.docs,
      ...overrides.extraEntries,
    }
  }

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

  it("rejects unusable project names on create", async () => {
    await withProjectsEnabled(async () => {
      await config.api.project.create(
        {
          name: "   ",
        },
        {
          status: 400,
          body: {
            message: "Project name is required.",
          },
        }
      )
    })
  })

  it("rejects unusable project names on update", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
      })

      await config.api.project.update(
        {
          ...project,
          name: "   ",
        },
        {
          status: 400,
          body: {
            message: "Project name is required.",
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

  it("removes only the deleted project from multi-project assignments", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
      })
      const { project: retainedProject } = await config.api.project.create({
        name: "Support",
      })
      const projectIds = [project._id, retainedProject._id]

      const { workspaceApp } = await config.api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "Ops app",
          url: "/ops-app",
          projectIds,
        })
      )
      const automation = await config.createAutomation()
      const { automation: updatedAutomation } =
        await config.api.automation.update({
          ...automation,
          projectIds,
        })
      const agent = await config.api.agent.create({
        name: "Ops agent",
        aiconfig: "default",
        projectIds,
      })
      const table = await config.api.table.save({
        ...basicTable(),
        projectIds,
      })
      const datasource = await config.api.datasource.create({
        ...basicDatasource().datasource,
        projectIds,
      })
      const entityKey = "TestTable"
      const externalTable = basicTable(datasource, {
        _id: buildExternalTableId(datasource._id!, entityKey),
        name: "Updated table",
        projectIds,
      })
      await config.api.datasource.update({
        ...datasource,
        entities: {
          [entityKey]: externalTable,
        },
      })
      const query = await config.api.query.save({
        ...basicQuery(datasource._id!),
        projectIds,
      })

      await config.api.project.delete(project._id, project._rev)

      const expectedProjectIds = [retainedProject._id]
      const fetchedWorkspaceApp = await config.api.workspaceApp.find(
        workspaceApp._id!
      )
      const fetchedAutomation = await config.api.automation.get(
        updatedAutomation._id!
      )
      const { agents } = await config.api.agent.fetch()
      const fetchedAgent = agents.find(existing => existing._id === agent._id)
      const fetchedTable = await config.api.table.get(table._id!)
      const fetchedDatasource = await config.api.datasource.get(datasource._id!)
      const fetchedQuery = await config.api.query.get(query._id!)

      expect(fetchedWorkspaceApp.projectIds).toEqual(expectedProjectIds)
      expect(fetchedAutomation.projectIds).toEqual(expectedProjectIds)
      expect(fetchedAgent?.projectIds).toEqual(expectedProjectIds)
      expect(fetchedTable.projectIds).toEqual(expectedProjectIds)
      expect(fetchedDatasource.projectIds).toEqual(expectedProjectIds)
      expect(fetchedDatasource.entities![entityKey].projectIds).toEqual(
        expectedProjectIds
      )
      expect(fetchedQuery.projectIds).toEqual(expectedProjectIds)
    })
  })

  it("uses the project members view when deleting project assignments", async () => {
    await withProjectsEnabled(async () => {
      const project = await createAssignedProject()
      const workspaceApp = await createAssignedWorkspaceApp(project._id)
      const table = await createAssignedInternalTable(project._id)
      const { datasource } = await createAssignedExternalDatasource(project._id)
      const { datasourcePlus } = await createAssignedDatasourcePlus(project._id)
      const automation = await config.createAutomation()
      const { automation: assignedAutomation } =
        await config.api.automation.update({
          ...automation,
          projectIds: [project._id],
        })
      const agent = await config.api.agent.create({
        name: "Ops agent",
        aiconfig: "default",
        projectIds: [project._id],
      })
      const query = await config.api.query.save({
        ...basicQuery(datasource._id!),
        projectIds: [project._id],
      })
      const allDocs = jest.spyOn(DatabaseImpl.prototype, "allDocs")

      try {
        await config.api.project.delete(project._id, project._rev)
        const broadFetches = allDocs.mock.calls.filter(([params]) => {
          return !params.keys
        })
        expect(broadFetches).toEqual([])
      } finally {
        allDocs.mockRestore()
      }

      const fetchedWorkspaceApp = await config.api.workspaceApp.find(
        workspaceApp._id!
      )
      const fetchedAutomation = await config.api.automation.get(
        assignedAutomation._id!
      )
      const { agents } = await config.api.agent.fetch()
      const fetchedAgent = agents.find(existing => existing._id === agent._id)
      const fetchedTable = await config.api.table.get(table._id!)
      const fetchedDatasource = await config.api.datasource.get(datasource._id!)
      const fetchedDatasourcePlus = await config.api.datasource.get(
        datasourcePlus._id!
      )
      const fetchedQuery = await config.api.query.get(query._id!)

      expect(fetchedWorkspaceApp.projectIds).toBeUndefined()
      expect(fetchedAutomation.projectIds).toBeUndefined()
      expect(fetchedAgent?.projectIds).toBeUndefined()
      expect(fetchedTable.projectIds).toBeUndefined()
      expect(fetchedDatasource.projectIds).toBeUndefined()
      expect(fetchedDatasourcePlus.projectIds).toBeUndefined()
      expect(fetchedQuery.projectIds).toBeUndefined()
    })
  })

  it("recreates the project members view when deleting project assignments", async () => {
    await withProjectsEnabled(async () => {
      const project = await createAssignedProject()
      const workspaceApp = await createAssignedWorkspaceApp(project._id)

      await config.doInContext(config.getDevWorkspaceId(), async () => {
        const db = context.getWorkspaceDB()
        const designDoc = await db.get<DesignDocument>("_design/database")
        delete designDoc.views?.[ViewName.PROJECT_MEMBERS]
        await db.put(designDoc)
      })

      await config.api.project.delete(project._id, project._rev)

      const fetchedWorkspaceApp = await config.api.workspaceApp.find(
        workspaceApp._id!
      )
      expect(fetchedWorkspaceApp.projectIds).toBeUndefined()

      await config.doInContext(config.getDevWorkspaceId(), async () => {
        const designDoc = await context
          .getWorkspaceDB()
          .get<DesignDocument>("_design/database")
        expect(designDoc.views?.[ViewName.PROJECT_MEMBERS]).toBeDefined()
      })
    })
  })

  it("preserves stored automation email passwords when deleting a project", async () => {
    await withProjectsEnabled(async () => {
      const project = await createAssignedProject()
      const password = "imap-secret"
      const trigger: EmailTrigger = {
        ...automationTrigger(TRIGGER_DEFINITIONS.EMAIL),
        stepId: AutomationTriggerStepId.EMAIL,
        inputs: {
          host: "imap.example.com",
          port: 993,
          secure: true,
          username: "ops@example.com",
          password,
          mailbox: "INBOX",
        } satisfies EmailTriggerInputs,
      }
      const { automation } = await config.api.automation.post({
        ...newAutomation({ trigger, steps: [] }),
        projectIds: [project._id],
      })

      await config.api.project.delete(project._id, project._rev)

      const stored = await config.doInContext(
        config.getDevWorkspaceId(),
        async () =>
          await context.getWorkspaceDB().get<Automation>(automation._id!)
      )

      expect(stored.projectIds).toBeUndefined()
      if (!isEmailTrigger(stored.definition.trigger)) {
        throw new Error("Expected stored automation to have an email trigger")
      }
      expect(stored.definition.trigger.inputs.password).toBe(password)
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

  it("preserves assignments when updates omit project ids", async () => {
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
      const automation = await config.createAutomation()
      const { automation: assignedAutomation } =
        await config.api.automation.update({
          ...automation,
          projectIds: [project._id],
        })
      const agent = await config.api.agent.create({
        name: "Ops agent",
        aiconfig: "default",
        projectIds: [project._id],
      })
      const table = await config.api.table.save({
        ...basicTable(),
        projectIds: [project._id],
      })
      const datasource = await config.api.datasource.create({
        ...basicDatasource().datasource,
        projectIds: [project._id],
      })
      const query = await config.api.query.save({
        ...basicQuery(datasource._id!),
        projectIds: [project._id],
      })

      const updatedWorkspaceApp = await config.doInContext(
        config.getDevWorkspaceId(),
        async () =>
          await sdk.workspaceApps.update({
            _id: workspaceApp._id,
            _rev: workspaceApp._rev,
            name: "Ops app updated",
            url: workspaceApp.url,
            navigation: workspaceApp.navigation,
            theme: workspaceApp.theme,
            customTheme: workspaceApp.customTheme,
            disabled: workspaceApp.disabled,
          })
      )

      const { projectIds: _automationProjectIds, ...automationUpdate } =
        assignedAutomation
      const { automation: updatedAutomation } =
        await config.api.automation.update({
          ...automationUpdate,
          name: "Ops automation updated",
        })

      const { projectIds: _agentProjectIds, ...agentUpdate } = agent
      const updatedAgent = await config.api.agent.update({
        ...agentUpdate,
        name: "Ops agent updated",
      })

      const { projectIds: _tableProjectIds, ...tableUpdate } = table
      const updatedTable = await config.api.table.save({
        ...tableUpdate,
        name: "Ops table updated",
      })

      const { projectIds: _datasourceProjectIds, ...datasourceUpdate } =
        datasource
      const updatedDatasource = await config.api.datasource.update({
        ...datasourceUpdate,
        name: "Ops datasource updated",
      })

      const { projectIds: _queryProjectIds, ...queryUpdate } = query
      const updatedQuery = await config.api.query.save({
        ...queryUpdate,
        name: "Ops query updated",
      })

      expect(updatedWorkspaceApp.projectIds).toEqual([project._id])
      expect(updatedAutomation.projectIds).toEqual([project._id])
      expect(updatedAgent.projectIds).toEqual([project._id])
      expect(updatedTable.projectIds).toEqual([project._id])
      expect(updatedDatasource.projectIds).toEqual([project._id])
      expect(updatedQuery.projectIds).toEqual([project._id])
    })
  })

  it("restores assignments when project cleanup fails after partial cleanup", async () => {
    await withProjectsEnabled(async () => {
      const project = await createAssignedProject()
      const workspaceApp = await createAssignedWorkspaceApp(project._id)
      await createAssignedInternalTable(project._id)

      await config.doInContext(undefined, async () => {
        const bulkDocs = jest
          .spyOn(DatabaseImpl.prototype, "bulkDocs")
          .mockImplementationOnce(async docs =>
            docs.map((doc, index) =>
              index === 0
                ? { id: doc._id!, rev: "2-mock" }
                : {
                    id: doc._id!,
                    error: "conflict",
                    reason: "cleanup failed",
                  }
            )
          )

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

  it("preserves valid project assignments when duplicating resources", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
      })
      const table = await config.api.table.save({
        ...basicTable(),
        projectIds: [project._id],
      })
      const { workspaceApp } = await config.api.workspaceApp.create({
        name: "Operations app",
        url: "/operations-app",
        projectIds: [project._id],
      })
      const agent = await config.api.agent.create({
        name: "Ops agent",
        aiconfig: "default",
        projectIds: [project._id],
      })

      const duplicatedTable = await config.api.table.duplicate(table._id!)
      const { workspaceApp: duplicatedWorkspaceApp } =
        await config.api.workspaceApp.duplicate(workspaceApp._id!)
      const duplicatedAgent = await config.api.agent.duplicate(agent._id!)

      expect(duplicatedTable.projectIds).toEqual([project._id])
      expect(duplicatedWorkspaceApp.projectIds).toEqual([project._id])
      expect(duplicatedAgent.projectIds).toEqual([project._id])
    })
  })

  it("clears project assignments when duplicating resources with projects disabled", async () => {
    let tableId = ""
    let workspaceAppId = ""
    let agentId = ""

    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
      })
      const table = await config.api.table.save({
        ...basicTable(),
        projectIds: [project._id],
      })
      const { workspaceApp } = await config.api.workspaceApp.create({
        name: "Operations app",
        url: "/operations-app",
        projectIds: [project._id],
      })
      const agent = await config.api.agent.create({
        name: "Ops agent",
        aiconfig: "default",
        projectIds: [project._id],
      })

      tableId = table._id!
      workspaceAppId = workspaceApp._id!
      agentId = agent._id!
    })

    const duplicatedTable = await config.api.table.duplicate(tableId!)
    const { workspaceApp: duplicatedWorkspaceApp } =
      await config.api.workspaceApp.duplicate(workspaceAppId!)
    const duplicatedAgent = await config.api.agent.duplicate(agentId!)

    expect(duplicatedTable.projectIds).toBeUndefined()
    expect(duplicatedWorkspaceApp.projectIds).toBeUndefined()
    expect(duplicatedAgent.projectIds).toBeUndefined()
  })

  it("exports a project tarball with selective docs and manifest", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
        description: "Operational workflows",
        color: "#8CA171",
      })
      await config.doInContext(config.getDevWorkspaceId(), async () => {
        const persistedProject = await context
          .getWorkspaceDB()
          .get<Project>(project._id)
        await context.getWorkspaceDB().put({
          ...persistedProject,
          createdAt: "invalid",
        })
      })

      const datasource = await config.api.datasource.create({
        ...basicDatasource().datasource,
        config: {
          password: "super-secret",
        },
        projectIds: [project._id],
      })
      const query = await config.api.query.save({
        ...basicQuery(datasource._id!),
        projectIds: [project._id],
      })
      const table = await config.api.table.save({
        ...basicTable(),
        projectIds: [project._id],
      })
      const { workspaceApp } = await config.api.workspaceApp.create({
        name: "Operations app",
        url: "/operations-app",
        projectIds: [project._id],
      })
      const screen = await config.api.screen.save({
        ...createQueryScreen(datasource._id!, query),
        workspaceAppId: workspaceApp._id,
      })

      const automation = await config.createAutomation()
      await config.api.automation.update({
        ...automation,
        projectIds: [project._id],
      })
      const agent = await config.api.agent.create({
        name: "Ops agent",
        aiconfig: "default",
        live: true,
        slackIntegration: {
          botToken: "secret-token",
          signingSecret: "secret-signing-key",
          chatAppId: "slack-app-id",
          messagingEndpointUrl: "https://source.example/slack",
          idleTimeoutMinutes: 20,
          requireUserLink: true,
        },
        telegramIntegration: {
          botToken: "secret-telegram-token",
          webhookSecretToken: "secret-telegram-webhook",
          botUserName: "ops_bot",
          chatAppId: "telegram-app-id",
          messagingEndpointUrl: "https://source.example/telegram",
          idleTimeoutMinutes: 25,
        },
        projectIds: [project._id],
      })

      const body = await config.api.project.export(project._id)
      const files = await readTarEntries(body)

      expect(Array.from(files.keys())).toEqual(
        expect.arrayContaining([
          "manifest.json",
          "project.json",
          "dependency-index.json",
          `docs/datasource/${datasource._id}.json`,
          `docs/query/${query._id}.json`,
          `docs/table/${table._id}.json`,
          `docs/automation/${automation._id}.json`,
          `docs/agent/${agent._id}.json`,
          `docs/workspace_app/${workspaceApp._id}.json`,
          `docs/screen/${screen._id}.json`,
        ])
      )

      const manifest = JSON.parse(files.get("manifest.json")!.toString())
      expect(manifest).toMatchObject({
        artifactType: "project",
        formatVersion: 1,
        containsRows: false,
        containsAttachments: false,
        requiresSecrets: true,
        project: {
          _id: project._id,
          name: project.name,
          description: project.description,
          color: project.color,
        },
        resourcesByType: {
          project: 1,
          datasource: 1,
          query: 1,
          table: 1,
          automation: 1,
          agent: 1,
          workspace_app: 1,
          screen: 1,
        },
        unsupportedContent: [
          {
            type: "agent_linked_content",
            count: 1,
          },
        ],
      })

      const exportedProject = JSON.parse(files.get("project.json")!.toString())
      expect(exportedProject._id).toBe(project._id)
      expect(exportedProject._rev).toBeUndefined()
      expect(manifest.project.createdAt).not.toBe("invalid")
      expect(manifest.project.createdAt).toBe(manifest.project.updatedAt)
      expect(exportedProject.createdAt).toBe(manifest.project.createdAt)
      expect(exportedProject.updatedAt).toBe(manifest.project.updatedAt)

      const exportedDatasource = JSON.parse(
        files.get(`docs/datasource/${datasource._id}.json`)!.toString()
      )
      expect(exportedDatasource.config.password).not.toBe("super-secret")

      const exportedAgent = JSON.parse(
        files.get(`docs/agent/${agent._id}.json`)!.toString()
      )
      expect(exportedAgent.live).toBe(false)
      expect(exportedAgent.slackIntegration).toEqual({
        idleTimeoutMinutes: 20,
        requireUserLink: true,
      })
      expect(exportedAgent.telegramIntegration).toEqual({
        botUserName: "ops_bot",
        idleTimeoutMinutes: 25,
      })

      const dependencyIndex = JSON.parse(
        files.get("dependency-index.json")!.toString()
      ) as ProjectPackageDependencyIndex
      expect(dependencyIndex.rootProjectId).toBe(project._id)
      expect(
        dependencyIndex.directMembers.map(resource => resource.id)
      ).toEqual(
        expect.arrayContaining([
          datasource._id,
          query._id,
          table._id,
          automation._id,
          agent._id,
          workspaceApp._id,
        ])
      )
    })
  })

  it("returns 404 when exporting an unknown project", async () => {
    await withProjectsEnabled(async () => {
      await config.api.project.export("project_missing", undefined, {
        status: 404,
        body: {
          message: "Project with id 'project_missing' not found.",
        },
      })
    })
  })

  it("exports encrypted project tarballs when requested", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
      })

      const body = await config.api.project.export(project._id, {
        encryptPassword: "abcde",
      })
      const files = await readTarEntries(body)

      expect(Array.from(files.keys())).toEqual(
        expect.arrayContaining([
          "manifest.json.enc",
          "project.json.enc",
          "dependency-index.json.enc",
        ])
      )
    })
  })

  it("imports empty projects without requiring docs", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
      })

      const body = await config.api.project.export(project._id)
      const destinationWorkspace = await config.api.workspace.create({
        name: "Imported workspace",
      })

      await config.withHeaders(
        { [Header.APP_ID]: destinationWorkspace.appId },
        async () => {
          const imported = await config.api.project.import(body)
          expect(imported.resources).toEqual({
            project: [imported.project._id],
          })
        }
      )
    })
  })

  it("exports and remaps assigned external tables through their datasource", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "External data",
      })
      const datasource = await config.api.datasource.create(
        basicDatasource().datasource
      )
      const externalTableId = buildExternalTableId(datasource._id!, "TestTable")
      const externalTable = basicTable(datasource, {
        _id: externalTableId,
        name: "TestTable",
        primaryDisplay: `{{ ${externalTableId}.name }}`,
        projectIds: [project._id],
      })
      await config.api.datasource.update({
        ...datasource,
        entities: {
          [externalTable.name]: externalTable,
        },
      })

      const body = await config.api.project.export(project._id)
      const files = await readTarEntries(body)
      const dependencyIndex = JSON.parse(
        files.get("dependency-index.json")!.toString()
      ) as ProjectPackageDependencyIndex
      expect(dependencyIndex.directMembers.map(member => member.id)).toEqual([
        datasource._id,
      ])

      const destinationWorkspace = await config.api.workspace.create({
        name: "Imported external data",
      })
      await config.withHeaders(
        { [Header.APP_ID]: destinationWorkspace.appId },
        async () => {
          const imported = await config.api.project.import(body)
          const importedDatasourceId = imported.resources.datasource?.[0]!
          const importedDatasource =
            await config.api.datasource.get(importedDatasourceId)
          const importedExternalTable =
            importedDatasource.entities![externalTable.name]
          const importedExternalTableId = buildExternalTableId(
            importedDatasourceId,
            "TestTable"
          )

          expect(importedExternalTable._id).toBe(importedExternalTableId)
          expect(importedExternalTable.projectIds).toEqual([
            imported.project._id,
          ])
          expect(importedExternalTable.primaryDisplay).toBe(
            `{{ ${importedExternalTableId}.name }}`
          )
        }
      )
    })
  })

  it("exports and imports app screens that need workspace app repair", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
      })
      const defaultWorkspaceApp = await config.api.workspaceApp.find(
        config.getDefaultWorkspaceAppId()
      )
      const { workspaceApp } = await config.api.workspaceApp.update({
        _id: defaultWorkspaceApp._id,
        _rev: defaultWorkspaceApp._rev,
        name: defaultWorkspaceApp.name,
        url: defaultWorkspaceApp.url,
        disabled: defaultWorkspaceApp.disabled,
        navigation: defaultWorkspaceApp.navigation,
        projectIds: [project._id],
      })
      const screen = await config.api.screen.save({
        ...basicScreen("/operations"),
        workspaceAppId: workspaceApp._id,
      })

      await config.doInContext(config.getDevWorkspaceId(), async () => {
        const db = context.getWorkspaceDB()
        await db.put({
          ...screen,
          workspaceAppId: undefined,
        })
      })

      const body = await config.api.project.export(project._id)
      const files = await readTarEntries(body)
      const exportedScreen = JSON.parse(
        files.get(`docs/screen/${screen._id}.json`)!.toString()
      )

      expect(exportedScreen.workspaceAppId).toBe(workspaceApp._id)

      const destinationWorkspace = await config.api.workspace.create({
        name: "Imported workspace",
      })

      await config.withHeaders(
        { [Header.APP_ID]: destinationWorkspace.appId },
        async () => {
          const imported = await config.api.project.import(body)
          const importedScreens = await config.api.screen.list()
          const importedScreen = importedScreens.find(
            existing => existing._id === imported.resources.screen?.[0]
          )

          expect(imported.resources.workspace_app).toHaveLength(1)
          expect(imported.resources.screen).toHaveLength(1)
          expect(importedScreen?.workspaceAppId).toBe(
            imported.resources.workspace_app?.[0]
          )
        }
      )
    })
  })

  it("imports row action dependencies with remapped automation references", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
      })
      const table = await config.api.table.save({
        ...basicTable(),
        projectIds: [project._id],
      })
      const rowAction = await config.api.rowAction.save(table._id!, {
        name: "Approve",
      })

      const body = await config.api.project.export(project._id)
      const destinationWorkspace = await config.api.workspace.create({
        name: "Imported workspace",
      })

      await config.withHeaders(
        { [Header.APP_ID]: destinationWorkspace.appId },
        async () => {
          const imported = await config.api.project.import(body)
          expect(imported.resources.table).toHaveLength(1)
          expect(imported.resources.automation).toHaveLength(1)
          expect(imported.resources.row_action).toHaveLength(1)

          const importedRowActions = await config.api.rowAction.find(
            imported.resources.table?.[0]!
          )
          const importedAction = Object.values(importedRowActions.actions)[0]

          expect(importedAction).toBeDefined()
          expect(importedAction.tableId).toBe(imported.resources.table?.[0])
          expect(importedAction.automationId).toBe(
            imported.resources.automation?.[0]
          )
          expect(importedAction.id).not.toBe(rowAction.id)

          const importedAutomation = await config.api.automation.get(
            imported.resources.automation?.[0]!
          )
          const triggerInputs = importedAutomation.definition.trigger
            .inputs as {
            tableId?: string
            rowActionId?: string
          }
          expect(triggerInputs.tableId).toBe(imported.resources.table?.[0])
          expect(triggerInputs.rowActionId).toBe(importedAction.id)
        }
      )
    })
  })

  it("imports exported projects additively into another workspace", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
        description: "Operational workflows",
      })
      const datasource = await config.api.datasource.create({
        ...basicDatasource().datasource,
        config: {
          password: "super-secret",
        },
        projectIds: [project._id],
      })
      const query = await config.api.query.save({
        ...basicQuery(datasource._id!),
        name: `Lookup ${datasource._id!} records`,
        projectIds: [project._id],
      })
      const table = await config.api.table.save({
        ...basicTable(),
        projectIds: [project._id],
      })
      const { workspaceApp } = await config.api.workspaceApp.create({
        name: "Operations app",
        url: "/operations-app",
        projectIds: [project._id],
      })
      const screen = await config.api.screen.save({
        ...createQueryScreen(datasource._id!, query),
        workspaceAppId: workspaceApp._id,
      })
      const automation = await config.createAutomation()
      await config.api.automation.update({
        ...automation,
        projectIds: [project._id],
      })
      const agent = await config.api.agent.create({
        name: "Ops agent",
        aiconfig: "default",
        live: true,
        slackIntegration: {
          botToken: "secret-token",
          signingSecret: "secret-signing-key",
        },
        projectIds: [project._id],
      })

      const body = await config.api.project.export(project._id)
      const destinationWorkspace = await config.api.workspace.create({
        name: "Imported workspace",
      })

      await config.withHeaders(
        { [Header.APP_ID]: destinationWorkspace.appId },
        async () => {
          await config.api.workspaceApp.create({
            name: "Existing app",
            url: "/existing-app",
          })

          const imported = await config.api.project.import(body)
          expect(imported.project._id).not.toBe(project._id)
          expect(imported.resources.project).toEqual([imported.project._id])
          expect(imported.resources.datasource).toHaveLength(1)
          expect(imported.resources.query).toHaveLength(1)
          expect(imported.resources.table).toHaveLength(1)
          expect(imported.resources.automation).toHaveLength(1)
          expect(imported.resources.agent).toHaveLength(1)
          expect(imported.resources.workspace_app).toHaveLength(1)
          expect(imported.resources.screen).toHaveLength(1)
          expect(imported.requirements).toHaveLength(2)
          expect(imported.requirements).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                type: "datasource_secrets",
                resourceId: imported.resources.datasource?.[0],
              }),
              expect.objectContaining({
                type: "agent_secrets",
                resourceId: imported.resources.agent?.[0],
              }),
            ])
          )

          const { projects } = await config.api.project.fetch()
          expect(projects.map(existing => existing._id)).toContain(
            imported.project._id
          )

          const importedWorkspaceApps = await config.api.workspaceApp.fetch()
          expect(
            importedWorkspaceApps.workspaceApps.map(app => app.name)
          ).toEqual(expect.arrayContaining(["Existing app", "Operations app"]))

          const importedScreens = await config.api.screen.list()
          const importedScreen = importedScreens.find(
            screen => screen._id === imported.resources.screen?.[0]
          )
          expect(importedScreen).toBeDefined()
          expect(importedScreen!.workspaceAppId).toBe(
            imported.resources.workspace_app?.[0]
          )
          expect(importedScreen!.props._children?.[0].table._id).toBe(
            imported.resources.query?.[0]
          )
          expect(importedScreen!.props._children?.[0].table.datasourceId).toBe(
            imported.resources.datasource?.[0]
          )

          const importedQuery = await config.api.query.get(
            imported.resources.query?.[0]!
          )
          expect(importedQuery.datasourceId).toBe(
            imported.resources.datasource?.[0]
          )
          expect(importedQuery.name).toBe(`Lookup ${datasource._id!} records`)
          expect(importedQuery.projectIds).toEqual([imported.project._id])

          const importedTable = await config.api.table.get(
            imported.resources.table?.[0]!
          )
          expect(importedTable.projectIds).toEqual([imported.project._id])

          const importedAutomation = await config.api.automation.get(
            imported.resources.automation?.[0]!
          )
          expect(importedAutomation.projectIds).toEqual([imported.project._id])
          expect(importedAutomation.appId).toBe(destinationWorkspace.appId)
          expect(importedAutomation.disabled).toBe(true)

          const importedDatasource = await config.api.datasource.get(
            imported.resources.datasource?.[0]!
          )
          expect(importedDatasource.projectIds).toEqual([imported.project._id])
          expect(importedDatasource.config?.password).not.toBe("super-secret")

          const { agents } = await config.api.agent.fetch()
          const importedAgent = agents.find(
            existing => existing._id === imported.resources.agent?.[0]
          )
          expect(importedAgent).toBeDefined()
          expect(importedAgent?.projectIds).toEqual([imported.project._id])
          expect(importedAgent?.live).toBe(false)

          const resourceGraph =
            await config.api.resource.getResourceDependencies()
          expect(
            resourceGraph.body.resources[imported.project._id].dependencies.map(
              resource => resource.id
            )
          ).toEqual(
            expect.arrayContaining([
              imported.resources.datasource?.[0],
              imported.resources.query?.[0],
              imported.resources.table?.[0],
              imported.resources.automation?.[0],
              imported.resources.agent?.[0],
              imported.resources.workspace_app?.[0],
              imported.resources.screen?.[0],
            ])
          )
        }
      )

      expect(screen._id).toBeDefined()
      expect(table._id).toBeDefined()
      expect(agent._id).toBeDefined()
    })
  })

  it("clears foreign project assignments from imported transitive dependencies", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
      })
      const { project: otherProject } = await config.api.project.create({
        name: "Other project",
      })
      const datasource = await config.api.datasource.create({
        ...basicDatasource().datasource,
        projectIds: [otherProject._id],
      })
      const externalTableId = buildExternalTableId(
        datasource._id!,
        "ForeignTable"
      )
      const externalTable = basicTable(datasource, {
        _id: externalTableId,
        name: "ForeignTable",
        projectIds: [otherProject._id],
      })
      await config.api.datasource.update({
        ...datasource,
        entities: {
          [externalTable.name]: externalTable,
        },
      })
      const query = await config.api.query.save({
        ...basicQuery(datasource._id!),
        projectIds: [project._id],
      })

      const body = await config.api.project.export(project._id)
      const destinationWorkspace = await config.api.workspace.create({
        name: "Imported workspace",
      })

      await config.withHeaders(
        { [Header.APP_ID]: destinationWorkspace.appId },
        async () => {
          const imported = await config.api.project.import(body)
          const importedQuery = await config.api.query.get(
            imported.resources.query?.[0]!
          )
          const importedDatasource = await config.api.datasource.get(
            imported.resources.datasource?.[0]!
          )

          expect(importedQuery._id).not.toBe(query._id)
          expect(importedQuery.projectIds).toEqual([imported.project._id])
          expect(importedDatasource.projectIds).toBeUndefined()
          expect(
            importedDatasource.entities![externalTable.name].projectIds
          ).toBeUndefined()
        }
      )
    })
  })

  it("rejects encrypted project imports without a password", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
      })

      const body = await config.api.project.export(project._id, {
        encryptPassword: "abcde",
      })

      await config.api.project.import(body, undefined, {
        status: 400,
        body: {
          message: "Files are encrypted but no password has been supplied.",
        },
      })
    })
  })

  it("rejects encrypted project imports with an incorrect password", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
      })
      const body = await config.api.project.export(project._id, {
        encryptPassword: "correct-password",
      })

      await config.api.project.import(
        body,
        { encryptPassword: "incorrect-password" },
        {
          status: 400,
          body: {
            message: "Project package could not be decrypted.",
          },
        }
      )
    })
  })

  it.each([
    ["manifest", "manifest.json", null, "Project package manifest is invalid."],
    [
      "project",
      "project.json",
      null,
      "Project package project.json is invalid.",
    ],
    [
      "dependency index",
      "dependency-index.json",
      null,
      "Project package dependency index is invalid.",
    ],
  ])(
    "rejects an invalid %s shape",
    async (_label, fileName, value, message) => {
      await withProjectsEnabled(async () => {
        const packageBuffer = await createTarPackage({
          ...createMinimalPackageEntries(),
          [fileName]: value,
        })

        await config.api.project.import(packageBuffer, undefined, {
          status: 400,
          body: { message },
        })
      })
    }
  )

  it("rejects packages with docs that are not declared in the dependency index", async () => {
    await withProjectsEnabled(async () => {
      const packageBuffer = await createTarPackage(
        createMinimalPackageEntries({
          manifest: {
            resourcesByType: {
              project: 1,
              automation: 1,
            },
          },
          docs: {
            "docs/automation/au_extra.json": {
              _id: "au_extra",
              name: "Unexpected automation",
              definition: {
                trigger: {
                  id: "trigger",
                  inputs: {},
                },
                steps: [],
              },
            },
          },
        })
      )

      await config.api.project.import(packageBuffer, undefined, {
        status: 400,
        body: {
          message:
            "Project package contains docs not listed in dependency-index.json.",
        },
      })
    })
  })

  it("rejects packages that reference missing docs", async () => {
    await withProjectsEnabled(async () => {
      const packageBuffer = await createTarPackage(
        createMinimalPackageEntries({
          manifest: {
            resourcesByType: {
              project: 1,
              automation: 1,
            },
          },
          dependencyIndex: {
            resources: {
              project_source: {
                dependencies: [
                  {
                    id: "au_missing",
                    name: "Missing automation",
                    type: "automation",
                  },
                ],
              },
              au_missing: {
                dependencies: [],
              },
            },
          },
        })
      )

      await config.api.project.import(packageBuffer, undefined, {
        status: 400,
        body: {
          message: "Project package dependency index references missing docs.",
        },
      })
    })
  })

  it("rejects packages with docs that are not reachable from the project", async () => {
    await withProjectsEnabled(async () => {
      const packageBuffer = await createTarPackage(
        createMinimalPackageEntries({
          manifest: {
            resourcesByType: {
              project: 1,
              automation: 1,
            },
          },
          dependencyIndex: {
            resources: {
              project_source: {
                dependencies: [],
              },
              au_orphan: {
                dependencies: [],
              },
            },
          },
          docs: {
            "docs/automation/au_orphan.json": {
              _id: "au_orphan",
              name: "Orphan automation",
              definition: {
                trigger: {
                  id: "trigger",
                  inputs: {},
                },
                steps: [],
              },
            },
          },
        })
      )

      await config.api.project.import(packageBuffer, undefined, {
        status: 400,
        body: {
          message:
            "Project package contains docs that are not reachable from the root project.",
        },
      })
    })
  })

  it("rejects packages when doc paths do not match resource types", async () => {
    await withProjectsEnabled(async () => {
      const packageBuffer = await createTarPackage(
        createMinimalPackageEntries({
          manifest: {
            resourcesByType: {
              project: 1,
              automation: 1,
            },
          },
          dependencyIndex: {
            resources: {
              project_source: {
                dependencies: [
                  {
                    id: "ta_wrong",
                    name: "Wrongly typed table",
                    type: "automation",
                  },
                ],
              },
              ta_wrong: {
                dependencies: [],
              },
            },
          },
          docs: {
            "docs/automation/ta_wrong.json": {
              _id: "ta_wrong",
              name: "Wrongly typed table",
            },
          },
        })
      )

      await config.api.project.import(packageBuffer, undefined, {
        status: 400,
        body: {
          message:
            "Project package doc 'ta_wrong' does not match resource type 'automation'.",
        },
      })
    })
  })

  it("rejects packages with unsupported root files", async () => {
    await withProjectsEnabled(async () => {
      const packageBuffer = await createTarPackage(
        createMinimalPackageEntries({
          extraEntries: {
            "readme.txt": "unexpected",
          },
        })
      )

      await config.api.project.import(packageBuffer, undefined, {
        status: 400,
        body: {
          message: "Project package contains unsupported files.",
        },
      })
    })
  })

  it("rejects workspace exports", async () => {
    await withProjectsEnabled(async () => {
      const packageBuffer = await createTarPackage(
        createMinimalPackageEntries({
          extraEntries: {
            "db.txt": "workspace export marker",
          },
        })
      )

      await config.api.project.import(packageBuffer, undefined, {
        status: 400,
        body: {
          message: "Workspace exports cannot be imported as Project packages.",
        },
      })
    })
  })

  it("rejects malformed project import archives", async () => {
    await withProjectsEnabled(async () => {
      await config.api.project.import(
        Buffer.from("not a project archive"),
        undefined,
        {
          status: 400,
          body: {
            message: "Project package is invalid.",
          },
        }
      )
    })
  })

  it("rejects packages that exceed the extracted size limit before extraction", async () => {
    await withProjectsEnabled(async () => {
      const packageBuffer = await createOversizedTarPackage()

      expect(packageBuffer.length).toBeLessThan(50 * 1024 * 1024)
      await config.api.project.import(packageBuffer, undefined, {
        status: 400,
        body: {
          message: "Project package is too large.",
        },
      })
    })
  })

  it("rejects packages with paths that are too deep", async () => {
    await withProjectsEnabled(async () => {
      const packageBuffer = await createTarPackage(
        createMinimalPackageEntries({
          manifest: {
            resourcesByType: {
              project: 1,
              automation: 1,
            },
          },
          dependencyIndex: {
            resources: {
              project_source: {
                dependencies: [
                  {
                    id: "au_deep",
                    name: "Deep automation",
                    type: "automation",
                  },
                ],
              },
              au_deep: {
                dependencies: [],
              },
            },
          },
          docs: {
            "docs/automation/nested/deeper/au_deep.json": {
              _id: "au_deep",
              name: "Deep automation",
            },
          },
        })
      )

      await config.api.project.import(packageBuffer, undefined, {
        status: 400,
        body: {
          message: "Project package contains paths that are too deep.",
        },
      })
    })
  })
})
