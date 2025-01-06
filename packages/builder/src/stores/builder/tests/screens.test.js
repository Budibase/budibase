import { it, expect, describe, beforeEach, vi } from "vitest"
import { get, writable } from "svelte/store"
import { API } from "@/api"
import { Constants } from "@budibase/frontend-core"
import { componentStore, appStore } from "@/stores/builder"
import { INITIAL_SCREENS_STATE, ScreenStore } from "@/stores/builder/screens"
import {
  getScreenFixture,
  getComponentFixture,
  COMPONENT_DEFINITIONS,
  componentDefinitionMap,
  getScreenDocId,
  getPluginFixture,
  componentsToNested,
} from "./fixtures"

const COMP_PREFIX = "@budibase/standard-components"

vi.mock("@/stores/builder", async () => {
  const mockAppStore = writable()
  const mockComponentStore = writable()
  const mockLayoutStore = writable()

  const componentStore = {
    getDefinition: vi.fn(),
    enrichEmptySettings: vi.fn(),
    update: mockComponentStore.update,
    subscribe: mockComponentStore.subscribe,
  }

  const appStore = {
    subscribe: mockAppStore.subscribe,
    update: mockAppStore.update,
    set: mockAppStore.set,
  }

  const navigationStore = {
    deleteLink: vi.fn(),
  }

  return {
    componentStore,
    appStore,
    navigationStore,
    layoutStore: {
      update: mockLayoutStore.update,
      subscribe: mockComponentStore.subscribe,
    },
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
      fetchAppRoutes: vi.fn(),
      saveScreen: vi.fn(),
      deleteScreen: vi.fn(),
    },
  }
})

