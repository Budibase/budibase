export type LoginSource = "local" | "google" | "oidc" | "google-internal"
export type SSOType = "oidc" | "google"

export interface LoginEvent {
  userId: string
  source: LoginSource
}

export interface LogoutEvent {
  userId: string
}

export interface SSOCreatedEvent {
  type: SSOType
}

export interface SSOUpdatedEvent {
  type: SSOType
}

export interface SSOActivatedEvent {
  type: SSOType
}

export interface SSODeactivatedEvent {
  type: SSOType
}
