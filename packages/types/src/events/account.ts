export interface AccountCreatedEvent {
  tenantId: string
  registrationStep?: string
}

export interface AccountDeletedEvent {
  tenantId: string
  registrationStep?: string
}

export interface AccountVerifiedEvent {
  tenantId: string
}
