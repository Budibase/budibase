import {
  Datasource,
  Operation,
  QueryJson,
  SourceName,
  SqlQuery,
  Table,
  TableSourceType,
  SqlClient,
} from "@budibase/types"
import { sql } from "@budibase/backend-core"
import { join } from "path"
import { generator } from "@budibase/backend-core/tests"
import sdk from "../../sdk"

const Sql = sql.Sql

// this doesn't exist strictly
const TABLE: Table = {
  type: "table",
  sourceType: TableSourceType.EXTERNAL,
  sourceId: "SOURCE_ID",
  schema: {},
  name: "tableName",
  primary: ["id"],
}

const AliasTables = sdk.rows.AliasTables

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
        sql: expect.stringContaining(
          multiline(`select "a"."year" as "a.year", "a"."firstname" as "a.firstname", "a"."personid" as "a.personid", 
              "a"."address" as "a.address", "a"."age" as "a.age", "a"."type" as "a.type", "a"."city" as "a.city", 
              "a"."lastname" as "a.lastname", "b"."executorid" as "b.executorid", "b"."taskname" as "b.taskname", 
              "b"."taskid" as "b.taskid", "b"."completed" as "b.completed", "b"."qaid" as "b.qaid", 
              "b"."executorid" as "b.executorid", "b"."taskname" as "b.taskname", "b"."taskid" as "b.taskid", 
              "b"."completed" as "b.completed", "b"."qaid" as "b.qaid"`)
        ),
      })
    })

    it("should handle filtering by relationship", () => {
      const queryJson = getJson("filterByRelationship.json")
      let query = new Sql(SqlClient.POSTGRES, limit)._query(queryJson)
      expect(query).toEqual({
        bindings: [relationshipLimit, "assembling", limit],
        sql: expect.stringContaining(
          multiline(`where COALESCE("b"."taskname" = $2, FALSE) 
            order by "a"."productname" asc nulls first, "a"."productid" asc limit $3`)
        ),
      })
    })

    it("should handle fetching many to many relationships", () => {
      const queryJson = getJson("fetchManyToMany.json")
      let query = new Sql(SqlClient.POSTGRES, limit)._query(queryJson)
      expect(query).toEqual({
        bindings: [relationshipLimit, limit],
        sql: expect.stringContaining(
          multiline(`left join "products_tasks" as "c" on "a"."productid" = "c"."productid" 
              left join "tasks" as "b" on "b"."taskid" = "c"."taskid" `)
        ),
      })
    })

    it("should handle enrichment of rows", () => {
      const queryJson = getJson("enrichRelationship.json")
      const filters = queryJson.filters?.oneOf?.taskid as number[]
      let query = new Sql(SqlClient.POSTGRES, limit)._query(queryJson)
      expect(query).toEqual({
        bindings: [...filters, limit, ...filters, limit],
        sql: multiline(
          `select "a"."executorid" as "a.executorid", "a"."taskname" as "a.taskname", "a"."taskid" as "a.taskid",
          "a"."completed" as "a.completed", "a"."qaid" as "a.qaid", "b"."productname" as "b.productname", "b"."productid" as "b.productid"
          from (select * from "tasks" as "a" where "a"."taskid" in ($1, $2) order by "a"."taskid" asc limit $3) as "a"
          left join "products_tasks" as "c" on "a"."taskid" = "c"."taskid" left join "products" as "b" on "b"."productid" = "c"."productid"
          where "a"."taskid" in ($4, $5) order by "a"."taskid" asc limit $6`
        ),
      })
    })

    it("should manage query with many relationship filters", () => {
      const queryJson = getJson("manyRelationshipFilters.json")
      let query = new Sql(SqlClient.POSTGRES, limit)._query(queryJson)
      const filters = queryJson.filters
      const notEqualsValue = Object.values(filters?.notEqual!)[0]
      const rangeValue: { high?: string | number; low?: string | number } =
        Object.values(filters?.range!)[0]
      const equalValue = Object.values(filters?.equal!)[0]

      expect(query).toEqual({
        bindings: [
          notEqualsValue,
          relationshipLimit,
          rangeValue.low,
          rangeValue.high,
          equalValue,
          true,
          limit,
        ],
        sql: expect.stringContaining(
          multiline(
            `where "c"."year" between $3 and $4 and COALESCE("b"."productname" = $5, FALSE)`
          )
        ),
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
             "type" = $5, "city" = $6, "lastname" = $7 where COALESCE("a"."personid" = $8, FALSE) returning *`),
      })
    })

    it("should handle performing an update of relationships", () => {
      const queryJson = getJson("updateRelationship.json")
      let query = new Sql(SqlClient.POSTGRES, limit)._query(queryJson)
      expect(query).toEqual({
        bindings: [1990, "C", "A Street", 34, "designer", "London", "B", 5],
        sql: multiline(`update "persons" as "a" set "year" = $1, "firstname" = $2, "address" = $3, "age" = $4, 
             "type" = $5, "city" = $6, "lastname" = $7 where COALESCE("a"."personid" = $8, FALSE) returning *`),
      })
    })
  })

  describe("delete", () => {
    it("should handle deleting with relationships", () => {
      const queryJson = getJson("deleteSimple.json")
      let query = new Sql(SqlClient.POSTGRES, limit)._query(queryJson)
      expect(query).toEqual({
        bindings: ["ddd", ""],
        sql: multiline(`delete from "compositetable" as "a" 
          where COALESCE("a"."keypartone" = $1, FALSE) and COALESCE("a"."keyparttwo" = $2, FALSE)
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
      let returningQuery: SqlQuery | SqlQuery[] = { sql: "", bindings: [] }
      SQL.getReturningRow((input: SqlQuery | SqlQuery[]) => {
        returningQuery = input
      }, queryJson)
      expect(returningQuery).toEqual({
        sql: multiline(`select top (@p0) * from (select top (@p1) * from [people] where CASE WHEN [people].[name] = @p2 
             THEN 1 ELSE 0 END = 1 and CASE WHEN [people].[age] = @p3 THEN 1 ELSE 0 END = 1 order by [people].[name] asc) as [people] 
             where CASE WHEN [people].[name] = @p4 THEN 1 ELSE 0 END = 1 and CASE WHEN [people].[age] = @p5 THEN 1 ELSE 0 END = 1`),
        bindings: [5000, 1, "Test", 22, "Test", 22],
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
        meta: {
          table: TABLE,
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
