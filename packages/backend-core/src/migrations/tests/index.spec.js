require("../../../tests")
const { runMigrations, getMigrationsDoc } = require("../index")
const { getGlobalDBName, getDB } = require("../../db")

const { faker } = require( "@faker-js/faker")

const { default: environment } = require("../../environment")
environment._set("MULTI_TENANCY", 'TRUE')

let db

describe("migrations", () => {

  const migrationFunction = jest.fn()

  const MIGRATIONS = [{
    type: "global",
    name: "test",
    fn: migrationFunction
  }]

  let tenantId

  beforeEach(() => {
    tenantId =faker.random.alpha(10)
    db = getDB(getGlobalDBName(tenantId))
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await db.destroy()
  })

  const migrate = () => {
    return runMigrations(MIGRATIONS, { tenantIds: [tenantId]})
  }

  it("should run a new migration", async () => {
    await migrate()
    expect(migrationFunction).toHaveBeenCalled()
    const doc = await getMigrationsDoc(db)
    expect(doc.test).toBeDefined()
  })

  it("should match snapshot", async () => {
    await migrate()
    const doc = await getMigrationsDoc(db)
    expect(doc).toMatchSnapshot()
  })

  it("should skip a previously run migration", async () => {
    await migrate()
    const previousMigrationTime = await getMigrationsDoc(db).test
    await migrate()
    const currentMigrationTime = await getMigrationsDoc(db).test
    expect(migrationFunction).toHaveBeenCalledTimes(1)
    expect(currentMigrationTime).toBe(previousMigrationTime)
  })
})