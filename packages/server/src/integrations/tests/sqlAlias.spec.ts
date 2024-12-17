import {
  Datasource,
  Operation,
  SourceName,
  SqlQuery,
  SqlClient,
  EnrichedQueryJson,
  TableSchema,
  Table,
  TableSourceType,
} from "@budibase/types"
import { sql } from "@budibase/backend-core"
import { join } from "path"
import { generator } from "@budibase/backend-core/tests"
import sdk from "../../sdk"

const Sql = sql.Sql

// this doesn't exist strictly
const TABLE = buildTable("tableName", {})

const AliasTables = sdk.rows.AliasTables

function buildTable(name: string, schema: TableSchema): Table {
  return {
    type: "table",
    sourceType: TableSourceType.EXTERNAL,
    sourceId: "SOURCE_ID",
    schema: schema,
    name: name,
    primary: ["id"],
  }
}

function multiline(sql: string) {
  return sql.replace(/\n/g, "").replace(/ +/g, " ")
}

describe("Captures of real examples", () => {
  const relationshipLimit = 500
  const primaryLimit = 100

  function getJson(name: string): EnrichedQueryJson {
    // tables aren't fully specified in the test JSON
    const base = require(join(__dirname, "sqlQueryJson", name)) as Omit<
      EnrichedQueryJson,
      "tables"
    >
    const tables: Record<string, Table> = { [base.table.name]: base.table }
    if (base.relationships) {
      for (let { tableName } of base.relationships) {
        tables[tableName] = buildTable(tableName, {})
      }
    }
    return {
      ...base,
      tables: tables,
    }
  }

  describe("create", () => {
    it("should create a row with relationships", () => {
      const queryJson = getJson("createWithRelationships.json")
      let query = new Sql(SqlClient.POSTGRES, relationshipLimit)._query(
        queryJson
      )
      expect(query).toEqual({
        bindings: ["A Street", 34, "London", "A", "B", "designer", 1990],
        sql: multiline(`insert into "persons" ("address", "age", "city", "firstname", "lastname", "type", "year") 
              values ($1, $2, $3, $4, $5, $6, $7) returning *`),
      })
    })
  })

  describe("read", () => {
    it("should retrieve all fields if non are specified", () => {
      const queryJson = getJson("basicFetch.json")
      delete queryJson.resource

      let query = new Sql(SqlClient.POSTGRES)._query(queryJson)
      expect(query).toEqual({
        bindings: [primaryLimit],
        sql: `select * from "persons" as "a" order by "a"."firstname" asc nulls first, "a"."personid" asc limit $1`,
      })
    })

    it("should retrieve only requested fields", () => {
      const queryJson = getJson("basicFetch.json")

      let query = new Sql(SqlClient.POSTGRES)._query(queryJson)
      expect(query).toEqual({
        bindings: [primaryLimit],
        sql: `select "a"."year", "a"."firstname", "a"."personid", "a"."age", "a"."type", "a"."lastname" from "persons" as "a" order by "a"."firstname" asc nulls first, "a"."personid" asc limit $1`,
      })
    })

    it("should handle basic retrieval with relationships", () => {
      const queryJson = getJson("basicFetchWithRelationships.json")
      let query = new Sql(SqlClient.POSTGRES, relationshipLimit)._query(
        queryJson
      )
      expect(query).toEqual({
        bindings: [primaryLimit, relationshipLimit, relationshipLimit],
        sql: expect.stringContaining(
          multiline(
            `select json_agg(json_build_object('executorid',"b"."executorid",'executorid',"b"."executorid",'qaid',"b"."qaid",'qaid',"b"."qaid",'taskid',"b"."taskid",'taskid',"b"."taskid",'completed',"b"."completed",'completed',"b"."completed",'taskname',"b"."taskname",'taskname',"b"."taskname"`
          )
        ),
      })
    })

    it("should handle filtering by relationship", () => {
      const queryJson = getJson("filterByRelationship.json")
      let query = new Sql(SqlClient.POSTGRES, relationshipLimit)._query(
        queryJson
      )
      expect(query).toEqual({
        bindings: ["assembling", primaryLimit, relationshipLimit],
        sql: expect.stringContaining(
          multiline(
            `where (exists (select 1 from "tasks" as "b" inner join "products_tasks" as "c" on "b"."taskid" = "c"."taskid" where "c"."productid" = "a"."productid" and (COALESCE("b"."taskname" = $1, FALSE)))`
          )
        ),
      })
    })

    it("should handle fetching many to many relationships", () => {
      const queryJson = getJson("fetchManyToMany.json")
      let query = new Sql(SqlClient.POSTGRES, relationshipLimit)._query(
        queryJson
      )
      expect(query).toEqual({
        bindings: [primaryLimit, relationshipLimit],
        sql: expect.stringContaining(
          multiline(
            `with "paginated" as (select * from "products" as "a" order by "a"."productname" asc nulls first, "a"."productid" asc limit $1) 
                 select "a"."productname", "a"."productid", (select json_agg(json_build_object('executorid',"b"."executorid",'qaid',"b"."qaid",'taskid',"b"."taskid",'completed',"b"."completed",'taskname',"b"."taskname")) 
                 from (select "b"."executorid", "b"."qaid", "b"."taskid", "b"."completed", "b"."taskname" from "tasks" as "b" inner join "products_tasks" as "c" on "b"."taskid" = "c"."taskid" where "c"."productid" = "a"."productid" order by "b"."taskid" asc limit $2) as "b") as "tasks" 
                 from "paginated" as "a" order by "a"."productname" asc nulls first, "a"."productid" asc`
          )
        ),
      })
    })

    it("should handle enrichment of rows", () => {
      const queryJson = getJson("enrichRelationship.json")
      const filters = queryJson.filters?.oneOf?.taskid as number[]
      let query = new Sql(SqlClient.POSTGRES, relationshipLimit)._query(
        queryJson
      )
      expect(query).toEqual({
        bindings: [...filters, relationshipLimit, relationshipLimit],
        sql: multiline(
          `with "paginated" as (select * from "tasks" as "a" where "a"."taskid" in ($1, $2) order by "a"."taskid" asc limit $3) 
               select "a"."executorid", "a"."taskname", "a"."taskid", "a"."completed", "a"."qaid", (select json_agg(json_build_object('productid',"b"."productid",'productname',"b"."productname")) 
               from (select "b"."productid", "b"."productname" from "products" as "b" inner join "products_tasks" as "c" on "b"."productid" = "c"."productid" 
               where "c"."taskid" = "a"."taskid" order by "b"."productid" asc limit $4) as "b") as "products" from "paginated" as "a" order by "a"."taskid" asc`
        ),
      })
    })

    it("should manage query with many relationship filters", () => {
      const queryJson = getJson("manyRelationshipFilters.json")
      let query = new Sql(SqlClient.POSTGRES, relationshipLimit)._query(
        queryJson
      )
      const filters = queryJson.filters
      const notEqualsValue = Object.values(filters!.notEqual!)[0]
      const rangeValue: { high?: string | number; low?: string | number } =
        Object.values(filters!.range!)[0]
      const equalValue = Object.values(filters!.equal!)[0]

      expect(query).toEqual({
        bindings: [
          rangeValue.low,
          rangeValue.high,
          rangeValue.low,
          rangeValue.high,
          equalValue,
          notEqualsValue,
          primaryLimit,
          relationshipLimit,
          relationshipLimit,
          relationshipLimit,
        ],
        sql: expect.stringContaining(
          multiline(
            `where (exists (select 1 from "persons" as "c" where "c"."personid" = "a"."executorid" and ("c"."year" between $1 and $2))) and (exists (select 1 from "persons" as "c" where "c"."personid" = "a"."qaid" and ("c"."year" between $3 and $4))) and (exists (select 1 from "products" as "b" inner join "products_tasks" as "d" on "b"."productid" = "d"."productid" where "d"."taskid" = "a"."taskid" and (COALESCE("b"."productname" = $5, FALSE))))`
          )
        ),
      })
    })
  })

  describe("update", () => {
    it("should handle performing a simple update", () => {
      const queryJson = getJson("updateSimple.json")
      let query = new Sql(SqlClient.POSTGRES, relationshipLimit)._query(
        queryJson
      )
      expect(query).toEqual({
        bindings: [1990, "C", "A Street", 34, "designer", "London", "B", 5],
        sql: multiline(
          `update "persons" as "a" set "year" = $1, "firstname" = $2, "address" = $3, "age" = $4, 
               "type" = $5, "city" = $6, "lastname" = $7 where COALESCE("a"."personid" = $8, FALSE) returning *`
        ),
      })
    })

    it("should handle performing an update of relationships", () => {
      const queryJson = getJson("updateRelationship.json")
      let query = new Sql(SqlClient.POSTGRES, relationshipLimit)._query(
        queryJson
      )
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
      let query = new Sql(SqlClient.POSTGRES, relationshipLimit)._query(
        queryJson
      )
      expect(query).toEqual({
        bindings: ["ddd", ""],
        sql: multiline(`delete from "compositetable" as "a" 
          where COALESCE("a"."keypartone" = $1, FALSE) and COALESCE("a"."keyparttwo" = $2, FALSE)
          returning "a"."keyparttwo", "a"."keypartone", "a"."name"`),
      })
    })
  })

  describe("returning (everything bar Postgres)", () => {
    it("should be able to handle row returning", () => {
      const queryJson = getJson("createSimple.json")
      const SQL = new Sql(SqlClient.MS_SQL, relationshipLimit)
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
        sql: multiline(
          `select top (@p0) * from [people] where CASE WHEN [people].[name] = @p1 THEN 1 ELSE 0 END = 1 and CASE WHEN [people].[age] = @p2 THEN 1 ELSE 0 END = 1 order by [people].[name] asc`
        ),
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
      let alias = ""
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

    function getQuery(
      op: Operation,
      fields: string[] = ["a"]
    ): EnrichedQueryJson {
      return {
        operation: op,
        resource: {
          fields,
        },
        table: TABLE,
        tables: { [TABLE.name]: TABLE },
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
