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
    it("exposes the related _id and excludes nested link fields", () => {
      const fields = getTableFields(tables, baseTable.schema.rel)
      expect(fields.map(field => field.name)).toEqual(["rel._id", "rel.title"])
    })

    it("exposes the related _id as a filterable string type", () => {
      const fields = getTableFields(tables, baseTable.schema.rel)
      const idField = fields.find(field => field.name === "rel._id")
      expect(idField).toEqual({ name: "rel._id", type: "string" })
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
        expect.arrayContaining(["name", "rel", "rel._id", "rel.title"])
      )
      expect(names).not.toContain("rel.otherLink")
    })

    it("drills relationships by default when allowLinks is omitted", () => {
      const names = getFields(tables, Object.values(baseTable.schema)).map(
        field => field.name
      )
      expect(names).toEqual(
        expect.arrayContaining(["name", "rel", "rel._id", "rel.title"])
      )
    })

    it("adds a distinct _id for each relationship", () => {
      const authors = table("t6", { fullName: field("fullName", "string") })
      const categories = table("t7", { code: field("code", "string") })
      const posts = table("t8", {
        name: field("name", "string"),
        author: field("author", "link", { tableId: "t6" }),
        category: field("category", "link", { tableId: "t7" }),
      })
      const names = getFields(
        [posts, authors, categories],
        Object.values(posts.schema),
        { allowLinks: true }
      ).map(field => field.name)
      expect(names).toEqual(
        expect.arrayContaining([
          "author._id",
          "author.fullName",
          "category._id",
          "category.code",
        ])
      )
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
