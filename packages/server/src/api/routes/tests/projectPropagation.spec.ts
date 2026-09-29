import { context, features } from "@budibase/backend-core"
import { structures } from "@budibase/backend-core/tests"
import { Header, helpers } from "@budibase/shared-core"
import {
  APIWarningCode,
  FeatureFlag,
  FieldType,
  RelationshipType,
  ToolExecutionPrincipal,
  type Screen,
} from "@budibase/types"
import { DatabaseImpl } from "../../../../../backend-core/src/db/couch/DatabaseImpl"
import { createAutomationBuilder } from "../../../automations/tests/utilities/AutomationTestBuilder"
import sdk from "../../../sdk"
import * as projectLock from "../../../sdk/workspace/projects/lock"
import { getQueryToolBindingsForResource } from "../../../sdk/workspace/ai/agents/queryToolReferences"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { setupDefaultCompletionsAIConfig } from "../../../tests/utilities/aiConfig"
import {
  basicDatasource,
  newAutomation,
  basicQuery,
  basicTable,
  createQueryScreen,
} from "../../../tests/utilities/structures"

jest.mock("../../../sdk/workspace/projects/lock", () => {
  const actual = jest.requireActual<
    typeof import("../../../sdk/workspace/projects/lock")
  >("../../../sdk/workspace/projects/lock")
  return {
    ...actual,
    doWithProjectAssignmentsLockIfEnabled: jest.fn(
      actual.doWithProjectAssignmentsLockIfEnabled
    ),
  }
})

