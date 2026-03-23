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

    it("enables tls from a rediss URL in the standard redis options", async () => {
      const options = await withEnv(
        {
          REDIS_URL: "rediss://alice:secret@localhost:6380",
          REDIS_USERNAME: "",
          REDIS_PASSWORD: "",
        },
        async () => getRedisOptions()
      )

      expect(options).toEqual({
        connectTimeout: 30000,
        host: "localhost",
        password: "secret",
        port: 6380,
        tls: {},
        username: "alice",
      })
    })

    it("supports rediss URL with username and password provided separately", async () => {
      const options = await withEnv(
        {
          REDIS_URL: "rediss://master.xxxxx.cache.amazonaws.com",
          REDIS_USERNAME: "aaa",
          REDIS_PASSWORD: "bbb",
        },
        async () => getRedisOptions()
      )

      expect(options).toEqual({
        connectTimeout: 30000,
        host: "master.xxxxx.cache.amazonaws.com",
        password: "bbb",
        port: 6379,
        tls: {},
        username: "aaa",
      })
    })
  })
})
