import { appPackage } from "./fixtures/appPackage"
import type { Screen } from "@budibase/types"
import { it, expect, describe, beforeEach, vi } from "vitest"
import { get } from "svelte/store"
import { API } from "@/api"
import { Constants } from "@budibase/frontend-core"
import {
  componentStore,
  workspaceStore,
  workspaceAppStore,
} from "@/stores/builder"
import { initialScreenState, ScreenStore } from "@/stores/builder/screens"
import {
  getScreenFixture,
  COMPONENT_DEFINITIONS,
  componentDefinitionMap,
  getScreenDocId,
  componentsToNested,
} from "./fixtures"

import { Component as ComponentTemplate } from "@/templates/Component"

const getComponentFixture = (type: string) => new ComponentTemplate(type)
let testScreenStore: ScreenStore

const COMP_PREFIX = "@budibase/standard-components"

vi.mock("@/stores/builder", async () => {
  const { writable } = await import("svelte/store")
  const mockWorkspaceStore = writable({
    features: { componentValidation: false },
  })
  const mockComponentStore = writable()
  const mockLayoutStore = writable()

  const componentStore = {
    getDefinition: vi.fn(),
    enrichEmptySettings: vi.fn(),
    update: mockComponentStore.update,
    subscribe: mockComponentStore.subscribe,
  }

  const workspaceStore = {
    subscribe: mockWorkspaceStore.subscribe,
    update: mockWorkspaceStore.update,
    set: mockWorkspaceStore.set,
    reset: () =>
      mockWorkspaceStore.set({ features: { componentValidation: false } }),
    refresh: vi.fn(),
    refreshWorkspaceAppNavigation: vi.fn(),
  }

  const navigationStore = {
    deleteLink: vi.fn(),
  }

  const workspaceAppStore = {
    refresh: vi.fn(),
  }

  return {
    componentStore,
    selectedComponent: writable(),
    workspaceStore,
    navigationStore,
    layoutStore: {
      update: mockLayoutStore.update,
      subscribe: mockComponentStore.subscribe,
    },
    workspaceAppStore,
  }
})

vi.mock("@/stores/builder/components/utils", () => {
  return {
    findAllMatchingComponents: vi.fn().mockImplementation(() => {
      return []
    }),
  }
})

vi.mock("@/api", () => {
  return {
    API: {
      fetchAppPackage: vi.fn(),
      get: vi.fn(),
      fetchAppRoutes: vi.fn(),
      saveScreen: vi.fn(),
      deleteScreen: vi.fn(),
    },
  }
})

