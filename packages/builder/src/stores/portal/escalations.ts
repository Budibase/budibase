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
const MAX_CONTEXT_ATTEMPTS = 3

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
  reviewContextAttempts?: number
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

  // The review context never changes once the escalation exists, so it's only
  // fetched until it lands. Failures are retried a bounded number of times so
  // a permanent error doesn't refetch and warn on every poll.
  private async fetchContext({
    escalationId,
    entry,
    signal,
  }: {
    escalationId: string
    entry: EscalationEntry | undefined
    signal: AbortSignal
  }): Promise<Partial<EscalationEntry> | undefined> {
    const attempts = entry?.reviewContextAttempts ?? 0
    if (entry?.reviewContextLoaded || attempts >= MAX_CONTEXT_ATTEMPTS) {
      return undefined
    }
    try {
      const details = await API.fetchEscalationContext(escalationId, signal)
      return { ...details, reviewContextLoaded: true }
    } catch (error) {
      if (signal.aborted) {
        return undefined
      }
      const reviewContextAttempts = attempts + 1
      console.warn("Escalation context fetch failed", {
        escalationId,
        attempt: reviewContextAttempts,
        givingUp: reviewContextAttempts >= MAX_CONTEXT_ATTEMPTS,
        error,
      })
      return { reviewContextAttempts }
    }
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
      // Each escalation resolves to its own outcome so a single failing
      // request never discards updates fetched alongside it.
      const outcomes = await Promise.all(
        ids.map(async escalationId => {
          const context = await this.fetchContext({
            escalationId,
            entry: currentEscalations[escalationId],
            signal,
          })
          try {
            const result = await API.fetchEscalationResult(escalationId, signal)
            return {
              escalationId,
              updates: { ...context, ...result },
              failed: false,
            }
          } catch (error) {
            if (!signal.aborted) {
              console.warn("Escalation poll failed", { escalationId, error })
            }
            return { escalationId, updates: context, failed: true }
          }
        })
      )
      if (signal.aborted) {
        return
      }
      this.update(state => {
        const escalations = { ...state.escalations }
        for (const { escalationId, updates } of outcomes) {
          if (!updates || !escalations[escalationId]) {
            continue
          }
          escalations[escalationId] = {
            ...escalations[escalationId],
            ...updates,
            escalationId,
          }
        }
        return { escalations }
      })
      if (outcomes.some(outcome => outcome.failed)) {
        this.consecutiveFailures++
        if (this.consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
          this.stop()
        }
      } else {
        this.consecutiveFailures = 0
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
