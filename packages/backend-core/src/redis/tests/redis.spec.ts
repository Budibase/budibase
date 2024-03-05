import { generator, structures } from "../../../tests"
import RedisWrapper from "../redis"

describe("redis", () => {
  const redis = new RedisWrapper(structures.db.id())

  beforeAll(async () => {
    await redis.init()
  })

  describe("store", () => {
    it("a basic value can be persisted", async () => {
      const key = structures.uuid()
      const value = generator.word()

      await redis.store(key, value)

      expect(await redis.get(key)).toEqual(value)
    })
  })
})
