import { it, expect, describe, beforeEach, vi } from "vitest"
import { get } from "svelte/store"
import { INITIAL_BUILDER_STATE, BuilderStore } from "@/stores/builder/builder"
import { createBuilderWebsocket } from "../websocket.js"
import { BuilderSocketEvent } from "@budibase/shared-core"

vi.mock("../websocket.js")

describe("Builder store", () => {
  beforeEach(ctx => {
    vi.clearAllMocks()
    const builderStore = new BuilderStore()
    ctx.test = {}
    ctx.test = {
      get store() {
        return get(builderStore)
      },
      builderStore,
    }
  })

  it("Create base builder store with defaults", ctx => {
    expect(ctx.test.store).toStrictEqual(INITIAL_BUILDER_STATE)
  })

  it("Initialise the builder and create a websocket if it hasnt already", ctx => {
    createBuilderWebsocket.mockReturnValue({
      emit: vi.fn(),
    })

    ctx.test.builderStore.init({
      appId: "1234",
    })
    expect(createBuilderWebsocket).toBeCalledWith("1234")
    expect(ctx.test.builderStore.websocket).toBeDefined()
  })

  it("Ignore initialisation if an appId is not provided", ctx => {
    ctx.test.builderStore.init()
    expect(createBuilderWebsocket).not.toBeCalled()
    expect(ctx.test.builderStore.websocket).not.toBeDefined()
  })

  it("Reset the app metadata to default values. Disconnect the websocket", ctx => {
    createBuilderWebsocket.mockReturnValue({
      emit: vi.fn(),
      disconnect: vi.fn(),
    })

    ctx.test.builderStore.init({
      appId: "1234",
    })

    ctx.test.builderStore.update(state => ({
      ...state,
      builderSidePanel: true,
      onboarding: true,
    }))

    let disconnected = false
    ctx.test.builderStore.websocket.disconnect.mockImplementation(() => {
      disconnected = true
    })

    ctx.test.builderStore.reset()
    expect(disconnected).toBe(true)
    expect(ctx.test.store).toStrictEqual(INITIAL_BUILDER_STATE)
    expect(ctx.test.builderStore.websocket).toBeUndefined()
  })

  it("Attempt to emit a resource select event to the websocket on select", ctx => {
    createBuilderWebsocket.mockReturnValue({
      emit: vi.fn(),
      disconnect: vi.fn(),
    })

    ctx.test.builderStore.init({
      appId: "1234",
    })

    ctx.test.builderStore.selectResource("tester")

    expect(ctx.test.builderStore.websocket.emit).toHaveBeenCalledWith(
      BuilderSocketEvent.SelectResource,
      {
        resourceId: "tester",
      }
    )
  })

  it("Sync a highlighted setting key to state. Default to info type", ctx => {
    expect(ctx.test.store.highlightedSetting).toBeNull()

    ctx.test.builderStore.highlightSetting("testing")

    expect(ctx.test.store).toStrictEqual({
      ...INITIAL_BUILDER_STATE,
      highlightedSetting: {
        key: "testing",
        type: "info",
      },
    })
  })

  it("Sync a highlighted setting key to state. Use provided type", ctx => {
    expect(ctx.test.store.highlightedSetting).toBeNull()

    ctx.test.builderStore.highlightSetting("testing", "error")

    expect(ctx.test.store).toStrictEqual({
      ...INITIAL_BUILDER_STATE,
      highlightedSetting: {
        key: "testing",
        type: "error",
      },
    })
  })

  it("Sync a highlighted setting key to state. Unset when no value is passed", ctx => {
    expect(ctx.test.store.highlightedSetting).toBeNull()

    ctx.test.builderStore.highlightSetting("testing", "error")
    ctx.test.builderStore.highlightSetting()

    expect(ctx.test.store).toStrictEqual({
      ...INITIAL_BUILDER_STATE,
    })
  })

  it("Sync a property focus setting key to state", ctx => {
    expect(ctx.test.store.propertyFocus).toBeNull()

    ctx.test.builderStore.propertyFocus("testing")

    expect(ctx.test.store).toStrictEqual({
      ...INITIAL_BUILDER_STATE,
      propertyFocus: "testing",
    })
  })

  it("Update the builder side panel visibility", ctx => {
    expect(ctx.test.store.builderSidePanel).toBe(false)

    ctx.test.builderStore.showBuilderSidePanel()

    expect(ctx.test.store).toStrictEqual({
      ...INITIAL_BUILDER_STATE,
      builderSidePanel: true,
    })

    ctx.test.builderStore.hideBuilderSidePanel()

    expect(ctx.test.store).toStrictEqual({
      ...INITIAL_BUILDER_STATE,
      builderSidePanel: false,
    })
  })

  it("Update the previousTopNavPath value when empty", ctx => {
    expect(ctx.test.store.previousTopNavPath).toBeDefined()
    const dataRoute = "/builder/app/:application/data"
    const dataURL = "/builder/app/app_dev_123/data/table/ta_users"

    ctx.test.builderStore.setPreviousTopNavPath(dataRoute, dataURL)

    expect(ctx.test.store.previousTopNavPath).toStrictEqual({
      [dataRoute]: dataURL,
    })
  })

  it("Add in new route/path mappings and maintain existing", ctx => {
    const dataRoute = "/builder/app/:application/data"
    const dataURL = "/builder/app/app_dev_123/data/table/ta_users"

    const designRoute = "/builder/app/:application/design"
    const designURL =
      "/builder/app/app_dev_123/design/screen_456/screen_456-screen"

    ctx.test.builderStore.setPreviousTopNavPath(dataRoute, dataURL)

    expect(ctx.test.store.previousTopNavPath).toStrictEqual({
      [dataRoute]: dataURL,
    })

    ctx.test.builderStore.setPreviousTopNavPath(designRoute, designURL)

    expect(ctx.test.store.previousTopNavPath).toStrictEqual({
      [dataRoute]: dataURL,
      [designRoute]: designURL,
    })
  })

  it("Overrite an existing route/path mapping with a new URL", ctx => {
    expect(ctx.test.store.previousTopNavPath).toStrictEqual({})

    const dataRoute = "/builder/app/:application/data"
    const dataURL = "/builder/app/app_dev_123/data/table/ta_users"
    const updatedURL = "/builder/app/app_dev_123/data/table/ta_employees"

    ctx.test.builderStore.setPreviousTopNavPath(dataRoute, dataURL)

    expect(ctx.test.store.previousTopNavPath).toStrictEqual({
      [dataRoute]: dataURL,
    })

    ctx.test.builderStore.setPreviousTopNavPath(dataRoute, updatedURL)

    expect(ctx.test.store.previousTopNavPath).toStrictEqual({
      [dataRoute]: updatedURL,
    })
  })

  it("Register a builder tour node", ctx => {
    const fakeNode = { name: "node" }
    ctx.test.builderStore.registerTourNode("sampleKey", fakeNode)

    const registeredNodes = ctx.test.store.tourNodes

    expect(registeredNodes).not.toBeNull()
    expect(Object.keys(registeredNodes).length).toBe(1)
    expect(registeredNodes["sampleKey"]).toStrictEqual(fakeNode)
  })

  it("Clear a destroyed tour node", ctx => {
    const fakeNode = { name: "node" }
    ctx.test.builderStore.registerTourNode("sampleKey", fakeNode)

    expect(ctx.test.store.tourNodes).not.toBeNull()
    expect(Object.keys(ctx.test.store.tourNodes).length).toBe(1)

    ctx.test.builderStore.destroyTourNode("sampleKey")
    expect(ctx.test.store.tourNodes).toStrictEqual({})
  })
})
