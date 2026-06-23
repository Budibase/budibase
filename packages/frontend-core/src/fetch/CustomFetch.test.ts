import { describe, it, expect, vi } from "vitest"

vi.mock("@budibase/bbui", () => {
  return {
    Helpers: {
      cloneDeep: (x: any) => JSON.parse(JSON.stringify(x)),
      uuid: () => "mock-uuid",
    },
  }
})

import CustomFetch from "./CustomFetch"
import { CustomDatasource } from "@budibase/types"

describe("CustomFetch", () => {
  it("should return null for getDefaultSortColumn", () => {
    const mockAPI = {} as any
    const mockDatasource = {
      type: "custom",
      data: "[]",
    } as unknown as CustomDatasource
    const fetcher = new CustomFetch({
      API: mockAPI,
      datasource: mockDatasource,
      query: {},
    })

    expect(fetcher.getDefaultSortColumn()).toBeNull()
  })
})
