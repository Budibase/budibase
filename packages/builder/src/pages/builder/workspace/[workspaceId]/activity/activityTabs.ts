import { FeatureFlag, type FeatureFlags } from "@budibase/types"

export interface ActivityTab {
  label: string
  url: string
  flag: FeatureFlag
}

export const ACTIVITY_TABS: ActivityTab[] = [
  { label: "Requests", url: "./requests", flag: FeatureFlag.AI_AGENT_ACTIVITY },
  { label: "Actions", url: "./actions", flag: FeatureFlag.PLATFORM_ACTIONS },
]

export const getEnabledActivityTabs = (
  flags: Partial<FeatureFlags>
): ActivityTab[] => ACTIVITY_TABS.filter(tab => flags[tab.flag])
