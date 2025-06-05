import { structures } from "@budibase/backend-core/tests"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { WorkspaceApp } from "@budibase/types"
import { getMatchedWorkspaceApp } from "../utils"

describe("workspaceApps utils", () => {
  const config = new TestConfiguration()
  let workspaceApps: WorkspaceApp[]

  beforeAll(async () => {
    await config.init()

    workspaceApps = []

    for (const urlPrefix of ["/", "/app", "/app2"]) {
      workspaceApps.push(
        (
          await config.api.workspaceApp.create(
            structures.workspaceApps.createRequest({ urlPrefix })
          )
        ).workspaceApp
      )
    }
  })

  describe("getMatchedWorkspaceApp", () => {
    it("should be able to get the base workspaceApp without slash", async () => {
      await config.doInContext(config.getAppId(), async () => {
        const result = await getMatchedWorkspaceApp(`/${config.getAppId()}`)
        expect(result?._id).toEqual(workspaceApps[0]._id)
      })
    })

    it("should be able to get the base workspaceApp with slash", async () => {
      await config.doInContext(config.getAppId(), async () => {
        const result = await getMatchedWorkspaceApp(`/${config.getAppId()}/`)
        expect(result?._id).toEqual(workspaceApps[0]._id)
      })
    })
  })
})
