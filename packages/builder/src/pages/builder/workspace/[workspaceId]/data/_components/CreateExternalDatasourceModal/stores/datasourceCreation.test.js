import { it, expect, describe, beforeEach, vi } from "vitest"
import {
  defaultStore,
  createDatasourceCreationStore,
} from "./datasourceCreation"
import { get } from "svelte/store"

vi.mock("@/stores/selectors", () => ({
  shouldIntegrationFetchTableNames: vi.fn(),
}))

describe("datasource creation store", () => {
  beforeEach(ctx => {
    vi.clearAllMocks()
    ctx.store = createDatasourceCreationStore()

    ctx.integration = { data: "integration" }
    ctx.config = { data: "config" }
    ctx.datasource = { data: "datasource" }
  })

  describe("store creation", () => {
    it("returns the default values", ctx => {
      expect(get(ctx.store)).toEqual(defaultStore)
    })
  })

  describe("cancel", () => {
    describe("when at the `selectTables` stage", () => {
      beforeEach(ctx => {
        ctx.store.selectTablesStage()
        ctx.store.cancel()
      })

      it("marks the store as finished", ctx => {
        expect(get(ctx.store)).toEqual({
          ...defaultStore,
          stage: "selectTables",
          finished: true,
        })
      })
    })

    describe("When at any previous stage", () => {
      beforeEach(ctx => {
        ctx.store.cancel()
      })

      it("resets to the default values", ctx => {
        expect(get(ctx.store)).toEqual(defaultStore)
      })
    })
  })

  describe("googleAuthStage", () => {
    beforeEach(ctx => {
      ctx.store.googleAuthStage()
    })

    it("sets the stage", ctx => {
      expect(get(ctx.store)).toEqual({ ...defaultStore, stage: "googleAuth" })
    })
  })

  describe("setIntegration", () => {
    beforeEach(ctx => {
      ctx.store.setIntegration(ctx.integration)
    })

    it("sets the integration", ctx => {
      expect(get(ctx.store)).toEqual({
        ...defaultStore,
        integration: ctx.integration,
      })
    })
  })

  describe("setConfig", () => {
    beforeEach(ctx => {
      ctx.store.setConfig(ctx.config)
    })

    it("sets the config", ctx => {
      expect(get(ctx.store)).toEqual({
        ...defaultStore,
        config: ctx.config,
      })
    })
  })

  describe("editConfigStage", () => {
    beforeEach(ctx => {
      ctx.store.editConfigStage()
    })

    it("sets the stage", ctx => {
      expect(get(ctx.store)).toEqual({ ...defaultStore, stage: "editConfig" })
    })
  })

  describe("markAsFinished", () => {
    beforeEach(ctx => {
      ctx.store.markAsFinished()
    })

    it("marks the store as finished", ctx => {
      expect(get(ctx.store)).toEqual({
        ...defaultStore,
        finished: true,
      })
    })
  })
})
