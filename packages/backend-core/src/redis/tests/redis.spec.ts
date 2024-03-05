import { generator, structures } from "../../../tests"
import RedisWrapper from "../redis"

describe("redis", () => {
  let redis: RedisWrapper

  beforeEach(async () => {
    redis = new RedisWrapper(structures.db.id())
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

  describe("bulkStore", () => {
    it("a basic object can be persisted", async () => {
      const data = generator
        .unique(() => generator.word(), 10)
        .reduce((acc, key) => {
          acc[key] = generator.word()
          return acc
        }, {} as Record<string, string>)

      await redis.bulkStore(data)

      for (const [key, value] of Object.entries(data)) {
        expect(await redis.get(key)).toEqual(value)
      }

      expect(await redis.keys("*")).toHaveLength(10)
    })
  })
})
