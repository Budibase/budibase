import { publishEvent } from "../events"
import {
  Event,
  User,
  UserCreatedEvent,
  UserDataCollaborationEvent,
  UserDeletedEvent,
  UserInviteAcceptedEvent,
  UserInvitedEvent,
  UserPasswordForceResetEvent,
  UserPasswordResetEvent,
  UserPasswordResetRequestedEvent,
  UserPasswordUpdatedEvent,
  UserPermissionAssignedEvent,
  UserPermissionRemovedEvent,
  UserUpdatedEvent,
  UserOnboardingEvent,
} from "@budibase/types"
import { isScim } from "../../context"

async function created(user: User, timestamp?: number) {
  const properties: UserCreatedEvent = {
    userId: user._id as string,
    viaScim: isScim(),
    audited: {
      email: user.email,
    },
  }
  await publishEvent(Event.USER_CREATED, properties, timestamp)
}

async function updated(user: User) {
  const properties: UserUpdatedEvent = {
    userId: user._id as string,
    viaScim: isScim(),
    audited: {
      email: user.email,
    },
  }
  await publishEvent(Event.USER_UPDATED, properties)
}

async function deleted(user: User) {
  const properties: UserDeletedEvent = {
    userId: user._id as string,
    viaScim: isScim(),
    audited: {
      email: user.email,
    },
  }
  await publishEvent(Event.USER_DELETED, properties)
}

export async function onboardingComplete(user: User) {
  const properties: UserOnboardingEvent = {
    userId: user._id as string,
    audited: {
      email: user.email,
    },
  }
  await publishEvent(Event.USER_ONBOARDING_COMPLETE, properties)
}

// PERMISSIONS

async function permissionAdminAssigned(user: User, timestamp?: number) {
  const properties: UserPermissionAssignedEvent = {
    userId: user._id as string,
    audited: {
      email: user.email,
    },
  }
  await publishEvent(
    Event.USER_PERMISSION_ADMIN_ASSIGNED,
    properties,
    timestamp
  )
}

async function permissionAdminRemoved(user: User) {
  const properties: UserPermissionRemovedEvent = {
    userId: user._id as string,
    audited: {
      email: user.email,
    },
  }
  await publishEvent(Event.USER_PERMISSION_ADMIN_REMOVED, properties)
}

async function permissionBuilderAssigned(user: User, timestamp?: number) {
  const properties: UserPermissionAssignedEvent = {
    userId: user._id as string,
    audited: {
      email: user.email,
    },
  }
  await publishEvent(
    Event.USER_PERMISSION_BUILDER_ASSIGNED,
    properties,
    timestamp
  )
}

async function permissionBuilderRemoved(user: User) {
  const properties: UserPermissionRemovedEvent = {
    userId: user._id as string,
    audited: {
      email: user.email,
    },
  }
  await publishEvent(Event.USER_PERMISSION_BUILDER_REMOVED, properties)
}

// INVITE

async function invited(email: string) {
  const properties: UserInvitedEvent = {
    audited: {
      email,
    },
  }
  await publishEvent(Event.USER_INVITED, properties)
}

async function inviteAccepted(user: User) {
  const properties: UserInviteAcceptedEvent = {
    userId: user._id as string,
    audited: {
      email: user.email,
    },
  }
  await publishEvent(Event.USER_INVITED_ACCEPTED, properties)
}

// PASSWORD

async function passwordForceReset(user: User) {
  const properties: UserPasswordForceResetEvent = {
    userId: user._id as string,
    audited: {
      email: user.email,
    },
  }
  await publishEvent(Event.USER_PASSWORD_FORCE_RESET, properties)
}

async function passwordUpdated(user: User) {
  const properties: UserPasswordUpdatedEvent = {
    userId: user._id as string,
    audited: {
      email: user.email,
    },
  }
  await publishEvent(Event.USER_PASSWORD_UPDATED, properties)
}

async function passwordResetRequested(user: User) {
  const properties: UserPasswordResetRequestedEvent = {
    userId: user._id as string,
    audited: {
      email: user.email,
    },
  }
  await publishEvent(Event.USER_PASSWORD_RESET_REQUESTED, properties)
}

async function passwordReset(user: User) {
  const properties: UserPasswordResetEvent = {
    userId: user._id as string,
    audited: {
      email: user.email,
    },
  }
  await publishEvent(Event.USER_PASSWORD_RESET, properties)
}

// COLLABORATION

async function dataCollaboration(users: number) {
  const properties: UserDataCollaborationEvent = {
    users,
  }
  await publishEvent(Event.USER_DATA_COLLABORATION, properties)
}

export default {
  created,
  updated,
  deleted,
  permissionAdminAssigned,
  permissionAdminRemoved,
  permissionBuilderAssigned,
  permissionBuilderRemoved,
  onboardingComplete,
  invited,
  inviteAccepted,
  passwordForceReset,
  passwordUpdated,
  passwordResetRequested,
  passwordReset,
  dataCollaboration,
}
