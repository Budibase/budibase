import { describe, expect, it, vi, beforeEach } from "vitest"

const mockGetComponentDefinition = vi.fn()
const mockGetSettingsDefinition = vi.fn()
const mockEnrichProps = vi.fn()
const mockGetActiveConditions = vi.fn()
const mockReduceConditionActions = vi.fn()

vi.mock("@budibase/frontend-core", () => ({
  getSettingsDefinition: (...args) => mockGetSettingsDefinition(...args),
}))

vi.mock("@/stores/components", () => ({
  componentStore: {
    actions: {
      getComponentDefinition: (...args) => mockGetComponentDefinition(...args),
    },
  },
}))

vi.mock("@/utils/componentProps", () => ({
  enrichProps: (...args) => mockEnrichProps(...args),
}))

vi.mock("@/utils/conditions", () => ({
  getActiveConditions: (...args) => mockGetActiveConditions(...args),
  reduceConditionActions: (...args) => mockReduceConditionActions(...args),
}))

const setupResolver = async () => {
  const module = await import("./collapsedButtonGroup.js")
  return module.resolveCollapsedButtons
}

describe("resolveCollapsedButtons", () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    mockGetComponentDefinition.mockReturnValue({ name: "Button" })
    mockGetSettingsDefinition.mockReturnValue([
      { key: "onClick", type: "event" },
    ])
  })

  it("returns an empty array when buttons are missing", async () => {
    const resolveCollapsedButtons = await setupResolver()
    expect(resolveCollapsedButtons(undefined, {}, vi.fn())).toEqual([])
  })

  it("filters out hidden buttons based on conditions", async () => {
    const resolveCollapsedButtons = await setupResolver()
    mockEnrichProps.mockImplementation(props => ({
      ...props,
      _conditions: [{ action: "hide" }],
    }))
    mockGetActiveConditions.mockReturnValue([{ action: "hide" }])
    mockReduceConditionActions.mockReturnValue({
      settingUpdates: {},
      visible: false,
    })

    const result = resolveCollapsedButtons([{ text: "Hidden" }], {}, vi.fn())
    expect(result).toEqual([])
  })

  it("applies conditional setting updates to resolved buttons", async () => {
    const resolveCollapsedButtons = await setupResolver()
    mockEnrichProps.mockImplementation(props => ({
      ...props,
      _conditions: [{ action: "show" }],
      text: "Before",
    }))
    mockGetActiveConditions.mockReturnValue([{ action: "show" }])
    mockReduceConditionActions.mockReturnValue({
      settingUpdates: { text: "After", disabled: true },
      visible: true,
    })

    const result = resolveCollapsedButtons([{ text: "Original" }], {}, vi.fn())
    expect(result).toHaveLength(1)
    expect(result[0].text).toEqual("After")
    expect(result[0].disabled).toEqual(true)
  })

  it("uses the enriched onClick handler when provided", async () => {
    const resolveCollapsedButtons = await setupResolver()
    const enrichedHandler = vi.fn()
    mockEnrichProps.mockImplementation(props => ({
      ...props,
      _conditions: [],
      onClick: enrichedHandler,
    }))
    mockGetActiveConditions.mockReturnValue([])
    mockReduceConditionActions.mockReturnValue({
      settingUpdates: {},
      visible: null,
    })

    const result = resolveCollapsedButtons([{ text: "Action" }], {}, vi.fn())
    await result[0].onClick()
    expect(enrichedHandler).toHaveBeenCalledTimes(1)
  })

  it("falls back to enrichButtonActions when no enriched handler exists", async () => {
    const resolveCollapsedButtons = await setupResolver()
    const enrichButtonActions = vi.fn(() => vi.fn())
    mockEnrichProps.mockImplementation(props => ({
      ...props,
      _conditions: [],
      onClick: undefined,
    }))
    mockGetActiveConditions.mockReturnValue([])
    mockReduceConditionActions.mockReturnValue({
      settingUpdates: {},
      visible: null,
    })

    const result = resolveCollapsedButtons(
      [{ text: "Action", onClick: [{ action: "noop" }] }],
      {},
      enrichButtonActions
    )
    await result[0].onClick()
    expect(enrichButtonActions).toHaveBeenCalledTimes(1)
  })
})
