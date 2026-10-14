import { context, events, locks, users } from "@budibase/backend-core"
import { groups } from "@budibase/pro"
import { IdentityType, LockName, LockType, type User } from "@budibase/types"
import { mocks, structures } from "../../../tests"
import { save } from "../users"
import { reconcileGroupEvents } from "../groupEvents"

describe("durable user group events", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mocks.licenses.useGroups()
  })

  it("recovers a failed publication without failing the save or losing its original metadata", async () => {
    const tenantId = structures.tenant.id()
    await context.doInTenant(tenantId, async () => {
      const group = await groups.save(structures.groups.UserGroup())
      const user = await save({ user: structures.users.user() })
      jest
        .mocked(events.group.usersAdded)
        .mockRejectedValueOnce(new Error("Audit queue unavailable"))

      const saved = await context.doInIdentityContext(
        { type: IdentityType.USER, _id: "us_original_actor", tenantId },
        () => save({ user: { ...user, userGroups: [group.id] } })
      )
      const pending = await context.getGlobalDB().get<User>(user._id!)
      const originalEvent = pending.pendingGroupEvents![0]
      await reconcileGroupEvents({ tenantId })
      const recovered = await users.getById(user._id!)
      await save({ user: recovered })

      expect(saved.userGroups).toEqual([group.id])
      expect(saved.pendingGroupEvents).toBeUndefined()
      expect(pending.pendingGroupEvents).toHaveLength(1)
      expect(originalEvent.identity.id).toBe("us_original_actor")
      expect(recovered.pendingGroupEvents).toBeUndefined()
      expect(events.group.usersAdded).toHaveBeenCalledTimes(2)
      expect(events.group.usersAdded).toHaveBeenLastCalledWith(
        1,
        expect.objectContaining({ _id: group.id }),
        [user._id],
        {
          identity: originalEvent.identity,
          timestamp: originalEvent.timestamp,
        }
      )
    })
  })

  it("only retries unpublished events after a partially published replacement", async () => {
    const tenantId = structures.tenant.id()
    await context.doInTenant(tenantId, async () => {
      const first = await groups.save(structures.groups.UserGroup())
      const second = await groups.save(structures.groups.UserGroup())
      const user = await save({
        user: structures.users.user({ userGroups: [first.id] }),
      })
      jest.clearAllMocks()
      jest
        .mocked(events.group.usersDeleted)
        .mockRejectedValueOnce(new Error("Audit queue unavailable"))

      await save({ user: { ...user, userGroups: [second.id] } })
      await reconcileGroupEvents({ tenantId })
      await reconcileGroupEvents({ tenantId })

      const persisted = await users.getById(user._id!)
      expect(persisted.userGroups).toEqual([second.id])
      expect(persisted.pendingGroupEvents).toBeUndefined()
      expect(events.group.usersAdded).toHaveBeenCalledTimes(1)
      expect(events.group.usersDeleted).toHaveBeenCalledTimes(2)
    })
  })

  it("defers publication when another worker holds the lock without failing the save", async () => {
    const tenantId = structures.tenant.id()
    await context.doInTenant(tenantId, async () => {
      const group = await groups.save(structures.groups.UserGroup())
      const user = await save({ user: structures.users.user() })
      const result = await locks.doWithLock(
        {
          name: LockName.USER_GROUP_EVENTS,
          resource: user._id!,
          type: LockType.TRY_ONCE,
          ttl: 10000,
        },
        () => save({ user: { ...user, userGroups: [group.id] } })
      )
      const pending = await users.getById(user._id!)
      await reconcileGroupEvents({ tenantId })
      const recovered = await users.getById(user._id!)

      expect(result).toMatchObject({
        executed: true,
        result: { userGroups: [group.id] },
      })
      expect(pending.pendingGroupEvents).toHaveLength(1)
      expect(recovered.pendingGroupEvents).toBeUndefined()
      expect(events.group.usersAdded).toHaveBeenCalledTimes(1)
    })
  })

  it("recovers pending events after the user is deleted", async () => {
    const tenantId = structures.tenant.id()
    await context.doInTenant(tenantId, async () => {
      const group = await groups.save(structures.groups.UserGroup())
      const user = await save({ user: structures.users.user() })
      jest
        .mocked(events.group.usersAdded)
        .mockRejectedValueOnce(new Error("Audit queue unavailable"))
      await save({ user: { ...user, userGroups: [group.id] } })
      await users.UserDB.destroy(user._id!)

      await reconcileGroupEvents({ tenantId })
      await reconcileGroupEvents({ tenantId })

      expect(await context.getGlobalDB().tryGet(user._id!)).toBeUndefined()
      expect(events.group.usersAdded).toHaveBeenCalledTimes(2)
      expect(events.group.usersAdded).toHaveBeenLastCalledWith(
        1,
        expect.objectContaining({ _id: group.id }),
        [user._id],
        expect.any(Object)
      )
    })
  })

  it("preserves concurrent user changes when acknowledging an event", async () => {
    const tenantId = structures.tenant.id()
    await context.doInTenant(tenantId, async () => {
      const group = await groups.save(structures.groups.UserGroup())
      const user = await save({ user: structures.users.user() })
      jest.mocked(events.group.usersAdded).mockImplementationOnce(async () => {
        const current = await users.getById(user._id!)
        await users.UserDB.save({ ...current, firstName: "Concurrent update" })
      })

      await save({ user: { ...user, userGroups: [group.id] } })
      const persisted = await users.getById(user._id!)
      expect(persisted.firstName).toBe("Concurrent update")
      expect(persisted.userGroups).toEqual([group.id])
      expect(persisted.pendingGroupEvents).toBeUndefined()
    })
  })

  it("does not record or publish membership changes when persistence fails", async () => {
    await context.doInTenant(structures.tenant.id(), async () => {
      const group = await groups.save(structures.groups.UserGroup())
      const user = await save({ user: structures.users.user() })

      await expect(
        save({
          user: { ...user, _rev: "1-stale", userGroups: [group.id] },
        })
      ).rejects.toBe("User exists already")

      const persisted = await users.getById(user._id!)
      expect(persisted.userGroups || []).toEqual([])
      expect(persisted.pendingGroupEvents).toBeUndefined()
      expect(events.group.usersAdded).not.toHaveBeenCalled()
    })
  })

  it("preserves events when quota bookkeeping fails after persistence", async () => {
    const tenantId = structures.tenant.id()
    await context.doInTenant(tenantId, async () => {
      const group = await groups.save(structures.groups.UserGroup())
      const user = await save({ user: structures.users.user() })
      const quotaSave = jest
        .spyOn(users.UserDB.quotas, "addUsers")
        .mockImplementationOnce(async (_change, _creatorsChange, callback) => {
          await callback?.()
          throw new Error("Quota write failed")
        })
      jest
        .mocked(events.group.usersAdded)
        .mockRejectedValueOnce(new Error("Audit queue unavailable"))

      try {
        await expect(
          save({ user: { ...user, userGroups: [group.id] } })
        ).rejects.toThrow("Quota write failed")
      } finally {
        quotaSave.mockRestore()
      }
      const pending = await users.getById(user._id!)
      await reconcileGroupEvents({ tenantId })
      const recovered = await users.getById(user._id!)

      expect(pending.userGroups).toEqual([group.id])
      expect(pending.pendingGroupEvents).toHaveLength(1)
      expect(recovered.pendingGroupEvents).toBeUndefined()
      expect(events.group.usersAdded).toHaveBeenCalledTimes(2)
    })
  })

  it("ignores client-supplied outbox data and hides pending events from user responses", async () => {
    await context.doInTenant(structures.tenant.id(), async () => {
      const group = await groups.save(structures.groups.UserGroup())
      const user = await save({ user: structures.users.user() })
      jest
        .mocked(events.group.usersAdded)
        .mockRejectedValueOnce(new Error("Audit queue unavailable"))
      await save({ user: { ...user, userGroups: [group.id] } })
      const pending = await users.getById(user._id!)
      const response = await users.UserDB.getUser(user._id!)

      await users.UserDB.save({
        ...pending,
        firstName: "Updated",
        pendingGroupEvents: [],
      })
      const persisted = await users.getById(user._id!)
      const created = await save({
        user: structures.users.user({
          pendingGroupEvents: pending.pendingGroupEvents,
        }),
      })

      expect(response.pendingGroupEvents).toBeUndefined()
      expect(persisted.pendingGroupEvents).toEqual(pending.pendingGroupEvents)
      expect(created.pendingGroupEvents).toBeUndefined()
      expect(events.group.usersAdded).toHaveBeenCalledTimes(1)
    })
  })
})
