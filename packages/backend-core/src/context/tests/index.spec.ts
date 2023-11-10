import { testEnv } from "../../../tests/extra"
import * as context from "../"
import { DEFAULT_TENANT_ID } from "../../constants"

describe("context", () => {
  describe("doInTenant", () => {
    describe("single-tenancy", () => {
      beforeAll(() => {
        testEnv.singleTenant()
      })

      it("defaults to the default tenant", () => {
        const tenantId = context.getTenantId()
        expect(tenantId).toBe(DEFAULT_TENANT_ID)
      })

      it("defaults to the default tenant db", async () => {
        await context.doInTenant(DEFAULT_TENANT_ID, () => {
          const db = context.getGlobalDB()
          expect(db.name).toBe("global-db")
        })
      })
    })

    describe("multi-tenancy", () => {
      beforeAll(() => {
        testEnv.multiTenant()
      })

      it("fails when no tenant id is set", () => {
        const test = () => {
          let error: any
          try {
            context.getTenantId()
          } catch (e) {
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
          let error: any
          try {
            context.getGlobalDB()
          } catch (e) {
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

  describe("doInScimContext", () => {
    it("returns true when set", () => {
      context.doInScimContext(() => {
        const isScim = context.isScim()
        expect(isScim).toBe(true)
      })
    })
    it("returns false when not set", () => {
      const isScim = context.isScim()
      expect(isScim).toBe(false)
    })
  })
})
