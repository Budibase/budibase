import { describe, expect, it } from "vitest"
import { getEnabledActivityTabs } from "./activityTabs"

describe("getEnabledActivityTabs", () => {
  it.each([
    { aiAgentActivity: false, platformActions: false, expected: [] },
    { aiAgentActivity: true, platformActions: false, expected: ["Requests"] },
    { aiAgentActivity: false, platformActions: true, expected: ["Actions"] },
    {
      aiAgentActivity: true,
      platformActions: true,
      expected: ["Requests", "Actions"],
    },
  ])(
    "AI_AGENT_ACTIVITY=$aiAgentActivity, PLATFORM_ACTIONS=$platformActions -> $expected",
    ({ aiAgentActivity, platformActions, expected }) => {
      const tabs = getEnabledActivityTabs({
        AI_AGENT_ACTIVITY: aiAgentActivity,
        PLATFORM_ACTIONS: platformActions,
      })

      expect(tabs.map(tab => tab.label)).toEqual(expected)
    }
  )
})
