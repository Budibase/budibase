import { BaseEvent } from "./event"

export interface GroupCreatedEvent extends BaseEvent {
  groupId: string
}

export interface GroupUpdatedEvent extends BaseEvent {
  groupId: string
}

export interface GroupDeletedEvent extends BaseEvent {
  groupId: string
}

export interface GroupUsersAddedEvent extends BaseEvent {
  count: number
  groupId: string
}

export interface GroupUsersDeletedEvent extends BaseEvent {
  count: number
  groupId: string
}

export interface GroupAddedOnboardingEvent extends BaseEvent {
  groupId: string
  onboarding: boolean
}
