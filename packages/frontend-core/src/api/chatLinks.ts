import {
  type ChatIdentityLink,
  type ChatIdentityLinkProvider,
  type ChatIdentityLinkSessionView,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface SlackChannel {
  id: string
  name: string
}

export interface MSTeamsChannel {
  id: string
  name: string
  teamId: string
  teamName: string
}

export interface ChatLinksEndpoints {
  fetchChatIdentityLinks: (
    provider?: ChatIdentityLinkProvider
  ) => Promise<ChatIdentityLink[]>
  fetchChatIdentityLinkSession: (
    instance: string,
    token: string
  ) => Promise<ChatIdentityLinkSessionView>
  confirmChatIdentityLinkSession: (
    instance: string,
    token: string
  ) => Promise<{ success: boolean }>
  fetchSlackChannels: (agentId: string) => Promise<SlackChannel[]>
  fetchMSTeamsChannels: (agentId: string) => Promise<MSTeamsChannel[]>
}

export const buildChatLinksEndpoints = (
  API: BaseAPIClient
): ChatLinksEndpoints => ({
  fetchChatIdentityLinks: async provider => {
    const query = provider
      ? `?${new URLSearchParams({ provider }).toString()}`
      : ""
    return await API.get({ url: `/api/chat-links${query}` })
  },
  fetchChatIdentityLinkSession: async (instance, token) => {
    return await API.get({
      url: `/api/chat-links/${instance}/${token}`,
    })
  },
  confirmChatIdentityLinkSession: async (instance, token) => {
    return await API.post({
      url: `/api/chat-links/${instance}/${token}/confirm`,
    })
  },
  fetchSlackChannels: async agentId => {
    const query = new URLSearchParams({ agentId }).toString()
    return await API.get({ url: `/api/slack-channels?${query}` })
  },
  fetchMSTeamsChannels: async agentId => {
    const query = new URLSearchParams({ agentId }).toString()
    return await API.get({ url: `/api/teams-channels?${query}` })
  },
})
