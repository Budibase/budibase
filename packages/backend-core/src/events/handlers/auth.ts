import { processEvent } from "../events"
import {
  Events,
  LoginEvent,
  LoginSource,
  LogoutEvent,
  SSOActivatedEvent,
  SSOCreatedEvent,
  SSODeactivatedEvent,
  SSOType,
  SSOUpdatedEvent,
} from "@budibase/types"

export function login(source: LoginSource) {
  const properties: LoginEvent = {
    source,
  }
  processEvent(Events.AUTH_LOGIN, properties)
}

export function logout() {
  const properties: LogoutEvent = {}
  processEvent(Events.AUTH_LOGOUT, properties)
}

export function SSOCreated(type: SSOType) {
  const properties: SSOCreatedEvent = {
    type,
  }
  processEvent(Events.AUTH_SSO_CREATED, properties)
}

export function SSOUpdated(type: SSOType) {
  const properties: SSOUpdatedEvent = {
    type,
  }
  processEvent(Events.AUTH_SSO_UPDATED, properties)
}

export function SSOActivated(type: SSOType) {
  const properties: SSOActivatedEvent = {
    type,
  }
  processEvent(Events.AUTH_SSO_ACTIVATED, properties)
}

export function SSODeactivated(type: SSOType) {
  const properties: SSODeactivatedEvent = {
    type,
  }
  processEvent(Events.AUTH_SSO_DEACTIVATED, properties)
}
