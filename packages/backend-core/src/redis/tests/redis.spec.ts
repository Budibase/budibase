import { GenericContainer, StartedTestContainer } from "testcontainers"
import { generator, structures } from "../../../tests"
import RedisWrapper, { closeAll } from "../redis"
import env from "../../environment"
import { randomUUID } from "crypto"

jest.setTimeout(30000)

describe("redis", () => {
  let redis: RedisWrapper
  let container: StartedTestContainer

  beforeAll(async () => {
    container = await new GenericContainer("redis")
      .withExposedPorts(6379)
      .start()

    env._set(
      "REDIS_URL",
      `${container.getHost()}:${container.getMappedPort(6379)}`
    )
    env._set("MOCK_REDIS", 0)
    env._set("REDIS_PASSWORD", 0)
  })

  afterAll(() => {
    container?.stop()
    closeAll()
  })

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
      valueGenerator: () => any = () => randomUUID()
    ) {
      return generator
        .unique(() => randomUUID(), keyLength)
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

      expect(await redis.keys("*")).toHaveLength(15)
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

      for (const key of Object.keys(data)) {
        expect(await redis.get(key)).toBe(null)
      }

      expect(await redis.keys("*")).toHaveLength(0)
    })
  })

  describe("increment", () => {
    it("can increment on a new key", async () => {
      const key = structures.uuid()
      const result = await redis.increment(key)
      expect(result).toBe(1)
    })

    it("can increment multiple times", async () => {
      const key = structures.uuid()
      const results = [
        await redis.increment(key),
        await redis.increment(key),
        await redis.increment(key),
        await redis.increment(key),
        await redis.increment(key),
      ]
      expect(results).toEqual([1, 2, 3, 4, 5])
    })

    it("can increment multiple times in parallel", async () => {
      const key = structures.uuid()
      const results = await Promise.all(
        Array.from({ length: 100 }).map(() => redis.increment(key))
      )
      expect(results).toHaveLength(100)
      expect(results).toEqual(Array.from({ length: 100 }).map((_, i) => i + 1))
    })

    it("can increment existing set keys", async () => {
      const key = structures.uuid()
      await redis.store(key, 70)
      await redis.increment(key)

      const result = await redis.increment(key)
      expect(result).toBe(72)
    })

    it.each([
      generator.word(),
      generator.bool(),
      { [generator.word()]: generator.word() },
    ])("cannot increment if the store value is not a number", async value => {
      const key = structures.uuid()
      await redis.store(key, value)

      await expect(redis.increment(key)).rejects.toThrow(
        "ERR value is not an integer or out of range"
      )
    })
  })

  describe("deleteIfValue", () => {
    it("can delete if the value matches", async () => {
      const key = structures.uuid()
      const value = generator.word()
      await redis.store(key, value)

      await redis.deleteIfValue(key, value)

      expect(await redis.get(key)).toBeNull()
    })

    it("will not delete if the value does not matches", async () => {
      const key = structures.uuid()
      const value = generator.word()
      await redis.store(key, value)

      await redis.deleteIfValue(key, generator.word())

      expect(await redis.get(key)).toEqual(value)
    })
  })
})
