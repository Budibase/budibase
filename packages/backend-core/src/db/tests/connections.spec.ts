import env from "../../environment"
import { getCouchInfo } from "../couch"

const MAIN_COUCH_URL = "http://user:test@localhost:5984"

describe("connections", () => {
  beforeAll(() => {
    env._set("COUCH_DB_SQL_URL", "https://user:test@localhost:4984")
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
})
