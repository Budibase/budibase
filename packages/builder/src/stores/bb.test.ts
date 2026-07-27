import { describe, it, expect, beforeEach } from "vitest"
import { get } from "svelte/store"
import { BBStore, setSettingsRouteResolver } from "@/stores/bb"

describe("BBStore pending settings", () => {
  let store: BBStore

  beforeEach(() => {
    store = new BBStore()
    setSettingsRouteResolver(() => null)
  })

  it("keeps settings closed when route cannot be resolved", () => {
    store.settings("/connections/apis")

    expect(get(store).settings.open).toBe(false)
    expect(get(store).settings.route).toBeUndefined()
    expect(get(store).settings.pendingPath).toBe("/connections/apis")
    expect(get(store).settings.pendingParams).toBeUndefined()
  })

  it("resolves a pending settings route when resolver becomes available", () => {
    store.update(state => ({
      ...state,
      settings: {
        ...state.settings,
        pendingPath: "/connections/apis",
      },
    }))

    setSettingsRouteResolver(path => {
      if (path !== "/connections/apis") {
        return null
      }
      return {
        entry: {
          path: "/connections/apis",
        },
        params: {
          initial: "value",
        },
      }
    })

    store.tryResolvePendingSettings()

    expect(get(store).settings.open).toBe(true)
    expect(get(store).settings.pendingPath).toBeUndefined()
    expect(get(store).settings.pendingParams).toBeUndefined()
    expect(get(store).settings.route?.entry.path).toBe("/connections/apis")
    expect(get(store).settings.route?.params).toEqual({
      initial: "value",
    })
  })

  it("preserves params while resolving a pending settings route", () => {
    store.settings("/connections/completions/new", {
      provider: "Budibase",
    })

    expect(get(store).settings.pendingPath).toBe("/connections/completions/new")
    expect(get(store).settings.pendingParams).toEqual({
      provider: "Budibase",
    })

    setSettingsRouteResolver(path => {
      if (path !== "/connections/completions/new") {
        return null
      }
      return {
        entry: {
          path: "/connections/:type/:configId",
        },
        params: {
          configId: "new",
        },
      }
    })

    store.tryResolvePendingSettings()

    expect(get(store).settings.route?.params).toEqual({
      configId: "new",
      provider: "Budibase",
    })
  })

  it("opens settings immediately when route is resolvable", () => {
    setSettingsRouteResolver(path => {
      if (path !== "/connections/apis") {
        return null
      }
      return {
        entry: {
          path: "/connections/apis",
        },
        params: {},
      }
    })

    store.settings("/connections/apis")

    expect(get(store).settings.open).toBe(true)
    expect(get(store).settings.route?.entry.path).toBe("/connections/apis")
    expect(get(store).settings.pendingPath).toBeUndefined()
  })

  it("merges params into resolvable settings routes", () => {
    setSettingsRouteResolver(path => {
      if (path !== "/connections/completions/new") {
        return null
      }
      return {
        entry: {
          path: "/connections/:type/:configId",
        },
        params: {
          configId: "new",
        },
      }
    })

    store.settings("/connections/completions/new", {
      provider: "Budibase",
    })

    expect(get(store).settings.open).toBe(true)
    expect(get(store).settings.route?.params).toEqual({
      configId: "new",
      provider: "Budibase",
    })
  })
})
