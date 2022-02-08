const TestConfig = require("../../../tests/utilities/TestConfiguration")
const { getGlobalDB } = require("@budibase/backend-core/tenancy")

// mock email view creation
const coreDb = require("@budibase/backend-core/db")
const createUserEmailView = jest.fn()
coreDb.createUserEmailView = createUserEmailView

const migration = require("../userEmailViewCasing")

describe("run", () => {
  let config = new TestConfig(false)
  const globalDb = getGlobalDB()

  beforeEach(async () => {
    await config.init()
  })

  afterAll(config.end)  

  it("runs successfully", async () => {
    await migration.run(globalDb)
    expect(createUserEmailView).toHaveBeenCalledTimes(1)
  })
})
