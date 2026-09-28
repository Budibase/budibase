import { context, features } from "@budibase/backend-core"
import { structures } from "@budibase/backend-core/tests"
import { getQueryToolBindings, Header } from "@budibase/shared-core"
import {
  APIWarningCode,
  FeatureFlag,
  INTERNAL_TABLE_SOURCE_ID,
  InternalTable,
  ResourceType,
  ToolExecutionPrincipal,
  ToolType,
  type Automation,
  type Screen,
} from "@budibase/types"
import { DatabaseImpl } from "../../../../../backend-core/src/db/couch/DatabaseImpl"
import { buildExternalTableId } from "../../../integrations/utils"
import sdk from "../../../sdk"
import * as projectLock from "../../../sdk/workspace/projects/lock"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { setupDefaultCompletionsAIConfig } from "../../../tests/utilities/aiConfig"
import {
  basicDatasource,
  basicQuery,
} from "../../../tests/utilities/structures"

jest.mock("../../../sdk/workspace/projects/lock", () => {
  const actual = jest.requireActual<
    typeof import("../../../sdk/workspace/projects/lock")
  >("../../../sdk/workspace/projects/lock")
  return {
    ...actual,
    doWithProjectAssignmentsLock: jest.fn(actual.doWithProjectAssignmentsLock),
  }
})

