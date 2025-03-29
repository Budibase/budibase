import DiscordLogo from "assets/discord.svg"
import ZapierLogo from "assets/zapier.png"
import n8nLogo from "assets/n8n_square.png"
import MakeLogo from "assets/make.svg"
import SlackLogo from "assets/slack.svg"
import { AutomationActionStepId } from "@budibase/types"

export type ExternalAction = {
  name: string
  icon: string
}
export const externalActions: Partial<
  Record<AutomationActionStepId, ExternalAction>
> = {
  [AutomationActionStepId.zapier]: { name: "zapier", icon: ZapierLogo },
  [AutomationActionStepId.discord]: { name: "discord", icon: DiscordLogo },
  [AutomationActionStepId.slack]: { name: "slack", icon: SlackLogo },
  [AutomationActionStepId.integromat]: { name: "integromat", icon: MakeLogo },
  [AutomationActionStepId.n8n]: { name: "n8n", icon: n8nLogo },
}
