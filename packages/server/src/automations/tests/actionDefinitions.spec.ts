import { PluginType } from "@budibase/types"
import env, { setEnv } from "../../environment"
import sdk from "../../sdk"
import { getAction, getActionDefinitions } from "../actions"
import { getAutomationPlugin } from "../../utilities/fileSystem"

jest.mock("../../sdk", () => ({
  plugins: {
    fetch: jest.fn(),
  },
}))

jest.mock("../../utilities/fileSystem", () => ({
  getAutomationPlugin: jest.fn(),
}))

const mockPluginFetch = sdk.plugins.fetch as jest.Mock
const mockGetAutomationPlugin = getAutomationPlugin as jest.Mock

describe("getActionDefinitions", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("marks OpenAI as deprecated for self-hosted environments", async () => {
    const restoreEnv = setEnv({ SELF_HOSTED: "1" })
    mockPluginFetch.mockResolvedValue([])

    try {
      const definitions = await getActionDefinitions()

      expect(definitions.OPENAI.deprecated).toEqual(true)
      expect(mockPluginFetch).toHaveBeenCalledWith(PluginType.AUTOMATION)
    } finally {
      restoreEnv()
    }
  })

  it("includes the agent action", async () => {
    const restoreEnv = setEnv({ SELF_HOSTED: undefined })

    try {
      const definitions = await getActionDefinitions()

      expect(definitions.AGENT).toBeDefined()
      expect(mockPluginFetch).not.toHaveBeenCalled()
    } finally {
      restoreEnv()
    }
  })

  it("adds self-hosted automation plugin definitions as custom actions", async () => {
    const restoreEnv = setEnv({ SELF_HOSTED: "1" })
    mockPluginFetch.mockResolvedValue([
      {
        schema: {
          schema: {
            stepId: "CUSTOM_ACTION",
            name: "Custom action",
          },
        },
      },
    ])

    try {
      const definitions = await getActionDefinitions()

      expect((definitions as Record<string, unknown>).CUSTOM_ACTION).toEqual({
        stepId: "CUSTOM_ACTION",
        name: "Custom action",
        custom: true,
      })
    } finally {
      restoreEnv()
    }
  })

  it("does not mutate builtin definitions between calls", async () => {
    const restoreEnv = setEnv({ SELF_HOSTED: "1" })
    mockPluginFetch.mockResolvedValue([])

    try {
      const first = await getActionDefinitions()
      first.OPENAI.deprecated = false

      const second = await getActionDefinitions()

      expect(second.OPENAI.deprecated).toEqual(true)
      expect(env.SELF_HOSTED).toEqual("1")
    } finally {
      restoreEnv()
    }
  })

  it("returns builtin action implementations", async () => {
    const action = await getAction("SERVER_LOG" as any)

    expect(action).toBeDefined()
    expect(mockPluginFetch).not.toHaveBeenCalled()
  })

  it("throws when a self-hosted plugin action cannot be found", async () => {
    const restoreEnv = setEnv({ SELF_HOSTED: "1" })
    mockPluginFetch.mockResolvedValue([])

    try {
      await expect(getAction("CUSTOM_ACTION" as any)).rejects.toThrow(
        'Unable to find action implementation for "CUSTOM_ACTION"'
      )
    } finally {
      restoreEnv()
    }
  })

  it("loads self-hosted plugin action implementations", async () => {
    const restoreEnv = setEnv({ SELF_HOSTED: "1" })
    const action = jest.fn()
    const plugin = {
      schema: {
        schema: {
          stepId: "CUSTOM_ACTION",
        },
      },
    }
    mockPluginFetch.mockResolvedValue([plugin])
    mockGetAutomationPlugin.mockResolvedValue({ action })

    try {
      const result = await getAction("CUSTOM_ACTION" as any)

      expect(result).toBe(action)
      expect(mockGetAutomationPlugin).toHaveBeenCalledWith(plugin)
    } finally {
      restoreEnv()
    }
  })
})