describe("project dependency assignments", () => {
  const config = new TestConfiguration()

  beforeEach(async () => {
    await config.newTenant()
  })

  afterAll(() => config.end())

  const withProjectsEnabled = async <T>(fn: () => Promise<T>) =>
    await features.testutils.withFeatureFlags(
      config.getTenantId(),
      { [FeatureFlag.PROJECTS]: true },
      fn
    )

  const createApp = async () => {
    const { workspaceApp } = await config.api.workspaceApp.create(
      structures.workspaceApps.createRequest({
        name: "Ops app",
        url: "/ops-app",
      })
    )
    return workspaceApp
  }

  it("rechecks the project after waiting for the assignment lock", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
      })
      const workspaceApp = await createApp()
      const preview = await config.api.project.previewAssignment({
        resourceId: workspaceApp._id!,
        projectIds: [project._id],
      })

      // Simulate deletion finishing before the waiting assignment acquires the lock.
      jest
        .mocked(projectLock.doWithProjectAssignmentsLock)
        .mockImplementationOnce(async task => {
          await config.api.project.delete(project._id, project._rev)
          return await task()
        })

      await config.api.project.updateAssignment(
        workspaceApp._id!,
        {
          resourceRev: preview.resourceRev,
          dependencyFingerprint: preview.dependencyFingerprint,
          projectIds: [project._id],
          dependencyIds: [],
        },
        { status: 404 }
      )

      expect(
        (await config.api.workspaceApp.find(workspaceApp._id!)).projectIds
      ).toBeUndefined()
    })
  })

  const createAutomationButtonScreen = ({
    workspaceAppId,
    automationId,
  }: {
    workspaceAppId: string
    automationId: string
  }): Screen => ({
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

  const createAppWithAutomation = async () => {
    const workspaceApp = await createApp()
    const automation = await config.createAutomation()
    const screen = await config.api.screen.save(
      createAutomationButtonScreen({
        workspaceAppId: workspaceApp._id!,
        automationId: automation._id!,
      })
    )
    return { workspaceApp, automation, screen }
  }

  it("previews dependencies and applies only the selected additions", async () => {
    await withProjectsEnabled(async () => {
      const { project: firstProject } = await config.api.project.create({
        name: "Operations",
      })
      const { project: secondProject } = await config.api.project.create({
        name: "Reporting",
      })
      const { workspaceApp, automation } = await createAppWithAutomation()
      await config.api.automation.update({
        ...automation,
        projectIds: [firstProject._id],
      })
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
          projectIdsToAdd: [secondProject._id],
        },
      ])

      const excluded = await config.api.project.updateAssignment(
        workspaceApp._id!,
        {
          resourceRev: preview.resourceRev,
          dependencyFingerprint: preview.dependencyFingerprint,
          projectIds,
          dependencyIds: [],
        }
      )
      expect(excluded.projectIds).toEqual(projectIds)
      expect(excluded.assignedDependencyIds).toEqual([])
      expect(
        (await config.api.automation.get(automation._id!)).projectIds
      ).toEqual([firstProject._id])

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
          dependencyFingerprint: repairPreview.dependencyFingerprint,
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
      const { workspaceApp, automation } = await createAppWithAutomation()

      const preview = await config.api.project.previewAssignment({
        resourceId: workspaceApp._id!,
        projectIds: [project._id],
      })

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
      const { workspaceApp, automation } = await createAppWithAutomation()

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
      const {
        workspaceApp,
        automation: existingAutomation,
        screen,
      } = await createAppWithAutomation()
      const preview = await config.api.project.previewAssignment({
        resourceId: workspaceApp._id!,
        projectIds: [project._id],
      })

      const addedAutomation = await config.createAutomation()
      const addedButton = createAutomationButtonScreen({
        workspaceAppId: workspaceApp._id!,
        automationId: addedAutomation._id!,
      }).props!._children![0]
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

  it("rejects dependency selections without a selected project", async () => {
    await withProjectsEnabled(async () => {
      const workspaceApp = await createApp()
      const preview = await config.api.project.previewAssignment({
        resourceId: workspaceApp._id!,
        projectIds: [],
      })
      await config.api.project.updateAssignment(
        workspaceApp._id!,
        {
          resourceRev: preview.resourceRev,
          dependencyFingerprint: preview.dependencyFingerprint,
          projectIds: [],
          dependencyIds: ["automation_unselected"],
        },
        { status: 400 }
      )
      expect(
        (await config.api.workspaceApp.find(workspaceApp._id!)).projectIds
      ).toBeUndefined()
    })
  })

  it("rejects unrelated dependency selections", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
      })
      const workspaceApp = await createApp()
      const unrelatedDatasource = await config.api.datasource.create(
        basicDatasource().datasource
      )
      const preview = await config.api.project.previewAssignment({
        resourceId: workspaceApp._id!,
        projectIds: [project._id],
      })
      await config.api.project.updateAssignment(
        workspaceApp._id!,
        {
          resourceRev: preview.resourceRev,
          dependencyFingerprint: preview.dependencyFingerprint,
          projectIds: [project._id],
          dependencyIds: [unrelatedDatasource._id!],
        },
        { status: 400 }
      )
      expect(
        (await config.api.workspaceApp.find(workspaceApp._id!)).projectIds
      ).toBeUndefined()
    })
  })

  it("rejects a stale root revision", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
      })
      const workspaceApp = await createApp()
      const preview = await config.api.project.previewAssignment({
        resourceId: workspaceApp._id!,
        projectIds: [project._id],
      })
      await config.api.project.updateAssignment(
        workspaceApp._id!,
        {
          resourceRev: "stale-revision",
          dependencyFingerprint: preview.dependencyFingerprint,
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
      const workspaceApp = await createApp()

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

  it("rejects resources that cannot be assigned directly to projects", async () => {
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

  it("keeps the root assignment successful when selected dependency writes conflict", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
      })
      const { workspaceApp, automation } = await createAppWithAutomation()
      const preview = await config.api.project.previewAssignment({
        resourceId: workspaceApp._id!,
        projectIds: [project._id],
      })
      const bulkDocs = jest
        .spyOn(DatabaseImpl.prototype, "bulkDocs")
        .mockImplementation(async docs =>
          docs.map(doc => ({
            id: doc._id!,
            error: "conflict",
            reason: "mock conflict",
          }))
        )

      try {
        const response = await config.api.project.updateAssignment(
          workspaceApp._id!,
          {
            resourceRev: preview.resourceRev,
            dependencyFingerprint: preview.dependencyFingerprint,
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
        expect(response.assignedDependencyIds).toEqual([])
        expect(
          (await config.api.workspaceApp.find(workspaceApp._id!)).projectIds
        ).toEqual([project._id])
        expect(
          (await config.api.automation.get(automation._id!)).projectIds
        ).toBeUndefined()
      } finally {
        bulkDocs.mockRestore()
      }

      const repairPreview = await config.api.project.previewAssignment({
        resourceId: workspaceApp._id!,
        projectIds: [project._id],
      })
      const retried = await config.api.project.updateAssignment(
        workspaceApp._id!,
        {
          resourceRev: repairPreview.resourceRev,
          dependencyFingerprint: repairPreview.dependencyFingerprint,
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

  it("retries a dependency conflict without losing its existing projects", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
      })
      const { project: sharedProject } = await config.api.project.create({
        name: "Shared",
      })
      const { workspaceApp, automation } = await createAppWithAutomation()
      const preview = await config.api.project.previewAssignment({
        resourceId: workspaceApp._id!,
        projectIds: [project._id],
      })
      const bulkDocs = jest
        .spyOn(DatabaseImpl.prototype, "bulkDocs")
        .mockImplementationOnce(async docs => {
          const db = context.getWorkspaceDB()
          const current = await db.get<Automation>(automation._id!)
          await db.put({ ...current, projectIds: [sharedProject._id] })
          return docs.map(doc => ({
            id: doc._id!,
            error: "conflict",
            reason: "concurrent edit",
          }))
        })

      try {
        const result = await config.api.project.updateAssignment(
          workspaceApp._id!,
          {
            resourceRev: preview.resourceRev,
            dependencyFingerprint: preview.dependencyFingerprint,
            projectIds: [project._id],
            dependencyIds: [automation._id!],
          }
        )
        expect(result.assignedDependencyIds).toEqual([automation._id])
        expect(
          (await config.api.automation.get(automation._id!)).projectIds
        ).toEqual([sharedProject._id, project._id])
      } finally {
        bulkDocs.mockRestore()
      }
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

  it("finds datasource dependencies through agent query tools", async () => {
    const cleanupAIConfig = await setupDefaultCompletionsAIConfig(
      config,
      "default"
    )
    try {
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
    } finally {
      await cleanupAIConfig()
    }
  })
})
