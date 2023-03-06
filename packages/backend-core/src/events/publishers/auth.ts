import { publishEvent } from "../events"
import {
  Event,
  LoginEvent,
  LoginSource,
  LogoutEvent,
  SSOActivatedEvent,
  SSOCreatedEvent,
  SSODeactivatedEvent,
  SSOType,
  SSOUpdatedEvent,
} from "@budibase/types"
import { identification } from ".."

async function login(source: LoginSource, email: string) {
  const identity = await identification.getCurrentIdentity()
  const properties: LoginEvent = {
    userId: identity.id,
    source,
    audited: {
      email,
    },
  }
  await publishEvent(Event.AUTH_LOGIN, properties)
}

async function logout(email?: string) {
  const identity = await identification.getCurrentIdentity()
  const properties: LogoutEvent = {
    userId: identity.id,
    audited: {
      email,
    },
  }
  await publishEvent(Event.AUTH_LOGOUT, properties)
}

async function SSOCreated(type: SSOType, timestamp?: string | number) {
  const properties: SSOCreatedEvent = {
    type,
  }
  await publishEvent(Event.AUTH_SSO_CREATED, properties, timestamp)
}

async function SSOUpdated(type: SSOType) {
  const properties: SSOUpdatedEvent = {
    type,
  }
  await publishEvent(Event.AUTH_SSO_UPDATED, properties)
}

async function SSOActivated(type: SSOType, timestamp?: string | number) {
  const properties: SSOActivatedEvent = {
    type,
  }
  await publishEvent(Event.AUTH_SSO_ACTIVATED, properties, timestamp)
}

async function SSODeactivated(type: SSOType) {
  const properties: SSODeactivatedEvent = {
    type,
  }
  await publishEvent(Event.AUTH_SSO_DEACTIVATED, properties)
}

export default {
  login,
  logout,
  SSOCreated,
  SSOUpdated,
  SSOActivated,
  SSODeactivated,
}
