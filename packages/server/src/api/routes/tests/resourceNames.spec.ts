import { context, db as dbCore } from "@budibase/backend-core"
import { structures } from "@budibase/backend-core/tests"
import { MAX_RESOURCE_NAME_LENGTH, type Document } from "@budibase/types"
import { createAutomationBuilder } from "../../../automations/tests/utilities/AutomationTestBuilder"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { setupDefaultCompletionsAIConfig } from "../../../tests/utilities/aiConfig"
import type { Expectations } from "../../../tests/utilities/api/base"
import {
  basicDatasource,
  basicQuery,
  basicRole,
  basicScreen,
  basicTable,
} from "../../../tests/utilities/structures"

interface NamedDocument extends Document {
  name?: string
}
interface CreateParams {
  name: string
  expectations?: Expectations
}
interface UpdateParams<T> extends CreateParams {
  resource: T
}
interface ResourceTestOptions<T extends NamedDocument> {
  create: (params: CreateParams) => Promise<T>
  update: (params: UpdateParams<T>) => Promise<T>
}

describe("resource name limits", () => {
  const config = new TestConfiguration()
  let cleanupAIConfig: (() => Promise<void>) | undefined
  const maximumName = "a".repeat(MAX_RESOURCE_NAME_LENGTH)
  const oversizedName = "b".repeat(MAX_RESOURCE_NAME_LENGTH + 1)
  const legacyName = "c".repeat(1001)
  beforeEach(async () => {
    await config.newTenant()
    cleanupAIConfig = await setupDefaultCompletionsAIConfig(config, "default")
  })
  afterEach(async () => {
    await cleanupAIConfig?.()
  })
  afterAll(() => config.end())

  const checkNames = async <T extends NamedDocument>({
    create,
    update,
  }: ResourceTestOptions<T>) => {
    await create({ name: oversizedName, expectations: { status: 400 } })
    const created = await create({ name: maximumName })
    const renamed = await update({ resource: created, name: "Renamed" })
    await update({
      resource: renamed,
      name: oversizedName,
      expectations: { status: 400 },
    })
    const legacy = await config.doInContext(
      config.getDevWorkspaceId(),
      async () =>
        (
          await context
            .getWorkspaceDB()
            .put({ ...renamed, name: legacyName }, { returnDoc: true })
        ).doc
    )
    await update({
      resource: legacy,
      name: oversizedName,
      expectations: { status: 400 },
    })
    const unchanged = await update({ resource: legacy, name: legacyName })
    const corrected = await update({ resource: unchanged, name: maximumName })
    expect(created.name).toBe(maximumName)
    expect(unchanged.name).toBe(legacyName)
    expect(corrected.name).toBe(maximumName)
  }

  it("validates agent names and preserves unchanged legacy names", async () => {
    await checkNames({
      create: ({ name, expectations }) =>
        config.api.agent.create({ name, aiconfig: "default" }, expectations),
      update: ({ resource, name, expectations }) =>
        config.api.agent.update({ ...resource, name }, expectations),
    })
  })
  it("validates automation names and preserves unchanged legacy names", async () => {
    await checkNames({
      create: async ({ name, expectations }) =>
        (
          await config.api.automation.post(
            { ...createAutomationBuilder(config).onAppAction().build(), name },
            expectations
          )
        ).automation,
      update: async ({ resource, name, expectations }) =>
        (
          await config.api.automation.update(
            { ...resource, name },
            expectations
          )
        ).automation,
    })
  })
  it("validates table names and preserves unchanged legacy names", async () => {
    await checkNames({
      create: ({ name, expectations }) =>
        config.api.table.save({ ...basicTable(), name }, expectations),
      update: ({ resource, name, expectations }) =>
        config.api.table.save({ ...resource, name }, expectations),
    })
  })
  it("validates datasource names and preserves unchanged legacy names", async () => {
    await checkNames({
      create: ({ name, expectations }) =>
        config.api.datasource.create(
          { ...basicDatasource().datasource, name },
          expectations
        ),
      update: ({ resource, name, expectations }) =>
        config.api.datasource.update({ ...resource, name }, expectations),
    })
  })
  it("validates query names and preserves unchanged legacy names", async () => {
    const datasource = await config.api.datasource.create(
      basicDatasource().datasource
    )
    await checkNames({
      create: ({ name, expectations }) =>
        config.api.query.save(
          { ...basicQuery(datasource._id!), name },
          expectations
        ),
      update: ({ resource, name, expectations }) =>
        config.api.query.save({ ...resource, name }, expectations),
    })
  })
  it("validates app names and preserves unchanged legacy names", async () => {
    await checkNames({
      create: async ({ name, expectations }) =>
        (
          await config.api.workspaceApp.create(
            structures.workspaceApps.createRequest({ name, url: "/example" }),
            expectations
          )
        ).workspaceApp,
      update: async ({ resource, name, expectations }) =>
        (
          await config.api.workspaceApp.update(
            {
              _id: resource._id!,
              _rev: resource._rev!,
              name,
              url: resource.url,
              navigation: resource.navigation,
            },
            expectations
          )
        ).workspaceApp,
    })
  })
  it("validates screen names and preserves unchanged legacy names", async () => {
    await checkNames({
      create: ({ name, expectations }) =>
        config.api.screen.save(
          { ...basicScreen("/example"), name },
          expectations
        ),
      update: ({ resource, name, expectations }) =>
        config.api.screen.save({ ...resource, name }, expectations),
    })
  })

  it("validates operation names and preserves unchanged legacy names", async () => {
    const agent = await config.api.agent.create({
      name: "Operations",
      aiconfig: "default",
    })
    const operation = {
      id: "operation_1",
      name: maximumName,
      live: false,
      allowKnowledgeSourceDownload: true,
    }
    await config.api.agent.createOperation(
      agent._id!,
      { ...operation, name: oversizedName },
      { status: 400 }
    )
    const created = await config.api.agent.createOperation(
      agent._id!,
      operation
    )
    await config.api.agent.updateOperation(
      agent._id!,
      operation.id,
      { name: oversizedName },
      { status: 400 }
    )
    await config.doInContext(config.getDevWorkspaceId(), async () => {
      await context
        .getWorkspaceDB()
        .put({ ...created, operations: [{ ...operation, name: legacyName }] })
    })
    await config.api.agent.updateOperation(
      agent._id!,
      operation.id,
      { name: oversizedName },
      { status: 400 }
    )
    const unchanged = await config.api.agent.updateOperation(
      agent._id!,
      operation.id,
      { name: legacyName, promptInstructions: "Updated instructions" }
    )
    const corrected = await config.api.agent.updateOperation(
      agent._id!,
      operation.id,
      { name: maximumName }
    )
    expect(created.operations?.[0]?.name).toBe(maximumName)
    expect(unchanged.operations?.[0]).toMatchObject({
      name: legacyName,
      promptInstructions: "Updated instructions",
    })
    expect(corrected.operations?.[0]?.name).toBe(maximumName)
  })

  it("validates view names and preserves unchanged legacy names", async () => {
    const table = await config.api.table.save(basicTable())
    const view = { name: maximumName, tableId: table._id!, schema: {} }
    await config.api.viewV2.create(
      { ...view, name: oversizedName },
      { status: 400 }
    )
    const created = await config.api.viewV2.create(view)
    await config.api.viewV2.update(
      { ...created, name: oversizedName },
      { status: 400 }
    )
    await config.doInContext(config.getDevWorkspaceId(), async () => {
      const stored = await context
        .getWorkspaceDB()
        .get<typeof table>(table._id!)
      stored.views![created.name].name = legacyName
      await context.getWorkspaceDB().put(stored)
    })
    const unchanged = await config.api.viewV2.update({
      ...created,
      name: legacyName,
    })
    const corrected = await config.api.viewV2.update({
      ...unchanged,
      name: maximumName,
    })
    expect(created.name).toBe(maximumName)
    expect(unchanged.name).toBe(legacyName)
    expect(corrected.name).toBe(maximumName)
  })

  it("validates role display names and preserves unchanged legacy names", async () => {
    const role = { ...basicRole(), uiMetadata: { displayName: maximumName } }
    await config.api.roles.save(
      { ...role, uiMetadata: { displayName: oversizedName } },
      { status: 400 }
    )
    await config.api.roles.save(
      { ...role, name: oversizedName },
      { status: 400 }
    )
    const created = await config.api.roles.save(role)
    await config.doInContext(config.getDevWorkspaceId(), async () => {
      const stored = await context
        .getWorkspaceDB()
        .get<typeof created>(dbCore.prefixRoleID(created._id!))
      await context.getWorkspaceDB().put({
        ...stored,
        uiMetadata: { ...stored.uiMetadata, displayName: legacyName },
      })
    })
    const unchanged = await config.api.roles.save({
      ...created,
      uiMetadata: {
        displayName: legacyName,
        description: "Updated description",
      },
    })
    await config.api.roles.save(
      { ...unchanged, uiMetadata: { displayName: oversizedName } },
      { status: 400 }
    )
    const corrected = await config.api.roles.save({
      ...unchanged,
      uiMetadata: { displayName: maximumName },
    })
    expect(created.uiMetadata?.displayName).toBe(maximumName)
    expect(unchanged.uiMetadata?.displayName).toBe(legacyName)
    expect(corrected.uiMetadata?.displayName).toBe(maximumName)
  })
})
