import { BaseEvent } from "./event"

export interface UserCreatedEvent extends BaseEvent {
  userId: string
  viaScim?: boolean
  audited: {
    email: string
  }
}

export interface UserUpdatedEvent extends BaseEvent {
  userId: string
  viaScim?: boolean
  audited: {
    email: string
  }
}

export interface UserDeletedEvent extends BaseEvent {
  userId: string
  viaScim?: boolean
  audited: {
    email: string
  }
}

export interface UserOnboardingEvent extends BaseEvent {
  userId: string
  step?: string
  audited: {
    email: string
  }
}

export interface UserPermissionAssignedEvent extends BaseEvent {
  userId: string
  audited: {
    email: string
  }
}

export interface UserPermissionRemovedEvent extends BaseEvent {
  userId: string
  audited: {
    email: string
  }
}

export interface UserInvitedEvent extends BaseEvent {
  audited: {
    email: string
  }
}

export interface UserInviteAcceptedEvent extends BaseEvent {
  userId: string
  audited: {
    email: string
  }
}

export interface UserPasswordForceResetEvent extends BaseEvent {
  userId: string
  audited: {
    email: string
  }
}

export interface UserPasswordUpdatedEvent extends BaseEvent {
  userId: string
  audited: {
    email: string
  }
}

export interface UserPasswordResetRequestedEvent extends BaseEvent {
  userId: string
  audited: {
    email: string
  }
}

export interface UserPasswordResetEvent extends BaseEvent {
  userId: string
  audited: {
    email: string
  }
}

export interface UserDataCollaborationEvent extends BaseEvent {
  users: number
}
