import { testEnv, DBTestConfiguration } from "../../../tests/extra"
import * as migrations from "../index"
import * as context from "../../context"
import { MigrationType } from "@budibase/types"

testEnv.multiTenant()

describe("migrations", () => {
  const config = new DBTestConfiguration()

  const migrationFunction = jest.fn()

  const MIGRATIONS = [
    {
      type: MigrationType.GLOBAL,
      name: "test" as any,
      fn: migrationFunction,
    },
  ]

  beforeEach(() => {
    config.newTenant()
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })

  const migrate = () => {
    return migrations.runMigrations(MIGRATIONS, {
      tenantIds: [config.tenantId],
    })
  }

  it("should run a new migration", async () => {
    await config.doInTenant(async () => {
      await migrate()
      expect(migrationFunction).toHaveBeenCalled()
      const db = context.getGlobalDB()
      const doc = await migrations.getMigrationsDoc(db)
      expect(doc.test).toBeDefined()
    })
  })

  it("should match snapshot", async () => {
    await config.doInTenant(async () => {
      await migrate()
      const doc = await migrations.getMigrationsDoc(context.getGlobalDB())
      expect(doc).toMatchSnapshot()
    })
  })

  it("should skip a previously run migration", async () => {
    await config.doInTenant(async () => {
      const db = context.getGlobalDB()
      await migrate()
      const previousDoc = await migrations.getMigrationsDoc(db)
      await migrate()
      const currentDoc = await migrations.getMigrationsDoc(db)
      expect(migrationFunction).toHaveBeenCalledTimes(1)
      expect(currentDoc.test).toBe(previousDoc.test)
    })
  })
})
