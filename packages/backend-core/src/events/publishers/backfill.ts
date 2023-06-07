import { publishEvent } from "../events"
import {
  Event,
  AppBackfillSucceededEvent,
  AppBackfillFailedEvent,
  TenantBackfillSucceededEvent,
  TenantBackfillFailedEvent,
  InstallationBackfillSucceededEvent,
  InstallationBackfillFailedEvent,
} from "@budibase/types"
import env from "../../environment"

const shouldSkip = !env.SELF_HOSTED && !env.isDev()

async function appSucceeded(properties: AppBackfillSucceededEvent) {
  if (shouldSkip) {
    return
  }
  await publishEvent(Event.APP_BACKFILL_SUCCEEDED, properties)
}

async function appFailed(error: any) {
  if (shouldSkip) {
    return
  }
  const properties: AppBackfillFailedEvent = {
    error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
  }
  await publishEvent(Event.APP_BACKFILL_FAILED, properties)
}

async function tenantSucceeded(properties: TenantBackfillSucceededEvent) {
  if (shouldSkip) {
    return
  }
  await publishEvent(Event.TENANT_BACKFILL_SUCCEEDED, properties)
}

async function tenantFailed(error: any) {
  if (shouldSkip) {
    return
  }
  const properties: TenantBackfillFailedEvent = {
    error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
  }
  await publishEvent(Event.TENANT_BACKFILL_FAILED, properties)
}

async function installationSucceeded() {
  if (shouldSkip) {
    return
  }
  const properties: InstallationBackfillSucceededEvent = {}
  await publishEvent(Event.INSTALLATION_BACKFILL_SUCCEEDED, properties)
}

async function installationFailed(error: any) {
  if (shouldSkip) {
    return
  }
  const properties: InstallationBackfillFailedEvent = {
    error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
  }
  await publishEvent(Event.INSTALLATION_BACKFILL_FAILED, properties)
}

export default {
  appSucceeded,
  appFailed,
  tenantSucceeded,
  tenantFailed,
  installationSucceeded,
  installationFailed,
}
