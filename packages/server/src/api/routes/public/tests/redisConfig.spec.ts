import { withEnv } from "@budibase/backend-core/src/environment"
import { SelectableDatabase } from "@budibase/backend-core/src/redis/utils"
import { getPublicApiRedisConfig } from "../redisConfig"

describe("public api redis config", () => {
  it("enables tls for rediss URLs with separate username and password", async () => {
    const config = await withEnv(
      {
        REDIS_URL: "rediss://master.xxxxx.cache.amazonaws.com",
        REDIS_USERNAME: "aaa",
        REDIS_PASSWORD: "bbb",
      },
      async () => getPublicApiRedisConfig(SelectableDatabase.RATE_LIMITING)
    )

    expect(config).toEqual({
      database: SelectableDatabase.RATE_LIMITING,
      password: "bbb",
      socket: {
        tls: true,
      },
      url: "rediss://master.xxxxx.cache.amazonaws.com",
      username: "aaa",
    })
  })

  it("enables tls for uppercase REDISS URLs", async () => {
    const config = await withEnv(
      {
        REDIS_URL: "REDISS://master.xxxxx.cache.amazonaws.com",
        REDIS_USERNAME: "aaa",
        REDIS_PASSWORD: "bbb",
      },
      async () => getPublicApiRedisConfig()
    )

    expect(config).toEqual({
      password: "bbb",
      socket: {
        tls: true,
      },
      url: "rediss://master.xxxxx.cache.amazonaws.com",
      username: "aaa",
    })
  })

  it("does not set tls for plain redis URLs", async () => {
    const config = await withEnv(
      {
        REDIS_URL: "localhost:6379",
        REDIS_USERNAME: "",
        REDIS_PASSWORD: "budibase",
      },
      async () => getPublicApiRedisConfig()
    )

    expect(config).toEqual({
      password: "budibase",
      url: "redis://localhost:6379",
    })
  })
})
