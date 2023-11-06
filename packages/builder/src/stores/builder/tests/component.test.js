import { it, expect, describe, beforeEach, vi } from "vitest"
import { get } from "svelte/store"
import {
  INITIAL_COMPONENTS_STATE,
  ComponentStore,
} from "stores/builder/components"

describe("Component store", () => {
  beforeEach(ctx => {
    vi.clearAllMocks()
    const componentStore = new ComponentStore()
    ctx.test = {}
    ctx.test = {
      get store() {
        return get(componentStore)
      },
      get $store() {
        return get(componentStore) //store and $store
      },
      componentStore,
    }
  })

  it("Create base component store with defaults", ctx => {
    expect(ctx.test.store).toStrictEqual(INITIAL_COMPONENTS_STATE)
  })
})
