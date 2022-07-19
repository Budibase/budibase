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
  emails: string[]
  count: number
  groupId: string
}

export interface GroupUsersDeletedEvent extends BaseEvent {
  emails: string[]
  count: number
  groupId: string
}

export interface GroupsAddedOnboarding extends BaseEvent {
  groupId: string
  onboarding: boolean
}
