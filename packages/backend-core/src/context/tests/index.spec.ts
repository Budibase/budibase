import "../../../tests/utilities/TestConfiguration"
import * as context from ".."
import { DEFAULT_TENANT_ID } from "../../constants"
import env from "../../environment"

// must use require to spy index file exports due to known issue in jest
const dbUtils = require("../../db")
jest.spyOn(dbUtils, "closeDB")
jest.spyOn(dbUtils, "dangerousGetDB")

describe("context", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("doInTenant", () => {
    describe("single-tenancy", () => {
      it("defaults to the default tenant", () => {
        const tenantId = context.getTenantId()
        expect(tenantId).toBe(DEFAULT_TENANT_ID)
      })

      it("defaults to the default tenant db", async () => {
        await context.doInTenant(DEFAULT_TENANT_ID, () => {
          const db = context.getGlobalDB()
          expect(db.name).toBe("global-db")
        })
        expect(dbUtils.dangerousGetDB).toHaveBeenCalledTimes(1)
        expect(dbUtils.closeDB).toHaveBeenCalledTimes(1)
      })
    })

    describe("multi-tenancy", () => {
      beforeEach(() => {
        env._set("MULTI_TENANCY", 1)
      })

      it("fails when no tenant id is set", () => {
        const test = () => {
          let error
          try {
            context.getTenantId()
          } catch (e: any) {
            error = e
          }
          expect(error.message).toBe("Tenant id not found")
        }

        // test under no tenancy
        test()

        // test after tenancy has been accessed to ensure cleanup
        context.doInTenant("test", () => {})
        test()
      })

      it("fails when no tenant db is set", () => {
        const test = () => {
          let error
          try {
            context.getGlobalDB()
          } catch (e: any) {
            error = e
          }
          expect(error.message).toBe("Global DB not found")
        }

        // test under no tenancy
        test()

        // test after tenancy has been accessed to ensure cleanup
        context.doInTenant("test", () => {})
        test()
      })

      it("sets tenant id", () => {
        context.doInTenant("test", () => {
          const tenantId = context.getTenantId()
          expect(tenantId).toBe("test")
        })
      })

      it("initialises the tenant db", async () => {
        await context.doInTenant("test", () => {
          const db = context.getGlobalDB()
          expect(db.name).toBe("test_global-db")
        })
        expect(dbUtils.dangerousGetDB).toHaveBeenCalledTimes(1)
        expect(dbUtils.closeDB).toHaveBeenCalledTimes(1)
      })

      it("sets the tenant id when nested with same tenant id", async () => {
        await context.doInTenant("test", async () => {
          const tenantId = context.getTenantId()
          expect(tenantId).toBe("test")

          await context.doInTenant("test", async () => {
            const tenantId = context.getTenantId()
            expect(tenantId).toBe("test")

            await context.doInTenant("test", () => {
              const tenantId = context.getTenantId()
              expect(tenantId).toBe("test")
            })
          })
        })
      })

      it("initialises the tenant db when nested with same tenant id", async () => {
        await context.doInTenant("test", async () => {
          const db = context.getGlobalDB()
          expect(db.name).toBe("test_global-db")

          await context.doInTenant("test", async () => {
            const db = context.getGlobalDB()
            expect(db.name).toBe("test_global-db")

            await context.doInTenant("test", () => {
              const db = context.getGlobalDB()
              expect(db.name).toBe("test_global-db")
            })
          })
        })

        // only 1 db is opened and closed
        expect(dbUtils.dangerousGetDB).toHaveBeenCalledTimes(1)
        expect(dbUtils.closeDB).toHaveBeenCalledTimes(1)
      })

      it("sets different tenant id inside another context", () => {
        context.doInTenant("test", () => {
          const tenantId = context.getTenantId()
          expect(tenantId).toBe("test")

          context.doInTenant("nested", () => {
            const tenantId = context.getTenantId()
            expect(tenantId).toBe("nested")

            context.doInTenant("double-nested", () => {
              const tenantId = context.getTenantId()
              expect(tenantId).toBe("double-nested")
            })
          })
        })
      })
    })
  })
})
