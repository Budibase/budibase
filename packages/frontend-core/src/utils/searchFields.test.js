import { describe, expect, it } from "vitest"
import { getFields, getTableFields } from "./searchFields.js"

const field = (name, type, extra = {}) => ({
  name,
  type,
  ...extra,
})

const table = (id, schema) => ({
  _id: id,
  name: id,
  sql: true,
  schema,
})

describe("search fields", () => {
  const relatedTable = table("t2", {
    title: field("title", "string"),
    otherLink: field("otherLink", "link", { tableId: "t3" }),
  })
  const baseTable = table("t1", {
    name: field("name", "string"),
    rel: field("rel", "link", { tableId: "t2" }),
  })
  const tables = [baseTable, relatedTable]

  describe("getTableFields", () => {
    it("excludes nested link fields when allowLinks is false", () => {
      const fields = getTableFields(tables, baseTable.schema.rel)
      expect(fields.map(field => field.name)).toEqual(["rel.title"])
    })

    it("returns empty for non-sql related tables", () => {
      const nonSqlTable = {
        ...relatedTable,
        sql: false,
      }
      const fields = getTableFields([baseTable, nonSqlTable], {
        ...baseTable.schema.rel,
        tableId: nonSqlTable._id,
      })
      expect(fields).toEqual([])
    })
  })

  describe("getFields", () => {
    it("excludes link fields when allowLinks is false", () => {
      const fields = getFields(tables, Object.values(baseTable.schema), {
        allowLinks: false,
      })
      expect(fields.map(field => field.name)).toEqual(["name"])
    })

    it("includes one relationship depth when allowLinks is true", () => {
      const fields = getFields(tables, Object.values(baseTable.schema), {
        allowLinks: true,
      })
      const names = fields.map(field => field.name)
      expect(names).toEqual(
        expect.arrayContaining(["name", "rel", "rel.title"])
      )
      expect(names).not.toEqual(expect.arrayContaining(["rel.otherLink"]))
    })

    it("appends static formula fields even when allowLinks is false", () => {
      const withFormula = table("t4", {
        name: field("name", "string"),
        calc: field("calc", "formula", { formulaType: "static" }),
        rel: field("rel", "link", { tableId: "t2" }),
      })
      const fields = getFields(tables, Object.values(withFormula.schema), {
        allowLinks: false,
      })
      expect(fields.map(field => field.name)).toEqual(
        expect.arrayContaining(["name", "calc"])
      )
    })

    it("filters out banned field types", () => {
      const withBanned = table("t5", {
        name: field("name", "string"),
        meta: field("meta", "json"),
        files: field("files", "attachment"),
        file: field("file", "attachment_single"),
      })
      const fields = getFields(tables, Object.values(withBanned.schema), {
        allowLinks: false,
      })
      expect(fields.map(field => field.name)).toEqual(["name"])
    })
  })
})
