import { BaseEvent } from "./event"

export interface EnvironmentVariableCreatedEvent extends BaseEvent {
  name: string
  environments: string[]
}

export interface EnvironmentVariableDeletedEvent extends BaseEvent {
  name: string
}

export interface EnvironmentVariableUpgradePanelOpenedEvent extends BaseEvent {
  userId: string
}
