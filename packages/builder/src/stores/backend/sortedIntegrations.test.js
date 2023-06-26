import { it, expect, describe, beforeEach, vi } from "vitest"
import { createSortedIntegrationsStore } from "./sortedIntegrations"
import { DatasourceTypes } from "constants/backend"

import { derived } from "svelte/store"
import { integrations } from "stores/backend/integrations"

vi.mock("svelte/store", () => ({
  derived: vi.fn(() => {}),
}))

vi.mock("stores/backend/integrations", () => ({ integrations: vi.fn() }))

const inputA = {
  nonRelationalA: {
    friendlyName: "non-relational A",
    type: DatasourceTypes.NON_RELATIONAL,
  },
  relationalB: {
    friendlyName: "relational B",
    type: DatasourceTypes.RELATIONAL,
  },
  relationalA: {
    friendlyName: "relational A",
    type: DatasourceTypes.RELATIONAL,
  },
  api: {
    friendlyName: "api",
    type: DatasourceTypes.API,
  },
  relationalC: {
    friendlyName: "relational C",
    type: DatasourceTypes.RELATIONAL,
  },
  nonRelationalB: {
    friendlyName: "non-relational B",
    type: DatasourceTypes.NON_RELATIONAL,
  },
  otherC: {
    friendlyName: "other C",
    type: "random",
  },
  otherB: {
    friendlyName: "other B",
    type: "arbitrary",
  },
  otherA: {
    friendlyName: "other A",
    type: "arbitrary",
  },
}

const inputB = Object.fromEntries(Object.entries(inputA).reverse())

const expectedOutput = [
  {
    name: "api",
    friendlyName: "api",
    type: DatasourceTypes.API,
  },
  {
    name: "relationalA",
    friendlyName: "relational A",
    type: DatasourceTypes.RELATIONAL,
  },
  {
    name: "relationalB",
    friendlyName: "relational B",
    type: DatasourceTypes.RELATIONAL,
  },
  {
    name: "relationalC",
    friendlyName: "relational C",
    type: DatasourceTypes.RELATIONAL,
  },
  {
    name: "nonRelationalA",
    friendlyName: "non-relational A",
    type: DatasourceTypes.NON_RELATIONAL,
  },
  {
    name: "nonRelationalB",
    friendlyName: "non-relational B",
    type: DatasourceTypes.NON_RELATIONAL,
  },
  {
    name: "otherA",
    friendlyName: "other A",
    type: "arbitrary",
  },
  {
    name: "otherB",
    friendlyName: "other B",
    type: "arbitrary",
  },
  {
    name: "otherC",
    friendlyName: "other C",
    type: "random",
  },
]

describe("sorted integrations store", () => {
  beforeEach(ctx => {
    vi.clearAllMocks()

    ctx.returnedStore = createSortedIntegrationsStore()

    ctx.derivedCallback = derived.mock.calls[0][1]
  })

  it("calls derived with the correct parameters", () => {
    expect(derived).toHaveBeenCalledTimes(1)
    expect(derived).toHaveBeenCalledWith(integrations, expect.toBeFunc())
  })

  describe("derived callback", () => {
    it("When no integrations are loaded", ctx => {
      expect(ctx.derivedCallback({})).toEqual([])
    })

    it("When integrations are present", ctx => {
      expect(ctx.derivedCallback(inputA)).toEqual(expectedOutput)
      expect(ctx.derivedCallback(inputB)).toEqual(expectedOutput)
    })
  })
})
