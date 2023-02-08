import { BaseEvent } from "./event"

export interface UserCreatedEvent extends BaseEvent {
  userId: string
}

export interface UserUpdatedEvent extends BaseEvent {
  userId: string
}

export interface UserDeletedEvent extends BaseEvent {
  userId: string
}

export interface UserOnboardingEvent extends BaseEvent {
  userId: string
  step?: string
}

export interface UserPermissionAssignedEvent extends BaseEvent {
  userId: string
}

export interface UserPermissionRemovedEvent extends BaseEvent {
  userId: string
}

export interface UserInvitedEvent extends BaseEvent {}

export interface UserInviteAcceptedEvent extends BaseEvent {
  userId: string
}

export interface UserPasswordForceResetEvent extends BaseEvent {
  userId: string
}

export interface UserPasswordUpdatedEvent extends BaseEvent {
  userId: string
}

export interface UserPasswordResetRequestedEvent extends BaseEvent {
  userId: string
}

export interface UserPasswordResetEvent extends BaseEvent {
  userId: string
}