describe("Screens store", () => {
  beforeEach(async ctx => {
    vi.clearAllMocks()

    const screenStore = new ScreenStore()
    ctx.test = {
      get store() {
        return get(screenStore)
      },
      screenStore,
    }
  })

  it("Create base screen store with defaults", ctx => {
    expect(ctx.test.store).toStrictEqual(INITIAL_SCREENS_STATE)
  })

  it("Syncs all screens from the app package", ctx => {
    expect(ctx.test.store.screens.length).toBe(0)

    const screens = Array(2)
      .fill()
      .map(() => getScreenFixture().json())

    ctx.test.screenStore.syncAppScreens({ screens })

    expect(ctx.test.store.screens).toStrictEqual(screens)
  })

  it("Reset the screen store back to the default state", ctx => {
    expect(ctx.test.store.screens.length).toBe(0)

    const screens = Array(2)
      .fill()
      .map(() => getScreenFixture().json())

    ctx.test.screenStore.syncAppScreens({ screens })
    expect(ctx.test.store.screens).toStrictEqual(screens)

    ctx.test.screenStore.update(state => ({
      ...state,
      selectedScreenId: screens[0]._id,
    }))

    ctx.test.screenStore.reset()

    expect(ctx.test.store).toStrictEqual(INITIAL_SCREENS_STATE)
  })

  it("Marks a valid screen as selected", ctx => {
    const screens = Array(2)
      .fill()
      .map(() => getScreenFixture().json())

    ctx.test.screenStore.syncAppScreens({ screens })
    expect(ctx.test.store.screens.length).toBe(2)

    ctx.test.screenStore.select(screens[0]._id)

    expect(ctx.test.store.selectedScreenId).toEqual(screens[0]._id)
  })

  it("Skip selecting a screen if it is not present", ctx => {
    const screens = Array(2)
      .fill()
      .map(() => getScreenFixture().json())

    ctx.test.screenStore.syncAppScreens({ screens })
    expect(ctx.test.store.screens.length).toBe(2)

    ctx.test.screenStore.select("screen_abc")

    expect(ctx.test.store.selectedScreenId).toBeNull()
  })

  it("Approve a valid empty screen config", ctx => {
    const coreScreen = getScreenFixture()
    ctx.test.screenStore.validate(coreScreen.json())
  })

  it("Approve a valid screen config with one component and no illegal children", ctx => {
    const coreScreen = getScreenFixture()
    const formBlock = getComponentFixture(`${COMP_PREFIX}/formblock`)

    coreScreen.addChild(formBlock)

    const defSpy = vi.spyOn(componentStore, "getDefinition")
    defSpy.mockReturnValueOnce(COMPONENT_DEFINITIONS.formblock)

    ctx.test.screenStore.validate(coreScreen.json())

    expect(defSpy).toHaveBeenCalled()
  })

  it("Reject an attempt to nest invalid components", ctx => {
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

    expect(() => ctx.test.screenStore.validate(coreScreen.json())).toThrowError(
      `You can't place a ${COMPONENT_DEFINITIONS.form.name} here`
    )

    expect(defSpy).toHaveBeenCalled()
  })

  it("Reject an attempt to deeply nest invalid components", ctx => {
    const coreScreen = getScreenFixture()

    const formOne = getComponentFixture(`${COMP_PREFIX}/form`)
    const formTwo = getComponentFixture(`${COMP_PREFIX}/form`)

    const components = Array(10)
      .fill()
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

    expect(() => ctx.test.screenStore.validate(coreScreen.json())).toThrowError(
      `You can't place a ${COMPONENT_DEFINITIONS.form.name} here`
    )

    expect(defSpy).toHaveBeenCalled()
  })

  it("Save a brand new screen and add it to the store. No validation", async ctx => {
    const coreScreen = getScreenFixture()
    const formOne = getComponentFixture(`${COMP_PREFIX}/form`)

    coreScreen.addChild(formOne)

    appStore.set({ features: { componentValidation: false } })

    expect(ctx.test.store.screens.length).toBe(0)

    const newDocId = getScreenDocId()
    const newDoc = { ...coreScreen.json(), _id: newDocId }

    // We dont care for this test
    const saveSpy = vi.spyOn(API, "saveScreen").mockResolvedValue(newDoc)
    vi.spyOn(API, "fetchAppRoutes").mockResolvedValue({
      routes: [],
    })
    await ctx.test.screenStore.save(coreScreen.json())

    expect(saveSpy).toHaveBeenCalled()

    expect(ctx.test.store.screens.length).toBe(1)

    expect(ctx.test.store.screens[0]).toStrictEqual(newDoc)

    expect(ctx.test.store.selectedScreenId).toBe(newDocId)

    // The new screen should be selected
    expect(get(componentStore).selectedComponentId).toBe(
      coreScreen.json().props._id
    )
  })

  it("Sync an updated screen to the screen store on save", async ctx => {
    const existingScreens = Array(4)
      .fill()
      .map(() => {
        const screenDoc = getScreenFixture()
        const existingDocId = getScreenDocId()
        screenDoc._json._id = existingDocId
        return screenDoc
      })

    ctx.test.screenStore.update(state => ({
      ...state,
      screens: existingScreens.map(screen => screen.json()),
    }))

    // Modify the fixture screen
    const form = getComponentFixture(`${COMP_PREFIX}/form`)
    existingScreens[2].addChild(form)

    const saveSpy = vi
      .spyOn(API, "saveScreen")
      .mockResolvedValue(existingScreens[2].json())

    const routeSpy = vi.spyOn(API, "fetchAppRoutes").mockResolvedValue({
      routes: [],
    })

    // Saved the existing screen having modified it.
    await ctx.test.screenStore.save(existingScreens[2].json())

    expect(routeSpy).toHaveBeenCalled()
    expect(saveSpy).toHaveBeenCalled()

    // On save, the screen is spliced back into the store with the saved content
    expect(ctx.test.store.screens[2]).toStrictEqual(existingScreens[2].json())
  })

  it("Sync API data to relevant stores on save. Updated plugins", async ctx => {
    const coreScreen = getScreenFixture()

    const newDocId = getScreenDocId()
    const newDoc = { ...coreScreen.json(), _id: newDocId, pluginAdded: true }

    // Fake plugins
    const plugins = Array(2)
      .fill()
      .map(() => getPluginFixture())

    appStore.update(() => ({
      usedPlugins: [],
    }))

    const appPackageSpy = vi
      .spyOn(API, "fetchAppPackage")
      .mockImplementation(appId => {
        return {
          application: {
            appId: appId,
            usedPlugins: plugins,
          },
        }
      })

    const routeSpy = vi.spyOn(API, "fetchAppRoutes").mockResolvedValue({
      routes: [],
    })

    await ctx.test.screenStore.syncScreenData(newDoc)

    expect(routeSpy).toHaveBeenCalled()
    expect(appPackageSpy).toHaveBeenCalled()

    expect(get(appStore).usedPlugins).toStrictEqual(plugins)
  })

  it("Sync API updates to relevant stores on save. Plugins unchanged", async ctx => {
    const coreScreen = getScreenFixture()

    const newDocId = getScreenDocId()
    const newDoc = { ...coreScreen.json(), _id: newDocId }
    const plugin = getPluginFixture()

    // Set existing plugin
    appStore.update(() => ({
      usedPlugins: [plugin],
    }))

    const appPackageSpy = vi.spyOn(API, "fetchAppPackage")
    const routeSpy = vi.spyOn(API, "fetchAppRoutes").mockResolvedValue({
      routes: [],
    })

    await ctx.test.screenStore.syncScreenData(newDoc)

    expect(routeSpy).toHaveBeenCalled()
    expect(appPackageSpy).not.toHaveBeenCalled()

    // Ensure nothing was updated
    expect(get(appStore).usedPlugins).toStrictEqual([plugin])
  })

  it("Proceed to patch if appropriate config are supplied", async ctx => {
    vi.spyOn(ctx.test.screenStore, "sequentialScreenPatch").mockImplementation(
      () => {
        return false
      }
    )
    const noop = () => {}

    await ctx.test.screenStore.patch(noop, "test")
    expect(ctx.test.screenStore.sequentialScreenPatch).toHaveBeenCalledWith(
      noop,
      "test"
    )
  })

  it("Return from the patch if all valid config are not present", async ctx => {
    vi.spyOn(ctx.test.screenStore, "sequentialScreenPatch")
    await ctx.test.screenStore.patch()
    expect(ctx.test.screenStore.sequentialScreenPatch).not.toBeCalled()
  })

  it("Acquire the currently selected screen on patch, if not specified", async ctx => {
    vi.spyOn(ctx.test.screenStore, "sequentialScreenPatch")
    await ctx.test.screenStore.patch()

    const noop = () => {}
    ctx.test.screenStore.update(state => ({
      ...state,
      selectedScreenId: "screen_123",
    }))

    await ctx.test.screenStore.patch(noop)
    expect(ctx.test.screenStore.sequentialScreenPatch).toHaveBeenCalledWith(
      noop,
      "screen_123"
    )
  })

  // Used by the websocket
  it("Ignore a call to replace if no screenId is provided", ctx => {
    const existingScreens = Array(4)
      .fill()
      .map(() => {
        const screenDoc = getScreenFixture()
        const existingDocId = getScreenDocId()
        screenDoc._json._id = existingDocId
        return screenDoc.json()
      })
    ctx.test.screenStore.syncAppScreens({ screens: existingScreens })

    ctx.test.screenStore.replace()

    expect(ctx.test.store.screens).toStrictEqual(existingScreens)
  })

  it("Remove a screen from the store if a single screenId is supplied", ctx => {
    const existingScreens = Array(4)
      .fill()
      .map(() => {
        const screenDoc = getScreenFixture()
        const existingDocId = getScreenDocId()
        screenDoc._json._id = existingDocId
        return screenDoc.json()
      })
    ctx.test.screenStore.syncAppScreens({ screens: existingScreens })

    ctx.test.screenStore.replace(existingScreens[1]._id)

    const filtered = existingScreens.filter(
      screen => screen._id != existingScreens[1]._id
    )
    expect(ctx.test.store.screens).toStrictEqual(filtered)
  })

  it("Replace an existing screen with a new version of itself", ctx => {
    const existingScreens = Array(4)
      .fill()
      .map(() => {
        const screenDoc = getScreenFixture()
        const existingDocId = getScreenDocId()
        screenDoc._json._id = existingDocId
        return screenDoc
      })

    ctx.test.screenStore.update(state => ({
      ...state,
      screens: existingScreens.map(screen => screen.json()),
    }))

    const formBlock = getComponentFixture(`${COMP_PREFIX}/formblock`)
    existingScreens[2].addChild(formBlock)

    ctx.test.screenStore.replace(
      existingScreens[2]._id,
      existingScreens[2].json()
    )

    expect(ctx.test.store.screens.length).toBe(4)
  })

  it("Add a screen when attempting to replace one not present in the store", ctx => {
    const existingScreens = Array(4)
      .fill()
      .map(() => {
        const screenDoc = getScreenFixture()
        const existingDocId = getScreenDocId()
        screenDoc._json._id = existingDocId
        return screenDoc
      })

    ctx.test.screenStore.update(state => ({
      ...state,
      screens: existingScreens.map(screen => screen.json()),
    }))

    const newScreenDoc = getScreenFixture()
    newScreenDoc._json._id = getScreenDocId()

    ctx.test.screenStore.replace(newScreenDoc._json._id, newScreenDoc.json())

    expect(ctx.test.store.screens.length).toBe(5)
    expect(ctx.test.store.screens[4]).toStrictEqual(newScreenDoc.json())
  })

  it("Delete a single screen and remove it from the store", async ctx => {
    const existingScreens = Array(3)
      .fill()
      .map(() => {
        const screenDoc = getScreenFixture()
        const existingDocId = getScreenDocId()
        screenDoc._json._id = existingDocId
        return screenDoc
      })

    ctx.test.screenStore.update(state => ({
      ...state,
      screens: existingScreens.map(screen => screen.json()),
    }))

    const deleteSpy = vi.spyOn(API, "deleteScreen")

    await ctx.test.screenStore.delete(existingScreens[2].json())

    vi.spyOn(API, "fetchAppRoutes").mockResolvedValue({
      routes: [],
    })

    expect(deleteSpy).toBeCalled()

    expect(ctx.test.store.screens.length).toBe(2)

    // Just confirm that the routes at are being initialised
    expect(get(appStore).routes).toEqual([])
  })

  it("Upon delete, reset selected screen and component ids if the screen was selected", async ctx => {
    const existingScreens = Array(3)
      .fill()
      .map(() => {
        const screenDoc = getScreenFixture()
        const existingDocId = getScreenDocId()
        screenDoc._json._id = existingDocId
        return screenDoc
      })

    ctx.test.screenStore.update(state => ({
      ...state,
      screens: existingScreens.map(screen => screen.json()),
      selectedScreenId: existingScreens[2]._json._id,
    }))

    componentStore.update(state => ({
      ...state,
      selectedComponentId: existingScreens[2]._json._id,
    }))

    await ctx.test.screenStore.delete(existingScreens[2].json())

    expect(ctx.test.store.screens.length).toBe(2)
    expect(get(componentStore).selectedComponentId).toBeNull()
    expect(ctx.test.store.selectedScreenId).toBeNull()
  })

  it("Delete multiple is not supported and should leave the store unchanged", async ctx => {
    const existingScreens = Array(3)
      .fill()
      .map(() => {
        const screenDoc = getScreenFixture()
        const existingDocId = getScreenDocId()
        screenDoc._json._id = existingDocId
        return screenDoc
      })

    const storeScreens = existingScreens.map(screen => screen.json())

    ctx.test.screenStore.update(state => ({
      ...state,
      screens: existingScreens.map(screen => screen.json()),
    }))

    const targets = [storeScreens[1], storeScreens[2]]

    const deleteSpy = vi.spyOn(API, "deleteScreen")

    await ctx.test.screenStore.delete(targets)

    expect(deleteSpy).not.toHaveBeenCalled()
    expect(ctx.test.store.screens.length).toBe(3)
    expect(ctx.test.store.screens).toStrictEqual(storeScreens)
  })

  it("Update a screen setting", async ctx => {
    const screenDoc = getScreenFixture()
    const existingDocId = getScreenDocId()
    screenDoc._json._id = existingDocId

    await ctx.test.screenStore.update(state => ({
      ...state,
      screens: [screenDoc.json()],
    }))

    const patchedDoc = screenDoc.json()
    const patchSpy = vi
      .spyOn(ctx.test.screenStore, "patch")
      .mockImplementation(async patchFn => {
        patchFn(patchedDoc)
        return
      })

    await ctx.test.screenStore.updateSetting(
      patchedDoc,
      "showNavigation",
      false
    )

    expect(patchSpy).toBeCalled()
    expect(patchedDoc.showNavigation).toBe(false)
  })

  it("Ensure only one homescreen per role after updating setting. All screens same role", async ctx => {
    const existingScreens = Array(3)
      .fill()
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

    await ctx.test.screenStore.update(state => ({
      ...state,
      screens: storeScreens,
    }))

    const patchSpy = vi
      .spyOn(ctx.test.screenStore, "patch")
      .mockImplementation(async (patchFn, screenId) => {
        const target = ctx.test.store.screens.find(
          screen => screen._id === screenId
        )
        patchFn(target)

        await ctx.test.screenStore.replace(screenId, target)
      })

    await ctx.test.screenStore.updateSetting(
      storeScreens[0],
      "routing.homeScreen",
      true
    )

    // One call for the update, one call for to update the existing home screen
    expect(patchSpy).toBeCalledTimes(2)

    // The new homescreen for BASIC
    expect(ctx.test.store.screens[0].routing.homeScreen).toBe(true)

    // The previous home screen for the BASIC role is now unset
    expect(ctx.test.store.screens[1].routing.homeScreen).toBe(false)
  })

  it("Ensure only one homescreen per role when updating screen setting. Multiple screen roles", async ctx => {
    const expectedRoles = [
      Constants.Roles.BASIC,
      Constants.Roles.POWER,
      Constants.Roles.PUBLIC,
      Constants.Roles.ADMIN,
    ]

    // Build 12 screens, 3 of each role
    const existingScreens = Array(12)
      .fill()
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
    await ctx.test.screenStore.update(state => ({
      ...state,
      screens: sorted,
    }))

    const patchSpy = vi
      .spyOn(ctx.test.screenStore, "patch")
      .mockImplementation(async (patchFn, screenId) => {
        const target = ctx.test.store.screens.find(
          screen => screen._id === screenId
        )
        patchFn(target)

        await ctx.test.screenStore.replace(screenId, target)
      })

    // ADMIN homeScreen updated from 0 to 2
    await ctx.test.screenStore.updateSetting(
      sorted[2],
      "routing.homeScreen",
      true
    )

    const results = ctx.test.store.screens.reduce((acc, screen) => {
      if (screen.routing.homeScreen) {
        acc[screen.routing.roleId] = acc[screen.routing.roleId] || []
        acc[screen.routing.roleId].push(screen)
      }
      return acc
    }, {})

    const screens = ctx.test.store.screens
    // Should still only be one of each homescreen
    expect(results[Constants.Roles.ADMIN].length).toBe(1)
    expect(screens[2].routing.homeScreen).toBe(true)

    expect(results[Constants.Roles.BASIC].length).toBe(1)
    expect(screens[4].routing.homeScreen).toBe(true)

    expect(results[Constants.Roles.PUBLIC].length).toBe(1)
    expect(screens[9].routing.homeScreen).toBe(true)

    // Homescreen was never set for POWER
    expect(results[Constants.Roles.POWER]).not.toBeDefined()

    // Once to update the target screen, once to unset the existing homescreen.
    expect(patchSpy).toBeCalledTimes(2)
  })

  it("Sequential patch check. Exit if the screenId is not valid.", async ctx => {
    const screenDoc = getScreenFixture()
    const existingDocId = getScreenDocId()
    screenDoc._json._id = existingDocId

    const original = screenDoc.json()

    await ctx.test.screenStore.update(state => ({
      ...state,
      screens: [original],
    }))

    const saveSpy = vi
      .spyOn(ctx.test.screenStore, "save")
      .mockImplementation(async () => {
        return
      })

    // A screen with this Id does not exist
    await ctx.test.screenStore.sequentialScreenPatch(() => {}, "123")
    expect(saveSpy).not.toBeCalled()
  })

  it("Sequential patch check. Exit if the patchFn result is false", async ctx => {
    const screenDoc = getScreenFixture()
    const existingDocId = getScreenDocId()
    screenDoc._json._id = existingDocId

    const original = screenDoc.json()
    // Set screens state
    await ctx.test.screenStore.update(state => ({
      ...state,
      screens: [original],
    }))

    const saveSpy = vi
      .spyOn(ctx.test.screenStore, "save")
      .mockImplementation(async () => {
        return
      })

    // Returning false from the patch will abort the save
    await ctx.test.screenStore.sequentialScreenPatch(() => {
      return false
    }, "123")

    expect(saveSpy).not.toBeCalled()
  })

  it("Sequential patch check. Patch applied and save requested", async ctx => {
    const screenDoc = getScreenFixture()
    const existingDocId = getScreenDocId()
    screenDoc._json._id = existingDocId

    const original = screenDoc.json()

    await ctx.test.screenStore.update(state => ({
      ...state,
      screens: [original],
    }))

    const saveSpy = vi
      .spyOn(ctx.test.screenStore, "save")
      .mockImplementation(async () => {
        return
      })

    await ctx.test.screenStore.sequentialScreenPatch(screen => {
      screen.name = "updated"
    }, existingDocId)

    expect(saveSpy).toBeCalledWith({ ...original, name: "updated" })
  })
})
