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
jest.mock("../../security/encryption", () => ({
  ...jest.requireActual("../../security/encryption"),
  decrypt: jest.fn(),
}))
jest.mock("dd-trace", () => ({ setUser: jest.fn() }))

import * as utils from "../../utils"
import * as encryption from "../../security/encryption"

const getCookieMock = jest.mocked(utils.getCookie)
const openJwtMock = jest.mocked(utils.openJwt)
const clearCookieMock = jest.mocked(utils.clearCookie)
const decryptMock = jest.mocked(encryption.decrypt)

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

  it("does not treat external bearer tokens on public endpoints as API keys", async () => {
    ctx.path = "/api/webhooks/ms-teams/app_dev_123/chatapp-test/agent-1"
    ctx.request.headers[Header.AUTHORIZATION] = "Bearer external-token"

    await authenticated([
      {
        method: "ALL",
        route: "/api/webhooks/ms-teams/:instance/:chatAppId/:agentId",
      },
    ])(ctx, next)

    expect(decryptMock).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
    expect(ctx.publicEndpoint).toBe(true)
    expect(ctx.isAuthenticated).toBe(false)
  })
})
