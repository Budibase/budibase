require("../../tests/utilities/dbConfig")

const { migrateIfRequired, MIGRATION_DBS, MIGRATIONS, getMigrationsDoc } = require("../index")
const database = require("../../db")
const {
  StaticDatabases,
} = require("../../db/utils")

Date.now = jest.fn(() => 1487076708000)
let db

describe("migrations", () => {

  const migrationFunction = jest.fn()

  beforeEach(() => {
    db = database.getDB(StaticDatabases.GLOBAL.name)
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await db.destroy()
  })

  const validMigration = () => {
    return migrateIfRequired(MIGRATION_DBS.GLOBAL_DB, MIGRATIONS.USER_EMAIL_VIEW_CASING, migrationFunction)
  }

  it("should run a new migration", async () => {
    await validMigration()
    expect(migrationFunction).toHaveBeenCalled()
  })

  it("should match snapshot", async () => {
    await validMigration()
    const doc = await getMigrationsDoc(db)
    expect(doc).toMatchSnapshot()
  })

  it("should skip a previously run migration", async () => {
    await validMigration()
    await validMigration()
    expect(migrationFunction).toHaveBeenCalledTimes(1)
  })

  it("should reject an unknown migration name", async () => {
    expect(async () => { 
      await migrateIfRequired(MIGRATION_DBS.GLOBAL_DB, "bogus_name", migrationFunction)
    }).rejects.toThrow()
    expect(migrationFunction).not.toHaveBeenCalled()
  })

  it("should reject an unknown database name", async () => {
    expect(async () => { 
      await migrateIfRequired("bogus_db", MIGRATIONS.USER_EMAIL_VIEW_CASING, migrationFunction)
    }).rejects.toThrow()
    expect(migrationFunction).not.toHaveBeenCalled()
  })

})