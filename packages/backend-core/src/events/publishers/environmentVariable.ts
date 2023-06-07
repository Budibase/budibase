import {
  Event,
  EnvironmentVariableCreatedEvent,
  EnvironmentVariableDeletedEvent,
  EnvironmentVariableUpgradePanelOpenedEvent,
} from "@budibase/types"
import { publishEvent } from "../events"

async function created(name: string, environments: string[]) {
  const properties: EnvironmentVariableCreatedEvent = {
    name,
    environments,
  }
  await publishEvent(Event.ENVIRONMENT_VARIABLE_CREATED, properties)
}

async function deleted(name: string) {
  const properties: EnvironmentVariableDeletedEvent = {
    name,
  }
  await publishEvent(Event.ENVIRONMENT_VARIABLE_DELETED, properties)
}

async function upgradePanelOpened(userId: string) {
  const properties: EnvironmentVariableUpgradePanelOpenedEvent = {
    userId,
  }
  await publishEvent(
    Event.ENVIRONMENT_VARIABLE_UPGRADE_PANEL_OPENED,
    properties
  )
}

export default {
  created,
  deleted,
  upgradePanelOpened,
}
