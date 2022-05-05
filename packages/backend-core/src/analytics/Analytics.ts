import PosthogClient from "./PosthogClient"
import env from "../environment"
import { getTenantId } from "../context"
import { Account, Hosting, Event, IdentityType } from "@budibase/types"

class Analytics {
  isEnabled: boolean
  posthog: PosthogClient | undefined

  constructor() {
    // check enabled before init
    this.isEnabled = !!env.ENABLE_ANALYTICS // TODO: use db flag instead
    if (!this.isEnabled) return
    this.posthog = new PosthogClient(env.POSTHOG_TOKEN)
  }

  enabled() {
    return this.isEnabled
  }

  identify(type: IdentityType, id: string, hosting?: Hosting) {
    if (!this.isEnabled) return
    const tenantId = getTenantId()
    if (!hosting) {
      hosting = env.SELF_HOSTED ? Hosting.SELF : Hosting.CLOUD
    }
    const properties = {
      type,
      hosting,
      tenantId,
    }
    this.posthog!.identify(id, properties)
  }

  identifyUser(userId: string) {
    this.identify(IdentityType.USER, userId)
  }

  identifyTenant() {
    let distinctId
    if (env.SELF_HOSTED) {
      distinctId = getTenantId() // TODO: Get installation ID
    } else {
      distinctId = getTenantId()
    }
    this.identify(IdentityType.TENANT, distinctId)
  }

  identifyAccount(account: Account) {
    const distinctId = account.accountId
    const hosting = account.hosting
    this.identify(IdentityType.ACCOUNT, distinctId, hosting)
  }

  captureEvent(event: Event, properties: any) {
    if (!this.isEnabled) return
    // TODO: get the user id from context
    const userId = "TESTING_USER_ID"
    this.posthog!.capture(userId, event, properties)
  }

  shutdown() {
    if (!this.isEnabled) return
    this.posthog!.shutdown()
  }
}

export default Analytics
