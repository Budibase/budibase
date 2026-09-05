import {
  context,
  db as dbCore,
  features,
  ViewName,
} from "@budibase/backend-core"
import { DatabaseImpl } from "../../../../../backend-core/src/db/couch/DatabaseImpl"
import { generator, structures } from "@budibase/backend-core/tests"
import {
  AutomationTriggerStepId,
  APIWarningCode,
  DesignDocument,
  EmailTriggerAuthType,
  FeatureFlag,
  FieldType,
  INTERNAL_TABLE_SOURCE_ID,
  InternalTable,
  isEmailTrigger,
  isWebhookTrigger,
  OAuth2CredentialsMethod,
  OAuth2GrantType,
  ResourceType,
  RelationshipType,
  RestAuthType,
  SourceName,
  ToolExecutionPrincipal,
  ToolType,
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
import { getQueryToolBindings, Header, helpers } from "@budibase/shared-core"
import { decodeJSBinding, encodeJSBinding } from "@budibase/string-templates"
import fsp from "fs/promises"
import { tmpdir } from "os"
import { join } from "path"
import { Readable } from "stream"
import { pipeline } from "stream/promises"
import * as tar from "tar"
import { TRIGGER_DEFINITIONS } from "../../../automations"
import { createAutomationBuilder } from "../../../automations/tests/utilities/AutomationTestBuilder"
import { getAutomationTriggerToolName } from "../../../ai/tools/budibase/automations"
import { getRowToolNames } from "../../../ai/tools/budibase/rows"
import sdk from "../../../sdk"
import { getQueryToolBindingsForResource } from "../../../sdk/workspace/ai/agents/queryToolReferences"
import * as projects from "../../../sdk/workspace/projects/crud"
import * as projectLock from "../../../sdk/workspace/projects/lock"
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
  createViewScreen,
  newAutomation,
} from "../../../tests/utilities/structures"

// Agent create/update resolves the Slack workspace via auth.test - mocked so
// tests never call out to Slack.
jest.mock("@slack/web-api", () => ({
  WebClient: jest.fn(() => ({
    auth: {
      test: jest.fn().mockResolvedValue({ ok: true, team_id: "T123" }),
    },
  })),
}))

