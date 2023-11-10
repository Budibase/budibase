import { it, expect, describe, beforeEach, vi } from "vitest"
import { DEFAULT_BB_DATASOURCE_ID } from "constants/backend"
import { integrationForDatasource, hasData, hasDefaultData } from "./selectors"

describe("selectors", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("integrationForDatasource", () => {
    it("returns the integration corresponding to the given datasource", () => {
      expect(
        integrationForDatasource(
          { integrationOne: { some: "data" } },
          { source: "integrationOne" }
        )
      ).toEqual({ some: "data", name: "integrationOne" })
    })
  })

  describe("hasData", () => {
    describe("when the user has created a datasource in addition to the premade Budibase DB source", () => {
      it("returns true", () => {
        expect(hasData({ list: [1, 1] }, { list: [] })).toBe(true)
      })
    })

    describe("when the user has created a table in addition to the premade users table", () => {
      it("returns true", () => {
        expect(hasData({ list: [] }, { list: [1, 1] })).toBe(true)
      })
    })

    describe("when the user doesn't have data", () => {
      it("returns false", () => {
        expect(hasData({ list: [] }, { list: [] })).toBe(false)
      })
    })
  })

  describe("hasDefaultData", () => {
    describe("when the user has default data", () => {
      it("returns true", () => {
        expect(
          hasDefaultData({ list: [{ _id: DEFAULT_BB_DATASOURCE_ID }] })
        ).toBe(true)
      })
    })

    describe("when the user doesn't have default data", () => {
      it("returns false", () => {
        expect(hasDefaultData({ list: [{ _id: "some other id" }] })).toBe(false)
      })
    })
  })
})
