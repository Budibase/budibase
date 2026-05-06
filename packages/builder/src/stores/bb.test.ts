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
    store.settings("/connections/knowledge")

    expect(get(store).settings.open).toBe(false)
    expect(get(store).settings.route).toBeUndefined()
    expect(get(store).settings.pendingPath).toBe("/connections/knowledge")
    expect(get(store).settings.pendingParams).toBeUndefined()
  })

  it("resolves a pending settings route when resolver becomes available", () => {
    store.update(state => ({
      ...state,
      settings: {
        ...state.settings,
        pendingPath: "/connections/knowledge",
      },
    }))

    setSettingsRouteResolver(path => {
      if (path !== "/connections/knowledge") {
        return null
      }
      return {
        entry: {
          path: "/connections/knowledge",
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
    expect(get(store).settings.route?.entry.path).toBe("/connections/knowledge")
    expect(get(store).settings.route?.params).toEqual({
      initial: "value",
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
})
