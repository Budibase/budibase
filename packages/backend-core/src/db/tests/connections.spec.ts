import { setEnv, withEnv } from "../../environment"
import { getCouchInfo } from "../couch"

describe("connections", () => {
  beforeAll(() => {
    setEnv({ COUCH_DB_SQL_URL: "https://user:test@localhost:4984" })
  })

  afterEach(() => {
    setEnv({ COUCH_DB_URL: "http://localhost:4005" })
    setEnv({ COUCH_DB_USERNAME: undefined })
    setEnv({ COUCH_DB_PASSWORD: undefined })
  })

  describe("getCouchInfo", () => {
    it("should accept COUCH_DB_USERNAME for internal couch access", async () => {
      await withEnv(
        {
          COUCH_DB_USERNAME: "internal-user",
          COUCH_DB_PASSWORD: "internal-password",
        },
        async () => {
          const response = getCouchInfo("http://localhost:5984")

          expect(response.auth.username).toBe("internal-user")
          expect(response.auth.password).toBe("internal-password")
        }
      )
    })

    it("prefers credentials embedded in COUCH_DB_URL over env credentials", async () => {
      await withEnv(
        {
          COUCH_DB_URL: "http://url-user:url-password@localhost:5984",
          COUCH_DB_USERNAME: "internal-user",
          COUCH_DB_PASSWORD: "internal-password",
        },
        async () => {
          const response = getCouchInfo()

          expect(response.url).toBe("http://localhost:5984")
          expect(response.auth.username).toBe("url-user")
          expect(response.auth.password).toBe("url-password")
        }
      )
    })

    it("derives the SQL URL from COUCH_DB_URL when COUCH_DB_SQL_URL is unset", async () => {
      await withEnv(
        {
          COUCH_DB_URL: "http://user:pass@localhost:5984",
          COUCH_DB_SQL_URL: undefined,
        },
        async () => {
          const response = getCouchInfo()

          expect(response.sqlUrl).toBe("http://localhost:4984")
        }
      )
    })

    it("derives the SQL URL using COUCH_DB_SQS_PORT when configured", async () => {
      await withEnv(
        {
          COUCH_DB_URL: "http://user:pass@localhost:5984",
          COUCH_DB_SQL_URL: undefined,
          COUCH_DB_SQS_PORT: "4006",
        },
        async () => {
          const response = getCouchInfo()

          expect(response.sqlUrl).toBe("http://localhost:4006")
        }
      )
    })
  })
})
