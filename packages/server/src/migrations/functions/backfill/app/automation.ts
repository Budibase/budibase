import { events, db } from "@budibase/backend-core"
import { Automation, AutomationStep } from "@budibase/types"

export const backfill = async (appDb: any) => {
  const automations: Automation[] = []

  for (const automation of automations) {
    events.automation.created(automation)

    const steps: AutomationStep[] = []
    for (const step of steps) {
      events.automation.stepCreated(automation, step)
    }
  }
}
