import { it, expect, describe, beforeEach, vi } from "vitest"
import { get } from "svelte/store"
import { INITIAL_APP_META_STATE, AppMetaStore } from "@/stores/builder/app"
import {
  clientFeaturesResp,
  generateAppPackage,
  generateFakeRoutes,
  getScreenFixture,
  getScreenDocId,
} from "./fixtures"
import { API } from "@/api"

vi.mock("@/api", () => {
  return {
    API: {
      fetchAppRoutes: vi.fn(),
    },
  }
})

describe("Application Meta Store", () => {
  beforeEach(async ctx => {
    vi.clearAllMocks()

    const appStore = new AppMetaStore()
    ctx.test = {
      get store() {
        return get(appStore)
      },
      appStore,
    }
  })

  it("Create base store with defaults", ctx => {
    expect(ctx.test.store).toStrictEqual(INITIAL_APP_META_STATE)
  })

  it("Reset the app metadata to default", ctx => {
    const pkg = generateAppPackage({})
    ctx.test.appStore.syncAppPackage(pkg)

    expect(ctx.test.store).not.toStrictEqual(INITIAL_APP_META_STATE)

    ctx.test.appStore.reset()

    expect(ctx.test.store).toStrictEqual(INITIAL_APP_META_STATE)
  })

  it("Sync app metadata from a new app package", async ctx => {
    const pkg = generateAppPackage({
      version: "2.5.0",
      revertableVersion: "2.5.6",
      upgradableVersion: "2.5.7",
      plugins: 4,
    })
    const { application: app, clientLibPath, hasLock } = pkg

    const {
      version,
      instance,
      revertableVersion,
      upgradableVersion,
      usedPlugins,
      icon,
      name,
      appId,
      url,
      features,
      componentLibraries,
    } = app

    ctx.test.appStore.syncAppPackage(pkg)

    expect(ctx.test.store).toStrictEqual({
      ...INITIAL_APP_META_STATE,
      name,
      appId,
      url,
      clientLibPath,
      libraries: componentLibraries,
      version,
      appInstance: instance,
      revertableVersion,
      upgradableVersion,
      usedPlugins,
      icon,
      features,
      hasLock,
      initialised: true,
      hasAppPackage: true,
    })
  })

  it("Sync type support information to state", async ctx => {
    ctx.test.appStore.syncClientTypeSupportPresets({ preset: "information" })

    expect(ctx.test.store.typeSupportPresets).toStrictEqual({
      preset: "information",
    })
  })

  it("Sync component feature flags to state", async ctx => {
    ctx.test.appStore.syncClientFeatures(clientFeaturesResp)

    expect(ctx.test.store.clientFeatures).toStrictEqual(clientFeaturesResp)
  })

  it("Sync app routes from the API", async ctx => {
    const coreScreen = getScreenFixture()
    const existingDocId = getScreenDocId()
    coreScreen._json._id = existingDocId

    const fakeRoutes = generateFakeRoutes([coreScreen.json()])
    const routeSpy = vi
      .spyOn(API, "fetchAppRoutes")
      .mockResolvedValue({ routes: fakeRoutes })

    await ctx.test.appStore.syncAppRoutes()

    expect(routeSpy).toBeCalled()

    expect(ctx.test.store.routes).toStrictEqual(fakeRoutes)
  })

  it("Sync app metadata after socket update", ctx => {
    const fakeMetadata = {
      name: "updated_name",
      url: "/update-url",
      icon: {
        name: "Launch",
        color: "var(--spectrum-global-color-orange-600)",
      },
    }

    ctx.test.appStore.syncMetadata(fakeMetadata)

    expect(ctx.test.store).toStrictEqual({
      ...INITIAL_APP_META_STATE,
      ...fakeMetadata,
    })
  })
})
