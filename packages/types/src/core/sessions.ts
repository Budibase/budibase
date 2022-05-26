import { User, Account } from "../documents"
import { Hosting } from "./hosting"

/**
 * Account portal user session. Used for self hosted accounts only.
 */
export interface AccountUserSession {
  _id: string
  email: string
  tenantId: string
  accountPortalAccess: boolean
  account: Account
}

/**
 * Budibase user session.
 */
export interface BudibaseUserSession extends User {
  _id: string // overwrite potentially undefined
  account?: Account
  accountPortalAccess?: boolean
}

export const isAccountSession = (
  user: AccountUserSession | BudibaseUserSession
): user is AccountUserSession => {
  return user.account?.hosting === Hosting.SELF
}

export const isUserSession = (
  user: AccountUserSession | BudibaseUserSession
): user is BudibaseUserSession => {
  return !user.account || user.account?.hosting === Hosting.CLOUD
}

// not technically a session, but used to identify the installation
export interface InstallationSession {
  _id: string
  isInstallation: boolean
}

export const isInstallation = (user: any): user is InstallationSession => {
  return !!user.isInstallation
}

export type SessionUser =
  | AccountUserSession
  | BudibaseUserSession
  | InstallationSession
