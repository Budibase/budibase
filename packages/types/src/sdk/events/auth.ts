import { BaseEvent } from "./event"
import { ConfigType } from "../../documents"

export type LoginSource = "local" | "google" | "oidc" | "google-internal"
export type SSOType = ConfigType.OIDC | ConfigType.GOOGLE

export interface LoginEvent extends BaseEvent {
  userId: string
  source: LoginSource
}

export interface LogoutEvent extends BaseEvent {
  userId: string
}

export interface SSOCreatedEvent extends BaseEvent {
  type: SSOType
}

export interface SSOUpdatedEvent extends BaseEvent {
  type: SSOType
}

export interface SSOActivatedEvent extends BaseEvent {
  type: SSOType
}

export interface SSODeactivatedEvent extends BaseEvent {
  type: SSOType
}
