import env from "../../environment"
import { getCouchInfo } from "../couch"

const MAIN_COUCH_URL = "http://user:test@localhost:5984"

describe("connections", () => {
  beforeAll(() => {
    env._set("COUCH_DB_SQL_URL", "https://user:test@localhost:4984")
  })

  afterEach(() => {
    env._set("COUCH_DB_USER", undefined)
    env._set("COUCH_DB_USERNAME", undefined)
    env._set("COUCH_DB_PASSWORD", undefined)
  })

  it("should strip URL credentials", () => {
    const response = getCouchInfo(MAIN_COUCH_URL)
    expect(response.url).toBe("http://localhost:5984")
    expect(response.sqlUrl).toBe("https://localhost:4984")
  })

  it("should return separate auth credentials", () => {
    const response = getCouchInfo(MAIN_COUCH_URL)
    expect(response.auth.username).toBe("user")
    expect(response.auth.password).toBe("test")
  })

  it("should accept COUCH_DB_USER for internal couch access", () => {
    env._set("COUCH_DB_USER", "internal-user")
    env._set("COUCH_DB_PASSWORD", "internal-password")

    const response = getCouchInfo("http://localhost:5984")

    expect(response.auth.username).toBe("internal-user")
    expect(response.auth.password).toBe("internal-password")
  })

  it("should accept COUCH_DB_USERNAME for internal couch access", () => {
    env._set("COUCH_DB_USERNAME", "internal-user")
    env._set("COUCH_DB_PASSWORD", "internal-password")

    const response = getCouchInfo("http://localhost:5984")

    expect(response.auth.username).toBe("internal-user")
    expect(response.auth.password).toBe("internal-password")
  })
})
