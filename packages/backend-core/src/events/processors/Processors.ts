import { Event } from "@budibase/types"
import { EventProcessor } from "./types"
import env from "../../environment"
import LoggingProcessor from "./LoggingProcessor"
import PosthogProcessor from "./PosthogProcessor"

export default class Processor implements EventProcessor {
  processors: EventProcessor[] = []

  constructor() {
    if (env.ENABLE_ANALYTICS && env.POSTHOG_TOKEN) {
      this.processors.push(new PosthogProcessor(env.POSTHOG_TOKEN))
    }
    this.processors.push(new LoggingProcessor())
  }

  processEvent(event: Event, properties: any): void {
    for (const eventProcessor of this.processors) {
      eventProcessor.processEvent(event, properties)
    }
  }

  shutdown() {
    for (const eventProcessor of this.processors) {
      eventProcessor.shutdown()
    }
  }

  // Identity todo

  // export const identify(type: IdentityType, id: string, hosting?: Hosting) {
  //   const tenantId = getTenantId()
  //   if (!hosting) {
  //     hosting = env.SELF_HOSTED ? Hosting.SELF : Hosting.CLOUD
  //   }
  //   const properties = {
  //     type,
  //     hosting,
  //     tenantId,
  //   }
  //   this.posthog!.identify(id, properties)
  // }

  // identifyUser(userId: string) {
  //   this.identify(IdentityType.USER, userId)
  // }

  // identifyTenant() {
  //   let distinctId
  //   if (env.SELF_HOSTED) {
  //     distinctId = getTenantId() // TODO: Get installation ID
  //   } else {
  //     distinctId = getTenantId()
  //   }
  //   this.identify(IdentityType.TENANT, distinctId)
  // }

  // identifyAccount(account: Account) {
  //   const distinctId = account.accountId
  //   const hosting = account.hosting
  //   this.identify(IdentityType.ACCOUNT, distinctId, hosting)
  // }
}
