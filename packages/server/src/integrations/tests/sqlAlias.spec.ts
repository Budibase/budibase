import { QueryJson } from "@budibase/types"
import { join } from "path"
import Sql from "../base/sql"
import { SqlClient } from "../utils"

describe("Captures of real examples", () => {
  const limit = 5000

  function getJson(name: string): QueryJson {
    return require(join(__dirname, "sqlQueryJson", name)) as QueryJson
  }

  describe("create", () => {
    it("should create a row with relationships", () => {
      const queryJson = getJson("createWithRelationships.json")
      let query = new Sql(SqlClient.POSTGRES, limit)._query(queryJson)
      expect(query).toEqual({
        bindings: ["A Street", 34, "London", "A", "B", "designer", 1990],
        sql: `insert into "persons" ("address", "age", "city", "firstname", "lastname", "type", "year") values ($1, $2, $3, $4, $5, $6, $7) returning *`,
      })
    })
  })

  describe("read", () => {
    it("should handle basic retrieval with relationships", () => {
      const queryJson = getJson("basicFetchWithRelationships.json")
      let query = new Sql(SqlClient.POSTGRES, limit)._query(queryJson)
      expect(query).toEqual({
        bindings: [100, limit],
        sql: `select "a"."year" as "a.year", "a"."firstname" as "a.firstname", "a"."personid" as "a.personid", "a"."address" as "a.address", "a"."age" as "a.age", "a"."type" as "a.type", "a"."city" as "a.city", "a"."lastname" as "a.lastname", "b"."executorid" as "b.executorid", "b"."taskname" as "b.taskname", "b"."taskid" as "b.taskid", "b"."completed" as "b.completed", "b"."qaid" as "b.qaid", "b"."executorid" as "b.executorid", "b"."taskname" as "b.taskname", "b"."taskid" as "b.taskid", "b"."completed" as "b.completed", "b"."qaid" as "b.qaid" from (select * from "persons" as "a" order by "a"."firstname" asc limit $1) as "a" left join "tasks" as "b" on "a"."personid" = "b"."qaid" or "a"."personid" = "b"."executorid" order by "a"."firstname" asc limit $2`,
      })
    })

    it("should handle filtering by relationship", () => {
      const queryJson = getJson("filterByRelationship.json")
      let query = new Sql(SqlClient.POSTGRES, limit)._query(queryJson)
      expect(query).toEqual({
        bindings: [100, "assembling", limit],
        sql: `select "a"."productname" as "a.productname", "a"."productid" as "a.productid", "b"."executorid" as "b.executorid", "b"."taskname" as "b.taskname", "b"."taskid" as "b.taskid", "b"."completed" as "b.completed", "b"."qaid" as "b.qaid" from (select * from "products" as "a" order by "a"."productname" asc limit $1) as "a" left join "products_tasks" as "c" on "a"."productid" = "c"."productid" left join "tasks" as "b" on "b"."taskid" = "c"."taskid" where "b"."taskname" = $2 order by "a"."productname" asc limit $3`,
      })
    })
  })

  describe("update", () => {
    it("should handle performing a simple update", () => {
      const queryJson = getJson("updateSimple.json")
      let query = new Sql(SqlClient.POSTGRES, limit)._query(queryJson)
      expect(query).toEqual({
        bindings: [1990, "C", "A Street", 34, "designer", "London", "B", 5],
        sql: `update "persons" as "a" set "year" = $1, "firstname" = $2, "address" = $3, "age" = $4, "type" = $5, "city" = $6, "lastname" = $7 where "a"."personid" = $8 returning *`,
      })
    })

    it("should handle performing an update of relationships", () => {
      const queryJson = getJson("updateRelationship.json")
      let query = new Sql(SqlClient.POSTGRES, limit)._query(queryJson)
      expect(query).toEqual({
        bindings: [1990, "C", "A Street", 34, "designer", "London", "B", 5],
        sql: `update "persons" as "a" set "year" = $1, "firstname" = $2, "address" = $3, "age" = $4, "type" = $5, "city" = $6, "lastname" = $7 where "a"."personid" = $8 returning *`,
      })
    })
  })

  describe("delete", () => {
    it("should handle deleting with relationships", () => {
      const queryJson = getJson("deleteSimple.json")
      let query = new Sql(SqlClient.POSTGRES, limit)._query(queryJson)
      expect(query).toEqual({
        bindings: ["ddd", ""],
        sql: `delete from "compositetable" as "a" where "a"."keypartone" = $1 and "a"."keyparttwo" = $2 returning "a"."keyparttwo" as "a.keyparttwo", "a"."keypartone" as "a.keypartone", "a"."name" as "a.name"`,
      })
    })
  })
})
