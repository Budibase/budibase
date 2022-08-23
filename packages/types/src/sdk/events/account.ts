import { BaseEvent } from "./event"

export interface AccountCreatedEvent extends BaseEvent {
  tenantId: string
  registrationStep?: string
}

export interface AccountDeletedEvent extends BaseEvent {
  tenantId: string
  registrationStep?: string
}

export interface AccountVerifiedEvent extends BaseEvent {
  tenantId: string
}
