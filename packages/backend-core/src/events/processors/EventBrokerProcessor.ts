import { Event, GetLicenseKeyFn, Identity } from "@budibase/types"
import { EventProcessor } from "./types"
import API from "../../accounts/api"
import env from "../../environment"
import { Header } from "../../constants"
import * as context from "../../context"
import { v4 as uuidv4 } from "uuid"

const api = new API(env.INTERNAL_ACCOUNT_PORTAL_URL)

export default class EventBrokerProcessor implements EventProcessor {
  private static getLicenseKeyFn: GetLicenseKeyFn | undefined

  static init(getLicenseKeyFn: GetLicenseKeyFn) {
    EventBrokerProcessor.getLicenseKeyFn = getLicenseKeyFn
  }

  async processEvent(
    event: Event,
    identity: Identity,
    properties: Record<string, unknown>,
    timestamp?: string | number
  ): Promise<void> {
    if (env.DISABLE_ACCOUNT_PORTAL) {
      return
    }

    let headers: Record<string, string>
    if (env.SELF_HOSTED) {
      if (!EventBrokerProcessor.getLicenseKeyFn) {
        return
      }
      const licenseKey = await EventBrokerProcessor.getLicenseKeyFn()
      if (!licenseKey) {
        return
      }
      headers = { [Header.LICENSE_KEY]: licenseKey }
    } else {
      headers = { [Header.API_KEY]: env.ACCOUNT_PORTAL_API_KEY }
      if (identity.tenantId) {
        headers[Header.TENANT_ID] = identity.tenantId
      }
    }

    const appId = context.getWorkspaceId()

    const payload: {
      id: string
      type: Event
      identity: Identity
      properties: Record<string, unknown>
      timestamp: number
    } = {
      id: uuidv4(),
      type: event,
      identity,
      properties: {
        ...properties,
        version: env.VERSION,
        service: env.SERVICE,
        environment: identity.environment,
        hosting: identity.hosting,
        ...(appId && { appId }),
        ...(identity.installationId && {
          installationId: identity.installationId,
        }),
        ...(identity.tenantId && { tenantId: identity.tenantId }),
      },
      timestamp:
        timestamp === undefined ? Date.now() : new Date(timestamp).getTime(),
    }

    try {
      const response = await api.post("/api/v2/analytics/event", {
        headers,
        body: payload,
      })

      if (!response.ok) {
        console.warn(
          `[EventBrokerProcessor] unexpected response status: ${response.status}`
        )
      }
    } catch (err) {
      console.error(`[EventBrokerProcessor] failed to send event: ${err}`)
    }
  }
}
