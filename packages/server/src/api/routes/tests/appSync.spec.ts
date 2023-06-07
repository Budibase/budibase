import * as setup from "./utilities"
import { roles, db as dbCore } from "@budibase/backend-core"

describe("/api/applications/:appId/sync", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()
  let app

  afterAll(setup.afterAll)

  beforeAll(async () => {
    app = await config.init()
    // create some users which we will use throughout the tests
    await config.createUser({
      email: "sync1@test.com",
      roles: {
        [app._id!]: roles.BUILTIN_ROLE_IDS.BASIC,
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
