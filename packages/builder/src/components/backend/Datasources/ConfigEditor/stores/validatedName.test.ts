import { describe, expect, it } from "vitest"
import { get } from "svelte/store"
import { MAX_RESOURCE_NAME_LENGTH } from "@budibase/types"
import { createValidatedNameStore } from "./validatedName"

describe("datasource name validation", () => {
  it.each([MAX_RESOURCE_NAME_LENGTH, MAX_RESOURCE_NAME_LENGTH + 1])(
    "validates a new name of %s characters",
    async length => {
      const store = createValidatedNameStore("", true)
      store.updateValue("a".repeat(length))
      store.markActive()
      await store.validate()
      expect(get(store).preventSubmit).toBe(length > MAX_RESOURCE_NAME_LENGTH)
    }
  )
  it("allows an unchanged oversized name", async () => {
    const store = createValidatedNameStore("a".repeat(1001), true)
    store.markActive()
    await store.validate()
    expect(get(store).preventSubmit).toBe(false)
  })
  it("rejects changing an oversized name to another oversized name", async () => {
    const store = createValidatedNameStore("a".repeat(1001), true)
    store.updateValue("b".repeat(MAX_RESOURCE_NAME_LENGTH + 1))
    store.markActive()
    await store.validate()
    expect(get(store).error).toBe("Name must be at most 128 characters")
  })
})
