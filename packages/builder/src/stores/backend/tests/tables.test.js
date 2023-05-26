import { it, expect, describe, beforeEach, vi } from "vitest"
import { createTablesStore } from "../tables"
import { writable, get, derived } from "svelte/store"
import { API } from "api"

vi.mock("api", () => {
  return {
    API: {
      getTables: vi.fn(),
      fetchTableDefinition: vi.fn(),
      saveTable: vi.fn(),
      deleteTable: vi.fn(),
    },
  }
})

vi.mock("stores/backend", () => {
  return { datasources: vi.fn() }
})

// explict mock that is overwritten later
vi.mock("svelte/store", () => {
  return {
    writable: vi.fn(() => ({
      subscribe: vi.fn(),
      update: vi.fn(),
    })),
    get: vi.fn(),
    derived: vi.fn(() => ({
      subscribe: vi.fn(),
      update: vi.fn(),
    })),
  }
})

describe("tables store", () => {
  beforeEach(ctx => {
    vi.clearAllMocks()

    ctx.writableReturn = { update: vi.fn(), subscribe: vi.fn() }
    writable.mockReturnValue(ctx.writableReturn)

    ctx.derivedReturn = { update: vi.fn(), subscribe: vi.fn() }
    derived.mockReturnValue(ctx.derivedReturn)

    ctx.returnedStore = createTablesStore()
  })

  it("returns the created store", ctx => {
    expect(ctx.returnedStore).toEqual({
      subscribe: expect.toBe(ctx.derivedReturn.subscribe),
      init: expect.toBeFunc(),
      fetch: expect.toBeFunc(),
      fetchTable: expect.toBeFunc(),
      select: expect.toBeFunc(),
      save: expect.toBeFunc(),
      delete: expect.toBeFunc(),
      saveField: expect.toBeFunc(),
      deleteField: expect.toBeFunc(),
      updateTable: expect.toBeFunc(),
    })
  })

  describe("fetch", () => {
    it("calls getTables and updates the store", async ctx => {
      const listOfTables = ["T1", "T2"]
      API.getTables.mockReturnValue(listOfTables)

      const state = {
        foo: "foo",
      }
      await ctx.returnedStore.fetch()

      expect(API.getTables).toHaveBeenCalledTimes(1)
      expect(ctx.writableReturn.update.calls[0][0](state)).toEqual({
        foo: "foo",
        list: listOfTables,
      })
    })
  })

  describe("fetchTable", () => {
    it("calls fetchTableDefinition and updates a specific table in the store", async ctx => {
      const tableId = "TABLE_ID"
      const table = { _id: tableId, name: "NEW" }
      API.fetchTableDefinition.mockReturnValue(table)

      const state = {
        list: [
          {
            _id: "T1",
            name: "OLD_1",
          },
          {
            _id: tableId,
            name: "OLD_2",
          },
          {
            _id: "T3",
            name: "OLD_3",
          },
        ],
      }
      await ctx.returnedStore.fetchTable(tableId)

      expect(API.fetchTableDefinition).toHaveBeenCalledTimes(1)
      expect(API.fetchTableDefinition).toHaveBeenCalledWith(tableId)

      expect(ctx.writableReturn.update.calls[0][0](state)).toEqual({
        list: [
          {
            _id: "T1",
            name: "OLD_1",
          },
          {
            _id: tableId,
            name: "NEW",
          },
          {
            _id: "T3",
            name: "OLD_3",
          },
        ],
      })
    })
  })

  describe("select", () => {
    it("updates the store with the selected table id", async ctx => {
      const tableId = "TABLE_ID"
      const state = {
        foo: "foo",
      }
      await ctx.returnedStore.select(tableId)

      expect(ctx.writableReturn.update.calls[0][0](state)).toEqual({
        foo: "foo",
        selectedTableId: tableId,
      })
    })
  })

  describe("delete", () => {
    it("calls deleteTable and does a store fetch", async ctx => {
      const table = {
        _id: "TABLE_ID",
        _rev: "REV",
      }
      const listOfTables = ["T1", "T2"]
      API.deleteTable.mockReturnValue()
      API.getTables.mockReturnValue(listOfTables)

      await ctx.returnedStore.delete(table)

      expect(API.deleteTable).toHaveBeenCalledTimes(1)
      expect(API.deleteTable).toHaveBeenCalledWith({
        tableId: "TABLE_ID",
        tableRev: "REV",
      })

      expect(API.getTables).toHaveBeenCalledTimes(1)
      expect(ctx.writableReturn.update.calls[0][0]({})).toEqual({
        list: listOfTables,
      })
    })
  })

  describe("updateTable", () => {
    beforeEach(() => {
      get.mockImplementation(() => {
        return {
          list: [
            {
              _id: "T1",
              name: "OLD_1",
            },
            {
              _id: "T2",
              name: "OLD_2",
            },
            {
              _id: "T3",
              name: "OLD_3",
            },
          ],
        }
      })
    })
    it("gets a specific table in the store and overwrites it with a new table object", async ctx => {
      const table = {
        _id: "T3",
        _rev: "REV",
        type: "TYPE_FROM_TABLE",
        name: "NEW",
        extra: "ADD_PROP",
      }
      const state = {
        list: [
          {
            _id: "T1",
            name: "OLD_1",
          },
          {
            _id: "T2",
            name: "OLD_2",
          },
          {
            _id: "T3",
            name: "OLD_3",
            type: "TYPE_FROM_STATE",
          },
        ],
      }

      await ctx.returnedStore.updateTable(table)

      expect(ctx.writableReturn.update.calls[0][0](state)).toEqual({
        list: [
          {
            _id: "T1",
            name: "OLD_1",
          },
          {
            _id: "T2",
            name: "OLD_2",
          },
          {
            _id: "T3",
            _rev: "REV",
            name: "NEW",
            extra: "ADD_PROP",
            type: "TYPE_FROM_STATE",
          },
        ],
      })
    })

    it("returns early and does not update state if the table id is not found", async ctx => {
      const table = {
        _id: "NOT_FOUND",
      }
      await ctx.returnedStore.updateTable(table)

      expect(ctx.writableReturn.update.calls.length).toBe(0)
    })
  })

  describe("saveField", () => {
    beforeEach(() => {
      get.mockImplementation(() => {
        return {
          selected: {
            _id: "TABLE_ID",
            primaryDisplay: "firstName",
            schema: {
              firstName: {
                name: "firstName",
                type: "string",
              },
              age: {
                name: "age",
                type: "number",
              },
            },
          },
          list: [
            {
              _id: "T1",
            },
            {
              _id: "T2",
            },
            {
              _id: "T3",
            },
          ],
        }
      })
    })

    it("saves a new field to a selected table", async ctx => {
      const originalName = null
      const field = {
        name: "lastName",
        type: "string",
      }
      const indexes = ["id"]

      API.saveTable.mockReturnValue("TABLE_SAVED")

      await ctx.returnedStore.saveField({
        originalName,
        field,
        indexes,
      })

      expect(API.saveTable).toHaveBeenCalledOnce()
      expect(API.saveTable).toHaveBeenCalledWith({
        _id: "TABLE_ID",
        indexes,
        primaryDisplay: "firstName",
        schema: {
          firstName: {
            name: "firstName",
            type: "string",
          },
          age: {
            name: "age",
            type: "number",
          },
          lastName: field,
        },
      })
    })

    it("overwrites an existing field if renaming", async ctx => {
      const originalName = "age"
      const field = {
        name: "Years",
        type: "number",
      }
      const indexes = ["id"]

      API.saveTable.mockReturnValue("TABLE_SAVED")

      await ctx.returnedStore.saveField({
        originalName,
        field,
        indexes,
      })

      expect(API.saveTable).toHaveBeenCalledOnce()
      expect(API.saveTable).toHaveBeenCalledWith({
        _id: "TABLE_ID",
        _rename: {
          old: originalName,
          updated: "Years",
        },
        primaryDisplay: "firstName",
        indexes,
        schema: {
          firstName: {
            name: "firstName",
            type: "string",
          },
          Years: field,
        },
      })
    })

    it("will set the primaryDisplay if the flag is true", async ctx => {
      const originalName = null
      const field = {
        name: "lastName",
        type: "string",
      }

      API.saveTable.mockReturnValue("TABLE_SAVED")

      await ctx.returnedStore.saveField({
        originalName,
        field,
        primaryDisplay: true,
      })

      expect(API.saveTable).toHaveBeenCalledOnce()
      expect(API.saveTable).toHaveBeenCalledWith({
        _id: "TABLE_ID",
        primaryDisplay: "lastName",
        schema: {
          firstName: {
            name: "firstName",
            type: "string",
          },
          age: {
            name: "age",
            type: "number",
          },
          lastName: field,
        },
      })
    })

    it("will set the primaryDisplay to the next field if the flag was previously true", async ctx => {
      const originalName = "firstName"
      const field = {
        name: "firstName",
        type: "string",
      }

      API.saveTable.mockReturnValue("TABLE_SAVED")

      await ctx.returnedStore.saveField({
        originalName,
        field,
        primaryDisplay: false,
      })

      expect(API.saveTable).toHaveBeenCalledOnce()
      expect(API.saveTable).toHaveBeenCalledWith({
        _id: "TABLE_ID",
        primaryDisplay: "age",
        schema: {
          firstName: {
            name: "firstName",
            type: "string",
          },
          age: {
            name: "age",
            type: "number",
          },
        },
      })
    })

    it("will skip setting the next field as primaryDisplay if it is not a valid type", async ctx => {
      get.mockImplementation(() => {
        return {
          selected: {
            _id: "TABLE_ID",
            primaryDisplay: "firstName",
            schema: {
              firstName: {
                name: "firstName",
                type: "string",
              },
              badgePhoto: {
                name: "badgePhoto",
                type: "attachment",
              },
              relationship: {
                name: "relationship",
                type: "link",
              },
              metadata: {
                name: "metadata",
                type: "json",
              },
              age: {
                name: "age",
                type: "number",
              },
            },
          },
          list: [
            {
              _id: "T1",
            },
          ],
        }
      })
      const originalName = "firstName"
      const field = {
        name: "firstName",
        type: "string",
      }

      API.saveTable.mockReturnValue("TABLE_SAVED")

      await ctx.returnedStore.saveField({
        originalName,
        field,
        primaryDisplay: false,
      })

      expect(API.saveTable).toHaveBeenCalledOnce()
      expect(API.saveTable).toHaveBeenCalledWith({
        _id: "TABLE_ID",
        primaryDisplay: "age",
        schema: {
          firstName: {
            name: "firstName",
            type: "string",
          },
          badgePhoto: {
            name: "badgePhoto",
            type: "attachment",
          },
          relationship: {
            name: "relationship",
            type: "link",
          },
          metadata: {
            name: "metadata",
            type: "json",
          },
          age: {
            name: "age",
            type: "number",
          },
        },
      })
    })
  })

  describe("deleteField", () => {
    beforeEach(() => {
      get.mockImplementation(() => {
        return {
          selected: {
            _id: "TABLE_ID",
            primaryDisplay: "firstName",
            schema: {
              firstName: {
                name: "firstName",
                type: "string",
              },
              age: {
                name: "age",
                type: "number",
              },
            },
          },
          list: [
            {
              _id: "T1",
            },
            {
              _id: "T2",
            },
            {
              _id: "T3",
            },
          ],
        }
      })
    })

    it("deletes an existing field", async ctx => {
      const field = {
        name: "age",
        type: "number",
      }

      API.saveTable.mockReturnValue("TABLE_SAVED")

      await ctx.returnedStore.deleteField(field)

      expect(API.saveTable).toHaveBeenCalledOnce()
      expect(API.saveTable).toHaveBeenCalledWith({
        _id: "TABLE_ID",
        primaryDisplay: "firstName",
        schema: {
          firstName: {
            name: "firstName",
            type: "string",
          },
        },
      })
    })

    it("will assign a new primary display when deletes an existing primary display field", async ctx => {
      const field = {
        name: "firstName",
        type: "string",
      }

      API.saveTable.mockReturnValue("TABLE_SAVED")

      await ctx.returnedStore.deleteField(field)

      expect(API.saveTable).toHaveBeenCalledOnce()
      expect(API.saveTable).toHaveBeenCalledWith({
        _id: "TABLE_ID",
        primaryDisplay: "age",
        schema: {
          age: {
            name: "age",
            type: "number",
          },
        },
      })
    })
  })
})
