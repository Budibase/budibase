import { it, expect, describe, beforeEach, vi } from "vitest"
import { Operations, initialState, createHistoryStore } from "../history"

import { writable, derived, get } from "svelte/store"
import * as jsonpatch from "fast-json-patch/index.mjs"

vi.mock("svelte/store", () => {
  return {
    writable: vi.fn(),
    derived: vi.fn(),
    get: vi.fn(),
  }
})

vi.mock("fast-json-patch/index.mjs", () => {
  return {
    compare: vi.fn(),
    deepClone: vi.fn(),
    applyPatch: vi.fn(),
  }
})

describe("admin store", () => {
  beforeEach(ctx => {
    vi.clearAllMocks()

    ctx.writableReturn = { update: vi.fn(), subscribe: vi.fn(), set: vi.fn() }
    writable.mockReturnValue(ctx.writableReturn)

    ctx.derivedReturn = { subscribe: vi.fn() }
    derived.mockReturnValue(ctx.derivedReturn)

    ctx.getDoc = vi.fn().mockReturnValue({})
    ctx.selectDoc = vi.fn().mockReturnValue({})
    ctx.beforeAction = vi.fn()
    ctx.afterAction = vi.fn()

    ctx.returnedStore = createHistoryStore({
      getDoc: ctx.getDoc,
      selectDoc: ctx.selectDoc,
      beforeAction: ctx.beforeAction,
      afterAction: ctx.afterAction,
    })
  })

  describe("init", () => {
    it.skip("inits the writable store with the default config", () => {
      expect(writable).toHaveBeenCalledTimes(1)
      expect(writable).toHaveBeenCalledWith(initialState)
    })

    it.skip("inits the derived store with the initial writable store and an update function", () => {
      expect(derived).toHaveBeenCalledTimes(1)
      expect(derived.mock.calls[0][1]({ position: 0, history: [] })).toEqual({
        position: 0,
        history: [],
        canUndo: false,
        canRedo: false,
      })
    })

    it.skip("returns the created store and methods to manipulate it", ctx => {
      expect(ctx.returnedStore).toEqual({
        subscribe: expect.toBe(ctx.derivedReturn.subscribe),
        wrapSaveDoc: expect.toBeFunc(),
        wrapDeleteDoc: expect.toBeFunc(),
        reset: expect.toBeFunc(),
        undo: expect.toBeFunc(),
        redo: expect.toBeFunc(),
      })
    })
  })

  describe("wrapSaveDoc", () => {
    beforeEach(async ctx => {
      console.log(
        "BEFORE: jsonpatch.deepClone calls:",
        jsonpatch.deepClone.mock?.calls?.length || 0
      )
      ctx.saveFn = vi.fn().mockResolvedValue("fn")

      ctx.doc = { _id: "id" }
      ctx.oldDoc = { _id: "oldDoc" }
      ctx.newDoc = { _id: "newDoc" }
      ctx.getDoc.mockReturnValue(ctx.oldDoc)
      jsonpatch.deepClone.mockReturnValue(ctx.newDoc)

      vi.stubGlobal("Math", { random: vi.fn() })

      ctx.forwardPatch = { foo: 1 }
      ctx.backwardsPatch = { bar: 2 }

      jsonpatch.compare.mockReturnValueOnce(ctx.forwardPatch)
      jsonpatch.compare.mockReturnValueOnce(ctx.backwardsPatch)
      Math.random.mockReturnValue(1234)

      const wrappedSaveFn = ctx.returnedStore.wrapSaveDoc(ctx.saveFn)
      await wrappedSaveFn(ctx.doc, null)
    })

    it.skip("sets the state to loading", ctx => {
      expect(ctx.writableReturn.update.mock.calls[0][0]({})).toEqual({
        loading: true,
      })
    })

    it.skip("retrieves the old doc", ctx => {
      expect(ctx.getDoc).toHaveBeenCalledTimes(1)
      expect(ctx.getDoc).toHaveBeenCalledWith("id")
    })

    it.skip("clones the new doc", ctx => {
      console.log("In test - deepClone calls:", jsonpatch.deepClone.mock.calls)
      expect(ctx.saveFn).toHaveBeenCalledTimes(1)
      expect(ctx.saveFn).toHaveBeenCalledWith(ctx.doc)
      expect(jsonpatch.deepClone).toHaveBeenCalledTimes(1)
      expect(jsonpatch.deepClone).toHaveBeenCalledWith("fn")
    })

    it.skip("creates the undo/redo patches", ctx => {
      expect(jsonpatch.compare).toHaveBeenCalledTimes(2)
      expect(jsonpatch.compare.mock.calls[0]).toEqual([ctx.oldDoc, ctx.doc])
      expect(jsonpatch.compare.mock.calls[1]).toEqual([ctx.doc, ctx.oldDoc])
    })

    it.skip("saves the operation", ctx => {
      expect(
        ctx.writableReturn.update.mock.calls[1][0]({
          history: [],
          position: 0,
        })
      ).toEqual({
        history: [
          {
            type: Operations.Change,
            backwardsPatch: ctx.backwardsPatch,
            forwardPatch: ctx.forwardPatch,
            doc: ctx.newDoc,
            id: 1234,
          },
        ],
        position: 1,
      })
    })

    it.skip("sets the state to not loading", ctx => {
      expect(ctx.writableReturn.update).toHaveBeenCalledTimes(3)
      expect(ctx.writableReturn.update.mock.calls[2][0]({})).toEqual({
        loading: false,
      })
    })
  })

  describe("wrapDeleteDoc", () => {
    beforeEach(async ctx => {
      ctx.deleteFn = vi.fn().mockResolvedValue("fn")

      ctx.doc = { _id: "id" }
      ctx.oldDoc = { _id: "oldDoc" }
      jsonpatch.deepClone.mockReturnValue(ctx.oldDoc)

      vi.stubGlobal("Math", { random: vi.fn() })
      Math.random.mockReturnValue(1235)

      const wrappedDeleteDoc = ctx.returnedStore.wrapDeleteDoc(ctx.deleteFn)
      await wrappedDeleteDoc(ctx.doc, null)
    })

    it.skip("sets the state to loading", ctx => {
      expect(ctx.writableReturn.update.mock.calls[0][0]({})).toEqual({
        loading: true,
      })
    })

    it.skip("clones the doc", ctx => {
      expect(jsonpatch.deepClone).toHaveBeenCalledTimes(1)
      expect(jsonpatch.deepClone).toHaveBeenCalledWith(ctx.doc)
    })

    it.skip("calls the delete fn with the doc", ctx => {
      expect(ctx.deleteFn).toHaveBeenCalledTimes(1)
      expect(ctx.deleteFn).toHaveBeenCalledWith(ctx.doc)
    })

    it.skip("saves the operation", ctx => {
      expect(
        ctx.writableReturn.update.mock.calls[1][0]({
          history: [],
          position: 0,
        })
      ).toEqual({
        history: [
          {
            type: Operations.Delete,
            doc: ctx.oldDoc,
            id: 1235,
          },
        ],
        position: 1,
      })
    })

    it.skip("sets the state to not loading", ctx => {
      expect(ctx.writableReturn.update).toHaveBeenCalledTimes(3)
      expect(ctx.writableReturn.update.mock.calls[2][0]({})).toEqual({
        loading: false,
      })
    })
  })

  describe("reset", () => {
    beforeEach(ctx => {
      ctx.returnedStore.reset()
    })

    it.skip("sets the store to the initial state", ctx => {
      expect(ctx.writableReturn.set).toHaveBeenCalledTimes(1)
      expect(ctx.writableReturn.set).toHaveBeenCalledWith(initialState)
    })
  })

  describe("undo", () => {
    beforeEach(async ctx => {
      ctx.history = [
        { type: Operations.Delete, doc: { _id: 1236, _rev: "rev" } },
      ]
      ctx.derivedReturn = {
        subscribe: vi.fn(),
        canUndo: true,
        history: ctx.history,
        position: 1,
        loading: false,
      }
      get.mockReturnValue(ctx.derivedReturn)

      jsonpatch.deepClone.mockReturnValueOnce(ctx.history[0].doc)

      ctx.newDoc = { _id: 1337 }
      ctx.saveFn = vi.fn().mockResolvedValue(ctx.newDoc)
      jsonpatch.deepClone.mockReturnValueOnce(ctx.newDoc)

      // We need to create a wrapped saveFn before undo can be invoked
      ctx.returnedStore.wrapSaveDoc(ctx.saveFn)
      await ctx.returnedStore.undo()
    })

    it.skip("sets the state to loading", ctx => {
      expect(ctx.writableReturn.update.mock.calls[0][0]({})).toEqual({
        loading: true,
      })
    })

    it.skip("calls the beforeAction", ctx => {
      expect(ctx.beforeAction).toHaveBeenCalledTimes(1)
      expect(ctx.beforeAction).toHaveBeenCalledWith(ctx.history[0])
    })

    it.skip("sets the state to the previous position", ctx => {
      expect(
        ctx.writableReturn.update.mock.calls[1][0]({ history: [], position: 1 })
      ).toEqual({ history: [], position: 0 })
    })

    it.skip("clones the doc", ctx => {
      expect(jsonpatch.deepClone).toHaveBeenCalledWith(ctx.history[0].doc)
    })

    it.skip("deletes the doc's rev", ctx => {
      expect(ctx.history[0].doc._rev).toBe(undefined)
    })

    it.skip("calls the wrappedSaveFn", ctx => {
      expect(jsonpatch.deepClone).toHaveBeenCalledWith(ctx.newDoc)
      expect(ctx.saveFn).toHaveBeenCalledWith(ctx.history[0].doc)
    })

    it.skip("calls selectDoc", ctx => {
      expect(ctx.selectDoc).toHaveBeenCalledWith(ctx.newDoc._id)
    })

    it.skip("sets the state to not loading", ctx => {
      expect(ctx.writableReturn.update.mock.calls[5][0]({})).toEqual({
        loading: false,
      })
    })

    it.skip("calls the afterAction", ctx => {
      expect(ctx.afterAction).toHaveBeenCalledTimes(1)
      expect(ctx.afterAction).toHaveBeenCalledWith(ctx.history[0])
    })
  })

  describe("redo", () => {
    beforeEach(async ctx => {
      ctx.history = [
        { type: Operations.Delete, doc: { _id: 1236, _rev: "rev" } },
      ]
      ctx.derivedReturn = {
        subscribe: vi.fn(),
        canRedo: true,
        history: ctx.history,
        position: 0,
        loading: false,
      }

      get.mockReturnValue(ctx.derivedReturn)

      ctx.latestDoc = { _id: 1337 }
      ctx.getDoc.mockReturnValue(ctx.latestDoc)

      // We need to create a wrapped deleteFn before redo can be invoked
      ctx.deleteFn = vi.fn().mockResolvedValue(ctx.newDoc)
      ctx.returnedStore.wrapDeleteDoc(ctx.deleteFn)

      await ctx.returnedStore.redo()
    })

    it.skip("sets the state to loading", ctx => {
      expect(ctx.writableReturn.update.mock.calls[0][0]({})).toEqual({
        loading: true,
      })
    })

    it.skip("calls the beforeAction", ctx => {
      expect(ctx.beforeAction).toHaveBeenCalledTimes(1)
      expect(ctx.beforeAction).toHaveBeenCalledWith(ctx.history[0])
    })

    it.skip("sets the state to the next position", ctx => {
      expect(
        ctx.writableReturn.update.mock.calls[1][0]({ history: [], position: 0 })
      ).toEqual({ history: [], position: 1 })
    })

    it.skip("calls the wrappedDeleteFn", ctx => {
      expect(ctx.deleteFn).toHaveBeenCalledWith(ctx.latestDoc)
    })

    it.skip("sets the state to not loading", ctx => {
      expect(ctx.writableReturn.update.mock.calls[5][0]({})).toEqual({
        loading: false,
      })
    })

    it.skip("calls the afterAction", ctx => {
      expect(ctx.afterAction).toHaveBeenCalledTimes(1)
      expect(ctx.afterAction).toHaveBeenCalledWith(ctx.history[0])
    })
  })
})
