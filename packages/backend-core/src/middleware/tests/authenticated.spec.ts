import { TokenExpiredError } from "jsonwebtoken"
import { Cookie, Header } from "../../constants"
import { authenticated } from "../authenticated"
import { structures } from "../../../tests"

jest.mock("../../utils", () => ({
  ...jest.requireActual("../../utils"),
  getCookie: jest.fn(),
  openJwt: jest.fn(),
  clearCookie: jest.fn(),
  isValidInternalAPIKey: jest.fn().mockReturnValue(false),
}))
jest.mock("dd-trace", () => ({ setUser: jest.fn() }))

import * as utils from "../../utils"

const getCookieMock = utils.getCookie as jest.Mock
const openJwtMock = utils.openJwt as jest.Mock
const clearCookieMock = utils.clearCookie as jest.Mock

describe("authenticated middleware — JWT expiration guard", () => {
  let ctx: ReturnType<typeof structures.koa.newContext>
  let next: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    ctx = structures.koa.newContext()
    next = jest.fn()
  })

  it("rejects a legacy cookie token without exp and clears the auth cookie", async () => {
    getCookieMock.mockReturnValue({ sessionId: "sid", userId: "uid" })

    await expect(authenticated()(ctx, next)).rejects.toThrow()

    expect(clearCookieMock).toHaveBeenCalledWith(ctx, Cookie.Auth)
    expect(ctx.throw).toHaveBeenCalledWith(
      401,
      "Session token missing expiration, please log in again"
    )
  })

  it("rejects a legacy header token without exp without touching the cookie", async () => {
    getCookieMock.mockReturnValue(undefined)
    ctx.request.headers[Header.TOKEN] = "legacy.header.token"
    openJwtMock.mockReturnValue({ sessionId: "sid", userId: "uid" })

    await expect(authenticated()(ctx, next)).rejects.toThrow()

    expect(clearCookieMock).not.toHaveBeenCalledWith(ctx, Cookie.Auth)
    expect(ctx.throw).toHaveBeenCalledWith(
      401,
      "Session token missing expiration, please log in again"
    )
  })

  it("clears the auth cookie when an expired JWT raises TokenExpiredError", async () => {
    getCookieMock.mockImplementation(() => {
      throw new TokenExpiredError("jwt expired", new Date())
    })

    await expect(authenticated()(ctx, next)).rejects.toThrow()

    expect(clearCookieMock).toHaveBeenCalledWith(ctx, Cookie.Auth)
  })
})
