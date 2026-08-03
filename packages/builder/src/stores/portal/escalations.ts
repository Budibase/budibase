import { get } from "svelte/store"
import { API } from "@/api"
import {
  type Agent,
  type EscalationResponse,
  type EscalationResult,
  EscalationNotificationChannel,
} from "@budibase/types"
import { BudiStore } from "../BudiStore"

const POLL_INTERVAL_MS = 5000
const MAX_CONSECUTIVE_FAILURES = 3

// Providers with an enabled deployment on the agent. Enabled = endpoint URL
// present
export const configuredEscalationProviders = (
  agent: Agent | undefined
): EscalationNotificationChannel[] => {
  const channels: [EscalationNotificationChannel, string | undefined][] = [
    [
      EscalationNotificationChannel.SLACK,
      agent?.slackIntegration?.messagingEndpointUrl,
    ],
    [
      EscalationNotificationChannel.DISCORD,
      agent?.discordIntegration?.interactionsEndpointUrl,
    ],
    [
      EscalationNotificationChannel.MSTEAMS,
      agent?.MSTeamsIntegration?.messagingEndpointUrl,
    ],
    [
      EscalationNotificationChannel.TELEGRAM,
      agent?.telegramIntegration?.messagingEndpointUrl,
    ],
  ]
  return channels.filter(([, url]) => url?.trim()).map(([provider]) => provider)
}

export interface EscalationEntry extends EscalationResult {
  escalationId: string
}

interface EscalationsState {
  escalations: Record<string, EscalationEntry>
}

// Polls the escalation result endpoint for tracked escalations until each
// resolves with a resumeResult. Mirrors operationKnowledgePolling.
export class EscalationsStore extends BudiStore<EscalationsState> {
  private interval: ReturnType<typeof setInterval> | undefined
  private inFlight = false
  private consecutiveFailures = 0
  private generation = 0

  constructor() {
    super({ escalations: {} })
  }

  track(escalationId: string) {
    if (get(this.store).escalations[escalationId]) {
      return
    }
    this.update(state => ({
      escalations: {
        ...state.escalations,
        [escalationId]: { escalationId, resolution: "pending" },
      },
    }))
    this.ensurePolling()
  }

  async resolve(escalationId: string, response: EscalationResponse) {
    return await API.resolveEscalation(escalationId, response)
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = undefined
    }
  }

  // Scopes the map to the current conversation; called on chat reset.
  reset() {
    this.generation++
    this.stop()
    this.set({ escalations: {} })
  }

  // resolution flips to "resolved" before resumeResult is persisted, so poll on
  // the result, not resolution. Cancelled escalations never produce one.
  private pendingIds(): string[] {
    return Object.values(get(this.store).escalations)
      .filter(entry => !entry.resumeResult && entry.resolution !== "cancelled")
      .map(entry => entry.escalationId)
  }

  private ensurePolling() {
    if (this.interval) {
      return
    }
    this.consecutiveFailures = 0
    this.interval = setInterval(() => {
      this.tick().catch(() => {})
    }, POLL_INTERVAL_MS)
  }

  private async tick() {
    if (this.inFlight) {
      return
    }
    const generation = this.generation
    const ids = this.pendingIds()
    if (!ids.length) {
      this.stop()
      return
    }
    this.inFlight = true
    try {
      const results = await Promise.all(
        ids.map(async escalationId => ({
          escalationId,
          result: await API.fetchEscalationResult(escalationId),
        }))
      )
      if (generation !== this.generation) {
        return
      }
      this.update(state => {
        const escalations = { ...state.escalations }
        for (const { escalationId, result } of results) {
          escalations[escalationId] = { escalationId, ...result }
        }
        return { escalations }
      })
      this.consecutiveFailures = 0
    } catch (error) {
      if (generation !== this.generation) {
        return
      }
      this.consecutiveFailures++
      console.warn("Escalation poll failed", error)
      if (this.consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
        this.stop()
      }
    } finally {
      this.inFlight = false
      if (!this.pendingIds().length) {
        this.stop()
      }
    }
  }
}

export const escalationsStore = new EscalationsStore()
