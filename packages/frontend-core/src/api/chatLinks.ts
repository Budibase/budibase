import {
  type ChatIdentityLink,
  type ChatIdentityLinkProvider,
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

// Cursor is an opaque provider token - callers only act on hasNext and echo
// the cursor back verbatim.
export interface PagedChannels<T> {
  channels: T[]
  hasNext: boolean
  cursor?: string
}

export interface ChatLinksEndpoints {
  fetchChatIdentityLinks: (
    provider: ChatIdentityLinkProvider,
    agentId: string
  ) => Promise<ChatIdentityLink[]>
  fetchSlackChannels: (
    agentId: string,
    cursor?: string
  ) => Promise<PagedChannels<SlackChannel>>
  fetchMSTeamsChannels: (
    agentId: string,
    cursor?: string
  ) => Promise<PagedChannels<MSTeamsChannel>>
}

export const buildChatLinksEndpoints = (
  API: BaseAPIClient
): ChatLinksEndpoints => ({
  fetchChatIdentityLinks: async (provider, agentId) => {
    const query = new URLSearchParams({ provider, agentId }).toString()
    return await API.get({ url: `/api/chat-links?${query}` })
  },
  fetchSlackChannels: async (agentId, cursor) => {
    const query = new URLSearchParams({
      agentId,
      ...(cursor ? { cursor } : {}),
    }).toString()
    return await API.get({ url: `/api/slack-channels?${query}` })
  },
  fetchMSTeamsChannels: async (agentId, cursor) => {
    const query = new URLSearchParams({
      agentId,
      ...(cursor ? { cursor } : {}),
    }).toString()
    return await API.get({ url: `/api/teams-channels?${query}` })
  },
})
