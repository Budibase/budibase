import type { ChatIdentityLinkProvider } from "../documents"

export interface ChatIdentityLinkSession {
  token: string
  tenantId: string
  workspaceId: string
  provider: ChatIdentityLinkProvider
  externalUserId: string
  externalUserName?: string
  teamId?: string
  guildId?: string
  providerTenantId?: string
  createdAt: string
  expiresAt: string
}

export interface ChatIdentityProviderRedirectInput {
  provider: ChatIdentityLinkProvider
  teamId?: string
}

export interface UpsertChatIdentityLinkInput {
  provider: ChatIdentityLinkProvider
  externalUserId: string
  externalUserName?: string
  teamId?: string
  guildId?: string
  providerTenantId?: string
  globalUserId: string
  linkedBy?: string
}

export interface CreateChatIdentityLinkSessionInput {
  workspaceId: string
  provider: ChatIdentityLinkProvider
  externalUserId: string
  externalUserName?: string
  teamId?: string
  guildId?: string
  providerTenantId?: string
}

export interface ChatIdentityLinkLookupInput {
  provider: ChatIdentityLinkProvider
  externalUserId: string
  teamId?: string
  providerTenantId?: string
}
