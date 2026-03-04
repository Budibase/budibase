import { it, expect, describe, beforeEach, vi } from "vitest"
import { get } from "svelte/store"
import { INITIAL_BUILDER_STATE, BuilderStore } from "@/stores/builder/builder"
import { createBuilderWebsocket } from "../websocket.js"
import { BuilderSocketEvent } from "@budibase/shared-core"
import type { Workspace } from "@budibase/types"

vi.mock("../websocket.js")

vi.mock("@/stores/builder", async () => {
  const workspaceAppStore = {}

  return {
    workspaceAppStore,
  }
})

const mockedCreateBuilderWebsocket = vi.mocked(createBuilderWebsocket)

const createMockWebsocket = () => ({
  emit: vi.fn(),
  disconnect: vi.fn(),
})

const buildWorkspace = (appId?: string): Workspace => ({ appId }) as Workspace

describe("Builder store", () => {
  let builderStore: BuilderStore

  const getStore = () => get(builderStore)

  beforeEach(() => {
    vi.clearAllMocks()
    builderStore = new BuilderStore()
  })

  it("Create base builder store with defaults", () => {
    expect(getStore()).toStrictEqual(INITIAL_BUILDER_STATE)
  })

  it("Initialise the builder and create a websocket if it hasnt already", () => {
    const websocket = createMockWebsocket()
    mockedCreateBuilderWebsocket.mockImplementation(
      () => websocket as unknown as ReturnType<typeof createBuilderWebsocket>
    )

    builderStore.init(buildWorkspace("1234"))
    expect(mockedCreateBuilderWebsocket).toBeCalledWith("1234")
    expect(builderStore.websocket).toBeDefined()
  })

  it("Ignore initialisation if an appId is not provided", () => {
    builderStore.init(buildWorkspace())
    expect(mockedCreateBuilderWebsocket).not.toBeCalled()
    expect(builderStore.websocket).not.toBeDefined()
  })

  it("Reset the app metadata to default values. Disconnect the websocket", () => {
    const websocket = createMockWebsocket()
    mockedCreateBuilderWebsocket.mockImplementation(
      () => websocket as unknown as ReturnType<typeof createBuilderWebsocket>
    )

    builderStore.init(buildWorkspace("1234"))

    builderStore.update(state => ({
      ...state,
      propertyFocus: "testing",
    }))

    builderStore.reset()
    expect(websocket.disconnect).toBeCalledTimes(1)
    expect(getStore()).toStrictEqual(INITIAL_BUILDER_STATE)
    expect(builderStore.websocket).toBeUndefined()
  })

  it("Attempt to emit a resource select event to the websocket on select", () => {
    const websocket = createMockWebsocket()
    mockedCreateBuilderWebsocket.mockImplementation(
      () => websocket as unknown as ReturnType<typeof createBuilderWebsocket>
    )

    builderStore.init(buildWorkspace("1234"))

    builderStore.selectResource("tester")

    expect(websocket.emit).toHaveBeenCalledWith(
      BuilderSocketEvent.SelectResource,
      {
        resourceId: "tester",
      }
    )
  })

  it("Sync a highlighted setting key to state. Default to info type", () => {
    expect(getStore().highlightedSetting).toBeNull()

    builderStore.highlightSetting("testing")

    expect(getStore()).toStrictEqual({
      ...INITIAL_BUILDER_STATE,
      highlightedSetting: {
        key: "testing",
        type: "info",
      },
    })
  })

  it("Sync a highlighted setting key to state. Use provided type", () => {
    expect(getStore().highlightedSetting).toBeNull()

    builderStore.highlightSetting("testing", "error")

    expect(getStore()).toStrictEqual({
      ...INITIAL_BUILDER_STATE,
      highlightedSetting: {
        key: "testing",
        type: "error",
      },
    })
  })

  it("Sync a highlighted setting key to state. Unset when no value is passed", () => {
    expect(getStore().highlightedSetting).toBeNull()

    builderStore.highlightSetting("testing", "error")
    builderStore.highlightSetting()

    expect(getStore()).toStrictEqual({
      ...INITIAL_BUILDER_STATE,
    })
  })

  it("Sync a property focus setting key to state", () => {
    expect(getStore().propertyFocus).toBeNull()

    builderStore.propertyFocus("testing")

    expect(getStore()).toStrictEqual({
      ...INITIAL_BUILDER_STATE,
      propertyFocus: "testing",
    })
  })

  it("Update the previousTopNavPath value when empty", () => {
    expect(getStore().previousTopNavPath).toBeDefined()
    const dataRoute = "/builder/workspace/:application/data"
    const dataURL = "/builder/workspace/app_dev_123/data/table/ta_users"

    builderStore.setPreviousTopNavPath(dataRoute, dataURL)

    expect(getStore().previousTopNavPath).toStrictEqual({
      [dataRoute]: dataURL,
    })
  })

  it("Add in new route/path mappings and maintain existing", () => {
    const dataRoute = "/builder/workspace/:application/data"
    const dataURL = "/builder/workspace/app_dev_123/data/table/ta_users"

    const designRoute = "/builder/workspace/:application/design"
    const designURL =
      "/builder/workspace/app_dev_123/design/screen_456/screen_456-screen"

    builderStore.setPreviousTopNavPath(dataRoute, dataURL)

    expect(getStore().previousTopNavPath).toStrictEqual({
      [dataRoute]: dataURL,
    })

    builderStore.setPreviousTopNavPath(designRoute, designURL)

    expect(getStore().previousTopNavPath).toStrictEqual({
      [dataRoute]: dataURL,
      [designRoute]: designURL,
    })
  })

  it("Overrite an existing route/path mapping with a new URL", () => {
    expect(getStore().previousTopNavPath).toStrictEqual({})

    const dataRoute = "/builder/workspace/:application/data"
    const dataURL = "/builder/workspace/app_dev_123/data/table/ta_users"
    const updatedURL = "/builder/workspace/app_dev_123/data/table/ta_employees"

    builderStore.setPreviousTopNavPath(dataRoute, dataURL)

    expect(getStore().previousTopNavPath).toStrictEqual({
      [dataRoute]: dataURL,
    })

    builderStore.setPreviousTopNavPath(dataRoute, updatedURL)

    expect(getStore().previousTopNavPath).toStrictEqual({
      [dataRoute]: updatedURL,
    })
  })
})
