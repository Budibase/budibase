import { Datasource, Operation, QueryJson, SourceName } from "@budibase/types"
import { join } from "path"
import Sql from "../base/sql"
import { SqlClient } from "../utils"
import AliasTables from "../../api/controllers/row/alias"
import { generator } from "@budibase/backend-core/tests"
import { Knex } from "knex"

function multiline(sql: string) {
  return sql.replace(/\n/g, "").replace(/ +/g, " ")
}

describe("Captures of real examples", () => {
  const limit = 5000
  const relationshipLimit = 100

  function getJson(name: string): QueryJson {
    return require(join(__dirname, "sqlQueryJson", name)) as QueryJson
  }

  describe("create", () => {
    it("should create a row with relationships", () => {
      const queryJson = getJson("createWithRelationships.json")
      let query = new Sql(SqlClient.POSTGRES, limit)._query(queryJson)
      expect(query).toEqual({
        bindings: ["A Street", 34, "London", "A", "B", "designer", 1990],
        sql: multiline(`insert into "persons" ("address", "age", "city", "firstname", "lastname", "type", "year") 
              values ($1, $2, $3, $4, $5, $6, $7) returning *`),
      })
    })
  })

  describe("read", () => {
    it("should handle basic retrieval with relationships", () => {
      const queryJson = getJson("basicFetchWithRelationships.json")
      let query = new Sql(SqlClient.POSTGRES, limit)._query(queryJson)
      expect(query).toEqual({
        bindings: [relationshipLimit, limit],
        sql: multiline(`select "a"."year" as "a.year", "a"."firstname" as "a.firstname", "a"."personid" as "a.personid", 
              "a"."address" as "a.address", "a"."age" as "a.age", "a"."type" as "a.type", "a"."city" as "a.city", 
              "a"."lastname" as "a.lastname", "b"."executorid" as "b.executorid", "b"."taskname" as "b.taskname", 
              "b"."taskid" as "b.taskid", "b"."completed" as "b.completed", "b"."qaid" as "b.qaid", 
              "b"."executorid" as "b.executorid", "b"."taskname" as "b.taskname", "b"."taskid" as "b.taskid", 
              "b"."completed" as "b.completed", "b"."qaid" as "b.qaid" 
              from (select * from "persons" as "a" order by "a"."firstname" asc limit $1) as "a" 
              left join "tasks" as "b" on "a"."personid" = "b"."qaid" or "a"."personid" = "b"."executorid" 
              order by "a"."firstname" asc limit $2`),
      })
    })

    it("should handle filtering by relationship", () => {
      const queryJson = getJson("filterByRelationship.json")
      let query = new Sql(SqlClient.POSTGRES, limit)._query(queryJson)
      expect(query).toEqual({
        bindings: [relationshipLimit, "assembling", limit],
        sql: multiline(`select "a"."productname" as "a.productname", "a"."productid" as "a.productid", 
              "b"."executorid" as "b.executorid", "b"."taskname" as "b.taskname", "b"."taskid" as "b.taskid", 
              "b"."completed" as "b.completed", "b"."qaid" as "b.qaid" 
              from (select * from "products" as "a" order by "a"."productname" asc limit $1) as "a" 
              left join "products_tasks" as "c" on "a"."productid" = "c"."productid" 
              left join "tasks" as "b" on "b"."taskid" = "c"."taskid" where "b"."taskname" = $2 
              order by "a"."productname" asc limit $3`),
      })
    })

    it("should handle fetching many to many relationships", () => {
      const queryJson = getJson("fetchManyToMany.json")
      let query = new Sql(SqlClient.POSTGRES, limit)._query(queryJson)
      expect(query).toEqual({
        bindings: [relationshipLimit, limit],
        sql: multiline(`select "a"."productname" as "a.productname", "a"."productid" as "a.productid", 
              "b"."executorid" as "b.executorid", "b"."taskname" as "b.taskname", "b"."taskid" as "b.taskid", 
              "b"."completed" as "b.completed", "b"."qaid" as "b.qaid" 
              from (select * from "products" as "a" order by "a"."productname" asc limit $1) as "a" 
              left join "products_tasks" as "c" on "a"."productid" = "c"."productid" 
              left join "tasks" as "b" on "b"."taskid" = "c"."taskid" 
              order by "a"."productname" asc limit $2`),
      })
    })

    it("should handle enrichment of rows", () => {
      const queryJson = getJson("enrichRelationship.json")
      const filters = queryJson.filters?.oneOf?.taskid as number[]
      let query = new Sql(SqlClient.POSTGRES, limit)._query(queryJson)
      expect(query).toEqual({
        bindings: [...filters, limit, limit],
        sql: multiline(`select "a"."executorid" as "a.executorid", "a"."taskname" as "a.taskname", 
             "a"."taskid" as "a.taskid", "a"."completed" as "a.completed", "a"."qaid" as "a.qaid", 
             "b"."productname" as "b.productname", "b"."productid" as "b.productid" 
             from (select * from "tasks" as "a" where "a"."taskid" in ($1, $2) limit $3) as "a" 
             left join "products_tasks" as "c" on "a"."taskid" = "c"."taskid" 
             left join "products" as "b" on "b"."productid" = "c"."productid" limit $4`),
      })
    })

    it("should manage query with many relationship filters", () => {
      const queryJson = getJson("manyRelationshipFilters.json")
      let query = new Sql(SqlClient.POSTGRES, limit)._query(queryJson)
      const filters = queryJson.filters
      const notEqualsValue = Object.values(filters?.notEqual!)[0]
      const rangeValue = Object.values(filters?.range!)[0]
      const equalValue = Object.values(filters?.equal!)[0]

      expect(query).toEqual({
        bindings: [
          notEqualsValue,
          relationshipLimit,
          rangeValue.low,
          rangeValue.high,
          equalValue,
          limit,
        ],
        sql: multiline(`select "a"."executorid" as "a.executorid", "a"."taskname" as "a.taskname", "a"."taskid" as "a.taskid", 
             "a"."completed" as "a.completed", "a"."qaid" as "a.qaid", "b"."productname" as "b.productname", 
             "b"."productid" as "b.productid", "c"."year" as "c.year", "c"."firstname" as "c.firstname", 
             "c"."personid" as "c.personid", "c"."address" as "c.address", "c"."age" as "c.age", "c"."type" as "c.type", 
             "c"."city" as "c.city", "c"."lastname" as "c.lastname", "c"."year" as "c.year", "c"."firstname" as "c.firstname", 
             "c"."personid" as "c.personid", "c"."address" as "c.address", "c"."age" as "c.age", "c"."type" as "c.type", 
             "c"."city" as "c.city", "c"."lastname" as "c.lastname" 
             from (select * from "tasks" as "a" where not "a"."completed" = $1 
             order by "a"."taskname" asc limit $2) as "a" 
             left join "products_tasks" as "d" on "a"."taskid" = "d"."taskid" 
             left join "products" as "b" on "b"."productid" = "d"."productid" 
             left join "persons" as "c" on "a"."executorid" = "c"."personid" or "a"."qaid" = "c"."personid" 
             where "c"."year" between $3 and $4 and "b"."productname" = $5 order by "a"."taskname" asc limit $6`),
      })
    })
  })

  describe("update", () => {
    it("should handle performing a simple update", () => {
      const queryJson = getJson("updateSimple.json")
      let query = new Sql(SqlClient.POSTGRES, limit)._query(queryJson)
      expect(query).toEqual({
        bindings: [1990, "C", "A Street", 34, "designer", "London", "B", 5],
        sql: multiline(`update "persons" as "a" set "year" = $1, "firstname" = $2, "address" = $3, "age" = $4, 
             "type" = $5, "city" = $6, "lastname" = $7 where "a"."personid" = $8 returning *`),
      })
    })

    it("should handle performing an update of relationships", () => {
      const queryJson = getJson("updateRelationship.json")
      let query = new Sql(SqlClient.POSTGRES, limit)._query(queryJson)
      expect(query).toEqual({
        bindings: [1990, "C", "A Street", 34, "designer", "London", "B", 5],
        sql: multiline(`update "persons" as "a" set "year" = $1, "firstname" = $2, "address" = $3, "age" = $4, 
             "type" = $5, "city" = $6, "lastname" = $7 where "a"."personid" = $8 returning *`),
      })
    })
  })

  describe("delete", () => {
    it("should handle deleting with relationships", () => {
      const queryJson = getJson("deleteSimple.json")
      let query = new Sql(SqlClient.POSTGRES, limit)._query(queryJson)
      expect(query).toEqual({
        bindings: ["ddd", ""],
        sql: multiline(`delete from "compositetable" as "a" where "a"."keypartone" = $1 and "a"."keyparttwo" = $2 
             returning "a"."keyparttwo" as "a.keyparttwo", "a"."keypartone" as "a.keypartone", "a"."name" as "a.name"`),
      })
    })
  })

  describe("returning (everything bar Postgres)", () => {
    it("should be able to handle row returning", () => {
      const queryJson = getJson("createSimple.json")
      const SQL = new Sql(SqlClient.MS_SQL, limit)
      let query = SQL._query(queryJson, { disableReturning: true })
      expect(query).toEqual({
        sql: "insert into [people] ([age], [name]) values (@p0, @p1)",
        bindings: [22, "Test"],
      })

      // now check returning
      let returningQuery: Knex.SqlNative = { sql: "", bindings: [] }
      SQL.getReturningRow((input: Knex.SqlNative) => {
        returningQuery = input
      }, queryJson)
      expect(returningQuery).toEqual({
        sql: "select * from (select top (@p0) * from [people] where [people].[name] = @p1 and [people].[age] = @p2 order by [people].[name] asc) as [people]",
        bindings: [1, "Test", 22],
      })
    })
  })

  describe("check max character aliasing", () => {
    it("should handle over 'z' max character alias", () => {
      const tableNames = []
      for (let i = 0; i < 100; i++) {
        tableNames.push(generator.guid())
      }
      const aliasing = new AliasTables(tableNames)
      let alias: string = ""
      for (let table of tableNames) {
        alias = aliasing.getAlias(table)
      }
      expect(alias).toEqual("cv")
    })
  })

  describe("check aliasing is disabled/enabled", () => {
    const tables = ["tableA", "tableB"]

    function getDatasource(source: SourceName): Datasource {
      return {
        source,
        type: "datasource",
        isSQL: true,
      }
    }

    function getQuery(op: Operation, fields: string[] = ["a"]): QueryJson {
      return {
        endpoint: { datasourceId: "", entityId: "", operation: op },
        resource: {
          fields,
        },
      }
    }

    it("should check for Postgres aliased status", () => {
      const aliasing = new AliasTables(tables)
      const datasource = getDatasource(SourceName.POSTGRES)
      expect(
        aliasing.isAliasingEnabled(getQuery(Operation.CREATE), datasource)
      ).toEqual(true)
      expect(
        aliasing.isAliasingEnabled(getQuery(Operation.READ), datasource)
      ).toEqual(true)
      expect(
        aliasing.isAliasingEnabled(getQuery(Operation.UPDATE), datasource)
      ).toEqual(true)
      expect(
        aliasing.isAliasingEnabled(getQuery(Operation.DELETE), datasource)
      ).toEqual(true)
    })

    it("should check for MS-SQL aliased status", () => {
      const aliasing = new AliasTables(tables)
      const datasource = getDatasource(SourceName.SQL_SERVER)
      expect(
        aliasing.isAliasingEnabled(getQuery(Operation.CREATE), datasource)
      ).toEqual(false)
      expect(
        aliasing.isAliasingEnabled(getQuery(Operation.READ), datasource)
      ).toEqual(true)
      expect(
        aliasing.isAliasingEnabled(getQuery(Operation.UPDATE), datasource)
      ).toEqual(false)
      expect(
        aliasing.isAliasingEnabled(getQuery(Operation.DELETE), datasource)
      ).toEqual(false)
    })

    it("should check for MySQL aliased status", () => {
      const aliasing = new AliasTables(tables)
      const datasource = getDatasource(SourceName.MYSQL)
      expect(
        aliasing.isAliasingEnabled(getQuery(Operation.CREATE), datasource)
      ).toEqual(false)
      expect(
        aliasing.isAliasingEnabled(getQuery(Operation.READ), datasource)
      ).toEqual(true)
      expect(
        aliasing.isAliasingEnabled(getQuery(Operation.UPDATE), datasource)
      ).toEqual(false)
      expect(
        aliasing.isAliasingEnabled(getQuery(Operation.DELETE), datasource)
      ).toEqual(false)
    })

    it("should check for Oracle aliased status", () => {
      const aliasing = new AliasTables(tables)
      const datasource = getDatasource(SourceName.ORACLE)
      expect(
        aliasing.isAliasingEnabled(getQuery(Operation.CREATE), datasource)
      ).toEqual(false)
      expect(
        aliasing.isAliasingEnabled(getQuery(Operation.READ), datasource)
      ).toEqual(true)
      expect(
        aliasing.isAliasingEnabled(getQuery(Operation.UPDATE), datasource)
      ).toEqual(false)
      expect(
        aliasing.isAliasingEnabled(getQuery(Operation.DELETE), datasource)
      ).toEqual(false)
    })

    it("should disable aliasing for non-SQL datasources", () => {
      const aliasing = new AliasTables(tables)
      expect(
        aliasing.isAliasingEnabled(getQuery(Operation.READ), {
          source: SourceName.GOOGLE_SHEETS,
          type: "datasource",
          isSQL: false,
        })
      ).toEqual(false)
    })

    it("should disable when no fields", () => {
      const aliasing = new AliasTables(tables)
      const datasource = getDatasource(SourceName.POSTGRES)
      expect(
        aliasing.isAliasingEnabled(getQuery(Operation.READ, []), datasource)
      ).toEqual(false)
    })
  })

  describe("check some edge cases", () => {
    const tableNames = ["hello", "world"]

    it("should handle quoted table names", () => {
      const aliasing = new AliasTables(tableNames)
      const aliased = aliasing.aliasField(`"hello"."field"`)
      expect(aliased).toEqual(`"a"."field"`)
    })

    it("should handle quoted table names with graves", () => {
      const aliasing = new AliasTables(tableNames)
      const aliased = aliasing.aliasField("`hello`.`world`")
      expect(aliased).toEqual("`a`.`world`")
    })

    it("should handle table names in table names correctly", () => {
      const tableNames = ["he", "hell", "hello"]
      const aliasing = new AliasTables(tableNames)
      const aliased1 = aliasing.aliasField("`he`.`world`")
      const aliased2 = aliasing.aliasField("`hell`.`world`")
      const aliased3 = aliasing.aliasField("`hello`.`world`")
      expect(aliased1).toEqual("`a`.`world`")
      expect(aliased2).toEqual("`b`.`world`")
      expect(aliased3).toEqual("`c`.`world`")
    })
  })
})
