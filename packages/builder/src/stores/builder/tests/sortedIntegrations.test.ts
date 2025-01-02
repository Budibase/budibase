import { it, expect, describe, beforeEach, vi } from "vitest"
import { SortedIntegrationStore } from "@/stores/builder/sortedIntegrations"
import { DatasourceTypes } from "@/constants/backend"

import { derived } from "svelte/store"
import { integrations } from "@/stores/builder/integrations"

vi.mock("svelte/store", () => ({
  derived: vi.fn(() => ({
    subscribe: vi.fn(),
  })),
  writable: vi.fn(() => ({
    subscribe: vi.fn(),
  })),
}))

vi.mock("@/stores/builder/integrations", () => ({ integrations: vi.fn() }))

const mockedDerived = vi.mocked(derived)

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
  interface LocalContext {
    returnedStore: SortedIntegrationStore
    derivedCallback: any
  }

  beforeEach<LocalContext>(ctx => {
    vi.clearAllMocks()

    ctx.returnedStore = new SortedIntegrationStore()
    ctx.derivedCallback = mockedDerived.mock.calls[0]?.[1]
  })

  it("calls derived with the correct parameters", () => {
    expect(mockedDerived).toHaveBeenCalledTimes(1)
    expect(mockedDerived).toHaveBeenCalledWith(
      integrations,
      expect.any(Function)
    )
  })

  describe("derived callback", () => {
    it<LocalContext>("When integrations are present", ctx => {
      expect(ctx.derivedCallback(inputA)).toEqual(expectedOutput)
      expect(ctx.derivedCallback(inputB)).toEqual(expectedOutput)
    })
  })
})
