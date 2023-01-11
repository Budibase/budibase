jest.mock("@budibase/backend-core", () => {
  const core = jest.requireActual("@budibase/backend-core")
  return {
    ...core,
    db: {
      ...core.db,
      createNewUserEmailView: jest.fn()
    }
  }
})
const { tenancy, db: dbCore } = require("@budibase/backend-core")
const TestConfig = require("../../../tests/utilities/TestConfiguration")
const { TENANT_ID } = require("../../../tests/utilities/structures")

// mock email view creation

const migration = require("../userEmailViewCasing")

describe("run", () => {
    let config = new TestConfig(false)

    beforeEach(async () => {
      await config.init()
    })

    afterAll(config.end)

    it("runs successfully", async () => {
      await tenancy.doInTenant(TENANT_ID, async () => {
        const globalDb = tenancy.getGlobalDB()
        await migration.run(globalDb)
        expect(dbCore.createNewUserEmailView).toHaveBeenCalledTimes(1)
      })
    })
})
