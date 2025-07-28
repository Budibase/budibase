import { getRoutingInfo as sut } from "./index"

import TestConfiguration from "../../tests/utilities/TestConfiguration"
import { structures } from "@budibase/backend-core/tests"
import { basicScreen } from "../../tests/utilities/structures"
import { DesignDocument, Screen, WorkspaceApp } from "@budibase/types"
import { db, ViewName } from "@budibase/backend-core"

describe("getRoutingInfo", () => {
  const config = new TestConfiguration()
  let defaultWorkspaceApp: WorkspaceApp

  beforeEach(async () => {
    jest.clearAllMocks()
    await config.newTenant()

    defaultWorkspaceApp = (
      await config.api.workspaceApp.fetch()
    ).workspaceApps.find(w => w.isDefault)!
    expect(defaultWorkspaceApp).toBeDefined()
  })

  async function createWorkspaceApp(name: string, url: string) {
    const { workspaceApp } = await config.api.workspaceApp.create(
      structures.workspaceApps.createRequest({
        name,
        url,
      })
    )
    return workspaceApp
  }

  async function createScreens(workspaceAppId: string, count: number) {
    const result: Screen[] = []
    for (const _ of Array.from({ length: count })) {
      result.push(
        await config.api.screen.save({ ...basicScreen(), workspaceAppId })
      )
    }
    return result
  }

  async function getRoutingInfo(path: string) {
    return await config.doInContext(config.getAppId(), () =>
      sut(`/${config.getAppId()}${path}`)
    )
  }

  it("should return empty array when no workspace apps match", async () => {
    const result = await config.doInContext(config.getAppId(), () =>
      getRoutingInfo("/unmatched")
    )

    expect(result).toEqual([])
  })

  it("should return routing info for matched workspace apps", async () => {
    const workspaceAppId1 = await createWorkspaceApp("App 1", "/app1")
    const workspaceAppId2 = await createWorkspaceApp("App 2", "/app2")

    const app1Screens = await createScreens(workspaceAppId1._id, 3)
    const _app2Screens = await createScreens(workspaceAppId2._id, 2)

    const result = await config.doInContext(config.getAppId(), () =>
      getRoutingInfo("/app1")
    )

    expect(result.length).toBe(3)
    expect(result).toEqual(
      expect.arrayContaining(
        app1Screens.map(s =>
          expect.objectContaining({
            id: s._id,
          })
        )
      )
    )
  })

  it("should handle default workspace app with missing workspaceAppId", async () => {
    const workspaceAppId2 = await createWorkspaceApp("App 2", "/app2")

    const defaultAppScreens = [
      ...(await config.api.screen.list()),
      ...(await createScreens(defaultWorkspaceApp._id!, 3)),
    ]
    const _app2Screens = await createScreens(workspaceAppId2._id, 2)

    // Force screens without workspaceAppId
    const unmappedScreens = await createScreens(workspaceAppId2._id, 2)
    const appDb = db.getDB(config.getAppId())
    await appDb.bulkDocs(
      unmappedScreens.map(s => ({ ...s, workspaceAppId: null as any }))
    )

    const result = await config.doInContext(config.getAppId(), () =>
      getRoutingInfo(defaultWorkspaceApp.url)
    )

    expect(result.length).toBe(
      defaultAppScreens.length + unmappedScreens.length
    )
    expect(result).toEqual(
      expect.arrayContaining(
        [...defaultAppScreens, ...unmappedScreens].map(s =>
          expect.objectContaining({
            id: s._id,
          })
        )
      )
    )
  })

  it("should not query for missing routes when workspace app is not default", async () => {
    const workspaceAppId2 = await createWorkspaceApp("App 2", "/app2")

    await createScreens(defaultWorkspaceApp._id!, 3)
    const app2Screens = await createScreens(workspaceAppId2._id, 2)

    // Force screens without workspaceAppId
    const unmappedScreens = await createScreens(defaultWorkspaceApp._id!, 2)
    const appDb = db.getDB(config.getAppId())
    await appDb.bulkDocs(
      unmappedScreens.map(s => ({ ...s, workspaceAppId: null as any }))
    )

    const result = await config.doInContext(config.getAppId(), () =>
      getRoutingInfo(workspaceAppId2.url)
    )

    expect(result.length).toBe(app2Screens.length)
    expect(result).toEqual(
      expect.arrayContaining(
        app2Screens.map(s =>
          expect.objectContaining({
            id: s._id,
          })
        )
      )
    )
  })

  it("should create routing view and retry when view is missing", async () => {
    const appDb = db.getDB(config.getAppId())
    const designDoc = await appDb.get<DesignDocument>("_design/database")
    delete designDoc.views?.[ViewName.ROUTING]
    await appDb.put(designDoc)

    const result = await config.doInContext(config.getAppId(), () =>
      getRoutingInfo(defaultWorkspaceApp.url)
    )

    expect(result.length).toBe(1)
    expect(
      (await appDb.get<DesignDocument>("_design/database")).views?.[
        ViewName.ROUTING
      ]
    ).toBeDefined()
  })
})
