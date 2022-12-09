require("../../../tests")
const { runMigrations, getMigrationsDoc } = require("../index")
const { getDB } = require("../../db")
const {
  StaticDatabases,
} = require("../../constants")

let db

describe("migrations", () => {

  const migrationFunction = jest.fn()

  const MIGRATIONS = [{
    type: "global",
    name: "test",
    fn: migrationFunction
  }]

  beforeEach(() => {
    db = getDB(StaticDatabases.GLOBAL.name)
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await db.destroy()
  })

  const migrate = () => {
    return runMigrations(MIGRATIONS)
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