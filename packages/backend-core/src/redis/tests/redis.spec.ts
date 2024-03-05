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

    it("objects can be persisted", async () => {
      const key = structures.uuid()
      const value = { [generator.word()]: generator.word() }

      await redis.store(key, value)

      expect(await redis.get(key)).toEqual(value)
    })
  })

  describe("bulkStore", () => {
    function createRandomObject(
      keyLength: number,
      valueGenerator: () => any = () => generator.word()
    ) {
      return generator
        .unique(() => generator.word(), keyLength)
        .reduce((acc, key) => {
          acc[key] = valueGenerator()
          return acc
        }, {} as Record<string, string>)
    }

    it("a basic object can be persisted", async () => {
      const data = createRandomObject(10)

      await redis.bulkStore(data)

      for (const [key, value] of Object.entries(data)) {
        expect(await redis.get(key)).toEqual(value)
      }

      expect(await redis.keys("*")).toHaveLength(10)
    })

    it("a complex object can be persisted", async () => {
      const data = {
        ...createRandomObject(10, () => createRandomObject(5)),
        ...createRandomObject(5),
      }

      await redis.bulkStore(data)

      for (const [key, value] of Object.entries(data)) {
        expect(await redis.get(key)).toEqual(value)
      }

      expect(await redis.keys("*")).toHaveLength(10)
    })

    it("no TTL is set by default", async () => {
      const data = createRandomObject(10)

      await redis.bulkStore(data)

      for (const [key, value] of Object.entries(data)) {
        expect(await redis.get(key)).toEqual(value)
        expect(await redis.getTTL(key)).toEqual(-1)
      }
    })

    it("a bulk store can be persisted with TTL", async () => {
      const ttl = 500
      const data = createRandomObject(8)

      await redis.bulkStore(data, ttl)

      for (const [key, value] of Object.entries(data)) {
        expect(await redis.get(key)).toEqual(value)
        expect(await redis.getTTL(key)).toEqual(ttl)
      }

      expect(await redis.keys("*")).toHaveLength(8)
    })

    it("setting a TTL of -1 will not persist the key", async () => {
      const ttl = -1
      const data = createRandomObject(5)

      await redis.bulkStore(data, ttl)

      for (const [key, value] of Object.entries(data)) {
        expect(await redis.get(key)).toBe(null)
      }

      expect(await redis.keys("*")).toHaveLength(0)
    })
  })
})
