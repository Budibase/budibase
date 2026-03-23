import { Ctx } from "@budibase/types"
import { structures } from "../../../tests"
import * as utils from "../../utils"

describe("getBearerToken", () => {
  let ctx: Ctx

  beforeEach(() => {
    ctx = structures.koa.newContext()
  })

  it("returns null when authorization header is missing", () => {
    ctx.get = jest.fn().mockReturnValue(undefined)
    expect(utils.getBearerToken(ctx)).toBe(null)
  })

  it("returns token for a bearer header", () => {
    ctx.get = jest.fn().mockReturnValue("Bearer test-token")
    expect(utils.getBearerToken(ctx)).toBe("test-token")
  })

  it("matches bearer scheme case-insensitively", () => {
    ctx.get = jest.fn().mockReturnValue("bEaReR token")
    expect(utils.getBearerToken(ctx)).toBe("token")
  })

  it("returns null for non-bearer authorization", () => {
    ctx.get = jest.fn().mockReturnValue("Basic abc")
    expect(utils.getBearerToken(ctx)).toBe(null)
  })
})
