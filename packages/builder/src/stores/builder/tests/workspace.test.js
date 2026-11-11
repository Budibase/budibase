import { it, expect, describe, beforeEach, vi } from "vitest"
import { get } from "svelte/store"
import {
  INITIAL_WORKSPACE_META_STATE,
  WorkspaceMetaStore,
} from "@/stores/builder/workspace"
import {
  clientFeaturesResp,
  generateAppPackage,
  generateFakeRoutes,
  getScreenFixture,
  getScreenDocId,
} from "./fixtures"
import { API } from "@/api"
import { initialise } from "@/stores/builder"

vi.mock("@/api", () => {
  return {
    API: {
      fetchAppRoutes: vi.fn(),
      fetchAppPackage: vi.fn(),
    },
  }
})

vi.mock("@/stores/builder", async () => {
  const navigationStore = {
    syncAppNavigation: vi.fn(),
  }
  const workspaceAppStore = {}

  return {
    initialise: vi.fn(),
    navigationStore,
    workspaceAppStore,
  }
})

const defer = () => {
  let resolve
  const promise = new Promise(res => {
    resolve = res
  })
  return { promise, resolve }
}

describe("Workspace Meta Store", () => {
  beforeEach(async ctx => {
    vi.clearAllMocks()

    const workspaceStore = new WorkspaceMetaStore()
    API.fetchAppPackage.mockReset()
    initialise.mockReset()
    initialise.mockImplementation(pkg =>
      workspaceStore.syncWorkspacePackage(pkg)
    )
    ctx.test = {
      get store() {
        return get(workspaceStore)
      },
      workspaceStore,
    }
  })

  it("Create base store with defaults", ctx => {
    expect(ctx.test.store).toStrictEqual(INITIAL_WORKSPACE_META_STATE)
  })

  it("Reset the workspace metadata to default", ctx => {
    const pkg = generateAppPackage({})
    ctx.test.workspaceStore.syncWorkspacePackage(pkg)

    expect(ctx.test.store).not.toStrictEqual(INITIAL_WORKSPACE_META_STATE)

    ctx.test.workspaceStore.reset()

    expect(ctx.test.store).toStrictEqual(INITIAL_WORKSPACE_META_STATE)
  })

  it("Sync workspace metadata from a new app package", async ctx => {
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
      pwa,
      embedSSO,
      componentLibraries,
    } = app

    ctx.test.workspaceStore.syncWorkspacePackage(pkg)

    expect(ctx.test.store).toStrictEqual({
      ...INITIAL_WORKSPACE_META_STATE,
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
      pwa,
      embedSSO,
    })
  })

  it("Sync type support information to state", async ctx => {
    ctx.test.workspaceStore.syncClientTypeSupportPresets({
      preset: "information",
    })

    expect(ctx.test.store.typeSupportPresets).toStrictEqual({
      preset: "information",
    })
  })

  it("Sync component feature flags to state", async ctx => {
    ctx.test.workspaceStore.syncClientFeatures(clientFeaturesResp)

    expect(ctx.test.store.clientFeatures).toStrictEqual(clientFeaturesResp)
  })

  it("Sync workspace routes from the API", async ctx => {
    const coreScreen = getScreenFixture()
    const existingDocId = getScreenDocId()
    coreScreen._json._id = existingDocId

    const fakeRoutes = generateFakeRoutes([coreScreen.json()])
    const routeSpy = vi
      .spyOn(API, "fetchAppRoutes")
      .mockResolvedValue({ routes: fakeRoutes })

    await ctx.test.workspaceStore.syncWorkspaceRoutes()

    expect(routeSpy).toBeCalled()

    expect(ctx.test.store.routes).toStrictEqual(fakeRoutes)
  })

  it("Sync workspace metadata after socket update", ctx => {
    const fakeMetadata = {
      name: "updated_name",
      url: "/update-url",
      icon: {
        name: "Launch",
        color: "var(--spectrum-global-color-orange-600)",
      },
    }

    ctx.test.workspaceStore.syncMetadata(fakeMetadata)

    expect(ctx.test.store).toStrictEqual({
      ...INITIAL_WORKSPACE_META_STATE,
      ...fakeMetadata,
    })
  })

  it("refreshes the current workspace package", async ctx => {
    const original = generateAppPackage({ name: "Original workspace" })
    const refreshed = {
      ...original,
      application: { ...original.application, name: "Refreshed workspace" },
    }
    ctx.test.workspaceStore.syncWorkspacePackage(original)
    API.fetchAppPackage.mockResolvedValueOnce(refreshed)

    const applied = await ctx.test.workspaceStore.refresh()

    expect(applied).toBe(true)
    expect(ctx.test.store.name).toBe("Refreshed workspace")
    expect(initialise).toHaveBeenCalledExactlyOnceWith(refreshed)
  })

  it("keeps the next workspace when an earlier refresh finishes", async ctx => {
    const original = generateAppPackage({ name: "Original workspace" })
    const destination = generateAppPackage({ name: "Destination workspace" })
    const pending = defer()
    ctx.test.workspaceStore.syncWorkspacePackage(original)
    API.fetchAppPackage.mockReturnValueOnce(pending.promise)
    const refreshing = ctx.test.workspaceStore.refresh()

    ctx.test.workspaceStore.reset()
    ctx.test.workspaceStore.syncWorkspacePackage(destination)
    pending.resolve(original)
    const applied = await refreshing

    expect(applied).toBe(false)
    expect(ctx.test.store.appId).toBe(destination.application.appId)
    expect(ctx.test.store.name).toBe("Destination workspace")
    expect(initialise).not.toHaveBeenCalled()
  })

  it("ignores a refresh from an earlier visit to the same workspace", async ctx => {
    const original = generateAppPackage({ name: "Before navigation" })
    const destination = generateAppPackage({ name: "Destination workspace" })
    const revisited = {
      ...original,
      application: { ...original.application, name: "After returning" },
    }
    const pending = defer()
    ctx.test.workspaceStore.syncWorkspacePackage(original)
    API.fetchAppPackage.mockReturnValueOnce(pending.promise)
    const refreshing = ctx.test.workspaceStore.refresh()

    ctx.test.workspaceStore.reset()
    ctx.test.workspaceStore.syncWorkspacePackage(destination)
    ctx.test.workspaceStore.reset()
    ctx.test.workspaceStore.syncWorkspacePackage(revisited)
    pending.resolve(original)
    const applied = await refreshing

    expect(applied).toBe(false)
    expect(ctx.test.store.appId).toBe(original.application.appId)
    expect(ctx.test.store.name).toBe("After returning")
    expect(initialise).not.toHaveBeenCalled()
  })

  it("keeps the latest package when overlapping refreshes finish out of order", async ctx => {
    const original = generateAppPackage({ name: "Original workspace" })
    const refreshed = {
      ...original,
      application: { ...original.application, name: "Latest workspace" },
    }
    const older = defer()
    const newer = defer()
    ctx.test.workspaceStore.syncWorkspacePackage(original)
    API.fetchAppPackage
      .mockReturnValueOnce(older.promise)
      .mockReturnValueOnce(newer.promise)
    const olderRefresh = ctx.test.workspaceStore.refresh()
    const newerRefresh = ctx.test.workspaceStore.refresh()

    newer.resolve(refreshed)
    const newerApplied = await newerRefresh
    older.resolve(original)
    const olderApplied = await olderRefresh

    expect(newerApplied).toBe(true)
    expect(olderApplied).toBe(false)
    expect(ctx.test.store.name).toBe("Latest workspace")
    expect(initialise).toHaveBeenCalledExactlyOnceWith(refreshed)
  })

  it("keeps reset metadata when a pending refresh finishes", async ctx => {
    const original = generateAppPackage({})
    const pending = defer()
    ctx.test.workspaceStore.syncWorkspacePackage(original)
    API.fetchAppPackage.mockReturnValueOnce(pending.promise)
    const refreshing = ctx.test.workspaceStore.refresh()

    ctx.test.workspaceStore.reset()
    pending.resolve(original)
    const applied = await refreshing

    expect(applied).toBe(false)
    expect(ctx.test.store).toStrictEqual(INITIAL_WORKSPACE_META_STATE)
    expect(initialise).not.toHaveBeenCalled()
  })

  it("preserves a newer package loaded for the current workspace", async ctx => {
    const original = generateAppPackage({ name: "Original workspace" })
    const replacement = {
      ...original,
      application: { ...original.application, name: "Replacement workspace" },
    }
    const pending = defer()
    ctx.test.workspaceStore.syncWorkspacePackage(original)
    API.fetchAppPackage.mockReturnValueOnce(pending.promise)
    const refreshing = ctx.test.workspaceStore.refresh()

    ctx.test.workspaceStore.syncWorkspacePackage(replacement)
    pending.resolve(original)
    const applied = await refreshing

    expect(applied).toBe(false)
    expect(ctx.test.store.name).toBe("Replacement workspace")
    expect(initialise).not.toHaveBeenCalled()
  })

  it("propagates a failed refresh request", async ctx => {
    const original = generateAppPackage({})
    ctx.test.workspaceStore.syncWorkspacePackage(original)
    API.fetchAppPackage.mockRejectedValueOnce(new Error("Refresh unavailable"))

    await expect(ctx.test.workspaceStore.refresh()).rejects.toThrow(
      "Refresh unavailable"
    )
    expect(ctx.test.store.appId).toBe(original.application.appId)
    expect(initialise).not.toHaveBeenCalled()
  })
})
