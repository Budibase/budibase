import { structures } from "@budibase/backend-core/tests"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { WorkspaceApp } from "@budibase/types"
import { getMatchedWorkspaceApp } from "../utils"
import { features } from "@budibase/backend-core"

describe("workspaceApps utils", () => {
  const config = new TestConfiguration()
  let workspaceApps: WorkspaceApp[]

  let featureCleanup: () => void

  beforeAll(async () => {
    await config.init()

    featureCleanup = features.testutils.setFeatureFlags("*", {
      WORKSPACE_APPS: true,
    })
    workspaceApps = (await config.api.workspaceApp.fetch()).workspaceApps
    expect(workspaceApps).toHaveLength(1)
    expect(workspaceApps.find(x => x.url === "/")).toBeDefined()

    for (const url of ["/app", "/app2"]) {
      workspaceApps.push(
        (
          await config.api.workspaceApp.create(
            structures.workspaceApps.createRequest({ url })
          )
        ).workspaceApp
      )
    }
  })

  afterAll(() => {
    featureCleanup()
  })

  describe.each(["", "/"])(
    "getMatchedWorkspaceApp (url closing char: %s)",
    closingChar => {
      it("should be able to get the base workspaceApp", async () => {
        await config.doInContext(config.getAppId(), async () => {
          const [result] = await getMatchedWorkspaceApp(
            `/${config.getAppId()}${closingChar}`
          )
          expect(result).toBeDefined()
          expect(result?._id).toEqual(workspaceApps[0]._id)
        })
      })

      it("should be able to get the a workspaceApp by its path", async () => {
        await config.doInContext(config.getAppId(), async () => {
          const [result] = await getMatchedWorkspaceApp(
            `/${config.getAppId()}/app${closingChar}`
          )
          expect(result).toBeDefined()
          expect(result?._id).toEqual(workspaceApps[1]._id)
        })
      })

      it("should be able to get the a workspaceApp by its path for overlapping urls", async () => {
        await config.doInContext(config.getAppId(), async () => {
          const [result] = await getMatchedWorkspaceApp(
            `/${config.getAppId()}/app2${closingChar}`
          )
          expect(result).toBeDefined()
          expect(result?._id).toEqual(workspaceApps[2]._id)
        })
      })

      it("should return undefined for partial matching paths", async () => {
        await config.doInContext(config.getAppId(), async () => {
          const [result] = await getMatchedWorkspaceApp(
            `/${config.getAppId()}/app22${closingChar}`
          )
          expect(result).toBeUndefined()
        })
      })
    }
  )
})
