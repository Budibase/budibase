import {
  cache,
  context,
  db,
  events,
  locks,
  timers,
} from "@budibase/backend-core"
import {
  isUser,
  LockName,
  LockType,
  type User,
  type UserGroupEventOutbox,
} from "@budibase/types"

type EventDocument = User | UserGroupEventOutbox

export const flushGroupEvents = async ({
  documentId,
}: {
  documentId: string
}) => {
  try {
    const globalDb = context.getGlobalDB()
    const document = await globalDb.tryGet<EventDocument>(documentId)
    if (!document?.pendingGroupEvents?.length) {
      return
    }
    const userId = isUser(document) ? document._id! : document.userId
    await locks.doWithLock(
      {
        name: LockName.USER_GROUP_EVENTS,
        resource: userId,
        type: LockType.TRY_ONCE,
        ttl: 5 * 60 * 1000,
      },
      async () => {
        let document = await globalDb.tryGet<EventDocument>(documentId)
        while (document?.pendingGroupEvents?.length) {
          const event = document.pendingGroupEvents[0]
          const publish =
            event.action === "added"
              ? events.group.usersAdded
              : events.group.usersDeleted
          await publish(1, event.group, [userId], {
            identity: event.identity,
            timestamp: event.timestamp,
          })

          // Reload to preserve changes made while publishing. A failed acknowledgement
          // leaves the event available for retry, so delivery is at least once.
          document = await globalDb.get<EventDocument>(documentId)
          document.pendingGroupEvents = (
            document.pendingGroupEvents || []
          ).filter(pending => pending.id !== event.id)
          if (!document.pendingGroupEvents.length) {
            if (!isUser(document)) {
              await globalDb.remove(document)
              return
            }
            delete document.pendingGroupEvents
          }
          const saved = await globalDb.put(document)
          document._rev = saved.rev
          await cache.user.invalidateUser(userId)
        }
      }
    )
  } catch (error) {
    // The pending event remains available for the next save or recovery pass.
    console.log(
      `Unable to publish pending group events for ${documentId}`,
      error
    )
  }
}

export const reconcileGroupEvents = async ({
  tenantId,
}: {
  tenantId: string
}) => {
  await context.doInTenant(tenantId, async () => {
    let startkey: string | undefined
    while (true) {
      const result = await db.queryGlobalViewRaw<EventDocument>(
        db.ViewName.USER_PENDING_GROUP_EVENTS,
        { limit: 101, ...(startkey && { startkey }) }
      )
      for (const row of result.rows) {
        if (row.id !== startkey) {
          await flushGroupEvents({ documentId: row.id })
        }
      }
      if (result.rows.length < 101) {
        return
      }
      startkey = result.rows[result.rows.length - 1].id
    }
  })
}

export const initGroupEventRecovery = () => {
  let running = false
  const recover = async () => {
    if (running) {
      return
    }
    running = true
    try {
      const databaseNames: string[] = await db.directCouchAllDbs()
      const globalName = db.StaticDatabases.GLOBAL.name
      for (const name of databaseNames) {
        if (name !== globalName && !name.endsWith(`_${globalName}`)) {
          continue
        }
        const tenantId =
          name === globalName
            ? context.DEFAULT_TENANT_ID
            : name.slice(0, -`_${globalName}`.length)
        try {
          await reconcileGroupEvents({ tenantId })
        } catch (error) {
          console.log(`Unable to recover group events for ${tenantId}`, error)
        }
      }
    } catch (error) {
      console.log("Unable to recover pending group events", error)
    } finally {
      running = false
    }
  }
  timers.set(recover, 5 * 60 * 1000)
  return recover()
}
