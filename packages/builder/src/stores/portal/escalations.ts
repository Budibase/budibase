import { get } from "svelte/store"
import { API } from "@/api"
import {
  type Agent,
  type EscalationReviewContext,
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
      EscalationNotificationChannel.MSTEAMS,
      agent?.MSTeamsIntegration?.messagingEndpointUrl,
    ],
  ]
  return channels.filter(([, url]) => url?.trim()).map(([provider]) => provider)
}

export interface EscalationEntry extends EscalationResult {
  escalationId: string
  reviewContext?: EscalationReviewContext
  reviewContextLoaded?: boolean
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
  private abortController = new AbortController()

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
    this.tick().catch(() => {})
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

  // Scopes the map to the current conversation; called on chat reset. Aborts
  // any in-flight poll so its results never land in the new conversation.
  reset() {
    this.abortController.abort()
    this.abortController = new AbortController()
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
    const { signal } = this.abortController
    const ids = this.pendingIds()
    if (!ids.length) {
      this.stop()
      return
    }
    this.inFlight = true
    try {
      const currentEscalations = get(this.store).escalations
      const results = await Promise.all(
        ids.map(async escalationId => {
          const context = currentEscalations[escalationId].reviewContextLoaded
            ? undefined
            : await API.fetchEscalationContext(escalationId, signal)
                .then(reviewContext => ({
                  ...reviewContext,
                  reviewContextLoaded: true,
                }))
                .catch(error => {
                  if (!signal.aborted) {
                    console.warn("Escalation context fetch failed", error)
                  }
                  return undefined
                })
          return {
            escalationId,
            context,
            result: await API.fetchEscalationResult(escalationId, signal),
          }
        })
      )
      if (signal.aborted) {
        return
      }
      this.update(state => {
        const escalations = { ...state.escalations }
        for (const { escalationId, context, result } of results) {
          escalations[escalationId] = {
            ...escalations[escalationId],
            escalationId,
            ...context,
            ...result,
          }
        }
        return { escalations }
      })
      this.consecutiveFailures = 0
    } catch (error) {
      if (signal.aborted) {
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
