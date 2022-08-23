import { events } from "@budibase/backend-core"
import { getAutomationParams } from "../../../../db/utils"
import { Automation } from "@budibase/types"

const getAutomations = async (appDb: any): Promise<Automation[]> => {
  const response = await appDb.allDocs(
    getAutomationParams(null, {
      include_docs: true,
    })
  )
  return response.rows.map((row: any) => row.doc)
}

export const backfill = async (appDb: any, timestamp: string | number) => {
  const automations = await getAutomations(appDb)

  for (const automation of automations) {
    await events.automation.created(automation, timestamp)

    for (const step of automation.definition.steps) {
      await events.automation.stepCreated(automation, step, timestamp)
    }
  }

  return automations.length
}