describe("project dependency propagation", () => {
  const config = new TestConfiguration()
  let cleanupAIConfig: undefined | (() => Promise<void>)
  beforeEach(async () => {
    await config.newTenant()
    cleanupAIConfig = await setupDefaultCompletionsAIConfig(config, "default")
  })
  afterEach(async () => {
    await cleanupAIConfig?.()
    cleanupAIConfig = undefined
  })
  afterAll(() => config.end())

  const withProjectsEnabled = async <T>(f: () => Promise<T>) => {
    return await features.testutils.withFeatureFlags(
      config.getTenantId(),
      { [FeatureFlag.PROJECTS]: true },
      f
    )
  }

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

    it("revalidates the project when it is deleted before the screen-save callback runs", async () => {
      await withProjectsEnabled(async () => {
        const { project } = await config.api.project.create({
          name: "Operations",
        })
        const workspaceApp = await createAssignedWorkspaceApp(project._id)
        const automation = await config.createAutomation()

        jest
          .mocked(projectLock.doWithProjectAssignmentsLockIfEnabled)
          .mockImplementationOnce(async task => {
            await config.api.project.delete(project._id, project._rev)
            return await task()
          })

        await config.api.screen.save(
          createAutomationButtonScreen({
            workspaceAppId: workspaceApp._id!,
            automationId: automation._id!,
          })
        )
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
        const analyseDependencies = jest.fn(
          sdk.resources.analyseResourceDependencies
        )
        const resources = jest.replaceProperty(sdk, "resources", {
          ...sdk.resources,
          analyseResourceDependencies: analyseDependencies,
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
          expect(analyseDependencies).not.toHaveBeenCalled()
        } finally {
          resources.restore()
        }
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
          createAutomationButtonScreen({
            workspaceAppId: workspaceApp._id!,
            automationId: automation._id!,
          })
        )

        const preview = await config.api.project.previewAssignment({
          resourceId: workspaceApp._id!,
          projectIds: [project._id],
        })
        await config.api.project.updateAssignment(workspaceApp._id!, {
          dependencyFingerprint: preview.dependencyFingerprint,
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
        const analyseDependencies = jest.fn(
          sdk.resources.analyseResourceDependencies
        )
        const resources = jest.replaceProperty(sdk, "resources", {
          ...sdk.resources,
          analyseResourceDependencies: analyseDependencies,
        })
        try {
          await config.api.screen.save(persistedScreen)
          expect(analyseDependencies).not.toHaveBeenCalled()
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
          createAutomationButtonScreen({
            workspaceAppId: workspaceApp._id!,
            automationId: automation._id!,
          })
        )

        const preview = await config.api.project.previewAssignment({
          resourceId: workspaceApp._id!,
          projectIds: [project._id],
        })
        await config.api.project.updateAssignment(workspaceApp._id!, {
          dependencyFingerprint: preview.dependencyFingerprint,
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
          ...createAutomationButtonScreen({
            workspaceAppId: workspaceApp._id!,
            automationId: automation._id!,
          }),
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
          createAutomationButtonScreen({
            workspaceAppId: workspaceApp._id!,
            automationId: automation._id!,
          })
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
          createAutomationButtonScreen({
            workspaceAppId: workspaceApp._id!,
            automationId: automation._id!,
          })
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
        const preview = await config.api.project.previewAssignment({
          resourceId: agent._id!,
          projectIds: [project._id],
        })
        await config.api.project.updateAssignment(agent._id!, {
          dependencyFingerprint: preview.dependencyFingerprint,
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

    it("preserves agent project exclusions and tool bindings when a query moves", async () => {
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
        const datasourcePreview = await config.api.project.previewAssignment({
          resourceId: destinationDatasource._id!,
          projectIds: [sharedProject._id, destinationProject._id],
        })
        await config.api.project.updateAssignment(destinationDatasource._id!, {
          dependencyFingerprint: datasourcePreview.dependencyFingerprint,
          resourceRev: destinationDatasource._rev!,
          projectIds: [sharedProject._id, destinationProject._id],
          dependencyIds: [],
        })
        const query = await config.api.query.save(
          basicQuery(sourceDatasource._id!)
        )
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
        const preview = await config.api.project.previewAssignment({
          resourceId: agent._id!,
          projectIds: [
            sharedProject._id,
            agentProject._id,
            excludedAgentProject._id,
          ],
        })
        await config.api.project.updateAssignment(agent._id!, {
          dependencyFingerprint: preview.dependencyFingerprint,
          resourceRev: agent._rev!,
          projectIds: [
            sharedProject._id,
            agentProject._id,
            excludedAgentProject._id,
          ],
          dependencyIds: [],
        })
        const analyseDependencies = jest.fn(
          sdk.resources.analyseResourceDependencies
        )
        const resources = jest.replaceProperty(sdk, "resources", {
          ...sdk.resources,
          analyseResourceDependencies: analyseDependencies,
        })
        try {
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
            new Set([
              sharedProject._id,
              destinationProject._id,
              agentProject._id,
            ])
          )
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
          expect(analyseDependencies).toHaveBeenCalledTimes(1)
        } finally {
          resources.restore()
        }
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
        const sourcePreview = await config.api.project.previewAssignment({
          resourceId: source._id!,
          projectIds: [sourceProject._id],
        })
        await config.api.project.updateAssignment(source._id!, {
          dependencyFingerprint: sourcePreview.dependencyFingerprint,
          resourceRev: source._rev!,
          projectIds: [sourceProject._id],
          dependencyIds: [],
        })
        const targetPreview = await config.api.project.previewAssignment({
          resourceId: target._id!,
          projectIds: [targetProject._id, sourceProject._id],
        })
        await config.api.project.updateAssignment(target._id!, {
          dependencyFingerprint: targetPreview.dependencyFingerprint,
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
          createAutomationButtonScreen({
            workspaceAppId: sourceApp._id!,
            automationId: automation._id!,
          })
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
          createAutomationButtonScreen({
            workspaceAppId: workspaceApp._id!,
            automationId: automation._id!,
          })
        )
        const preview = await config.api.project.previewAssignment({
          resourceId: workspaceApp._id!,
          projectIds: [project._id],
        })
        await config.api.project.updateAssignment(workspaceApp._id!, {
          dependencyFingerprint: preview.dependencyFingerprint,
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
        const firstQuery = await config.api.query.save(
          basicQuery(firstDatasource._id!)
        )
        const secondQuery = await config.api.query.save(
          basicQuery(secondDatasource._id!)
        )
        const screen = createQueryScreen(firstDatasource._id!, firstQuery)
        const secondQueryTable = createQueryScreen(
          secondDatasource._id!,
          secondQuery
        ).props._children![0]
        screen.props._children!.push({
          ...secondQueryTable,
          _id: "second-query-table",
        })
        const bulkDocs = jest
          .spyOn(DatabaseImpl.prototype, "bulkDocs")
          .mockImplementation(async docs =>
            Promise.all(
              docs.map(async doc => {
                if (doc._id === firstDatasource._id) {
                  return await context.getWorkspaceDB().put(doc)
                }
                return {
                  id: doc._id,
                  error: "forbidden",
                  reason: "mock failure",
                }
              })
            )
          )

        try {
          await config.api.screen.save(
            { ...screen, workspaceAppId: workspaceApp._id },
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
          firstDatasource._id!
        )
        const failedDatasource = await config.api.datasource.get(
          secondDatasource._id!
        )

        expect(successfulDatasource.projectIds).toEqual([project._id])
        expect(failedDatasource.projectIds).toBeUndefined()
      })
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
      await config.api.screen.save(
        createAutomationButtonScreen({
          workspaceAppId: workspaceApp._id!,
          automationId: appDependency._id!,
        })
      )
      const agentDependency = await config.api.datasource.create({
        ...basicDatasource().datasource,
        name: "Agent dependency",
      })
      const agentQuery = await config.api.query.save(
        basicQuery(agentDependency._id!)
      )
      const agentQueryTool = getQueryToolBindingsForResource({
        datasource: agentDependency,
        query: agentQuery,
      })
      const agent = await config.api.agent.createWithOperation(
        { name: "Ops agent" },
        {
          id: "operation_1",
          name: "Run query",
          live: false,
          enabledTools: [
            {
              toolName: agentQueryTool.runtimeBinding,
              executionPrincipal: ToolExecutionPrincipal.REQUESTER,
            },
          ],
          allowKnowledgeSourceDownload: true,
        }
      )
      const automationDependency = await config.api.table.save(
        basicTable(undefined, { name: "Automation dependency" })
      )
      const { automation } = await createAutomationBuilder(config)
        .onAppAction({})
        .createRow({
          row: { tableId: automationDependency._id!, name: "New row" },
        })
        .save()

      for (const resource of [table, workspaceApp, agent, automation]) {
        const preview = await config.api.project.previewAssignment({
          resourceId: resource._id!,
          projectIds: [project._id],
        })
        await config.api.project.updateAssignment(resource._id!, {
          dependencyFingerprint: preview.dependencyFingerprint,
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
      const { automation: source } = await createAutomationBuilder(config)
        .onAppAction({})
        .createRow({ row: { tableId: dependency._id!, name: "New row" } })
        .save()
      const sourcePreview = await config.api.project.previewAssignment({
        resourceId: source._id!,
        projectIds: [project._id],
      })
      await config.api.project.updateAssignment(source._id!, {
        dependencyFingerprint: sourcePreview.dependencyFingerprint,
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
      const automation = createAutomationBuilder(config)
        .onAppAction({})
        .createRow({ row: { tableId: dependency._id!, name: "New row" } })
        .build()

      await config.api.automation.post({
        ...automation,
        _id: "au_explicit_id",
        projectIds: [project._id],
      })

      expect((await config.api.table.get(dependency._id!)).projectIds).toEqual([
        project._id,
      ])
    })
  })

  it("clears project assignments when duplicating resources with projects disabled", async () => {
    const { tableId, workspaceAppId, agentId, automationId } =
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

        return {
          tableId: table._id!,
          workspaceAppId: workspaceApp._id!,
          agentId: agent._id!,
          automationId: automation._id!,
        }
      })

    await features.testutils.withFeatureFlags(
      config.getTenantId(),
      { [FeatureFlag.PROJECTS]: false },
      async () => {
        const duplicatedTable = await config.api.table.duplicate(tableId)
        const { workspaceApp: duplicatedWorkspaceApp } =
          await config.api.workspaceApp.duplicate(workspaceAppId)
        const duplicatedAgent = await config.api.agent.duplicate(agentId)
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
      }
    )
  })
})
