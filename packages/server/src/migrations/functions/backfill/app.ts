import * as automations from "./app/automations"
import * as datasources from "./app/datasources"
import * as layouts from "./app/layouts"
import * as queries from "./app/queries"
import * as roles from "./app/roles"
import * as tables from "./app/tables"
import * as screens from "./app/screens"
import * as global from "./global"
import { App, AppBackfillSucceededEvent, Event } from "@budibase/types"
import { db as dbUtils, events } from "@budibase/backend-core"
import env from "../../../environment"
import { DEFAULT_TIMESTAMP } from "."

const failGraceful = env.SELF_HOSTED && !env.isDev()

const handleError = (e: any, errors?: any) => {
  if (failGraceful) {
    if (errors) {
      errors.push(e)
    }
    return
  }
  console.trace(e)
  throw e
}

const EVENTS = [
  Event.AUTOMATION_CREATED,
  Event.AUTOMATION_STEP_CREATED,
  Event.DATASOURCE_CREATED,
  Event.LAYOUT_CREATED,
  Event.QUERY_CREATED,
  Event.ROLE_CREATED,
  Event.SCREEN_CREATED,
  Event.TABLE_CREATED,
  Event.VIEW_CREATED,
  Event.VIEW_CALCULATION_CREATED,
  Event.VIEW_FILTER_CREATED,
  Event.APP_PUBLISHED,
  Event.APP_CREATED,
]

/**
 * Date:
 * May 2022
 *
 * Description:
 * Backfill app events.
 */

export const run = async (appDb: any) => {
  try {
    if (await global.isComplete()) {
      // make sure new apps aren't backfilled
      // return if the global migration for this tenant is complete
      // which runs after the app migrations
      return
    }

    // tell the event pipeline to start caching
    // events for this tenant
    await events.backfillCache.start(EVENTS)

    let timestamp: string | number = DEFAULT_TIMESTAMP
    const app: App = await appDb.get(dbUtils.DocumentType.APP_METADATA)
    if (app.createdAt) {
      timestamp = app.createdAt as string
    }

    if (dbUtils.isProdAppID(app.appId)) {
      await events.app.published(app, timestamp)
    }

    const totals: any = {}
    const errors: any = []

    if (dbUtils.isDevAppID(app.appId)) {
      await events.app.created(app, timestamp)
      try {
        totals.automations = await automations.backfill(appDb, timestamp)
      } catch (e) {
        handleError(e, errors)
      }

      try {
        totals.datasources = await datasources.backfill(appDb, timestamp)
      } catch (e) {
        handleError(e, errors)
      }

      try {
        totals.layouts = await layouts.backfill(appDb, timestamp)
      } catch (e) {
        handleError(e, errors)
      }

      try {
        totals.queries = await queries.backfill(appDb, timestamp)
      } catch (e) {
        handleError(e, errors)
      }

      try {
        totals.roles = await roles.backfill(appDb, timestamp)
      } catch (e) {
        handleError(e, errors)
      }

      try {
        totals.screens = await screens.backfill(appDb, timestamp)
      } catch (e) {
        handleError(e, errors)
      }

      try {
        totals.tables = await tables.backfill(appDb, timestamp)
      } catch (e) {
        handleError(e, errors)
      }
    }

    const properties: AppBackfillSucceededEvent = {
      appId: app.appId,
      automations: totals.automations,
      datasources: totals.datasources,
      layouts: totals.layouts,
      queries: totals.queries,
      roles: totals.roles,
      tables: totals.tables,
      screens: totals.screens,
    }

    if (errors.length) {
      properties.errors = errors.map((e: any) =>
        JSON.stringify(e, Object.getOwnPropertyNames(e))
      )
      properties.errorCount = errors.length
    } else {
      properties.errorCount = 0
    }

    await events.backfill.appSucceeded(properties)
    // tell the event pipeline to stop caching events for this tenant
    await events.backfillCache.end()
  } catch (e) {
    handleError(e)
    await events.backfill.appFailed(e)
  }
}
