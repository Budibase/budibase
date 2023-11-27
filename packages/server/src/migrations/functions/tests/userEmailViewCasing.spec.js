jest.mock("@budibase/backend-core", () => {
  const core = jest.requireActual("@budibase/backend-core")
  return {
    ...core,
    db: {
      ...core.db,
      createNewUserEmailView: jest.fn(),
    },
  }
})
const { context, db: dbCore } = require("@budibase/backend-core")
const TestConfig = require("../../../tests/utilities/TestConfiguration")

// mock email view creation

const migration = require("../userEmailViewCasing")

describe("run", () => {
  let config = new TestConfig(false)

  beforeAll(async () => {
    await config.init()
  })

  afterAll(config.end)

  it("runs successfully", async () => {
    await config.doInTenant(async () => {
      const globalDb = context.getGlobalDB()
      await migration.run(globalDb)
      expect(dbCore.createNewUserEmailView).toHaveBeenCalledTimes(1)
    })
  })
})
