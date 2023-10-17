import { Event } from "@budibase/types"
import { CacheKey, TTL } from "../../../cache/generic"
import * as cache from "../../../cache/generic"
import * as context from "../../../context"

type RateLimitedEvent =
  | Event.SERVED_BUILDER
  | Event.SERVED_APP_PREVIEW
  | Event.SERVED_APP

const isRateLimited = (event: Event): event is RateLimitedEvent => {
  return (
    event === Event.SERVED_BUILDER ||
    event === Event.SERVED_APP_PREVIEW ||
    event === Event.SERVED_APP
  )
}

const isPerApp = (event: RateLimitedEvent) => {
  return event === Event.SERVED_APP_PREVIEW || event === Event.SERVED_APP
}

interface EventProperties {
  timestamp: number
}

enum RateLimit {
  CALENDAR_DAY = "calendarDay",
}

const RATE_LIMITS = {
  [Event.SERVED_APP]: RateLimit.CALENDAR_DAY,
  [Event.SERVED_APP_PREVIEW]: RateLimit.CALENDAR_DAY,
  [Event.SERVED_BUILDER]: RateLimit.CALENDAR_DAY,
}

/**
 * Check if this event should be sent right now
 * Return false to signal the event SHOULD be sent
 * Return true to signal the event should NOT be sent
 */
export const limited = async (event: Event): Promise<boolean> => {
  // not a rate limited event -- send
  if (!isRateLimited(event)) {
    return false
  }

  const cachedEvent = await readEvent(event)
  if (cachedEvent) {
    const timestamp = new Date(cachedEvent.timestamp)
    const limit = RATE_LIMITS[event]
    switch (limit) {
      case RateLimit.CALENDAR_DAY: {
        // get midnight at the start of the next day for the timestamp
        timestamp.setDate(timestamp.getDate() + 1)
        timestamp.setHours(0, 0, 0, 0)

        // if we have passed the threshold into the next day
        if (Date.now() > timestamp.getTime()) {
          // update the timestamp in the event -- send
          await recordEvent(event, { timestamp: Date.now() })
          return false
        } else {
          // still within the limited period -- don't send
          return true
        }
      }
    }
  } else {
    // no event present i.e. expired -- send
    await recordEvent(event, { timestamp: Date.now() })
    return false
  }
}

const eventKey = (event: RateLimitedEvent) => {
  let key = `${CacheKey.EVENTS_RATE_LIMIT}:${event}`
  if (isPerApp(event)) {
    key = key + ":" + context.getAppId()
  }
  return key
}

const readEvent = async (
  event: RateLimitedEvent
): Promise<EventProperties | undefined> => {
  const key = eventKey(event)
  const result = await cache.get(key)
  return result as EventProperties
}

const recordEvent = async (
  event: RateLimitedEvent,
  properties: EventProperties
) => {
  const key = eventKey(event)
  const limit = RATE_LIMITS[event]
  let ttl
  switch (limit) {
    case RateLimit.CALENDAR_DAY: {
      ttl = TTL.ONE_DAY
    }
  }

  await cache.store(key, properties, ttl)
}
