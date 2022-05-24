export type LoginSource = "local" | "google" | "oidc"
export type SSOType = "oidc" | "google"

export interface LoginEvent {
  source: LoginSource
}

export interface LogoutEvent {}

export interface SSOCreatedEvent {}

export interface SSOUpdatedEvent {}

export interface SSOActivatedEvent {}

export interface SSODeactivatedEvent {}
