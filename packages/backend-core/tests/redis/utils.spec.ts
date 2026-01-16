import {
  getRedisConnectionDetails,
  getRedisOptions,
} from "../../src/redis/utils"
import { withEnv } from "../../src/environment"

describe("redis utils", () => {
  describe("getRedisConnectionDetails", () => {
    it("reads username and password from URL", async () => {
      const details = await withEnv(
        {
          REDIS_URL: "redis://alice:secret@localhost:6380",
          REDIS_USERNAME: "",
          REDIS_PASSWORD: "",
        },
        async () => getRedisConnectionDetails()
      )

      expect(details).toEqual({
        host: "localhost",
        password: "secret",
        username: "alice",
        port: 6380,
      })
    })

    it("supports password-only URL without username", async () => {
      const details = await withEnv(
        {
          REDIS_URL: "redis://:secret@localhost:6380",
          REDIS_USERNAME: "",
          REDIS_PASSWORD: "",
        },
        async () => getRedisConnectionDetails()
      )

      expect(details.username).toBeUndefined()
      expect(details.password).toBe("secret")
      expect(details.host).toBe("localhost")
      expect(details.port).toBe(6380)
    })

    it("prefers env username over URL username", async () => {
      const details = await withEnv(
        {
          REDIS_URL: "redis://urluser:secret@localhost:6380",
          REDIS_USERNAME: "envuser",
          REDIS_PASSWORD: "",
        },
        async () => getRedisConnectionDetails()
      )

      expect(details.username).toBe("envuser")
      expect(details.password).toBe("secret")
      expect(details.host).toBe("localhost")
      expect(details.port).toBe(6380)
    })
  })

  describe("getRedisOptions", () => {
    it("omits username when not provided", async () => {
      const options = await withEnv(
        {
          REDIS_URL: "redis://:secret@localhost:6380",
          REDIS_USERNAME: "",
          REDIS_PASSWORD: "",
        },
        async () => getRedisOptions()
      )

      expect(options.username).toBeUndefined()
      expect(options.password).toBe("secret")
    })
  })
})