describe("Screens store", () => {
  beforeEach(async () => {
    vi.clearAllMocks()

    const screenStore = new ScreenStore()
    vi.mocked(API.get).mockImplementation(async () => get(screenStore).screens)
    vi.mocked(API.fetchAppRoutes).mockResolvedValue({ routes: {} })
    testScreenStore = screenStore
  })

  it("Create base screen store with defaults", () => {
    expect(get(testScreenStore)).toStrictEqual(initialScreenState)
  })

  it("Syncs all screens from the app package", () => {
    expect(get(testScreenStore).screens.length).toBe(0)

    const screens = Array(2)
      .fill(undefined)
      .map(() => getScreenFixture().json())

    testScreenStore.syncAppScreens(appPackage({ screens }))

    expect(get(testScreenStore).screens).toStrictEqual(screens)
  })

  it("Selects the requested screen when syncing a scoped app package", () => {
    const screens = Array(2)
      .fill(undefined)
      .map(() => getScreenFixture().json())
    const requestedScreen = screens[1]

    testScreenStore.update(state => ({
      ...state,
      selectedScreenId: screens[0]._id,
    }))
    testScreenStore.syncAppScreens(appPackage({ screens }), requestedScreen._id)

    expect(get(testScreenStore).selectedScreenId).toBe(requestedScreen._id)
  })

  it("Reset the screen store back to the default state", () => {
    expect(get(testScreenStore).screens.length).toBe(0)

    const screens = Array(2)
      .fill(undefined)
      .map(() => getScreenFixture().json())

    testScreenStore.syncAppScreens(appPackage({ screens }))
    expect(get(testScreenStore).screens).toStrictEqual(screens)

    testScreenStore.update(state => ({
      ...state,
      selectedScreenId: screens[0]._id,
    }))

    testScreenStore.reset()

    expect(get(testScreenStore)).toStrictEqual(initialScreenState)
  })

  it("retains loaded screen children when syncing truncated screens", () => {
    const screen = getScreenFixture()
      .addChild(getComponentFixture(`${COMP_PREFIX}/container`))
      .json()
    screen._id = "screen_source"
    screen._rev = "1-source"
    testScreenStore.syncAppScreens(appPackage({ screens: [screen] }))
    testScreenStore.syncAppScreens(
      appPackage({
        screens: [
          {
            ...screen,
            _rev: undefined,
            props: { ...screen.props, _children: [] },
          },
        ],
      })
    )

    expect(get(testScreenStore).screens).toEqual([screen])
  })

  it("replaces a loaded screen with a fresh complete screen", () => {
    const screen = getScreenFixture()
      .addChild(getComponentFixture(`${COMP_PREFIX}/container`))
      .json()
    screen._rev = "1-original"
    const revertedScreen = {
      ...screen,
      _rev: "2-reverted",
      props: { ...screen.props, _children: [] },
    }
    testScreenStore.syncAppScreens(appPackage({ screens: [screen] }))
    testScreenStore.syncAppScreens(appPackage({ screens: [revertedScreen] }))

    expect(get(testScreenStore).screens).toEqual([revertedScreen])
  })

  it("restores full children when undoing deletion of a truncated screen", async () => {
    const screen = getScreenFixture()
      .addChild(getComponentFixture(`${COMP_PREFIX}/container`))
      .json()
    screen._id = "screen_source"
    screen._rev = "1-source"
    const truncated = {
      ...screen,
      _rev: undefined,
      props: { ...screen.props, _children: [] },
    }
    testScreenStore.syncAppScreens(appPackage({ screens: [truncated] }))
    vi.mocked(API.get).mockResolvedValueOnce([screen])
    vi.mocked(API.fetchAppRoutes).mockResolvedValueOnce({ routes: {} })
    vi.mocked(API.saveScreen).mockResolvedValueOnce(screen)
    workspaceStore.reset()

    await testScreenStore.delete(truncated)
    await testScreenStore.history.undo()

    expect(get(testScreenStore).screens).toEqual([screen])
  })

  it("Marks a valid screen as selected", () => {
    const screens = Array(2)
      .fill(undefined)
      .map(() => getScreenFixture().json())

    testScreenStore.syncAppScreens(appPackage({ screens }))
    expect(get(testScreenStore).screens.length).toBe(2)

    testScreenStore.select(screens[0]._id!)

    expect(get(testScreenStore).selectedScreenId).toEqual(screens[0]._id!)
  })

  it("Skip selecting a screen if it is not present", () => {
    const screens = Array(2)
      .fill(undefined)
      .map(() => getScreenFixture().json())

    testScreenStore.syncAppScreens(appPackage({ screens }))
    expect(get(testScreenStore).screens.length).toBe(2)

    testScreenStore.select("screen_abc")

    expect(get(testScreenStore).selectedScreenId).toBeUndefined()
  })

  it("Approve a valid empty screen config", () => {
    const coreScreen = getScreenFixture()
    testScreenStore.validate(coreScreen.json())
  })

  it("Approve a valid screen config with one component and no illegal children", () => {
    const coreScreen = getScreenFixture()
    const formBlock = getComponentFixture(`${COMP_PREFIX}/formblock`)

    coreScreen.addChild(formBlock)

    const defSpy = vi.spyOn(componentStore, "getDefinition")
    defSpy.mockReturnValueOnce(
      componentDefinitionMap()[`${COMP_PREFIX}/formblock`]
    )

    testScreenStore.validate(coreScreen.json())

    expect(defSpy).toHaveBeenCalled()
  })

  it("Reject an attempt to nest invalid components", () => {
    const coreScreen = getScreenFixture()

    const formOne = getComponentFixture(`${COMP_PREFIX}/form`)
    const formTwo = getComponentFixture(`${COMP_PREFIX}/form`)

    formOne.addChild(formTwo)
    coreScreen.addChild(formOne)

    const defSpy = vi
      .spyOn(componentStore, "getDefinition")
      .mockImplementation(comp => {
        const defMap = componentDefinitionMap()
        return defMap[comp]
      })

    expect(() => testScreenStore.validate(coreScreen.json())).toThrowError(
      `You can't place a ${COMPONENT_DEFINITIONS.form.name} here`
    )

    expect(defSpy).toHaveBeenCalled()
  })

  it("Reject an attempt to deeply nest invalid components", () => {
    const coreScreen = getScreenFixture()

    const formOne = getComponentFixture(`${COMP_PREFIX}/form`)
    const formTwo = getComponentFixture(`${COMP_PREFIX}/form`)

    const components = Array(10)
      .fill(undefined)
      .map(() => getComponentFixture(`${COMP_PREFIX}/container`))

    components.splice(5, 0, formOne)
    components.push(formTwo)

    //Take the array and turn it into a deeply nested tree
    let nested = componentsToNested(components)

    coreScreen.addChild(nested)

    const defSpy = vi
      .spyOn(componentStore, "getDefinition")
      .mockImplementation(comp => {
        const defMap = componentDefinitionMap()
        return defMap[comp]
      })

    expect(() => testScreenStore.validate(coreScreen.json())).toThrowError(
      `You can't place a ${COMPONENT_DEFINITIONS.form.name} here`
    )

    expect(defSpy).toHaveBeenCalled()
  })

  it("Save a brand new screen and add it to the store. No validation", async () => {
    const coreScreen = getScreenFixture()
    const formOne = getComponentFixture(`${COMP_PREFIX}/form`)

    coreScreen.addChild(formOne)

    workspaceStore.update(state => ({
      ...state,
      features: { ...state.features, componentValidation: false },
    }))

    expect(get(testScreenStore).screens.length).toBe(0)

    const newDocId = getScreenDocId()
    const newDoc = { ...coreScreen.json(), _id: newDocId }

    // We dont care for this test
    const saveSpy = vi.spyOn(API, "saveScreen").mockResolvedValue(newDoc)
    vi.spyOn(API, "fetchAppRoutes").mockResolvedValue({
      routes: {},
    })
    await testScreenStore.save(coreScreen.json())

    expect(saveSpy).toHaveBeenCalled()

    expect(get(testScreenStore).screens.length).toBe(1)

    expect(get(testScreenStore).screens[0]).toStrictEqual({
      ...newDoc,
    })

    expect(get(testScreenStore).selectedScreenId).toBe(newDocId)

    // The new screen should be selected
    expect(get(componentStore).selectedComponentId).toBe(
      coreScreen.json().props._id
    )
  })

  it("Sync an updated screen to the screen store on save", async () => {
    const existingScreens = Array(4)
      .fill(undefined)
      .map(() => {
        const screenDoc = getScreenFixture()
        const existingDocId = getScreenDocId()
        screenDoc._json._id = existingDocId
        return screenDoc
      })

    testScreenStore.update(state => ({
      ...state,
      screens: existingScreens.map(screen => screen.json()),
    }))

    // Modify the fixture screen
    const form = getComponentFixture(`${COMP_PREFIX}/form`)
    existingScreens[2].addChild(form)

    const saveSpy = vi
      .spyOn(API, "saveScreen")
      .mockResolvedValue(existingScreens[2].json())

    // Saved the existing screen having modified it.
    await testScreenStore.save(existingScreens[2].json())

    expect(workspaceStore.refreshWorkspaceAppNavigation).toHaveBeenCalledOnce()
    expect(saveSpy).toHaveBeenCalled()

    // On save, the screen is spliced back into the store with the saved content
    expect(get(testScreenStore).screens[2]).toStrictEqual(
      existingScreens[2].json()
    )
  })

  it("Proceed to patch if appropriate config are supplied", async () => {
    vi.spyOn(testScreenStore, "sequentialScreenPatch").mockImplementation(
      async () => {}
    )
    const noop = () => {}

    await testScreenStore.patch(noop, "test")
    expect(testScreenStore.sequentialScreenPatch).toHaveBeenCalledWith(
      noop,
      "test"
    )
  })

  it("Return from the patch if all valid config are not present", async () => {
    vi.spyOn(testScreenStore, "sequentialScreenPatch")
    await testScreenStore.patch(undefined!)
    expect(testScreenStore.sequentialScreenPatch).not.toBeCalled()
  })

  it("Acquire the currently selected screen on patch, if not specified", async () => {
    vi.spyOn(testScreenStore, "sequentialScreenPatch")
    await testScreenStore.patch(undefined!)

    const noop = () => {}
    testScreenStore.update(state => ({
      ...state,
      selectedScreenId: "screen_123",
    }))

    await testScreenStore.patch(noop)
    expect(testScreenStore.sequentialScreenPatch).toHaveBeenCalledWith(
      noop,
      "screen_123"
    )
  })

  // Used by the websocket
  it("Ignore a call to replace if no screenId is provided", () => {
    const existingScreens = Array(4)
      .fill(undefined)
      .map(() => {
        const screenDoc = getScreenFixture()
        const existingDocId = getScreenDocId()
        screenDoc._json._id = existingDocId
        return screenDoc.json()
      })
    testScreenStore.syncAppScreens(appPackage({ screens: existingScreens }))

    testScreenStore.replace(undefined!, undefined!)

    expect(get(testScreenStore).screens).toStrictEqual(existingScreens)
  })

  it("Remove a screen from the store if a single screenId is supplied", () => {
    const existingScreens = Array(4)
      .fill(undefined)
      .map(() => {
        const screenDoc = getScreenFixture()
        const existingDocId = getScreenDocId()
        screenDoc._json._id = existingDocId
        return screenDoc.json()
      })
    testScreenStore.syncAppScreens(appPackage({ screens: existingScreens }))

    testScreenStore.replace(existingScreens[1]._id!, undefined!)

    const filtered = existingScreens.filter(
      screen => screen._id != existingScreens[1]._id
    )
    expect(get(testScreenStore).screens).toStrictEqual(filtered)
  })

  it("Replace an existing screen with a new version of itself", () => {
    const existingScreens = Array(4)
      .fill(undefined)
      .map(() => {
        const screenDoc = getScreenFixture()
        const existingDocId = getScreenDocId()
        screenDoc._json._id = existingDocId
        return screenDoc
      })

    testScreenStore.update(state => ({
      ...state,
      screens: existingScreens.map(screen => screen.json()),
    }))

    const formBlock = getComponentFixture(`${COMP_PREFIX}/formblock`)
    existingScreens[2].addChild(formBlock)

    testScreenStore.replace(
      existingScreens[2].json()._id!,
      existingScreens[2].json()
    )

    expect(get(testScreenStore).screens.length).toBe(4)
  })

  it("Add a screen when attempting to replace one not present in the store", () => {
    const existingScreens = Array(4)
      .fill(undefined)
      .map(() => {
        const screenDoc = getScreenFixture()
        const existingDocId = getScreenDocId()
        screenDoc._json._id = existingDocId
        return screenDoc
      })

    testScreenStore.update(state => ({
      ...state,
      screens: existingScreens.map(screen => screen.json()),
    }))

    const newScreenDoc = getScreenFixture()
    newScreenDoc._json._id = getScreenDocId()

    testScreenStore.replace(newScreenDoc._json._id, newScreenDoc.json())

    expect(get(testScreenStore).screens.length).toBe(5)
    expect(get(testScreenStore).screens[4]).toStrictEqual(newScreenDoc.json())
  })

  it("Delete a single screen and remove it from the store", async () => {
    const existingScreens = Array(3)
      .fill(undefined)
      .map(() => {
        const screenDoc = getScreenFixture()
        const existingDocId = getScreenDocId()
        screenDoc._json._id = existingDocId
        return screenDoc
      })

    testScreenStore.update(state => ({
      ...state,
      screens: existingScreens.map(screen => screen.json()),
    }))

    const deleteSpy = vi.spyOn(API, "deleteScreen")
    const refreshWorkspaceAppSpy = vi.spyOn(workspaceAppStore, "refresh")

    await testScreenStore.delete(existingScreens[2].json())

    vi.spyOn(API, "fetchAppRoutes").mockResolvedValue({
      routes: {},
    })

    expect(deleteSpy).toBeCalled()
    expect(refreshWorkspaceAppSpy).toHaveBeenCalledOnce()

    expect(get(testScreenStore).screens.length).toBe(2)

    // Just confirm that the routes at are being initialised
    expect(get(workspaceStore).routes).toEqual({})
  })

  it("Upon delete, reset selected screen and component ids if the screen was selected", async () => {
    const existingScreens = Array(3)
      .fill(undefined)
      .map(() => {
        const screenDoc = getScreenFixture()
        const existingDocId = getScreenDocId()
        screenDoc._json._id = existingDocId
        return screenDoc
      })

    testScreenStore.update(state => ({
      ...state,
      screens: existingScreens.map(screen => screen.json()),
      selectedScreenId: existingScreens[2]._json._id,
    }))

    componentStore.update(state => ({
      ...state,
      selectedComponentId: existingScreens[2]._json._id,
    }))

    await testScreenStore.delete(existingScreens[2].json())

    expect(get(testScreenStore).screens.length).toBe(2)
    expect(get(componentStore).selectedComponentId).toBeUndefined()
    expect(get(testScreenStore).selectedScreenId).toBeUndefined()
  })

  it("Delete multiple is not supported and should leave the store unchanged", async () => {
    const existingScreens = Array(3)
      .fill(undefined)
      .map(() => {
        const screenDoc = getScreenFixture()
        const existingDocId = getScreenDocId()
        screenDoc._json._id = existingDocId
        return screenDoc
      })

    const storeScreens = existingScreens.map(screen => screen.json())

    testScreenStore.update(state => ({
      ...state,
      screens: existingScreens.map(screen => screen.json()),
    }))

    const targets = [storeScreens[1], storeScreens[2]]

    const deleteSpy = vi.spyOn(API, "deleteScreen")

    // @ts-expect-error Multiple screen deletion is intentionally unsupported
    await testScreenStore.delete(targets)

    expect(deleteSpy).not.toHaveBeenCalled()
    expect(get(testScreenStore).screens.length).toBe(3)
    expect(get(testScreenStore).screens).toStrictEqual(storeScreens)
  })

  it("Update a screen setting", async () => {
    const screenDoc = getScreenFixture()
    const existingDocId = getScreenDocId()
    screenDoc._json._id = existingDocId

    await testScreenStore.update(state => ({
      ...state,
      screens: [screenDoc.json()],
    }))

    const patchedDoc = screenDoc.json()
    const patchSpy = vi
      .spyOn(testScreenStore, "patch")
      .mockImplementation(async patchFn => {
        patchFn(patchedDoc)
        return
      })

    await testScreenStore.updateSetting(patchedDoc, "showNavigation", false)

    expect(patchSpy).toBeCalled()
    expect(patchedDoc.showNavigation).toBe(false)
  })

  it("Ensure only one homescreen per role after updating setting. All screens same role", async () => {
    const existingScreens = Array(3)
      .fill(undefined)
      .map(() => {
        const screenDoc = getScreenFixture()
        const existingDocId = getScreenDocId()
        screenDoc._json._id = existingDocId
        return screenDoc
      })

    const storeScreens = existingScreens
      .map(screen => screen.json())
      .filter(screen => screen.routing.roleId == Constants.Roles.BASIC)

    // All default screens have the BASIC role
    expect(storeScreens.length).toBe(3)

    // Set the 2nd screen as the home screen
    storeScreens[1].routing.homeScreen = true

    await testScreenStore.update(state => ({
      ...state,
      screens: storeScreens,
    }))

    vi.spyOn(testScreenStore, "patch").mockImplementation(
      async (patchFn, screenId) => {
        const target = get(testScreenStore).screens.find(
          screen => screen._id === screenId
        )
        patchFn(target!)

        await testScreenStore.replace(screenId!, target!)
      }
    )

    await testScreenStore.updateSetting(
      storeScreens[0],
      "routing.homeScreen",
      true
    )

    // The new homescreen for BASIC
    expect(get(testScreenStore).screens[0].routing.homeScreen).toBe(true)

    // The previous home screen for the BASIC role is now unset
    expect(get(testScreenStore).screens[1].routing.homeScreen).toBe(false)
  })

  it("Does not unset home screen when updating route on another screen", async () => {
    const existingScreens = Array(3)
      .fill(undefined)
      .map(() => {
        const screenDoc = getScreenFixture()
        const existingDocId = getScreenDocId()
        screenDoc._json._id = existingDocId
        return screenDoc
      })

    const storeScreens = existingScreens.map(screen => screen.json())
    storeScreens[1].routing.homeScreen = true

    await testScreenStore.update(state => ({
      ...state,
      screens: storeScreens,
    }))

    vi.spyOn(testScreenStore, "patch").mockImplementation(
      async (patchFn, screenId) => {
        const target = get(testScreenStore).screens.find(
          screen => screen._id === screenId
        )
        patchFn(target!)

        await testScreenStore.replace(screenId!, target!)
      }
    )

    await testScreenStore.updateSetting(
      storeScreens[0],
      "routing.route",
      "/updated-route"
    )

    expect(get(testScreenStore).screens[0].routing.route).toBe("/updated-route")
    expect(get(testScreenStore).screens[1].routing.homeScreen).toBe(true)
  })

  it("Ensure only one homescreen per role when updating screen setting. Multiple screen roles", async () => {
    const expectedRoles = [
      Constants.Roles.BASIC,
      Constants.Roles.POWER,
      Constants.Roles.PUBLIC,
      Constants.Roles.ADMIN,
    ]

    // Build 12 screens, 3 of each role
    const existingScreens = Array(12)
      .fill(undefined)
      .map((_, idx) => {
        const screenDoc = getScreenFixture()
        screenDoc.role(expectedRoles[idx % 4])

        const existingDocId = getScreenDocId()
        screenDoc._json._id = existingDocId
        return screenDoc
      })

    const sorted = existingScreens
      .map(screen => screen.json())
      .sort((a, b) => a.routing.roleId.localeCompare(b.routing.roleId))

    // ADMIN
    sorted[0].routing.homeScreen = true
    // BASIC
    sorted[4].routing.homeScreen = true
    // PUBLIC
    sorted[9].routing.homeScreen = true

    // Set screens state
    await testScreenStore.update(state => ({
      ...state,
      screens: sorted,
    }))

    vi.spyOn(testScreenStore, "patch").mockImplementation(
      async (patchFn, screenId) => {
        const target = get(testScreenStore).screens.find(
          screen => screen._id === screenId
        )
        patchFn(target!)

        await testScreenStore.replace(screenId!, target!)
      }
    )

    // ADMIN homeScreen updated from 0 to 2
    await testScreenStore.updateSetting(sorted[2], "routing.homeScreen", true)

    const results = get(testScreenStore).screens.reduce<
      Record<string, Screen[]>
    >((acc, screen) => {
      if (screen.routing.homeScreen) {
        acc[screen.routing.roleId] = acc[screen.routing.roleId] || []
        acc[screen.routing.roleId].push(screen)
      }
      return acc
    }, {})

    const screens = get(testScreenStore).screens
    // Should still only be one of each homescreen
    expect(results[Constants.Roles.ADMIN].length).toBe(1)
    expect(screens[2].routing.homeScreen).toBe(true)

    expect(results[Constants.Roles.BASIC].length).toBe(1)
    expect(screens[4].routing.homeScreen).toBe(true)

    expect(results[Constants.Roles.PUBLIC].length).toBe(1)
    expect(screens[9].routing.homeScreen).toBe(true)

    // Homescreen was never set for POWER
    expect(results[Constants.Roles.POWER]).not.toBeDefined()
  })

  it("Sequential patch check. Exit if the screenId is not valid.", async () => {
    const screenDoc = getScreenFixture()
    const existingDocId = getScreenDocId()
    screenDoc._json._id = existingDocId

    const original = screenDoc.json()

    await testScreenStore.update(state => ({
      ...state,
      screens: [original],
    }))

    const saveSpy = vi
      .spyOn(testScreenStore, "save")
      .mockResolvedValue(original)

    // A screen with this Id does not exist
    await testScreenStore.sequentialScreenPatch(() => false, "123")
    expect(saveSpy).not.toBeCalled()
  })

  it("Sequential patch check. Exit if the patchFn result is false", async () => {
    const screenDoc = getScreenFixture()
    const existingDocId = getScreenDocId()
    screenDoc._json._id = existingDocId

    const original = screenDoc.json()
    // Set screens state
    await testScreenStore.update(state => ({
      ...state,
      screens: [original],
    }))

    const saveSpy = vi
      .spyOn(testScreenStore, "save")
      .mockResolvedValue(original)

    // Returning false from the patch will abort the save
    await testScreenStore.sequentialScreenPatch(() => {
      return false
    }, "123")

    expect(saveSpy).not.toBeCalled()
  })

  it("Sequential patch check. Patch applied and save requested", async () => {
    const screenDoc = getScreenFixture()
    const existingDocId = getScreenDocId()
    screenDoc._json._id = existingDocId

    const original = screenDoc.json()

    await testScreenStore.update(state => ({
      ...state,
      screens: [original],
    }))

    const saveSpy = vi
      .spyOn(testScreenStore, "save")
      .mockResolvedValue(original)

    await testScreenStore.sequentialScreenPatch(screen => {
      screen.name = "updated"
      return true
    }, existingDocId)

    expect(saveSpy).toBeCalledWith({
      ...original,
      name: "updated",
    })
  })
})
