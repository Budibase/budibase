import {
  context,
  db as dbCore,
  features,
  ViewName,
} from "@budibase/backend-core"
import { DatabaseImpl } from "../../../../../backend-core/src/db/couch/DatabaseImpl"
import { structures } from "@budibase/backend-core/tests"
import {
  AutomationTriggerStepId,
  APIWarningCode,
  DesignDocument,
  FeatureFlag,
  INTERNAL_TABLE_SOURCE_ID,
  InternalTable,
  isEmailTrigger,
  isWebhookTrigger,
  ResourceType,
  type Automation,
  type Datasource,
  type EmailTrigger,
  type EmailTriggerInputs,
  type Project,
  type ProjectPackageDependencyIndex,
  type Query,
  type Screen,
  type UpdateProjectAssignmentResponse,
  type Webhook,
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
import { getQueryIndex } from "../../../db/utils"
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
    await config.api.project.previewAssignment(
      { resourceId: "workspace_app_test", projectIds: [] },
      { status: 404 }
    )
    await config.api.project.updateAssignment(
      "workspace_app_test",
      {
        resourceRev: "1-test",
        projectIds: [],
        dependencyIds: [],
      },
      { status: 404 }
    )
  })

  it("preserves dormant project assignments on omitted updates when the feature flag is disabled", async () => {
    const workspaceApp = await withProjectsEnabled(async () => {
      const project = await createAssignedProject()
      return await createAssignedWorkspaceApp(project._id)
    })

    await config.api.workspaceApp.update({
      _id: workspaceApp._id,
      _rev: workspaceApp._rev,
      name: workspaceApp.name,
      url: workspaceApp.url,
      navigation: workspaceApp.navigation,
      theme: workspaceApp.theme,
      customTheme: workspaceApp.customTheme,
      disabled: workspaceApp.disabled,
    })

    const fetchedWorkspaceApp = await config.api.workspaceApp.find(
      workspaceApp._id!
    )
    expect(fetchedWorkspaceApp.projectIds).toEqual(workspaceApp.projectIds)
  })

  it("preserves inert legacy child assignments when the feature flag is disabled", async () => {
    const seeded = await withProjectsEnabled(async () => {
      const project = await createAssignedProject()
      const datasource = await config.api.datasource.create(
        basicDatasource().datasource
      )
      const entityKey = "TestTable"
      const datasourceWithEntity = await config.api.datasource.update({
        ...datasource,
        entities: {
          [entityKey]: basicTable(datasource, {
            _id: buildExternalTableId(datasource._id!, entityKey),
            name: "External table",
          }),
        },
      })
      const query = await config.api.query.save(basicQuery(datasource._id!))

      await config.doInContext(config.getDevWorkspaceId(), async () => {
        const db = context.getWorkspaceDB()
        const persistedDatasource = await db.get<Datasource>(datasource._id!)
        persistedDatasource.entities![entityKey].projectIds = [project._id]
        await db.put(persistedDatasource)

        const persistedQuery = await db.get<Query>(query._id!)
        await db.put({
          ...persistedQuery,
          projectIds: [project._id],
        })
      })

      return {
        project,
        entityKey,
        datasource: await config.api.datasource.get(datasource._id!),
        query: await config.api.query.get(query._id!),
        datasourceWithEntity,
      }
    })

    const fetchAutomations = jest.spyOn(sdk.automations, "fetch")
    let updatedQuery: Query
    let updatedDatasource: Datasource
    try {
      updatedQuery = await config.api.query.save({
        ...seeded.query,
        name: "Legacy query updated",
        projectIds: [],
      })
      updatedDatasource = await config.api.datasource.update({
        ...seeded.datasource,
        entities: {
          ...seeded.datasource.entities,
          [seeded.entityKey]: {
            ...seeded.datasource.entities![seeded.entityKey],
            projectIds: [],
          },
        },
      })
      expect(fetchAutomations).not.toHaveBeenCalled()
    } finally {
      fetchAutomations.mockRestore()
    }

    expect(updatedQuery!.projectIds).toEqual([seeded.project._id])
    expect(updatedDatasource!.entities![seeded.entityKey].projectIds).toEqual([
      seeded.project._id,
    ])
    expect(
      seeded.datasourceWithEntity.entities![seeded.entityKey].projectIds
    ).toBeUndefined()
  })

  it("allows unchanged dormant assignments but rejects assignment changes when the feature flag is disabled", async () => {
    const workspaceApp = await withProjectsEnabled(async () => {
      const project = await createAssignedProject()
      return await createAssignedWorkspaceApp(project._id)
    })

    const unchanged = await config.api.workspaceApp.update({
      _id: workspaceApp._id,
      _rev: workspaceApp._rev,
      name: workspaceApp.name,
      url: workspaceApp.url,
      navigation: workspaceApp.navigation,
      theme: workspaceApp.theme,
      customTheme: workspaceApp.customTheme,
      disabled: workspaceApp.disabled,
      projectIds: workspaceApp.projectIds,
    })

    expect(unchanged.workspaceApp.projectIds).toEqual(workspaceApp.projectIds)

    await config.api.workspaceApp.update(
      {
        _id: unchanged.workspaceApp._id,
        _rev: unchanged.workspaceApp._rev,
        name: unchanged.workspaceApp.name,
        url: unchanged.workspaceApp.url,
        navigation: unchanged.workspaceApp.navigation,
        theme: unchanged.workspaceApp.theme,
        customTheme: unchanged.workspaceApp.customTheme,
        disabled: unchanged.workspaceApp.disabled,
        projectIds: [],
      },
      { status: 404 }
    )

    const fetchedWorkspaceApp = await config.api.workspaceApp.find(
      workspaceApp._id!
    )
    expect(fetchedWorkspaceApp.projectIds).toEqual(workspaceApp.projectIds)
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

  it("rejects unknown direct project ids and strips entity project ids", async () => {
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

      const updatedDatasource = await config.api.datasource.update({
        ...datasource,
        entities: {
          [externalTable.name]: externalTable,
        },
      })
      expect(
        updatedDatasource.entities![externalTable.name].projectIds
      ).toBeUndefined()
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
      expect(fetchedDatasource.entities![entityKey].projectIds).toBeUndefined()
      expect(fetchedQuery.projectIds).toBeUndefined()
    })
  })

  it("uses the project members view when deleting project assignments", async () => {
    await withProjectsEnabled(async () => {
      const project = await createAssignedProject()
      await createAssignedWorkspaceApp(project._id)

      const query = jest.spyOn(DatabaseImpl.prototype, "query")

      try {
        await config.api.project.delete(project._id, project._rev)

        expect(query).toHaveBeenCalledWith(
          getQueryIndex(ViewName.PROJECT_MEMBERS),
          expect.objectContaining({
            key: project._id,
            include_docs: true,
          })
        )
      } finally {
        query.mockRestore()
      }
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

  describe("preserves assignments when updates omit project ids", () => {
    const createAssignedResources = async (projectId: string) => {
      const { workspaceApp } = await config.api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "Ops app",
          url: "/ops-app",
          projectIds: [projectId],
        })
      )
      const automation = await config.createAutomation()
      const { automation: assignedAutomation } =
        await config.api.automation.update({
          ...automation,
          projectIds: [projectId],
        })
      const agent = await config.api.agent.create({
        name: "Ops agent",
        aiconfig: "default",
        projectIds: [projectId],
      })
      const table = await config.api.table.save({
        ...basicTable(),
        projectIds: [projectId],
      })
      const datasource = await config.api.datasource.create({
        ...basicDatasource().datasource,
        projectIds: [projectId],
      })
      const query = await config.api.query.save({
        ...basicQuery(datasource._id!),
        projectIds: [projectId],
      })
      return {
        workspaceApp,
        assignedAutomation,
        agent,
        table,
        datasource,
        query,
      }
    }

    it("preserves workspace app assignments", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({
          name: "Operations",
        })
        const { workspaceApp } = await createAssignedResources(project._id)

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

        expect(updatedWorkspaceApp.projectIds).toEqual([project._id])
      })
    })

    it("preserves automation assignments", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({
          name: "Operations",
        })
        const { assignedAutomation } = await createAssignedResources(
          project._id
        )

        const { projectIds: _automationProjectIds, ...automationUpdate } =
          assignedAutomation
        const { automation: updatedAutomation } =
          await config.api.automation.update({
            ...automationUpdate,
            name: "Ops automation updated",
          })

        expect(updatedAutomation.projectIds).toEqual([project._id])
      })
    })

    it("preserves agent assignments", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({
          name: "Operations",
        })
        const { agent } = await createAssignedResources(project._id)

        const { projectIds: _agentProjectIds, ...agentUpdate } = agent
        const updatedAgent = await config.api.agent.update({
          ...agentUpdate,
          name: "Ops agent updated",
        })

        expect(updatedAgent.projectIds).toEqual([project._id])
      })
    })

    it("preserves internal table assignments", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({
          name: "Operations",
        })
        const { table } = await createAssignedResources(project._id)

        const { projectIds: _tableProjectIds, ...tableUpdate } = table
        const updatedTable = await config.api.table.save({
          ...tableUpdate,
          name: "Ops table updated",
        })

        expect(updatedTable.projectIds).toEqual([project._id])
      })
    })

    it("preserves datasource assignments", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({
          name: "Operations",
        })
        const { datasource } = await createAssignedResources(project._id)

        const { projectIds: _datasourceProjectIds, ...datasourceUpdate } =
          datasource
        const updatedDatasource = await config.api.datasource.update({
          ...datasourceUpdate,
          name: "Ops datasource updated",
        })

        expect(updatedDatasource.projectIds).toEqual([project._id])
      })
    })

    it("preserves inert legacy query assignments", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({
          name: "Operations",
        })
        const { query } = await createAssignedResources(project._id)
        await config.doInContext(config.getDevWorkspaceId(), async () => {
          const persistedQuery = await context
            .getWorkspaceDB()
            .get<Query>(query._id!)
          await context.getWorkspaceDB().put({
            ...persistedQuery,
            projectIds: [project._id],
          })
        })

        const persistedQuery = await config.api.query.get(query._id!)

        const { projectIds: _queryProjectIds, ...queryUpdate } = persistedQuery
        const updatedQuery = await config.api.query.save({
          ...queryUpdate,
          name: "Ops query updated",
        })

        expect(updatedQuery.projectIds).toEqual([project._id])
      })
    })
  })

  describe("propagates project ids to dependencies on save", () => {
    it("does not build a workspace graph for an unassigned resource save", async () => {
      await withProjectsEnabled(async () => {
        const { workspaceApp } = await config.api.workspaceApp.create(
          structures.workspaceApps.createRequest({
            name: "Unassigned app",
            url: "/unassigned-app",
          })
        )
        const fetchAutomations = jest.spyOn(sdk.automations, "fetch")

        try {
          await config.api.workspaceApp.update({
            _id: workspaceApp._id,
            _rev: workspaceApp._rev,
            name: "Still unassigned",
            url: workspaceApp.url,
            navigation: workspaceApp.navigation,
            theme: workspaceApp.theme,
            customTheme: workspaceApp.customTheme,
            disabled: workspaceApp.disabled,
          })
          expect(fetchAutomations).not.toHaveBeenCalled()
        } finally {
          fetchAutomations.mockRestore()
        }
      })
    })

    const createAutomationButtonScreen = (
      workspaceAppId: string,
      automationId: string
    ): Screen => ({
      props: {
        _id: "automation-button-root",
        _component: "@budibase/standard-components/container",
        _styles: { normal: {}, hover: {}, active: {}, selected: {} },
        _instanceName: "Root",
        _children: [
          {
            _id: "automation-button",
            _component: "@budibase/standard-components/button",
            _styles: { normal: {}, hover: {}, active: {}, selected: {} },
            _instanceName: "Trigger automation button",
            _children: [],
            onClick: [
              {
                "##eventHandlerType": "Trigger Automation",
                parameters: { automationId },
              },
            ],
          },
        ],
      },
      routing: {
        route: "/automation-button",
        roleId: "BASIC",
        homeScreen: false,
      },
      name: "automation-button-screen",
      workspaceAppId,
    })

    it("previews dependencies and applies only the selected additions", async () => {
      await withProjectsEnabled(async () => {
        const { project: firstProject } = await config.api.project.create({
          name: "Operations",
        })
        const { project: secondProject } = await config.api.project.create({
          name: "Reporting",
        })
        const { workspaceApp } = await config.api.workspaceApp.create(
          structures.workspaceApps.createRequest({
            name: "Ops app",
            url: "/ops-app",
          })
        )
        const automation = await config.createAutomation()
        await config.api.screen.save(
          createAutomationButtonScreen(workspaceApp._id!, automation._id!)
        )
        const projectIds = [firstProject._id, secondProject._id]

        const preview = await config.api.project.previewAssignment({
          resourceId: workspaceApp._id!,
          projectIds,
        })
        expect(preview.dependencies).toEqual([
          {
            id: automation._id,
            name: automation.name,
            type: ResourceType.AUTOMATION,
            projectIdsToAdd: projectIds,
          },
        ])

        const excluded = await config.api.project.updateAssignment(
          workspaceApp._id!,
          {
            resourceRev: workspaceApp._rev!,
            projectIds,
            dependencyIds: [],
          }
        )
        expect(excluded.projectIds).toEqual(projectIds)
        expect(excluded.assignedDependencyIds).toEqual([])
        expect(
          (await config.api.automation.get(automation._id!)).projectIds
        ).toBeUndefined()

        const repairPreview = await config.api.project.previewAssignment({
          resourceId: workspaceApp._id!,
          projectIds,
        })
        expect(repairPreview.dependencies).toEqual(preview.dependencies)

        const included = await config.api.project.updateAssignment(
          workspaceApp._id!,
          {
            resourceRev: excluded.resourceRev,
            projectIds,
            dependencyIds: [automation._id!],
          }
        )
        expect(included.assignedDependencyIds).toEqual([automation._id])
        expect(
          (await config.api.automation.get(automation._id!)).projectIds
        ).toEqual(projectIds)
      })
    })

    it("accepts a valid dependency selection that became assigned after preview", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({
          name: "Operations",
        })
        const { workspaceApp } = await config.api.workspaceApp.create(
          structures.workspaceApps.createRequest({
            name: "Ops app",
            url: "/ops-app",
          })
        )
        const automation = await config.createAutomation()
        await config.api.screen.save(
          createAutomationButtonScreen(workspaceApp._id!, automation._id!)
        )

        const preview = await config.api.project.previewAssignment({
          resourceId: workspaceApp._id!,
          projectIds: [project._id],
        })
        expect(preview.dependencies.map(dependency => dependency.id)).toEqual([
          automation._id,
        ])

        await config.api.automation.update({
          ...automation,
          projectIds: [project._id],
        })

        const updated = await config.api.project.updateAssignment(
          workspaceApp._id!,
          {
            resourceRev: workspaceApp._rev!,
            projectIds: [project._id],
            dependencyIds: [automation._id!],
          }
        )

        expect(updated.projectIds).toEqual([project._id])
        expect(updated.assignedDependencyIds).toEqual([automation._id])
      })
    })

    it("rejects dependency selections when clearing root assignments", async () => {
      await withProjectsEnabled(async () => {
        const { workspaceApp } = await config.api.workspaceApp.create(
          structures.workspaceApps.createRequest({
            name: "Ops app",
            url: "/ops-app",
          })
        )
        const automation = await config.createAutomation()
        await config.api.screen.save(
          createAutomationButtonScreen(workspaceApp._id!, automation._id!)
        )

        await config.api.project.updateAssignment(
          workspaceApp._id!,
          {
            resourceRev: workspaceApp._rev!,
            projectIds: [],
            dependencyIds: [automation._id!],
          },
          { status: 400 }
        )
        expect(
          (await config.api.workspaceApp.find(workspaceApp._id!)).projectIds
        ).toBeUndefined()
      })
    })

    it("rejects stale roots and unrelated dependency selections", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({
          name: "Operations",
        })
        const { workspaceApp } = await config.api.workspaceApp.create(
          structures.workspaceApps.createRequest({
            name: "Ops app",
            url: "/ops-app",
          })
        )
        const unrelatedDatasource = await config.api.datasource.create(
          basicDatasource().datasource
        )

        await config.api.project.updateAssignment(
          workspaceApp._id!,
          {
            resourceRev: workspaceApp._rev!,
            projectIds: [project._id],
            dependencyIds: [unrelatedDatasource._id!],
          },
          { status: 400 }
        )
        expect(
          (await config.api.workspaceApp.find(workspaceApp._id!)).projectIds
        ).toBeUndefined()

        await config.api.project.updateAssignment(
          workspaceApp._id!,
          {
            resourceRev: "stale-revision",
            projectIds: [project._id],
            dependencyIds: [],
          },
          { status: 409 }
        )
        expect(
          (await config.api.workspaceApp.find(workspaceApp._id!)).projectIds
        ).toBeUndefined()
      })
    })

    it("rejects resources that are not direct project members", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({
          name: "Operations",
        })
        const datasource = await config.api.datasource.create(
          basicDatasource().datasource
        )
        const query = await config.api.query.save(basicQuery(datasource._id!))
        const externalTableId = buildExternalTableId(
          datasource._id!,
          "External table"
        )

        for (const resourceId of [
          query._id!,
          externalTableId,
          InternalTable.USER_METADATA,
          INTERNAL_TABLE_SOURCE_ID,
        ]) {
          await config.api.project.previewAssignment(
            { resourceId, projectIds: [project._id] },
            { status: 400 }
          )
        }
      })
    })

    it("reports only project memberships a dependency is missing", async () => {
      await withProjectsEnabled(async () => {
        const { project: firstProject } = await config.api.project.create({
          name: "Operations",
        })
        const { project: secondProject } = await config.api.project.create({
          name: "Reporting",
        })
        const { workspaceApp } = await config.api.workspaceApp.create(
          structures.workspaceApps.createRequest({
            name: "Ops app",
            url: "/ops-app",
          })
        )
        const automation = await config.createAutomation({
          ...newAutomation(),
          projectIds: [firstProject._id],
        })
        await config.api.screen.save(
          createAutomationButtonScreen(workspaceApp._id!, automation._id!)
        )

        const preview = await config.api.project.previewAssignment({
          resourceId: workspaceApp._id!,
          projectIds: [firstProject._id, secondProject._id],
        })

        expect(preview.dependencies).toEqual([
          {
            id: automation._id,
            name: automation.name,
            type: ResourceType.AUTOMATION,
            projectIdsToAdd: [secondProject._id],
          },
        ])
      })
    })

    it("keeps a deselected dependency excluded on an unchanged save", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({
          name: "Operations",
        })
        const { workspaceApp } = await config.api.workspaceApp.create(
          structures.workspaceApps.createRequest({
            name: "Ops app",
            url: "/ops-app",
          })
        )
        const automation = await config.createAutomation()
        const screen = await config.api.screen.save(
          createAutomationButtonScreen(workspaceApp._id!, automation._id!)
        )

        await config.api.project.updateAssignment(workspaceApp._id!, {
          resourceRev: workspaceApp._rev!,
          projectIds: [project._id],
          dependencyIds: [],
        })
        expect(
          (await config.api.automation.get(automation._id!)).projectIds
        ).toBeUndefined()

        const persistedScreen = (await config.api.screen.list()).find(
          candidate => candidate._id === screen._id
        )!
        const fetchAutomations = jest.spyOn(sdk.automations, "fetch")
        try {
          await config.api.screen.save(persistedScreen)
          expect(fetchAutomations).not.toHaveBeenCalled()
        } finally {
          fetchAutomations.mockRestore()
        }
        expect(
          (await config.api.automation.get(automation._id!)).projectIds
        ).toBeUndefined()
      })
    })

    it("propagates a dependency when its edge is removed and reintroduced", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({
          name: "Operations",
        })
        const { workspaceApp } = await config.api.workspaceApp.create(
          structures.workspaceApps.createRequest({
            name: "Ops app",
            url: "/ops-app",
          })
        )
        const automation = await config.createAutomation()
        const screen = await config.api.screen.save(
          createAutomationButtonScreen(workspaceApp._id!, automation._id!)
        )

        await config.api.project.updateAssignment(workspaceApp._id!, {
          resourceRev: workspaceApp._rev!,
          projectIds: [project._id],
          dependencyIds: [],
        })

        const screenWithoutAutomation = await config.api.screen.save({
          ...screen,
          props: {
            ...screen.props,
            _children: [],
          },
        })
        await config.api.screen.save({
          ...createAutomationButtonScreen(workspaceApp._id!, automation._id!),
          _id: screenWithoutAutomation._id,
          _rev: screenWithoutAutomation._rev,
        })

        expect(
          (await config.api.automation.get(automation._id!)).projectIds
        ).toEqual([project._id])
      })
    })

    it("propagates existing dependencies to a newly added project", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({
          name: "Operations",
        })
        const { workspaceApp } = await config.api.workspaceApp.create(
          structures.workspaceApps.createRequest({
            name: "Ops app",
            url: "/ops-app",
          })
        )
        const automation = await config.createAutomation()
        await config.api.screen.save(
          createAutomationButtonScreen(workspaceApp._id!, automation._id!)
        )

        await config.api.workspaceApp.update({
          _id: workspaceApp._id,
          _rev: workspaceApp._rev,
          name: workspaceApp.name,
          url: workspaceApp.url,
          navigation: workspaceApp.navigation,
          theme: workspaceApp.theme,
          customTheme: workspaceApp.customTheme,
          disabled: workspaceApp.disabled,
          projectIds: [project._id],
        })

        expect(
          (await config.api.automation.get(automation._id!)).projectIds
        ).toEqual([project._id])
      })
    })

    it("keeps the root assignment successful when selected dependency writes conflict", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({
          name: "Operations",
        })
        const { workspaceApp } = await config.api.workspaceApp.create(
          structures.workspaceApps.createRequest({
            name: "Ops app",
            url: "/ops-app",
          })
        )
        const automation = await config.createAutomation()
        await config.api.screen.save(
          createAutomationButtonScreen(workspaceApp._id!, automation._id!)
        )
        const bulkDocs = jest
          .spyOn(DatabaseImpl.prototype, "bulkDocs")
          .mockImplementation(async docs =>
            docs.map(doc => ({
              id: doc._id!,
              error: "conflict",
              reason: "mock conflict",
            }))
          )

        let response: UpdateProjectAssignmentResponse | undefined
        try {
          response = await config.api.project.updateAssignment(
            workspaceApp._id!,
            {
              resourceRev: workspaceApp._rev!,
              projectIds: [project._id],
              dependencyIds: [automation._id!],
            },
            {
              status: 200,
              headers: {
                [Header.API_WARNING]:
                  APIWarningCode.PROJECT_DEPENDENCY_ASSIGNMENT_INCOMPLETE,
              },
            }
          )
          expect(bulkDocs).toHaveBeenCalledTimes(3)
        } finally {
          bulkDocs.mockRestore()
        }

        expect(response!.assignedDependencyIds).toEqual([])
        expect(
          (await config.api.workspaceApp.find(workspaceApp._id!)).projectIds
        ).toEqual([project._id])
        expect(
          (await config.api.automation.get(automation._id!)).projectIds
        ).toBeUndefined()

        const retried = await config.api.project.updateAssignment(
          workspaceApp._id!,
          {
            resourceRev: response!.resourceRev,
            projectIds: [project._id],
            dependencyIds: [automation._id!],
          }
        )
        expect(retried.assignedDependencyIds).toEqual([automation._id])
        expect(
          (await config.api.automation.get(automation._id!)).projectIds
        ).toEqual([project._id])
      })
    })

    it("adds the project id to an automation triggered from a screen button", async () => {
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

        await config.api.screen.save(
          createAutomationButtonScreen(workspaceApp._id!, automation._id!)
        )

        const updatedAutomation = await config.api.automation.get(
          automation._id!
        )
        expect(updatedAutomation.projectIds).toEqual([project._id])
      })
    })

    it("propagates from an already-assigned app to newly referenced datasource dependencies added via a screen", async () => {
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
        const datasource = await config.api.datasource.create(
          basicDatasource().datasource
        )
        const query = await config.api.query.save(basicQuery(datasource._id!))

        await config.api.screen.save({
          ...createQueryScreen(datasource._id!, query),
          workspaceAppId: workspaceApp._id,
        })

        const updatedQuery = await config.api.query.get(query._id!)
        const updatedDatasource = await config.api.datasource.get(
          datasource._id!
        )
        expect(updatedQuery.projectIds).toBeUndefined()
        expect(updatedDatasource.projectIds).toEqual([project._id])
      })
    })

    it("does not add the project id to a query's datasource when only the query is assigned", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({
          name: "Operations",
        })
        const datasource = await config.api.datasource.create(
          basicDatasource().datasource
        )
        await config.api.query.save({
          ...basicQuery(datasource._id!),
          projectIds: [project._id],
        })

        const updatedDatasource = await config.api.datasource.get(
          datasource._id!
        )
        expect(updatedDatasource.projectIds).toBeUndefined()
      })
    })

    it("strips the project id from external table entities", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({
          name: "Operations",
        })
        const datasource = await config.api.datasource.create(
          basicDatasource().datasource
        )
        const entityKey = "TestTable"
        const externalTable = basicTable(datasource, {
          _id: buildExternalTableId(datasource._id!, entityKey),
          name: "External table",
          projectIds: [project._id],
        })

        await config.api.datasource.update({
          ...datasource,
          entities: {
            [entityKey]: externalTable,
          },
        })

        const updatedDatasource = await config.api.datasource.get(
          datasource._id!
        )
        expect(updatedDatasource.projectIds).toBeUndefined()
        expect(
          updatedDatasource.entities![entityKey].projectIds
        ).toBeUndefined()
      })
    })

    it("preserves inert legacy project ids on external table entities", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({
          name: "Operations",
        })
        const datasource = await config.api.datasource.create(
          basicDatasource().datasource
        )
        const entityKey = "TestTable"
        const externalTable = basicTable(datasource, {
          _id: buildExternalTableId(datasource._id!, entityKey),
          name: "External table",
        })
        const datasourceWithEntity = await config.api.datasource.update({
          ...datasource,
          entities: {
            [entityKey]: externalTable,
          },
        })

        await config.doInContext(config.getDevWorkspaceId(), async () => {
          const persistedDatasource = await context
            .getWorkspaceDB()
            .get<Datasource>(datasource._id!)
          persistedDatasource.entities![entityKey].projectIds = [project._id]
          await context.getWorkspaceDB().put(persistedDatasource)
        })

        const persistedDatasource = await config.api.datasource.get(
          datasource._id!
        )
        const updatedDatasource = await config.api.datasource.update({
          ...persistedDatasource,
          _rev: persistedDatasource._rev!,
          entities: {
            ...persistedDatasource.entities,
            [entityKey]: {
              ...persistedDatasource.entities![entityKey],
              projectIds: [],
            },
          },
        })

        expect(updatedDatasource.entities![entityKey].projectIds).toEqual([
          project._id,
        ])
        expect(
          datasourceWithEntity.entities![entityKey].projectIds
        ).toBeUndefined()
      })
    })

    it("includes a datasource's queries in project dependencies when the datasource is assigned", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({
          name: "Operations",
        })
        const datasource = await config.api.datasource.create({
          ...basicDatasource().datasource,
          projectIds: [project._id],
        })
        const query = await config.api.query.save(basicQuery(datasource._id!))

        const { body } = await config.api.resource.getResourceDependencies()
        expect(body.resources[project._id].dependencies).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: datasource._id,
              type: "datasource",
            }),
            expect.objectContaining({
              id: query._id,
              type: "query",
            }),
          ])
        )
      })
    })

    it("propagates through a newly saved query owned by an assigned datasource", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({
          name: "Operations",
        })
        const datasource = await config.api.datasource.create({
          ...basicDatasource().datasource,
          projectIds: [project._id],
        })
        const table = await config.api.table.save(basicTable())

        await config.api.query.save({
          ...basicQuery(datasource._id!),
          name: `Query using ${table._id}`,
        })

        const updatedTable = await config.api.table.get(table._id!)
        expect(updatedTable.projectIds).toEqual([project._id])
      })
    })

    it("does not restore excluded sibling query dependencies", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({
          name: "Operations",
        })
        const datasource = await config.api.datasource.create(
          basicDatasource().datasource
        )
        const excludedTable = await config.api.table.save(
          basicTable(undefined, { name: "Excluded table" })
        )
        const includedTable = await config.api.table.save(
          basicTable(undefined, { name: "Included table" })
        )
        await config.api.query.save({
          ...basicQuery(datasource._id!),
          name: `Query using ${excludedTable._id}`,
        })

        await config.api.project.updateAssignment(datasource._id!, {
          resourceRev: datasource._rev!,
          projectIds: [project._id],
          dependencyIds: [],
        })
        await config.api.query.save({
          ...basicQuery(datasource._id!),
          name: `Query using ${includedTable._id}`,
        })

        expect(
          (await config.api.table.get(excludedTable._id!)).projectIds
        ).toBeUndefined()
        expect(
          (await config.api.table.get(includedTable._id!)).projectIds
        ).toEqual([project._id])
      })
    })

    it("propagates existing references when a screen moves to an assigned app", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({
          name: "Operations",
        })
        const { workspaceApp: sourceApp } =
          await config.api.workspaceApp.create(
            structures.workspaceApps.createRequest({
              name: "Source app",
              url: "/source-app",
            })
          )
        const { workspaceApp: destinationApp } =
          await config.api.workspaceApp.create(
            structures.workspaceApps.createRequest({
              name: "Destination app",
              url: "/destination-app",
              projectIds: [project._id],
            })
          )
        const automation = await config.createAutomation()
        const screen = await config.api.screen.save(
          createAutomationButtonScreen(sourceApp._id!, automation._id!)
        )

        await config.api.screen.save({
          ...screen,
          workspaceAppId: destinationApp._id,
        })

        expect(
          (await config.api.automation.get(automation._id!)).projectIds
        ).toEqual([project._id])
      })
    })

    it("adds the project id to the generated automation when creating a row action for a project table", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({
          name: "Operations",
        })
        const table = await config.api.table.save({
          ...basicTable(),
          projectIds: [project._id],
        })

        const rowAction = await config.api.rowAction.save(table._id!, {
          name: "Row action button",
        })

        const automation = await config.api.automation.get(
          rowAction.automationId!
        )
        expect(automation.projectIds).toEqual([project._id])
      })
    })

    it("does not remove a project id from an already propagated datasource when the root app's project id is removed", async () => {
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
        const datasource = await config.api.datasource.create(
          basicDatasource().datasource
        )
        const query = await config.api.query.save(basicQuery(datasource._id!))

        await config.api.screen.save({
          ...createQueryScreen(datasource._id!, query),
          workspaceAppId: workspaceApp._id,
        })

        await config.api.workspaceApp.update({
          _id: workspaceApp._id,
          _rev: workspaceApp._rev,
          name: workspaceApp.name,
          url: workspaceApp.url,
          navigation: workspaceApp.navigation,
          theme: workspaceApp.theme,
          customTheme: workspaceApp.customTheme,
          disabled: workspaceApp.disabled,
          projectIds: [],
        })

        const updatedDatasource = await config.api.datasource.get(
          datasource._id!
        )
        expect(updatedDatasource.projectIds).toEqual([project._id])
      })
    })

    it("clears propagated assignments when the project is deleted", async () => {
      await withProjectsEnabled(async () => {
        const project = await createAssignedProject()
        const datasource = await config.api.datasource.create({
          ...basicDatasource().datasource,
          projectIds: [project._id],
        })
        await config.api.query.save(basicQuery(datasource._id!))

        const propagatedDatasource = await config.api.datasource.get(
          datasource._id!
        )
        expect(propagatedDatasource.projectIds).toEqual([project._id])

        await config.api.project.delete(project._id, project._rev)

        const clearedDatasource = await config.api.datasource.get(
          datasource._id!
        )
        expect(clearedDatasource.projectIds).toBeUndefined()
      })
    })

    it("returns an explicit warning when automatic propagation fails", async () => {
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
        const datasource = await config.api.datasource.create(
          basicDatasource().datasource
        )
        const query = await config.api.query.save(basicQuery(datasource._id!))
        const bulkDocs = jest
          .spyOn(DatabaseImpl.prototype, "bulkDocs")
          .mockImplementation(async docs =>
            docs.map(doc => ({
              id: doc._id!,
              error: "conflict",
              reason: "mock conflict",
            }))
          )

        let savedScreen: Screen
        try {
          savedScreen = await config.api.screen.save(
            {
              ...createQueryScreen(datasource._id!, query),
              workspaceAppId: workspaceApp._id,
            },
            {
              status: 200,
              headers: {
                [Header.API_WARNING]:
                  APIWarningCode.PROJECT_DEPENDENCY_ASSIGNMENT_INCOMPLETE,
              },
            }
          )
          expect(bulkDocs).toHaveBeenCalledTimes(3)
        } finally {
          bulkDocs.mockRestore()
        }

        const persistedScreen = (await config.api.screen.list()).find(
          screen => screen._id === savedScreen!._id
        )
        expect(persistedScreen).toBeDefined()

        const updatedDatasource = await config.api.datasource.get(
          datasource._id!
        )
        expect(updatedDatasource.projectIds).toBeUndefined()

        const preview = await config.api.project.previewAssignment({
          resourceId: workspaceApp._id!,
          projectIds: [project._id],
        })
        await config.api.project.updateAssignment(workspaceApp._id!, {
          resourceRev: workspaceApp._rev!,
          projectIds: [project._id],
          dependencyIds: preview.dependencies.map(dependency => dependency.id),
        })
        const retriedDatasource = await config.api.datasource.get(
          datasource._id!
        )
        expect(retriedDatasource.projectIds).toEqual([project._id])
      })
    })

    it("keeps successful dependency assignments when another dependency write fails", async () => {
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
        const firstDatasource = await config.api.datasource.create(
          basicDatasource().datasource
        )
        const secondDatasource = await config.api.datasource.create({
          ...basicDatasource().datasource,
          name: "Second datasource",
        })
        let successfulDependencyId = ""
        const bulkDocs = jest
          .spyOn(DatabaseImpl.prototype, "bulkDocs")
          .mockImplementation(async docs => {
            const [successful, ...failed] = docs
            if (!successful?._id) {
              throw new Error("Expected a dependency assignment update")
            }
            const response = await context.getWorkspaceDB().put(successful)
            successfulDependencyId = successful._id
            return [
              { id: successful._id, rev: response.rev },
              ...failed.map(doc => ({
                id: doc._id,
                error: "forbidden",
                reason: "mock failure",
              })),
            ]
          })

        try {
          await config.api.screen.save(
            {
              ...basicScreen(),
              name: `${firstDatasource._id} ${secondDatasource._id}`,
              workspaceAppId: workspaceApp._id,
            },
            {
              status: 200,
              headers: {
                [Header.API_WARNING]:
                  APIWarningCode.PROJECT_DEPENDENCY_ASSIGNMENT_INCOMPLETE,
              },
            }
          )
        } finally {
          bulkDocs.mockRestore()
        }

        const successfulDatasource = await config.api.datasource.get(
          successfulDependencyId
        )
        const failedDatasourceId = [
          firstDatasource._id!,
          secondDatasource._id!,
        ].find(id => id !== successfulDependencyId)!
        const failedDatasource =
          await config.api.datasource.get(failedDatasourceId)

        expect(successfulDatasource.projectIds).toEqual([project._id])
        expect(failedDatasource.projectIds).toBeUndefined()
      })
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

  const createProjectExportFixture = async () => {
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
    await config.doInContext(config.getDevWorkspaceId(), async () => {
      const persistedQuery = await context
        .getWorkspaceDB()
        .get<Query>(query._id!)
      await context.getWorkspaceDB().put({
        ...persistedQuery,
        projectIds: [project._id],
      })
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

    return {
      project,
      datasource,
      query,
      table,
      automation,
      agent,
      workspaceApp,
      screen,
      files,
    }
  }

  describe("exports project tarballs", () => {
    it("includes expected docs and manifest metadata", async () => {
      await withProjectsEnabled(async () => {
        const {
          project,
          datasource,
          query,
          table,
          automation,
          agent,
          workspaceApp,
          screen,
          files,
        } = await createProjectExportFixture()

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

        const exportedProject = JSON.parse(
          files.get("project.json")!.toString()
        )
        expect(exportedProject._id).toBe(project._id)
        expect(exportedProject._rev).toBeUndefined()
        expect(manifest.project.createdAt).not.toBe("invalid")
        expect(manifest.project.createdAt).toBe(manifest.project.updatedAt)
        expect(exportedProject.createdAt).toBe(manifest.project.createdAt)
        expect(exportedProject.updatedAt).toBe(manifest.project.updatedAt)
      })
    })

    it("sanitises exported secrets and agent integrations", async () => {
      await withProjectsEnabled(async () => {
        const { datasource, query, agent, files } =
          await createProjectExportFixture()

        const exportedDatasource = JSON.parse(
          files.get(`docs/datasource/${datasource._id}.json`)!.toString()
        )
        expect(exportedDatasource.config.password).not.toBe("super-secret")

        const exportedQuery = JSON.parse(
          files.get(`docs/query/${query._id}.json`)!.toString()
        )
        expect(exportedQuery.projectIds).toBeUndefined()

        const exportedAgent = JSON.parse(
          files.get(`docs/agent/${agent._id}.json`)!.toString()
        )
        expect(exportedAgent.live).toBe(false)
        expect(exportedAgent.publishedAt).toBeUndefined()
        expect(exportedAgent.slackIntegration).toEqual({
          idleTimeoutMinutes: 20,
          requireUserLink: true,
        })
        expect(exportedAgent.telegramIntegration).toEqual({
          botUserName: "ops_bot",
          idleTimeoutMinutes: 25,
        })
      })
    })

    it("includes a dependency index for exported project members", async () => {
      await withProjectsEnabled(async () => {
        const {
          project,
          datasource,
          query,
          table,
          automation,
          agent,
          workspaceApp,
          files,
        } = await createProjectExportFixture()

        const dependencyIndex = JSON.parse(
          files.get("dependency-index.json")!.toString()
        ) as ProjectPackageDependencyIndex
        expect(dependencyIndex.rootProjectId).toBe(project._id)
        expect(
          dependencyIndex.directMembers.map(resource => resource.id)
        ).toEqual(
          expect.arrayContaining([
            datasource._id,
            table._id,
            automation._id,
            agent._id,
            workspaceApp._id,
          ])
        )
        expect(
          dependencyIndex.directMembers.map(resource => resource.id)
        ).not.toContain(query._id)
        expect(
          dependencyIndex.resources[datasource._id!]!.dependencies.map(
            resource => resource.id
          )
        ).toContain(query._id)
      })
    })

    it("omits unassigned dependencies and reports incomplete content", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({
          name: "Operations",
        })
        const datasource = await config.api.datasource.create({
          ...basicDatasource().datasource,
        })
        const agent = await config.api.agent.create({
          name: "Referenced agent",
          aiconfig: "default",
          live: true,
        })
        await config.api.query.save({
          ...basicQuery(datasource._id!),
          name: `Uses ${agent._id}`,
        })
        await config.api.project.updateAssignment(datasource._id!, {
          resourceRev: datasource._rev!,
          projectIds: [project._id],
          dependencyIds: [],
        })

        const body = await config.api.project.export(project._id)
        const files = await readTarEntries(body)
        const manifest = JSON.parse(files.get("manifest.json")!.toString())

        expect(files.has(`docs/agent/${agent._id}.json`)).toBe(false)
        const dependencyIndex = JSON.parse(
          files.get("dependency-index.json")!.toString()
        ) as ProjectPackageDependencyIndex
        expect(
          Object.values(dependencyIndex.resources).flatMap(resource =>
            resource.dependencies.map(dependency => dependency.id)
          )
        ).not.toContain(agent._id)
        expect(manifest.unsupportedContent).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              type: "excluded_dependency",
              count: 1,
            }),
          ])
        )
      })
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
      const datasource = await config.api.datasource.create({
        ...basicDatasource().datasource,
        projectIds: [project._id],
      })
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
          expect(importedExternalTable.projectIds).toBeUndefined()
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
      const queryScreen = createQueryScreen(datasource._id!, query)
      const screen = await config.api.screen.save({
        ...queryScreen,
        props: {
          ...queryScreen.props,
          testBinding: `{{ ${query._id}.rows }}`,
        },
        workspaceAppId: workspaceApp._id,
      })
      const automation = await config.createAutomation()
      const { automation: webhookAutomation } =
        await config.api.automation.update({
          ...automation,
          definition: {
            ...automation.definition,
            trigger: automationTrigger(TRIGGER_DEFINITIONS.WEBHOOK),
          },
        })
      const { automation: assignedAutomation } =
        await config.api.automation.update({
          ...webhookAutomation,
          projectIds: [project._id],
        })
      if (!isWebhookTrigger(assignedAutomation.definition.trigger)) {
        throw new Error("Expected source automation to use a webhook trigger")
      }
      const sourceWebhookId = assignedAutomation.definition.trigger.webhookId
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
          expect(importedScreen!.props.testBinding).toBe(
            `{{ ${imported.resources.query?.[0]}.rows }}`
          )

          const importedQuery = await config.api.query.get(
            imported.resources.query?.[0]!
          )
          expect(importedQuery.datasourceId).toBe(
            imported.resources.datasource?.[0]
          )
          expect(importedQuery.name).toBe(`Lookup ${datasource._id!} records`)
          expect(importedQuery.projectIds).toBeUndefined()

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
          if (!isWebhookTrigger(importedAutomation.definition.trigger)) {
            throw new Error(
              "Expected imported automation to use a webhook trigger"
            )
          }
          const importedTrigger = importedAutomation.definition.trigger
          expect(importedTrigger.webhookId).toBeDefined()
          expect(importedTrigger.webhookId).not.toBe(sourceWebhookId)
          expect(importedTrigger.inputs.schemaUrl).toContain(
            destinationWorkspace.appId
          )
          expect(importedTrigger.inputs.triggerUrl).toContain(
            dbCore.getProdWorkspaceID(destinationWorkspace.appId)
          )
          expect(importedTrigger.inputs.schemaUrl).not.toContain(
            config.getDevWorkspaceId()
          )
          const importedWebhook = await config.doInContext(
            destinationWorkspace.appId,
            async () =>
              await context
                .getWorkspaceDB()
                .get<Webhook>(importedTrigger.webhookId!)
          )
          expect(importedWebhook.action.target).toBe(importedAutomation._id)

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

          const secondImport = await config.api.project.import(body)
          const importedAppsAfterSecondImport =
            await config.api.workspaceApp.fetch()
          const secondImportedApp =
            importedAppsAfterSecondImport.workspaceApps.find(
              app => app._id === secondImport.resources.workspace_app?.[0]
            )
          expect(secondImportedApp?.name).toBe("Operations app 1")
          expect(secondImportedApp?.url).toBe("/operations%20app%201")
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
        projectIds: [project._id, otherProject._id],
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
          expect(importedQuery.projectIds).toBeUndefined()
          expect(importedDatasource.projectIds).toEqual([imported.project._id])
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
      await config.api.project.import({
        file: Buffer.from("not a project archive"),
        body: undefined,
        expectations: {
          status: 400,
          body: {
            message: "Project package is invalid.",
          },
        },
      })
    })
  })

  it("rejects project packages with malformed datasource entities", async () => {
    await withProjectsEnabled(async () => {
      const datasourceId = "datasource_malformed"
      const dependency = {
        id: datasourceId,
        name: "Malformed datasource",
        type: "datasource",
      }
      const packageBuffer = await createTarPackage(
        createMinimalPackageEntries({
          manifest: {
            resourcesByType: {
              project: 1,
              datasource: 1,
            },
          },
          dependencyIndex: {
            directMembers: [dependency],
            resources: {
              project_source: {
                dependencies: [dependency],
              },
              [datasourceId]: {
                dependencies: [],
              },
            },
          },
          docs: {
            [`docs/datasource/${datasourceId}.json`]: {
              ...basicDatasource().datasource,
              _id: datasourceId,
              name: "Malformed datasource",
              projectIds: ["project_source"],
              entities: {
                Broken: "not an entity",
              },
            },
          },
        })
      )

      await config.api.project.import({
        file: packageBuffer,
        expectations: {
          status: 400,
          body: {
            message: "Project package contains invalid datasource entities.",
          },
        },
      })
    })
  })

  it("sanitises crafted import packages before saving resources", async () => {
    await withProjectsEnabled(async () => {
      const datasourceId = "datasource_secret"
      const agentId = "agent_secret"
      const datasourceDependency = {
        id: datasourceId,
        name: "Secret datasource",
        type: "datasource",
      }
      const agentDependency = {
        id: agentId,
        name: "Secret agent",
        type: "agent",
      }
      const packageBuffer = await createTarPackage(
        createMinimalPackageEntries({
          manifest: {
            resourcesByType: {
              project: 1,
              datasource: 1,
              agent: 1,
            },
            requiresSecrets: true,
          },
          dependencyIndex: {
            directMembers: [datasourceDependency, agentDependency],
            resources: {
              project_source: {
                dependencies: [datasourceDependency, agentDependency],
              },
              [datasourceId]: {
                dependencies: [],
              },
              [agentId]: {
                dependencies: [],
              },
            },
          },
          docs: {
            [`docs/datasource/${datasourceId}.json`]: {
              ...basicDatasource().datasource,
              _id: datasourceId,
              name: "Secret datasource",
              projectIds: ["project_source"],
              config: {
                password: "crafted-secret",
              },
            },
            [`docs/agent/${agentId}.json`]: {
              _id: agentId,
              name: "Secret agent",
              aiconfig: "default",
              live: true,
              publishedAt: new Date().toISOString(),
              projectIds: ["project_source"],
              slackIntegration: {
                botToken: "crafted-token",
                signingSecret: "crafted-signing-secret",
                idleTimeoutMinutes: 20,
              },
            },
          },
        })
      )

      const imported = await config.api.project.import(packageBuffer)
      const importedDatasource = await config.api.datasource.get(
        imported.resources.datasource?.[0]!
      )
      const { agents } = await config.api.agent.fetch()
      const importedAgent = agents.find(
        agent => agent._id === imported.resources.agent?.[0]
      )

      expect(importedDatasource.config?.password).not.toBe("crafted-secret")
      expect(importedAgent?.live).toBe(false)
      expect(importedAgent?.publishedAt).toBeUndefined()
      expect(importedAgent?.slackIntegration).toEqual({
        idleTimeoutMinutes: 20,
      })
    })
  })

  it("rolls back imported resources when project import partially fails", async () => {
    await withProjectsEnabled(async () => {
      const firstDatasourceId = "datasource_first"
      const secondDatasourceId = "datasource_second"
      const dependencies = [
        {
          id: firstDatasourceId,
          name: "First datasource",
          type: "datasource",
        },
        {
          id: secondDatasourceId,
          name: "Second datasource",
          type: "datasource",
        },
      ]
      const packageBuffer = await createTarPackage(
        createMinimalPackageEntries({
          manifest: {
            resourcesByType: {
              project: 1,
              datasource: 2,
            },
          },
          dependencyIndex: {
            directMembers: dependencies,
            resources: {
              project_source: {
                dependencies,
              },
              [firstDatasourceId]: {
                dependencies: [],
              },
              [secondDatasourceId]: {
                dependencies: [],
              },
            },
          },
          docs: {
            [`docs/datasource/${firstDatasourceId}.json`]: {
              ...basicDatasource().datasource,
              _id: firstDatasourceId,
              name: "First datasource",
              projectIds: ["project_source"],
            },
            [`docs/datasource/${secondDatasourceId}.json`]: {
              ...basicDatasource().datasource,
              _id: secondDatasourceId,
              name: "Second datasource",
              projectIds: ["project_source"],
            },
          },
        })
      )

      const bulkDocs = jest
        .spyOn(DatabaseImpl.prototype, "bulkDocs")
        .mockImplementationOnce(async docs =>
          docs.map((doc, index) =>
            index === 0
              ? { id: doc._id!, rev: "1-imported" }
              : {
                  id: doc._id!,
                  error: "conflict",
                  reason: "import failed",
                }
          )
        )

      try {
        await config.api.project.import(packageBuffer, undefined, {
          status: 400,
          body: {
            message: expect.stringContaining(
              "Project import failed while saving"
            ),
          },
        })
      } finally {
        bulkDocs.mockRestore()
      }

      const { projects } = await config.api.project.fetch()
      expect(projects).toHaveLength(0)
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
