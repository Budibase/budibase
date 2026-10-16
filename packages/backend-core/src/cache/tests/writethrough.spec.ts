import { DBTestConfiguration } from "../../../tests/extra"
import { structures } from "../../../tests"
import { Writethrough } from "../writethrough"
import { getDB } from "../../db"
import { Document, LockName, LockType } from "@budibase/types"
import * as locks from "../../redis/redlockImpl"
import tk from "timekeeper"
import Redlock from "redlock"

jest.mock("../../redis/redlockImpl", () => {
  const actual = jest.requireActual<typeof import("../../redis/redlockImpl")>(
    "../../redis/redlockImpl"
  )
  return { ...actual, doWithLock: jest.fn(actual.doWithLock) }
})

tk.freeze(Date.now())

interface ValueDoc extends Document {
  value: any
}

const DELAY = 5000

describe("writethrough", () => {
  const config = new DBTestConfiguration()

  const db = getDB(structures.db.id())
  const db2 = getDB(structures.db.id())

  const writethrough = new Writethrough(db, DELAY)
  const writethrough2 = new Writethrough(db2, DELAY)

  const docId = structures.uuid()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("put", () => {
    let current: any

    it("waits for the persistence lock when throttling is disabled", async () => {
      await config.doInTenant(async () => {
        const id = structures.uuid()
        const first = await writethrough.put({ _id: id, value: 1 }, 0)
        let started!: () => void
        const locked = new Promise<void>(resolve => {
          started = resolve
        })
        let release!: () => void
        const released = new Promise<void>(resolve => {
          release = resolve
        })
        const holder = locks.doWithLock(
          {
            type: LockType.DEFAULT,
            name: LockName.PERSIST_WRITETHROUGH,
            resource: id,
            ttl: 15000,
          },
          async () => {
            started()
            await released
          }
        )
        await locked
        let attempted!: () => void
        const attempting = new Promise<void>(resolve => {
          attempted = resolve
        })
        const originalLock = Redlock.prototype.lock
        const lock = jest
          .spyOn(Redlock.prototype, "lock")
          .mockImplementation(function (this: Redlock, ...args) {
            const pending = originalLock.apply(this, args)
            attempted()
            return pending
          })
        const order: string[] = []
        const originalPut = db.put.bind(db)
        const put = jest.spyOn(db, "put").mockImplementation((...args) => {
          order.push("write")
          return originalPut(...args)
        })
        const write = writethrough.put(
          { _id: id, _rev: first.rev, value: 2 },
          0
        )
        let timer: ReturnType<typeof setTimeout> | undefined
        try {
          await Promise.race([
            attempting,
            write.then(() => {
              throw new Error("Write completed without attempting the lock")
            }),
            new Promise<never>((_resolve, reject) => {
              timer = setTimeout(
                () => reject(new Error("Persistence lock attempt timed out")),
                5000
              )
            }),
          ])
          order.push("release")
          release()
          await write
        } finally {
          clearTimeout(timer)
          release()
          try {
            await Promise.allSettled([holder, write])
          } finally {
            put.mockRestore()
            lock.mockRestore()
          }
        }
        expect(order).toEqual(["release", "write"])
        expect((await db.tryGet<ValueDoc>(id))?.value).toBe(2)
        expect((await writethrough.tryGet<ValueDoc>(id))?.value).toBe(2)
      })
    })

    it.each([409, 500])(
      "propagates write errors (%s) without updating the cache when throttling is disabled",
      async status => {
        await config.doInTenant(async () => {
          const id = structures.uuid()
          const first = await writethrough.put({ _id: id, value: 1 }, 0)
          const error = Object.assign(new Error("Write failed"), { status })
          const write = jest.spyOn(db, "put").mockRejectedValueOnce(error)
          try {
            await expect(
              writethrough.put({ _id: id, _rev: first.rev, value: 2 }, 0)
            ).rejects.toBe(error)
            expect((await db.tryGet<ValueDoc>(id))?.value).toBe(1)
            expect((await writethrough.tryGet<ValueDoc>(id))?.value).toBe(1)
          } finally {
            write.mockRestore()
          }
        })
      }
    )

    it("does not update the cache when the waiting lock cannot be acquired", async () => {
      await config.doInTenant(async () => {
        const id = structures.uuid()
        const first = await writethrough.put({ _id: id, value: 1 }, 0)
        const error = Object.assign(new Error("Lock unavailable"), {
          name: "LockError",
        })
        const lock = jest
          .spyOn(locks, "doWithLock")
          .mockRejectedValueOnce(error)
        try {
          await expect(
            writethrough.put({ _id: id, _rev: first.rev, value: 2 }, 0)
          ).rejects.toBe(error)
          expect((await db.tryGet<ValueDoc>(id))?.value).toBe(1)
          expect((await writethrough.tryGet<ValueDoc>(id))?.value).toBe(1)
        } finally {
          lock.mockImplementation(
            jest.requireActual<typeof import("../../redis/redlockImpl")>(
              "../../redis/redlockImpl"
            ).doWithLock
          )
        }
      })
    })

    it("persists every write when throttling is disabled, even in the same millisecond", async () => {
      await config.doInTenant(async () => {
        const id = structures.uuid()
        const first = await writethrough.put({ _id: id, value: 1 }, 0)
        await writethrough.put({ _id: id, _rev: first.rev, value: 2 }, 0)

        const persisted = await db.tryGet<ValueDoc>(id)
        const cached = await writethrough.tryGet<ValueDoc>(id)
        expect(persisted?.value).toBe(2)
        expect(cached?.value).toBe(2)
      })
    })

    it("should be able to store, will go to DB", async () => {
      await config.doInTenant(async () => {
        const response = await writethrough.put({
          _id: docId,
          value: 1,
        })
        const output = await db.get<any>(response.id)
        current = output
        expect(output.value).toBe(1)
      })
    })

    it("second put shouldn't update DB", async () => {
      await config.doInTenant(async () => {
        const response = await writethrough.put({ ...current, value: 2 })
        const output = await db.get<any>(response.id)
        expect(current._rev).toBe(output._rev)
        expect(output.value).toBe(1)
      })
    })

    it("should put it again after delay period", async () => {
      await config.doInTenant(async () => {
        tk.freeze(Date.now() + DELAY + 1)
        const response = await writethrough.put({ ...current, value: 3 })
        const output = await db.get<any>(response.id)
        expect(response.rev).not.toBe(current._rev)
        expect(output.value).toBe(3)

        current = output
      })
    })

    it("should handle parallel DB updates ignoring conflicts", async () => {
      await config.doInTenant(async () => {
        tk.freeze(Date.now() + DELAY + 1)
        const responses = await Promise.all([
          writethrough.put({ ...current, value: 4 }),
          writethrough.put({ ...current, value: 4 }),
          writethrough.put({ ...current, value: 4 }),
        ])

        // with a lock, this will work
        const newRev = responses.map(x => x.rev).find(x => x !== current._rev)
        expect(newRev).toBeDefined()
        expect(responses.map(x => x.rev)).toEqual(
          expect.arrayContaining([current._rev, current._rev, newRev])
        )

        const output = await db.get<any>(current._id)
        expect(output.value).toBe(4)
        expect(output._rev).toBe(newRev)

        current = output
      })
    })

    it("should handle updates with documents falling behind", async () => {
      await config.doInTenant(async () => {
        tk.freeze(Date.now() + DELAY + 1)

        const id = structures.uuid()
        await writethrough.put({ _id: id, value: 1 })
        const doc = await writethrough.get(id)

        // Updating document
        tk.freeze(Date.now() + DELAY + 1)
        await writethrough.put({ ...doc, value: 2 })

        // Update with the old rev value
        tk.freeze(Date.now() + DELAY + 1)
        const res = await writethrough.put({
          ...doc,
          value: 3,
        })
        expect(res.ok).toBe(true)

        const output = await db.get<any>(id)
        expect(output.value).toBe(3)
        expect(output._rev).toBe(res.rev)
      })
    })
  })

  describe("get", () => {
    it("should be able to retrieve", async () => {
      await config.doInTenant(async () => {
        const response = await writethrough.get<ValueDoc>(docId)
        expect(response.value).toBe(4)
      })
    })
  })

  describe("same doc, different databases (tenancy)", () => {
    it("should be able to two different databases", async () => {
      await config.doInTenant(async () => {
        const resp1 = await writethrough.put({ _id: "db1", value: "first" })
        const resp2 = await writethrough2.put({ _id: "db1", value: "second" })
        expect(resp1.rev).toBeDefined()
        expect(resp2.rev).toBeDefined()
        expect((await db.get<any>("db1")).value).toBe("first")
        expect((await db2.get<any>("db1")).value).toBe("second")
      })
    })
  })
})
