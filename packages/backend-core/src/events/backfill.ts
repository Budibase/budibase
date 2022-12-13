import {
  Event,
  BackfillMetadata,
  CachedEvent,
  SSOCreatedEvent,
  AutomationCreatedEvent,
  AutomationStepCreatedEvent,
  DatasourceCreatedEvent,
  LayoutCreatedEvent,
  QueryCreatedEvent,
  RoleCreatedEvent,
  ScreenCreatedEvent,
  TableCreatedEvent,
  ViewCreatedEvent,
  ViewCalculationCreatedEvent,
  ViewFilterCreatedEvent,
  AppPublishedEvent,
  UserCreatedEvent,
  RoleAssignedEvent,
  UserPermissionAssignedEvent,
  AppCreatedEvent,
} from "@budibase/types"
import * as context from "../context"
import { CacheKey } from "../cache/generic"
import * as cache from "../cache/generic"

// LIFECYCLE

export const start = async (events: Event[]) => {
  const metadata: BackfillMetadata = {
    eventWhitelist: events,
  }
  return saveBackfillMetadata(metadata)
}

export const recordEvent = async (event: Event, properties: any) => {
  const eventKey = getEventKey(event, properties)
  // don't use a ttl - cleaned up by migration
  // don't use tenancy - already in the key
  await cache.store(eventKey, properties, undefined, { useTenancy: false })
}

export const end = async () => {
  await deleteBackfillMetadata()
  await clearEvents()
}

// CRUD

const getBackfillMetadata = async (): Promise<BackfillMetadata | null> => {
  return cache.get(CacheKey.BACKFILL_METADATA)
}

const saveBackfillMetadata = async (
  backfill: BackfillMetadata
): Promise<void> => {
  // no TTL - deleted by backfill
  return cache.store(CacheKey.BACKFILL_METADATA, backfill)
}

const deleteBackfillMetadata = async (): Promise<void> => {
  await cache.destroy(CacheKey.BACKFILL_METADATA)
}

const clearEvents = async () => {
  // wildcard
  const pattern = getEventKey()
  const keys = await cache.keys(pattern)

  for (const key of keys) {
    // delete each key
    // don't  use tenancy, already in the key
    await cache.destroy(key, { useTenancy: false })
  }
}

// HELPERS

export const isBackfillingEvent = async (event: Event) => {
  const backfill = await getBackfillMetadata()
  const events = backfill?.eventWhitelist
  if (events && events.includes(event)) {
    return true
  } else {
    return false
  }
}

export const isAlreadySent = async (event: Event, properties: any) => {
  const eventKey = getEventKey(event, properties)
  const cachedEvent: CachedEvent = await cache.get(eventKey, {
    useTenancy: false,
  })
  return !!cachedEvent
}

const CUSTOM_PROPERTY_SUFFIX: any = {
  // APP EVENTS
  [Event.AUTOMATION_CREATED]: (properties: AutomationCreatedEvent) => {
    return properties.automationId
  },
  [Event.AUTOMATION_STEP_CREATED]: (properties: AutomationStepCreatedEvent) => {
    return properties.stepId
  },
  [Event.DATASOURCE_CREATED]: (properties: DatasourceCreatedEvent) => {
    return properties.datasourceId
  },
  [Event.LAYOUT_CREATED]: (properties: LayoutCreatedEvent) => {
    return properties.layoutId
  },
  [Event.QUERY_CREATED]: (properties: QueryCreatedEvent) => {
    return properties.queryId
  },
  [Event.ROLE_CREATED]: (properties: RoleCreatedEvent) => {
    return properties.roleId
  },
  [Event.SCREEN_CREATED]: (properties: ScreenCreatedEvent) => {
    return properties.screenId
  },
  [Event.TABLE_CREATED]: (properties: TableCreatedEvent) => {
    return properties.tableId
  },
  [Event.VIEW_CREATED]: (properties: ViewCreatedEvent) => {
    return properties.tableId // best uniqueness
  },
  [Event.VIEW_CALCULATION_CREATED]: (
    properties: ViewCalculationCreatedEvent
  ) => {
    return properties.tableId // best uniqueness
  },
  [Event.VIEW_FILTER_CREATED]: (properties: ViewFilterCreatedEvent) => {
    return properties.tableId // best uniqueness
  },
  [Event.APP_CREATED]: (properties: AppCreatedEvent) => {
    return properties.appId // best uniqueness
  },
  [Event.APP_PUBLISHED]: (properties: AppPublishedEvent) => {
    return properties.appId // best uniqueness
  },
  // GLOBAL EVENTS
  [Event.AUTH_SSO_CREATED]: (properties: SSOCreatedEvent) => {
    return properties.type
  },
  [Event.AUTH_SSO_ACTIVATED]: (properties: SSOCreatedEvent) => {
    return properties.type
  },
  [Event.USER_CREATED]: (properties: UserCreatedEvent) => {
    return properties.userId
  },
  [Event.USER_PERMISSION_ADMIN_ASSIGNED]: (
    properties: UserPermissionAssignedEvent
  ) => {
    return properties.userId
  },
  [Event.USER_PERMISSION_BUILDER_ASSIGNED]: (
    properties: UserPermissionAssignedEvent
  ) => {
    return properties.userId
  },
  [Event.ROLE_ASSIGNED]: (properties: RoleAssignedEvent) => {
    return `${properties.roleId}-${properties.userId}`
  },
}

const getEventKey = (event?: Event, properties?: any) => {
  let eventKey: string

  const tenantId = context.getTenantId()
  if (event) {
    eventKey = `${CacheKey.EVENTS}:${tenantId}:${event}`

    // use some properties to make the key more unique
    const custom = CUSTOM_PROPERTY_SUFFIX[event]
    const suffix = custom ? custom(properties) : undefined
    if (suffix) {
      eventKey = `${eventKey}:${suffix}`
    }
  } else {
    eventKey = `${CacheKey.EVENTS}:${tenantId}:*`
  }

  return eventKey
}
