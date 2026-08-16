import { cache, context, RedisClient, utils } from "@budibase/backend-core"
import {
  BBReferenceFieldSubType,
  FieldType,
  Table,
  User,
} from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { basicTable } from "../../../tests/utilities/structures"

const ROW_COUNT = 20
const USER_COUNT = 5

const userColumns = {
  single_user: {
    name: "single_user",
    type: FieldType.BB_REFERENCE_SINGLE as const,
    subtype: BBReferenceFieldSubType.USER,
  },
  multi_user: {
    name: "multi_user",
    type: FieldType.BB_REFERENCE as const,
    subtype: BBReferenceFieldSubType.USER,
    constraints: { type: "array" as const },
  },
}

describe("search - user column redis usage", () => {
  const config = new TestConfiguration()

  let users: User[]
  let table: Table

  beforeAll(async () => {
    await config.init()

    users = []
    for (let i = 0; i < USER_COUNT; i++) {
      users.push(await config.createUser({ _id: `us_${utils.newid()}` }))
    }

    table = await config.api.table.save(
      basicTable(undefined, { schema: userColumns })
    )

    for (let i = 0; i < ROW_COUNT; i++) {
      await config.api.row.save(table._id!, {
        name: `row ${i}`,
        single_user: users[i % USER_COUNT],
        multi_user: [users[i % USER_COUNT], users[(i + 1) % USER_COUNT]],
      })
    }
  })

  afterAll(() => {
    config.end()
  })

  const isUserKey = (key: string) => key.startsWith("us_")

  async function trackUserLookups<T>(task: () => Promise<T>) {
    const gets = jest.spyOn(RedisClient.prototype, "get")
    const bulkGets = jest.spyOn(RedisClient.prototype, "bulkGet")

    try {
      const result = await task()
      const bulkGetCalls = bulkGets.mock.calls.filter(([keys]) =>
        keys.some(isUserKey)
      )

      return {
        result,
        gets: gets.mock.calls.filter(([key]) => isUserKey(key)).length,
        bulkGets: bulkGetCalls.length,
        keysFetched: bulkGetCalls.reduce((acc, [keys]) => acc + keys.length, 0),
      }
    } finally {
      gets.mockRestore()
      bulkGets.mockRestore()
    }
  }

  async function countUserLookups(limit: number) {
    const { result, gets, bulkGets } = await trackUserLookups(() =>
      config.api.row.search(table._id!, { query: {}, limit })
    )
    expect(result.rows).toHaveLength(limit)
    return { gets, bulkGets }
  }

  it("fetches referenced users in one round trip, whatever the page size", async () => {
    const smallPage = await countUserLookups(5)
    const largePage = await countUserLookups(ROW_COUNT)

    // the remaining single-key gets authenticate the caller, they don't scale
    // with the rows being returned
    expect(largePage).toEqual(smallPage)
    expect(largePage.bulkGets).toBe(1)
  })

  it("returns fully enriched user columns", async () => {
    const { rows } = await config.api.row.search(table._id!, { query: {} })
    const row = rows.find(r => r.name === "row 0")!

    expect(row.single_user).toEqual({
      _id: users[0]._id,
      primaryDisplay: users[0].email,
      email: users[0].email,
      firstName: users[0].firstName,
      lastName: users[0].lastName,
      fullName: expect.anything(),
    })
    expect(row.multi_user).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ _id: users[0]._id, email: users[0].email }),
        expect.objectContaining({ _id: users[1]._id, email: users[1].email }),
      ])
    )
  })

  it("deduplicates repeated references into one batch", async () => {
    const { keysFetched, bulkGets } = await trackUserLookups(() =>
      config.api.row.search(table._id!, { query: {}, limit: ROW_COUNT })
    )

    // 20 rows reference the same 5 users across two columns - 40 references
    expect(bulkGets).toBe(1)
    expect(keysFetched).toBe(USER_COUNT)
  })

  it("preserves the stored order of a multi user column", async () => {
    const ordered = await config.api.row.save(table._id!, {
      name: "ordered",
      multi_user: [users[3], users[1], users[4]],
    })

    const { rows } = await config.api.row.search(table._id!, {
      query: { equal: { _id: ordered._id } },
    })

    expect(rows[0].multi_user.map((u: User) => u._id)).toEqual([
      users[3]._id,
      users[1]._id,
      users[4]._id,
    ])
  })

  it("keeps that order when the cache is only partially warm", async () => {
    const ordered = await config.api.row.save(table._id!, {
      name: "partially cached",
      multi_user: [users[3], users[1], users[4]],
    })

    await config.doInContext(undefined, () =>
      cache.user.invalidateUser(users[1]._id!)
    )

    const { rows } = await config.api.row.search(table._id!, {
      query: { equal: { _id: ordered._id } },
    })

    expect(rows[0].multi_user.map((u: User) => u._id)).toEqual([
      users[3]._id,
      users[1]._id,
      users[4]._id,
    ])
  })

  describe("empty values", () => {
    let emptyTable: Table

    beforeAll(async () => {
      emptyTable = await config.api.table.save(
        basicTable(undefined, { schema: userColumns })
      )
      await config.api.row.save(emptyTable._id!, { name: "no users" })
      await config.api.row.save(emptyTable._id!, {
        name: "explicitly empty",
        single_user: null,
        multi_user: [],
      })
    })

    it("does not hit redis when no rows reference a user", async () => {
      const { result, gets, bulkGets } = await trackUserLookups(() =>
        config.api.row.search(emptyTable._id!, { query: {} })
      )

      expect(result.rows).toHaveLength(2)
      expect(bulkGets).toBe(0)
      expect(gets).toBe(3) // caller authentication only
      for (const row of result.rows) {
        expect(row.single_user).toBeUndefined()
        expect(row.multi_user).toBeUndefined()
      }
    })
  })

  describe("dangling references", () => {
    let danglingTable: Table
    let deleted: User

    beforeAll(async () => {
      deleted = await config.createUser({ _id: `us_${utils.newid()}` })
      danglingTable = await config.api.table.save(
        basicTable(undefined, { schema: userColumns })
      )

      await config.api.row.save(danglingTable._id!, {
        name: "dangling single",
        single_user: deleted,
        multi_user: [deleted, users[0]],
      })
      await config.api.row.save(danglingTable._id!, {
        name: "all dangling",
        multi_user: [deleted],
      })

      await config.doInContext(undefined, async () => {
        const db = context.getGlobalDB()
        const user = await db.get<User>(deleted._id!)
        await db.remove(user._id!, user._rev!)
        await cache.user.invalidateUser(deleted._id!)
      })
    })

    it("drops references to users that no longer exist", async () => {
      const { rows } = await config.api.row.search(danglingTable._id!, {
        query: {},
      })

      const single = rows.find(r => r.name === "dangling single")!
      expect(single.single_user).toBeUndefined()
      expect(single.multi_user).toEqual([
        expect.objectContaining({ _id: users[0]._id }),
      ])

      const allDangling = rows.find(r => r.name === "all dangling")!
      expect(allDangling.multi_user).toBeUndefined()
    })
  })

  describe("tables without user columns", () => {
    let plainTable: Table

    beforeAll(async () => {
      plainTable = await config.api.table.save(basicTable())
      await config.api.row.save(plainTable._id!, { name: "plain" })
    })

    it("makes no user lookups at all", async () => {
      const { result, bulkGets } = await trackUserLookups(() =>
        config.api.row.search(plainTable._id!, { query: {} })
      )

      expect(result.rows).toHaveLength(1)
      expect(bulkGets).toBe(0)
    })
  })
})
