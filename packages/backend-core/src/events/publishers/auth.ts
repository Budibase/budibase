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

export async function login(source: LoginSource) {
  const properties: LoginEvent = {
    source,
  }
  await publishEvent(Event.AUTH_LOGIN, properties)
}

export async function logout() {
  const properties: LogoutEvent = {}
  await publishEvent(Event.AUTH_LOGOUT, properties)
}

export async function SSOCreated(type: SSOType, timestamp?: string | number) {
  const properties: SSOCreatedEvent = {
    type,
  }
  await publishEvent(Event.AUTH_SSO_CREATED, properties, timestamp)
}

export async function SSOUpdated(type: SSOType) {
  const properties: SSOUpdatedEvent = {
    type,
  }
  await publishEvent(Event.AUTH_SSO_UPDATED, properties)
}

export async function SSOActivated(type: SSOType, timestamp?: string | number) {
  const properties: SSOActivatedEvent = {
    type,
  }
  await publishEvent(Event.AUTH_SSO_ACTIVATED, properties, timestamp)
}

export async function SSODeactivated(type: SSOType) {
  const properties: SSODeactivatedEvent = {
    type,
  }
  await publishEvent(Event.AUTH_SSO_DEACTIVATED, properties)
}
