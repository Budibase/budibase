import { newTool } from "@budibase/types"
import sdk from "../../../sdk"

export default [
  newTool({
    name: "list_automations",
    description: "List all automations in the current app",
    handler: async () => {
      const automations = await sdk.automations.fetch()
      const formatted = JSON.stringify(automations, null, 2)
      return `Here are the automations in the current app:\n\n${formatted}`
    },
  }),
]
