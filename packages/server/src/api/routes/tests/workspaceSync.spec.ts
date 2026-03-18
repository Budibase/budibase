import { Workspace } from "@budibase/types"
import * as setup from "./utilities"
import { roles, db as dbCore } from "@budibase/backend-core"

describe("/api/applications/:appId/sync", () => {
  let config = setup.getConfig()
  let workspace: Workspace

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()
    workspace = await config.createWorkspace()
    await config.publish()
    // create some users which we will use throughout the tests
    await config.createUser({
      email: "sync1@example.com",
      roles: {
        [workspace._id!]: roles.BUILTIN_ROLE_IDS.BASIC,
      },
    })
  })

  async function getUserMetadata() {
    const { rows } = await config.searchRows(dbCore.InternalTable.USER_METADATA)
    return rows
  }

  it("make sure that user metadata is correctly sync'd", async () => {
    const rows = await getUserMetadata()
    expect(rows.length).toBe(1)
  })
})