jest.mock("../../../sdk/workspace/projects/lock", () => {
  const actual = jest.requireActual<
    typeof import("../../../sdk/workspace/projects/lock")
  >("../../../sdk/workspace/projects/lock")
  return {
    ...actual,
    doWithProjectAssignmentsLock: jest.fn(actual.doWithProjectAssignmentsLock),
    doWithProjectAssignmentsLockIfEnabled: jest.fn(
      actual.doWithProjectAssignmentsLockIfEnabled
    ),
  }
})

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

  const pauseNextProjectAssignmentLock = () => {
    const doWithProjectAssignmentsLock =
      projectLock.doWithProjectAssignmentsLock as jest.MockedFunction<
        typeof projectLock.doWithProjectAssignmentsLock
      >
    const doWithProjectAssignmentsLockIfEnabled =
      projectLock.doWithProjectAssignmentsLockIfEnabled as jest.MockedFunction<
        typeof projectLock.doWithProjectAssignmentsLockIfEnabled
      >
    const originalLockImplementation =
      doWithProjectAssignmentsLock.getMockImplementation()
    const originalConditionalLockImplementation =
      doWithProjectAssignmentsLockIfEnabled.getMockImplementation()
    if (!originalLockImplementation || !originalConditionalLockImplementation) {
      throw new Error("Project assignments lock mock is not configured")
    }
    let release!: () => void
    let locked!: () => void
    let contenderStarted!: () => void
    let firstCompleted!: () => void
    const releasePromise = new Promise<void>(resolve => (release = resolve))
    const lockedPromise = new Promise<void>(resolve => (locked = resolve))
    const contenderPromise = new Promise<void>(
      resolve => (contenderStarted = resolve)
    )
    const firstCompletedPromise = new Promise<void>(
      resolve => (firstCompleted = resolve)
    )
    let projectLockCalls = 0

    const runWithPausedLock = async <T>({
      task,
      fallback,
    }: {
      task: () => Promise<T>
      fallback: () => Promise<T>
    }): Promise<T> => {
      projectLockCalls++
      if (projectLockCalls === 1) {
        locked()
        await releasePromise
        try {
          return await task()
        } finally {
          firstCompleted()
        }
      }
      if (projectLockCalls === 2) {
        contenderStarted()
        await firstCompletedPromise
        return await task()
      }
      return await fallback()
    }

    doWithProjectAssignmentsLock.mockImplementation((task, workspaceId) =>
      runWithPausedLock({
        task,
        fallback: () => originalLockImplementation(task, workspaceId),
      })
    )
    doWithProjectAssignmentsLockIfEnabled.mockImplementation(task =>
      runWithPausedLock({
        task,
        fallback: () => originalConditionalLockImplementation(task),
      })
    )

    return {
      locked: lockedPromise,
      contenderStarted: contenderPromise,
      release,
      restore: () => {
        doWithProjectAssignmentsLock.mockImplementation(
          originalLockImplementation
        )
        doWithProjectAssignmentsLockIfEnabled.mockImplementation(
          originalConditionalLockImplementation
        )
      },
    }
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
        id: "app_dev_source",
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
        dependencyFingerprint: "unavailable-while-feature-disabled",
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

  it("rejects unknown direct project ids", async () => {
    await withProjectsEnabled(async () => {
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
    })
  })

  it("strips project assignments from external tables", async () => {
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
      const datasourceWithTable = await config.api.datasource.update({
        ...datasource,
        entities: {
          [externalTable.name]: externalTable,
        },
      })

      expect(
        datasourceWithTable.entities![externalTable.name].projectIds
      ).toBeUndefined()

      const savedTable = await config.api.table.save({
        ...datasourceWithTable.entities![externalTable.name],
        projectIds: [project._id],
      })
      expect(savedTable.projectIds).toBeUndefined()

      const storedDatasource = await config.api.datasource.get(datasource._id!)
      expect(
        storedDatasource.entities![externalTable.name].projectIds
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

  it("clears external datasource assignments when deleting a project", async () => {
    await withProjectsEnabled(async () => {
      const project = await createAssignedProject()
      const datasource = await config.api.datasource.create({
        ...basicDatasource().datasource,
        projectIds: [project._id],
      })

      await config.api.project.delete(project._id, project._rev)

      const fetchedDatasource = await config.api.datasource.get(datasource._id!)
      expect(fetchedDatasource.projectIds).toBeUndefined()
    })
  })

  it("clears datasource_plus assignments when deleting a project", async () => {
    await withProjectsEnabled(async () => {
      const project = await createAssignedProject()
      const datasourcePlus = await config.api.datasource.create({
        ...basicDatasourcePlus().datasource,
        projectIds: [project._id],
      })

      await config.api.project.delete(project._id, project._rev)

      const fetchedDatasourcePlus = await config.api.datasource.get(
        datasourcePlus._id!
      )
      expect(fetchedDatasourcePlus.projectIds).toBeUndefined()
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
    it("preserves workspace app assignments", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({
          name: "Operations",
        })
        const workspaceApp = await createAssignedWorkspaceApp(project._id)

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
        const automation = await config.createAutomation()
        const { automation: assignedAutomation } =
          await config.api.automation.update({
            ...automation,
            projectIds: [project._id],
          })

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
        const agent = await config.api.agent.create({
          name: "Ops agent",
          aiconfig: "default",
          projectIds: [project._id],
        })

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
        const table = await createAssignedInternalTable(project._id)

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
        const datasource = await config.api.datasource.create({
          ...basicDatasource().datasource,
          projectIds: [project._id],
        })

        const { projectIds: _datasourceProjectIds, ...datasourceUpdate } =
          datasource
        const updatedDatasource = await config.api.datasource.update({
          ...datasourceUpdate,
          name: "Ops datasource updated",
        })

        expect(updatedDatasource.projectIds).toEqual([project._id])
      })
    })

    it("strips query assignments", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({
          name: "Operations",
        })
        const datasource = await config.createDatasource()
        const query = await config.api.query.save(basicQuery(datasource._id))
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

        expect(updatedQuery.projectIds).toBeUndefined()
      })
    })
  })

  describe("propagates project ids to dependencies on save", () => {
    it("allows other saves during schema discovery and revalidates projects afterwards", async () => {
      await withProjectsEnabled(async () => {
        const project = await createAssignedProject()
        const { workspaceApp } = await config.api.workspaceApp.create({
          name: "Unrelated app",
          url: "/unrelated-app",
        })
        let schemaStarted!: () => void
        let releaseSchema!: () => void
        const schemaReady = new Promise<void>(
          resolve => (schemaStarted = resolve)
        )
        const schemaPending = new Promise<void>(
          resolve => (releaseSchema = resolve)
        )
        const buildSchema = jest
          .spyOn(sdk.datasources, "buildFilteredSchema")
          .mockImplementationOnce(async () => {
            schemaStarted()
            await schemaPending
            return { tables: {}, errors: {} }
          })

        const datasourceSave = config
          .request!.post("/api/datasources")
          .set(config.defaultHeaders())
          .send({
            datasource: {
              ...basicDatasource().datasource,
              name: "Slow schema",
              projectIds: [project._id],
            },
            fetchSchema: true,
          })
          .expect(404)
          .then(() => undefined)

        try {
          await helpers.withTimeout(5000, () => schemaReady)
          await helpers.withTimeout(5000, async () => {
            const { isDefault: _isDefault, ...update } = workspaceApp
            await config.api.workspaceApp.update({
              ...update,
              name: "Saved during schema discovery",
            })
            await config.api.project.delete(project._id, project._rev)
          })
        } finally {
          releaseSchema()
          await datasourceSave.finally(() => buildSchema.mockRestore())
        }

        expect(
          (await config.api.workspaceApp.find(workspaceApp._id!)).name
        ).toBe("Saved during schema discovery")
        expect(
          (await config.api.datasource.fetch()).map(
            datasource => datasource.name
          )
        ).not.toContain("Slow schema")
      })
    })

    it("rejects direct assignment waiting for Project deletion", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({ name: "Race" })
        const { workspaceApp } = await config.api.workspaceApp.create(
          structures.workspaceApps.createRequest({
            name: "Race app",
            url: "/race-app",
          })
        )
        const gate = pauseNextProjectAssignmentLock()

        try {
          const deletion = config.api.project.delete(project._id, project._rev)
          await gate.locked
          const assignment = config.api.project.updateAssignment(
            workspaceApp._id!,
            {
              resourceRev: workspaceApp._rev!,
              projectIds: [project._id],
              dependencyIds: [],
            },
            { status: 404 }
          )
          await gate.contenderStarted
          gate.release()

          await Promise.all([deletion, assignment])
        } finally {
          gate.release()
          gate.restore()
        }

        expect(
          (await config.api.workspaceApp.find(workspaceApp._id!)).projectIds
        ).toBeUndefined()
      })
    })

    it("does not propagate after waiting for Project deletion", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({ name: "Race" })
        const { workspaceApp } = await config.api.workspaceApp.create(
          structures.workspaceApps.createRequest({
            name: "Race app",
            url: "/race-app",
            projectIds: [project._id],
          })
        )
        const automation = await config.createAutomation()
        const gate = pauseNextProjectAssignmentLock()

        try {
          const deletion = config.api.project.delete(project._id, project._rev)
          await gate.locked
          const screenSave = config.api.screen.save(
            createAutomationButtonScreen(workspaceApp._id!, automation._id!)
          )
          await gate.contenderStarted
          gate.release()

          await Promise.all([deletion, screenSave])
        } finally {
          gate.release()
          gate.restore()
        }

        expect(
          (await config.api.automation.get(automation._id!)).projectIds
        ).toBeUndefined()
      })
    })

    it("does not build a workspace graph for an unassigned resource save", async () => {
      await withProjectsEnabled(async () => {
        const { workspaceApp } = await config.api.workspaceApp.create(
          structures.workspaceApps.createRequest({
            name: "Unassigned app",
            url: "/unassigned-app",
          })
        )
        const analyzeDependencies = jest.fn(
          sdk.resources.analyzeResourceDependencies
        )
        const resources = jest.replaceProperty(sdk, "resources", {
          ...sdk.resources,
          analyzeResourceDependencies: analyzeDependencies,
        })

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
          expect(analyzeDependencies).not.toHaveBeenCalled()
        } finally {
          resources.restore()
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
            resourceRev: preview.resourceRev,
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
        expect(repairPreview).toMatchObject({
          resourceRev: excluded.resourceRev,
          resourceProjectIds: projectIds,
          dependencies: preview.dependencies,
        })

        const included = await config.api.project.updateAssignment(
          workspaceApp._id!,
          {
            resourceRev: repairPreview.resourceRev,
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

    it("rejects an assignment when dependency projects change after preview", async () => {
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

        await config.api.project.updateAssignment(
          workspaceApp._id!,
          {
            resourceRev: workspaceApp._rev!,
            projectIds: [project._id],
            dependencyIds: [automation._id!],
            dependencyFingerprint: preview.dependencyFingerprint,
          },
          { status: 409 }
        )

        expect(
          (await config.api.workspaceApp.find(workspaceApp._id!)).projectIds
        ).toBeUndefined()
        expect(
          (await config.api.automation.get(automation._id!)).projectIds
        ).toEqual([project._id])
      })
    })

    it("rejects an assignment when target projects change after preview", async () => {
      await withProjectsEnabled(async () => {
        const { project: previewedProject } = await config.api.project.create({
          name: "Operations",
        })
        const { project: updatedProject } = await config.api.project.create({
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

        const preview = await config.api.project.previewAssignment({
          resourceId: workspaceApp._id!,
          projectIds: [previewedProject._id],
        })

        await config.api.project.updateAssignment(
          workspaceApp._id!,
          {
            resourceRev: workspaceApp._rev!,
            projectIds: [updatedProject._id],
            dependencyIds: [automation._id!],
            dependencyFingerprint: preview.dependencyFingerprint,
          },
          { status: 409 }
        )

        expect(
          (await config.api.workspaceApp.find(workspaceApp._id!)).projectIds
        ).toBeUndefined()
        expect(
          (await config.api.automation.get(automation._id!)).projectIds
        ).toBeUndefined()
      })
    })

    it("rejects an assignment when dependencies change after preview", async () => {
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
        const existingAutomation = await config.createAutomation()
        const screen = await config.api.screen.save(
          createAutomationButtonScreen(
            workspaceApp._id!,
            existingAutomation._id!
          )
        )
        const preview = await config.api.project.previewAssignment({
          resourceId: workspaceApp._id!,
          projectIds: [project._id],
        })

        const addedAutomation = await config.createAutomation()
        const addedButton = createAutomationButtonScreen(
          workspaceApp._id!,
          addedAutomation._id!
        ).props!._children![0]
        await config.api.screen.save({
          ...screen,
          props: {
            ...screen.props,
            _children: [
              ...screen.props!._children!,
              { ...addedButton, _id: "added-automation-button" },
            ],
          },
        })

        await config.api.project.updateAssignment(
          workspaceApp._id!,
          {
            resourceRev: workspaceApp._rev!,
            projectIds: [project._id],
            dependencyIds: [existingAutomation._id!],
            dependencyFingerprint: preview.dependencyFingerprint,
          },
          { status: 409 }
        )

        expect(
          (await config.api.workspaceApp.find(workspaceApp._id!)).projectIds
        ).toBeUndefined()
        expect(
          (await config.api.automation.get(existingAutomation._id!)).projectIds
        ).toBeUndefined()
        expect(
          (await config.api.automation.get(addedAutomation._id!)).projectIds
        ).toBeUndefined()
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

    it("rejects non-project document ids through the assignment SDK", async () => {
      await withProjectsEnabled(async () => {
        const datasource = await config.api.datasource.create(
          basicDatasource().datasource
        )
        const { workspaceApp } = await config.api.workspaceApp.create(
          structures.workspaceApps.createRequest({
            name: "Ops app",
            url: "/ops-app",
          })
        )

        await config.doInContext(config.getDevWorkspaceId(), async () => {
          await expect(
            sdk.projects.updateResourceProjectAssignment({
              resourceId: workspaceApp._id!,
              resourceRev: workspaceApp._rev!,
              projectIds: [datasource._id!],
            })
          ).rejects.toThrow(`Project '${datasource._id}' not found.`)
        })

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
        const analyzeDependencies = jest.fn(
          sdk.resources.analyzeResourceDependencies
        )
        const resources = jest.replaceProperty(sdk, "resources", {
          ...sdk.resources,
          analyzeResourceDependencies: analyzeDependencies,
        })
        try {
          await config.api.screen.save(persistedScreen)
          expect(analyzeDependencies).not.toHaveBeenCalled()
        } finally {
          resources.restore()
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

    it("propagates dependencies introduced by a new agent operation", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({
          name: "Operations",
        })
        const automation = await config.createAutomation()
        const agent = await config.api.agent.create({
          name: "Ops agent",
          aiconfig: "default",
          projectIds: [project._id],
        })

        await config.api.agent.createOperation(agent._id!, {
          id: "operation_1",
          name: "Run operations",
          live: false,
          enabledTools: [
            {
              toolName: `${automation._id}_trigger`,
              executionPrincipal: ToolExecutionPrincipal.ADMIN,
            },
          ],
          allowKnowledgeSourceDownload: true,
        })

        expect(
          (await config.api.automation.get(automation._id!)).projectIds
        ).toEqual([project._id])
      })
    })

    it("propagates newly enabled operation dependencies without restoring exclusions", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({
          name: "Operations",
        })
        const excludedAutomation = await config.createAutomation()
        const addedAutomation = await config.createAutomation()
        const agent = await config.api.agent.createWithOperation(
          {
            name: "Ops agent",
            aiconfig: "default",
          },
          {
            id: "operation_1",
            name: "Run operations",
            live: false,
            enabledTools: [
              {
                toolName: `${excludedAutomation._id}_trigger`,
                executionPrincipal: ToolExecutionPrincipal.ADMIN,
              },
            ],
            allowKnowledgeSourceDownload: true,
          }
        )
        await config.api.project.updateAssignment(agent._id!, {
          resourceRev: agent._rev!,
          projectIds: [project._id],
          dependencyIds: [],
        })

        await config.api.agent.updateOperation(agent._id!, "operation_1", {
          enabledTools: [
            {
              toolName: `${excludedAutomation._id}_trigger`,
              executionPrincipal: ToolExecutionPrincipal.ADMIN,
            },
            {
              toolName: `${addedAutomation._id}_trigger`,
              executionPrincipal: ToolExecutionPrincipal.ADMIN,
            },
          ],
        })

        expect(
          (await config.api.automation.get(excludedAutomation._id!)).projectIds
        ).toBeUndefined()
        expect(
          (await config.api.automation.get(addedAutomation._id!)).projectIds
        ).toEqual([project._id])
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

    it("preserves project exclusions and tool bindings when a query moves", async () => {
      await withProjectsEnabled(async () => {
        const { project: sharedProject } = await config.api.project.create({
          name: "Shared project",
        })
        const { project: destinationProject } = await config.api.project.create(
          {
            name: "Destination project",
          }
        )
        const { project: agentProject } = await config.api.project.create({
          name: "Agent project",
        })
        const { project: excludedAgentProject } =
          await config.api.project.create({
            name: "Excluded agent project",
          })
        const sourceDatasource = await config.api.datasource.create({
          ...basicDatasource().datasource,
          name: "Source datasource",
          projectIds: [sharedProject._id, agentProject._id],
        })
        const destinationDatasource = await config.api.datasource.create({
          ...basicDatasource().datasource,
          name: "Destination datasource",
        })
        const table = await config.api.table.save(basicTable())
        const excludedTable = await config.api.table.save(
          basicTable(undefined, { name: "Excluded table" })
        )
        await config.api.query.save({
          ...basicQuery(destinationDatasource._id!),
          name: "Excluded query",
          transformer: `return "{{ ${excludedTable._id}._id }}"`,
        })
        await config.api.project.updateAssignment(destinationDatasource._id!, {
          resourceRev: destinationDatasource._rev!,
          projectIds: [sharedProject._id, destinationProject._id],
          dependencyIds: [],
        })
        const query = await config.api.query.save({
          ...basicQuery(sourceDatasource._id!),
          transformer: `return "{{ ${table._id}._id }}"`,
        })
        const existingBindings = getQueryToolBindingsForResource({
          datasource: sourceDatasource,
          query,
        })
        const agent = await config.api.agent.createWithOperation(
          {
            name: "Query agent",
            projectIds: [sharedProject._id, agentProject._id],
          },
          {
            id: "operation_1",
            name: "Run query",
            live: false,
            promptInstructions: `Use {{ ${existingBindings.readableBinding} }}.`,
            enabledTools: [
              {
                toolName: existingBindings.runtimeBinding,
                executionPrincipal: ToolExecutionPrincipal.ADMIN,
              },
            ],
            allowKnowledgeSourceDownload: true,
          }
        )
        await config.api.project.updateAssignment(agent._id!, {
          resourceRev: agent._rev!,
          projectIds: [
            sharedProject._id,
            agentProject._id,
            excludedAgentProject._id,
          ],
          dependencyIds: [],
        })
        const persistedTable = await config.api.table.get(table._id!)
        await config.api.project.updateAssignment(table._id!, {
          resourceRev: persistedTable._rev!,
          projectIds: [agentProject._id],
          dependencyIds: [],
        })

        const movedQuery = await config.api.query.save({
          ...query,
          datasourceId: destinationDatasource._id!,
        })

        expect(
          new Set(
            (
              await config.api.datasource.get(destinationDatasource._id!)
            ).projectIds
          )
        ).toEqual(
          new Set([sharedProject._id, destinationProject._id, agentProject._id])
        )
        expect(
          new Set((await config.api.table.get(table._id!)).projectIds)
        ).toEqual(new Set([destinationProject._id, agentProject._id]))
        expect(
          (await config.api.table.get(excludedTable._id!)).projectIds
        ).toEqual([agentProject._id])
        expect(
          (await config.api.datasource.get(destinationDatasource._id!))
            .projectIds
        ).not.toContain(excludedAgentProject._id)
        expect(
          (await config.api.table.get(table._id!)).projectIds
        ).not.toContain(excludedAgentProject._id)
        const updatedBindings = getQueryToolBindingsForResource({
          datasource: destinationDatasource,
          query: movedQuery,
        })
        const updatedAgent = (await config.api.agent.fetch()).agents.find(
          candidate => candidate._id === agent._id
        )!
        expect(updatedAgent.operations?.[0].promptInstructions).toBe(
          `Use {{ ${updatedBindings.readableBinding} }}.`
        )
        expect(updatedAgent.operations?.[0].enabledTools?.[0].toolName).toBe(
          updatedBindings.runtimeBinding
        )
      })
    })

    it("propagates imported query dependencies without restoring exclusions", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({
          name: "Operations",
        })
        const datasource = await config.api.datasource.create({
          type: "datasource",
          name: "REST datasource",
          source: SourceName.REST,
          config: { url: "https://example.com" },
        })
        const excludedTable = await config.api.table.save(
          basicTable(undefined, { name: "Excluded table" })
        )
        const importedTable = await config.api.table.save(
          basicTable(undefined, { name: "Imported table" })
        )
        await config.api.query.save({
          ...basicQuery(datasource._id!),
          transformer: `return "{{ ${excludedTable._id}._id }}"`,
        })
        await config.api.project.updateAssignment(datasource._id!, {
          resourceRev: datasource._rev!,
          projectIds: [project._id],
          dependencyIds: [],
        })

        await config.api.query.import({
          datasource,
          datasourceId: datasource._id,
          data: JSON.stringify({
            openapi: "3.0.0",
            info: { title: "Imported API", version: "1.0.0" },
            servers: [{ url: "https://example.com" }],
            paths: {
              "/records": {
                get: {
                  parameters: [
                    {
                      name: "table",
                      in: "query",
                      schema: {
                        type: "string",
                        default: `{{ ${importedTable._id}._id }}`,
                      },
                    },
                  ],
                  responses: { "200": { description: "OK" } },
                },
              },
            },
          }),
        })

        expect(
          (await config.api.table.get(importedTable._id!)).projectIds
        ).toEqual([project._id])
        expect(
          (await config.api.table.get(excludedTable._id!)).projectIds
        ).toBeUndefined()
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
          transformer: `return "{{ ${excludedTable._id}._id }}"`,
        })

        await config.api.project.updateAssignment(datasource._id!, {
          resourceRev: datasource._rev!,
          projectIds: [project._id],
          dependencyIds: [],
        })
        await config.api.query.save({
          ...basicQuery(datasource._id!),
          transformer: `return "{{ ${includedTable._id}._id }}"`,
        })

        expect(
          (await config.api.table.get(excludedTable._id!)).projectIds
        ).toBeUndefined()
        expect(
          (await config.api.table.get(includedTable._id!)).projectIds
        ).toEqual([project._id])
      })
    })

    it("propagates reciprocal table dependencies without crossing excluded cycles", async () => {
      await withProjectsEnabled(async () => {
        const { project: sourceProject } = await config.api.project.create({
          name: "Source project",
        })
        const { project: targetProject } = await config.api.project.create({
          name: "Target project",
        })
        const sourceSibling = await config.api.table.save(
          basicTable(undefined, { name: "Source sibling" })
        )
        const targetSibling = await config.api.table.save(
          basicTable(undefined, { name: "Target sibling" })
        )
        const sourceDefinition = basicTable(undefined, { name: "Source" })
        const source = await config.api.table.save({
          ...sourceDefinition,
          schema: {
            ...sourceDefinition.schema,
            sourceSibling: {
              type: FieldType.LINK,
              name: "Source sibling",
              fieldName: "source",
              relationshipType: RelationshipType.MANY_TO_MANY,
              tableId: sourceSibling._id!,
            },
          },
        })
        const targetDefinition = basicTable(undefined, { name: "Target" })
        const target = await config.api.table.save({
          ...targetDefinition,
          schema: {
            ...targetDefinition.schema,
            targetSibling: {
              type: FieldType.LINK,
              name: "Target sibling",
              fieldName: "target",
              relationshipType: RelationshipType.MANY_TO_MANY,
              tableId: targetSibling._id!,
            },
          },
        })
        await config.api.project.updateAssignment(source._id!, {
          resourceRev: source._rev!,
          projectIds: [sourceProject._id],
          dependencyIds: [],
        })
        await config.api.project.updateAssignment(target._id!, {
          resourceRev: target._rev!,
          projectIds: [targetProject._id, sourceProject._id],
          dependencyIds: [],
        })

        const persistedSource = await config.api.table.get(source._id!)
        await config.api.table.save({
          ...persistedSource,
          schema: {
            ...persistedSource.schema,
            target: {
              type: FieldType.LINK,
              name: "Target",
              fieldName: "source",
              relationshipType: RelationshipType.MANY_TO_MANY,
              tableId: target._id!,
            },
          },
        })

        const updatedSource = await config.api.table.get(source._id!)
        const updatedTarget = await config.api.table.get(target._id!)
        const updatedSourceSibling = await config.api.table.get(
          sourceSibling._id!
        )
        const updatedTargetSibling = await config.api.table.get(
          targetSibling._id!
        )
        expect(updatedSource.projectIds).toEqual(
          expect.arrayContaining([sourceProject._id, targetProject._id])
        )
        expect(updatedTarget.projectIds).toEqual(
          expect.arrayContaining([sourceProject._id, targetProject._id])
        )
        expect(updatedSourceSibling.projectIds).toContain(targetProject._id)
        expect(updatedSourceSibling.projectIds).not.toContain(sourceProject._id)
        expect(updatedTargetSibling.projectIds).toContain(sourceProject._id)
        expect(updatedTargetSibling.projectIds).not.toContain(targetProject._id)
      })
    })

    it("keeps table saves successful when a new linked table is missing", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({
          name: "Operations",
        })
        const table = await config.api.table.save({
          ...basicTable(),
          projectIds: [project._id],
        })
        const missingTableId = "ta_missing"

        await config.api.table.save({
          ...table,
          schema: {
            ...table.schema,
            missing: {
              type: FieldType.LINK,
              name: "Missing",
              fieldName: "source",
              relationshipType: RelationshipType.MANY_TO_MANY,
              tableId: missingTableId,
            },
          },
        })

        expect(
          (await config.api.table.get(table._id!)).schema.missing
        ).toMatchObject({ tableId: missingTableId })
      })
    })

    it("does not propagate resource ids from ordinary text", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({
          name: "Operations",
        })
        const datasource = await config.api.datasource.create({
          ...basicDatasource().datasource,
          projectIds: [project._id],
        })
        const agent = await config.api.agent.create({
          name: "Unrelated agent",
          aiconfig: "default",
        })

        await config.api.query.save({
          ...basicQuery(datasource._id!),
          name: `Docs for ${agent._id}.json`,
        })

        const { agents } = await config.api.agent.fetch()
        expect(
          agents.find(candidate => candidate._id === agent._id)?.projectIds
        ).toBeUndefined()
      })
    })

    it("finds datasource dependencies through agent query tools", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({
          name: "Operations",
        })
        const datasource = await config.api.datasource.create(
          basicDatasource().datasource
        )
        const query = await config.api.query.save(basicQuery(datasource._id!))
        const bindings = getQueryToolBindings({
          sourceType: ToolType.DATASOURCE_QUERY,
          sourceLabel: datasource.name,
          queryName: query.name,
          queryId: query._id!,
        })
        const agent = await config.api.agent.createWithOperation(
          { name: "Query agent" },
          {
            id: "operation_1",
            name: "Run query",
            live: false,
            promptInstructions: `Use {{ ${bindings.readableBinding} }}.`,
            enabledTools: [
              {
                toolName: bindings.runtimeBinding,
                executionPrincipal: ToolExecutionPrincipal.ADMIN,
              },
            ],
            allowKnowledgeSourceDownload: true,
          }
        )

        const preview = await config.api.project.previewAssignment({
          resourceId: agent._id!,
          projectIds: [project._id],
        })
        expect(preview.dependencies).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ id: datasource._id }),
          ])
        )
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

    it("preserves exclusions when saving a screen with a repaired app id", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({
          name: "Operations",
        })
        const workspaceApp = await config.api.workspaceApp.find(
          config.getDefaultWorkspaceAppId()
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

        await config.doInContext(config.getDevWorkspaceId(), async () => {
          await context.getWorkspaceDB().put({
            ...screen,
            workspaceAppId: undefined,
          })
        })
        const repairedScreen = (await config.api.screen.list()).find(
          candidate => candidate._id === screen._id
        )!
        await config.api.screen.save(repairedScreen)

        expect(
          (await config.api.automation.get(automation._id!)).projectIds
        ).toBeUndefined()
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
          const screen = basicScreen()
          await config.api.screen.save(
            {
              ...screen,
              props: {
                ...screen.props,
                dependencies: [firstDatasource._id, secondDatasource._id],
              },
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
          .mockImplementationOnce(async docs => {
            const results = []
            for (const doc of docs) {
              if (doc._id === workspaceApp._id) {
                results.push(await context.getWorkspaceDB().put(doc))
              } else {
                results.push({
                  id: doc._id!,
                  error: "conflict",
                  reason: "cleanup failed",
                })
              }
            }
            return results
          })

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

  it("preserves project assignments and exclusions when duplicating resources", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
      })
      const table = await config.api.table.save(
        basicTable(undefined, { name: "Source table" })
      )
      const { workspaceApp } = await config.api.workspaceApp.create({
        name: "Operations app",
        url: "/operations-app",
      })
      const appDependency = await config.createAutomation()
      const appScreen = basicScreen()
      await config.api.screen.save({
        ...appScreen,
        workspaceAppId: workspaceApp._id,
        props: {
          ...appScreen.props,
          dependencies: [appDependency._id],
        },
      })
      const agentDependency = await config.api.datasource.create({
        ...basicDatasource().datasource,
        name: "Agent dependency",
      })
      const agent = await config.api.agent.createWithOperation(
        { name: "Ops agent" },
        {
          id: "operation_1",
          name: "Use datasource",
          live: false,
          promptInstructions: `Use {{ ${agentDependency._id}.rows }}.`,
          enabledTools: [],
          allowKnowledgeSourceDownload: true,
        }
      )
      const automationDependency = await config.api.table.save(
        basicTable(undefined, { name: "Automation dependency" })
      )
      const automationDefinition = newAutomation()
      automationDefinition.definition.steps[0].inputs = {
        ...automationDefinition.definition.steps[0].inputs,
        tableId: automationDependency._id!,
      }
      const automation = await config.createAutomation(automationDefinition)

      for (const resource of [table, workspaceApp, agent, automation]) {
        await config.api.project.updateAssignment(resource._id!, {
          resourceRev: resource._rev!,
          projectIds: [project._id],
          dependencyIds: [],
        })
      }

      const duplicatedTable = await config.api.table.duplicate(table._id!)
      const { workspaceApp: duplicatedWorkspaceApp } =
        await config.api.workspaceApp.duplicate(workspaceApp._id!)
      const duplicatedAgent = await config.api.agent.duplicate(agent._id!)
      const persistedAutomation = await config.api.automation.get(
        automation._id!
      )
      const { automation: duplicatedAutomation } =
        await config.api.automation.update({
          ...persistedAutomation,
          _id: undefined,
          _rev: undefined,
          name: `${persistedAutomation.name} copy`,
          sourceAutomationId: persistedAutomation._id,
        })

      expect(duplicatedTable.projectIds).toEqual([project._id])
      expect(duplicatedWorkspaceApp.projectIds).toEqual([project._id])
      expect(duplicatedAgent.projectIds).toEqual([project._id])
      expect(duplicatedAutomation.projectIds).toEqual([project._id])
      expect(
        (await config.api.automation.get(appDependency._id!)).projectIds
      ).toBeUndefined()
      expect(
        (await config.api.datasource.get(agentDependency._id!)).projectIds
      ).toBeUndefined()
      expect(
        (await config.api.table.get(automationDependency._id!)).projectIds
      ).toBeUndefined()
    })
  })

  it("restores a duplicated automation without its source", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
      })
      const dependency = await config.api.table.save(
        basicTable(undefined, { name: "Automation dependency" })
      )
      const definition = newAutomation()
      definition.definition.steps[0].inputs = {
        ...definition.definition.steps[0].inputs,
        tableId: dependency._id!,
      }
      const source = await config.createAutomation(definition)
      await config.api.project.updateAssignment(source._id!, {
        resourceRev: source._rev!,
        projectIds: [project._id],
        dependencyIds: [],
      })
      const persistedSource = await config.api.automation.get(source._id!)
      const { automation: duplicate } = await config.api.automation.update({
        ...persistedSource,
        _id: undefined,
        _rev: undefined,
        name: `${persistedSource.name} copy`,
        sourceAutomationId: persistedSource._id,
      })

      await config.api.automation.delete(duplicate)
      await config.api.automation.delete(persistedSource)
      const { automation: restored } = await config.api.automation.update({
        ...duplicate,
        _rev: undefined,
        sourceAutomationId: persistedSource._id,
      })

      expect(restored._id).toBe(duplicate._id)
      expect(restored.projectIds).toEqual([project._id])
      expect(
        (await config.api.table.get(dependency._id!)).projectIds
      ).toBeUndefined()
    })
  })

  it("propagates dependencies for explicit-id automation creations", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
      })
      const dependency = await config.api.table.save(
        basicTable(undefined, { name: "Automation dependency" })
      )
      const automation = newAutomation()
      automation._id = "au_explicit_id"
      automation.projectIds = [project._id]
      automation.definition.steps[0].inputs = {
        ...automation.definition.steps[0].inputs,
        tableId: dependency._id!,
      }

      await config.api.automation.post(automation)

      expect((await config.api.table.get(dependency._id!)).projectIds).toEqual([
        project._id,
      ])
    })
  })

  it("clears project assignments when duplicating resources with projects disabled", async () => {
    let tableId = ""
    let workspaceAppId = ""
    let agentId = ""
    let automationId = ""

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
      const automation = await config.createAutomation({
        ...newAutomation(),
        projectIds: [project._id],
      })

      tableId = table._id!
      workspaceAppId = workspaceApp._id!
      agentId = agent._id!
      automationId = automation._id!
    })

    const duplicatedTable = await config.api.table.duplicate(tableId!)
    const { workspaceApp: duplicatedWorkspaceApp } =
      await config.api.workspaceApp.duplicate(workspaceAppId!)
    const duplicatedAgent = await config.api.agent.duplicate(agentId!)
    const automation = await config.api.automation.get(automationId)
    const { automation: duplicatedAutomation } =
      await config.api.automation.update({
        ...automation,
        _id: undefined,
        _rev: undefined,
        name: `${automation.name} copy`,
        sourceAutomationId: automationId,
      })

    expect(duplicatedTable.projectIds).toBeUndefined()
    expect(duplicatedWorkspaceApp.projectIds).toBeUndefined()
    expect(duplicatedAgent.projectIds).toBeUndefined()
    expect(duplicatedAutomation.projectIds).toBeUndefined()
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
        password: "super-secret {{ env.DB_PASSWORD }}",
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
    await config.doInContext(config.getDevWorkspaceId(), async () => {
      const db = context.getWorkspaceDB()
      const storedScreen = await db.get<
        typeof screen & { projectIds?: string[] }
      >(screen._id!)
      await db.put({ ...storedScreen, projectIds: [project._id] })
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
        messagingEndpointUrl: "https://source.example/slack",
        idleTimeoutMinutes: 20,
        requireUserLink: true,
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
    it.each([
      {
        name: "password",
        includeDatasource: false,
        credentials: { password: "mailbox-secret" },
      },
      {
        name: "excluded OAuth2 connection",
        includeDatasource: false,
        credentials: {
          authType: EmailTriggerAuthType.OAUTH2,
          datasourceId: "datasource_source",
          authConfigId: "auth_source",
        },
      },
      {
        name: "included OAuth2 connection",
        includeDatasource: true,
        credentials: {
          authType: EmailTriggerAuthType.OAUTH2,
          datasourceId: "datasource_source",
          authConfigId: "auth_source",
        },
      },
      {
        name: "missing OAuth2 auth config",
        includeDatasource: true,
        credentials: {
          authType: EmailTriggerAuthType.OAUTH2,
          datasourceId: "datasource_source",
          authConfigId: "auth_missing",
        },
      },
      {
        name: "legacy OAuth2",
        includeDatasource: false,
        credentials: {
          authType: EmailTriggerAuthType.OAUTH2,
          oauth2ConfigId: "oauth2_source",
        },
      },
    ])(
      "sanitises email credentials and remaps $name after import",
      async ({ credentials, includeDatasource }) => {
        await withProjectsEnabled(async () => {
          const project = await createAssignedProject()
          if (credentials.datasourceId) {
            const datasource = await config.api.datasource.create({
              ...basicDatasource().datasource,
              source: SourceName.REST,
              projectIds: includeDatasource ? [project._id] : undefined,
              config: {
                authConfigs: [
                  {
                    _id: "auth_source",
                    name: "Mailbox authentication",
                    type: RestAuthType.OAUTH2,
                    url: "https://example.com/oauth/token",
                    clientId: "mailbox-client",
                    clientSecret: "oauth-secret",
                    method: OAuth2CredentialsMethod.BODY,
                    grantType: OAuth2GrantType.CLIENT_CREDENTIALS,
                  },
                ],
              },
            })
            credentials = { ...credentials, datasourceId: datasource._id! }
          }
          const settings = {
            host: "imap.example.com",
            port: 993,
            secure: true,
            username: "ops@example.com",
            mailbox: "INBOX",
          }
          const sourceAutomation = createAutomationBuilder(config)
            .onEmail({ ...settings, ...credentials })
            .build({ disabled: true })
          const { automation } = await config.api.automation.post({
            ...sourceAutomation,
            projectIds: [project._id],
          })
          if (credentials.datasourceId && !includeDatasource) {
            const datasource = await config.api.datasource.get(
              credentials.datasourceId
            )
            await config.api.project.updateAssignment(datasource._id!, {
              resourceRev: datasource._rev!,
              projectIds: [],
              dependencyIds: [],
            })
          }
          const files = await readTarEntries(
            await config.api.project.export(project._id)
          )
          const automationPath = `docs/automation/${automation._id}.json`
          const exported: Automation = JSON.parse(
            files.get(automationPath)!.toString()
          )
          const manifest = JSON.parse(files.get("manifest.json")!.toString())

          expect(exported.definition.trigger.inputs).toEqual({
            ...settings,
            authType: credentials.authType,
            ...(credentials.datasourceId
              ? {
                  datasourceId: credentials.datasourceId,
                  authConfigId: credentials.authConfigId,
                }
              : {}),
          })
          expect(
            [...files.values()].map(file => file.toString()).join("\n")
          ).not.toContain("oauth-secret")
          expect(manifest.requiresSecrets).toBe(true)

          const entries = Object.fromEntries(
            [...files].map(([path, contents]) => [
              path,
              JSON.parse(contents.toString()),
            ])
          )
          entries[automationPath] = {
            ...exported,
            disabled: false,
            definition: sourceAutomation.definition,
          }
          const imported = await config.api.project.import(
            await createTarPackage(entries)
          )
          const importedAutomation = await config.doInContext(undefined, () =>
            context
              .getWorkspaceDB()
              .get<Automation>(imported.resources.automation![0])
          )

          expect(importedAutomation.disabled).toBe(true)
          const importedConnection =
            includeDatasource && credentials.authConfigId === "auth_source"
          expect(importedAutomation.definition.trigger.inputs).toEqual({
            ...settings,
            authType: credentials.authType,
            ...(importedConnection
              ? {
                  datasourceId: imported.resources.datasource![0],
                  authConfigId: credentials.authConfigId,
                }
              : {}),
          })
          const expectedRequirements = []
          if (!importedConnection) {
            expectedRequirements.push({
              type: "automation_credentials",
              resourceId: importedAutomation._id,
            })
          }
          if (includeDatasource) {
            expectedRequirements.push({
              type: "datasource_secrets",
              resourceId: imported.resources.datasource![0],
            })
          }
          expect(
            imported.requirements
              .map(({ type, resourceId }) => ({ type, resourceId }))
              .sort((a, b) => a.type.localeCompare(b.type))
          ).toEqual(expectedRequirements)
        })
      }
    )

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
        const { datasource, query, agent, screen, files } =
          await createProjectExportFixture()

        const exportedDatasource = JSON.parse(
          files.get(`docs/datasource/${datasource._id}.json`)!.toString()
        )
        expect(exportedDatasource.config.password).not.toContain("super-secret")

        const exportedQuery = JSON.parse(
          files.get(`docs/query/${query._id}.json`)!.toString()
        )
        expect(exportedQuery.projectIds).toBeUndefined()

        const exportedScreen = JSON.parse(
          files.get(`docs/screen/${screen._id}.json`)!.toString()
        )
        expect(exportedScreen.projectIds).toBeUndefined()

        const exportedAgent = JSON.parse(
          files.get(`docs/agent/${agent._id}.json`)!.toString()
        )
        expect(exportedAgent.live).toBe(false)
        expect(exportedAgent.publishedAt).toBeUndefined()
        expect(exportedAgent.slackIntegration).toEqual({
          idleTimeoutMinutes: 20,
          requireUserLink: true,
          teamId: "T123",
        })
      })
    })

    it("preserves pure environment expressions in exported secrets", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({
          name: "Environment bindings",
        })
        const password = "{{ env.PASSWORD_PREFIX }}{{ env.PASSWORD_SUFFIX }}"
        const datasource = await config.api.datasource.create({
          type: "datasource",
          name: "Environment datasource",
          source: SourceName.REST,
          config: {
            authConfigs: [
              {
                _id: generator.guid(),
                name: "Environment auth",
                type: RestAuthType.BASIC,
                config: {
                  username: "{{ env.USERNAME }}",
                  password,
                },
              },
            ],
          },
          projectIds: [project._id],
        })

        const files = await readTarEntries(
          await config.api.project.export(project._id)
        )
        const exportedDatasource = JSON.parse(
          files.get(`docs/datasource/${datasource._id}.json`)!.toString()
        )
        expect(exportedDatasource.config.authConfigs[0].config.password).toBe(
          password
        )
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
          transformer: `return "{{ ${agent._id}.name }}"`,
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

    it("ignores resource ids in ordinary text", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({
          name: "Operations",
        })
        const datasource = await config.api.datasource.create({
          ...basicDatasource().datasource,
        })
        const agent = await config.api.agent.create({
          name: "Unrelated agent",
          aiconfig: "default",
        })
        await config.api.query.save({
          ...basicQuery(datasource._id!),
          name: `Docs for ${agent._id}.json`,
        })
        await config.api.project.updateAssignment(datasource._id!, {
          resourceRev: datasource._rev!,
          projectIds: [project._id],
          dependencyIds: [],
        })

        const files = await readTarEntries(
          await config.api.project.export(project._id)
        )
        const manifest = JSON.parse(files.get("manifest.json")!.toString())
        const dependencyIndex = JSON.parse(
          files.get("dependency-index.json")!.toString()
        ) as ProjectPackageDependencyIndex

        expect(files.has(`docs/agent/${agent._id}.json`)).toBe(false)
        expect(
          Object.values(dependencyIndex.resources).flatMap(resource =>
            resource.dependencies.map(dependency => dependency.id)
          )
        ).not.toContain(agent._id)
        expect(manifest.unsupportedContent).not.toEqual(
          expect.arrayContaining([
            expect.objectContaining({ type: "excluded_dependency" }),
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

  it("rejects project imports into production workspaces", async () => {
    await withProjectsEnabled(async () => {
      const body = await createTarPackage(createMinimalPackageEntries())
      await config.publish()

      await config.withHeaders(
        { [Header.WORKSPACE_ID]: config.getProdWorkspaceId() },
        async () => {
          await config.api.project.import(body, undefined, {
            status: 400,
            body: {
              message: "Only apps in development support this endpoint",
            },
          })

          expect((await config.api.project.fetch()).projects).toEqual([])
        }
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
        { [Header.WORKSPACE_ID]: destinationWorkspace.appId },
        async () => {
          const imported = await config.api.project.import(body)
          expect(imported.resources).toEqual({
            project: [imported.project._id],
          })
        }
      )
    })
  })

  it("exports and remaps external tables through their assigned datasource", async () => {
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
      })
      await config.api.datasource.update({
        ...datasource,
        entities: {
          [externalTable.name]: externalTable,
        },
      })
      const view = await config.api.viewV2.create({
        tableId: externalTableId,
        name: "External view",
      })
      await config.doInContext(config.getDevWorkspaceId(), async () => {
        const db = context.getWorkspaceDB()
        const storedDatasource = await db.get<Datasource>(datasource._id!)
        storedDatasource.entities![externalTable.name].projectIds = [
          project._id,
        ]
        await db.put(storedDatasource)
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
        { [Header.WORKSPACE_ID]: destinationWorkspace.appId },
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

          expect(importedDatasource.projectIds).toEqual([imported.project._id])
          expect(importedExternalTable._id).toBe(importedExternalTableId)
          expect(importedExternalTable.projectIds).toBeUndefined()
          expect(importedExternalTable.primaryDisplay).toBe(
            `{{ ${importedExternalTableId}.name }}`
          )
          const importedView = Object.values(
            importedExternalTable.views!
          ).filter(helpers.views.isV2)[0]
          expect(importedView.id).not.toBe(view.id)
          expect((await config.api.viewV2.get(importedView.id)).tableId).toBe(
            importedExternalTableId
          )
        }
      )
    })
  })

  it("tracks external table agent tools as datasource dependencies", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "External data agent",
      })
      const datasource = await config.api.datasource.create(
        basicDatasource().datasource
      )
      const externalTableId = buildExternalTableId(datasource._id!, "Orders")
      await config.api.datasource.update({
        ...datasource,
        entities: {
          Orders: basicTable(datasource, {
            _id: externalTableId,
            name: "Orders",
          }),
        },
      })
      const agent = await config.api.agent.create({
        name: "External data agent",
        aiconfig: "default",
        projectIds: [project._id],
      })
      await config.api.agent.createOperation(agent._id!, {
        id: "operation_1",
        name: "Create orders",
        live: false,
        enabledTools: [
          {
            toolName: getRowToolNames(externalTableId).create_row,
            executionPrincipal: ToolExecutionPrincipal.ADMIN,
          },
        ],
        allowKnowledgeSourceDownload: true,
      })

      const resourceGraph = await config.api.resource.getResourceDependencies()
      expect(
        resourceGraph.body.resources[agent._id!].dependencies.map(
          dependency => dependency.id
        )
      ).toContain(datasource._id)
      expect(
        resourceGraph.body.resources[project._id].dependencies.map(
          dependency => dependency.id
        )
      ).toContain(datasource._id)
      expect(
        (await config.api.datasource.get(datasource._id!)).projectIds
      ).toEqual([project._id])
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
        { [Header.WORKSPACE_ID]: destinationWorkspace.appId },
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

  it.each(["source", "another"])(
    "imports independent views and row actions into the %s workspace",
    async destination => {
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
        const view = await config.api.viewV2.create({
          tableId: table._id!,
          name: "Open orders",
        })
        await config.api.rowAction.setViewPermission(
          table._id!,
          view.id,
          rowAction.id
        )
        const workspaceApp = await createAssignedWorkspaceApp(project._id)
        await config.api.screen.save({
          ...createViewScreen(view),
          workspaceAppId: workspaceApp._id,
        })

        const body = await config.api.project.export(project._id)
        const destinationWorkspaceId =
          destination === "source"
            ? config.getDevWorkspaceId()
            : (
                await config.api.workspace.create({
                  name: "Imported workspace",
                })
              ).appId

        await config.withHeaders(
          { [Header.WORKSPACE_ID]: destinationWorkspaceId },
          async () => {
            for (let importIndex = 0; importIndex < 2; importIndex++) {
              const imported = await config.api.project.import(body)
              const importedTableId = imported.resources.table![0]
              const importedTable = await config.api.table.get(importedTableId)
              const importedView = Object.values(importedTable.views!).filter(
                helpers.views.isV2
              )[0]
              const resolvedView = await config.api.viewV2.get(importedView.id)
              const screens = await config.api.screen.list()
              const importedScreen = screens.find(
                screen => screen._id === imported.resources.screen![0]
              )!

              expect(resolvedView.tableId).toBe(importedTableId)
              expect(importedView.id).not.toBe(view.id)
              expect(importedScreen.props._children![1].table).toMatchObject({
                id: importedView.id,
                tableId: importedTableId,
              })

              const importedRowActions = await config.api.rowAction.find(
                imported.resources.table?.[0]!
              )
              const importedAction = Object.values(
                importedRowActions.actions
              )[0]

              expect(importedAction).toMatchObject({
                tableId: importedTableId,
                automationId: imported.resources.automation![0],
                allowedSources: [importedTableId, importedView.id],
              })
              expect(importedAction.id).not.toBe(rowAction.id)
              expect(Object.keys(importedRowActions.actions)).toEqual([
                importedAction.id,
              ])

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
          }
        )
      })
    }
  )

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
      await config.api.screen.save({
        ...queryScreen,
        props: {
          ...queryScreen.props,
          testBinding: `{{ ${query._id}.rows }}`,
          testBracketBinding: `{{ [${query._id}].[rows] }}`,
          testBlockBinding: `{{#if ${query._id}.rows}}{{ ${query._id}.rows }}{{/if}}`,
          testJavascriptBinding: encodeJSBinding(
            `return $("${query._id}.rows")`
          ),
          ordinaryText: `Docs: ${query._id}.rows`,
          ordinaryUrl: `https://example.com/${query._id}.rows`,
          bindingKeyed: {
            [`{{ ${query._id}.rows }}`]: "binding key",
          },
          idKeyed: {
            [query._id!]: {
              resourceId: query._id,
            },
          },
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
      const createdToolAutomation = await config.createAutomation()
      const { automation: toolAutomation } = await config.api.automation.update(
        {
          ...createdToolAutomation,
          projectIds: [project._id],
        }
      )
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
      await config.api.agent.createOperation(agent._id!, {
        id: "operation_1",
        name: "Use project resources",
        live: false,
        enabledTools: [
          {
            toolName: getAutomationTriggerToolName(toolAutomation._id!),
            executionPrincipal: ToolExecutionPrincipal.ADMIN,
          },
          {
            toolName: getRowToolNames(table._id!).create_row,
            executionPrincipal: ToolExecutionPrincipal.ADMIN,
          },
          {
            toolName: getQueryToolBindingsForResource({ datasource, query })
              .runtimeBinding,
            executionPrincipal: ToolExecutionPrincipal.ADMIN,
          },
        ],
        allowKnowledgeSourceDownload: true,
      })

      const body = await config.api.project.export(project._id)
      const destinationWorkspace = await config.api.workspace.create({
        name: "Imported workspace",
      })

      await config.withHeaders(
        { [Header.WORKSPACE_ID]: destinationWorkspace.appId },
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
          expect(imported.resources.automation).toHaveLength(2)
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
          expect(importedScreen!.props.testBracketBinding).toBe(
            `{{ [${imported.resources.query?.[0]}].[rows] }}`
          )
          expect(importedScreen!.props.testBlockBinding).toBe(
            `{{#if ${imported.resources.query?.[0]}.rows}}{{ ${imported.resources.query?.[0]}.rows }}{{/if}}`
          )
          expect(
            decodeJSBinding(importedScreen!.props.testJavascriptBinding)
          ).toBe(`return $("${imported.resources.query?.[0]}.rows")`)
          expect(importedScreen!.props.ordinaryText).toBe(
            `Docs: ${query._id}.rows`
          )
          expect(importedScreen!.props.ordinaryUrl).toBe(
            `https://example.com/${query._id}.rows`
          )
          expect(importedScreen!.props.bindingKeyed).toEqual({
            [`{{ ${query._id}.rows }}`]: "binding key",
          })
          expect(importedScreen!.props.idKeyed).toEqual({
            [query._id!]: {
              resourceId: imported.resources.query?.[0],
            },
          })

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

          const importedAutomations = await Promise.all(
            imported.resources.automation!.map(id =>
              config.api.automation.get(id)
            )
          )
          const importedAutomation = importedAutomations.find(automation =>
            isWebhookTrigger(automation.definition.trigger)
          )!
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

          const importedToolAutomation = importedAutomations.find(
            automation =>
              automation.definition.trigger.stepId ===
              AutomationTriggerStepId.APP
          )!
          expect(importedToolAutomation).toBeDefined()
          expect(importedToolAutomation.projectIds).toEqual([
            imported.project._id,
          ])

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
          expect(
            importedAgent?.operations?.[0].enabledTools?.map(
              tool => tool.toolName
            )
          ).toEqual([
            getAutomationTriggerToolName(importedToolAutomation._id!),
            getRowToolNames(importedTable._id!).create_row,
            getQueryToolBindingsForResource({
              datasource: importedDatasource,
              query: importedQuery,
            }).runtimeBinding,
          ])

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
              ...imported.resources.automation!,
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
        { [Header.WORKSPACE_ID]: destinationWorkspace.appId },
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

  it("rejects packages with an invalid source project id", async () => {
    await withProjectsEnabled(async () => {
      const packageBuffer = await createTarPackage(
        createMinimalPackageEntries({
          project: { _id: "invalid" },
        })
      )

      await config.api.project.import(packageBuffer, undefined, {
        status: 400,
        body: { message: "Project package project.json is invalid." },
      })
    })
  })

  it("rejects packages with an invalid source workspace id", async () => {
    await withProjectsEnabled(async () => {
      const packageBuffer = await createTarPackage(
        createMinimalPackageEntries({
          manifest: { sourceWorkspace: { id: "invalid" } },
        })
      )

      await config.api.project.import(packageBuffer, undefined, {
        status: 400,
        body: { message: "Project package manifest is invalid." },
      })
    })
  })

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

  it.each(["dependency", "direct member"])(
    "rejects a missing %s resource",
    async location => {
      await withProjectsEnabled(async () => {
        const missing = {
          id: "au_missing",
          name: "Missing automation",
          type: "automation",
        }
        const dependencyIndex =
          location === "dependency"
            ? {
                resources: {
                  project_source: { dependencies: [missing] },
                },
              }
            : { directMembers: [missing] }
        const packageBuffer = await createTarPackage(
          createMinimalPackageEntries({ dependencyIndex })
        )

        await config.api.project.import(packageBuffer, undefined, {
          status: 400,
          body: {
            message:
              "Project package dependency index references missing docs.",
          },
        })
      })
    }
  )

  it.each(["dependency", "direct member"])(
    "rejects a %s with the wrong resource type",
    async location => {
      await withProjectsEnabled(async () => {
        const tableId = "ta_mistyped"
        const table = {
          id: tableId,
          name: "Mistyped table",
          type: "table",
        }
        const mistyped = { ...table, type: "automation" }
        const packageBuffer = await createTarPackage(
          createMinimalPackageEntries({
            manifest: {
              resourcesByType: {
                project: 1,
                table: 1,
              },
            },
            dependencyIndex: {
              directMembers: location === "direct member" ? [mistyped] : [],
              resources: {
                project_source: {
                  dependencies: [location === "dependency" ? mistyped : table],
                },
                [tableId]: { dependencies: [] },
              },
            },
            docs: {
              [`docs/table/${tableId}.json`]: {
                ...basicTable(),
                _id: tableId,
                name: "Mistyped table",
              },
            },
          })
        )

        await config.api.project.import(packageBuffer, undefined, {
          status: 400,
          body: {
            message:
              "Project package dependency index resource types do not match package docs.",
          },
        })
      })
    }
  )

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
        .mockImplementationOnce(async docs => {
          const saved = await context.getWorkspaceDB().put(docs[0])
          return [
            { id: saved.id, rev: saved.rev },
            { id: docs[1]._id!, error: "conflict", reason: "import failed" },
          ]
        })

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
      expect(
        (await config.api.datasource.fetch()).filter(
          datasource => datasource._id !== INTERNAL_TABLE_SOURCE_ID
        )
      ).toHaveLength(0)
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
