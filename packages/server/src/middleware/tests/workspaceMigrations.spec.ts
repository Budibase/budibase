import { Header } from "@budibase/shared-core"
import { UserCtx } from "@budibase/types"
import { skipMigrationRedirect } from "../workspaceMigrations"

describe("workspaceMigrations middleware", () => {
  describe("skipMigrationRedirect", () => {
    let ctx: UserCtx

    beforeEach(() => {
      jest.clearAllMocks()

      const responseMap = new Map()
      ctx = {
        response: {
          set: (key: string, value: string) => responseMap.set(key, value),
          get: (key: string) => responseMap.get(key),
          remove: (key: string) => responseMap.delete(key),
        },
      } as any
    })

    it("should return next result when MIGRATING_APP header when not present", async () => {
      const next = jest.fn().mockResolvedValue("next-result")
      const result = await skipMigrationRedirect(ctx, next)

      expect(ctx.response.get(Header.MIGRATING_APP)).toBeUndefined()

      expect(next).toHaveBeenCalledTimes(1)
      expect(result).toBe("next-result")
    })

    it("should remove MIGRATING_APP header when present", async () => {
      const next = jest.fn().mockResolvedValue("next-result")

      const consoleSpy = jest.spyOn(console, "log").mockImplementation()
      ctx.response.set(Header.MIGRATING_APP, "mockHeader")

      expect(ctx.response.get(Header.MIGRATING_APP)).toBeDefined()
      const result = await skipMigrationRedirect(ctx, next)
      expect(ctx.response.get(Header.MIGRATING_APP)).toBeUndefined()

      expect(next).toHaveBeenCalledTimes(1)
      expect(result).toBe("next-result")
      expect(consoleSpy).toHaveBeenCalledWith("Skipping migration redirect")
    })
  })
})
