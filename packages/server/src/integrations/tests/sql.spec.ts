import { SqlClient } from "../utils"
import Sql from "../base/sql"
import {
  FieldType,
  Operation,
  QueryJson,
  Table,
  TableSourceType,
} from "@budibase/types"

const TABLE_NAME = "test"
const TABLE: Table = {
  type: "table",
  sourceType: TableSourceType.EXTERNAL,
  sourceId: "SOURCE_ID",
  schema: {
    id: {
      name: "id",
      type: FieldType.NUMBER,
    },
  },
  name: TABLE_NAME,
  primary: ["id"],
}

function endpoint(table: any, operation: any) {
  return {
    datasourceId: "Postgres",
    operation: operation,
    entityId: table || TABLE_NAME,
  }
}

function generateReadJson({
  table,
  fields,
  filters,
  sort,
  paginate,
}: any = {}): QueryJson {
  const tableObj = { ...TABLE }
  if (table) {
    tableObj.name = table
  }
  return {
    endpoint: endpoint(table || TABLE_NAME, "READ"),
    resource: {
      fields: fields || [],
    },
    filters: filters || {},
    sort: sort || {},
    paginate: paginate || {},
    meta: {
      table: tableObj,
    },
  }
}

function generateCreateJson(table = TABLE_NAME, body = {}): QueryJson {
  return {
    endpoint: endpoint(table, "CREATE"),
    meta: {
      table: TABLE,
    },
    body,
  }
}

function generateRelationshipJson(config: { schema?: string } = {}): QueryJson {
  return {
    endpoint: {
      datasourceId: "Postgres",
      entityId: "brands",
      operation: Operation.READ,
      schema: config.schema,
    },
    resource: {
      fields: [
        "brands.brand_id",
        "brands.brand_name",
        "products.product_id",
        "products.product_name",
        "products.brand_id",
      ],
    },
    filters: {},
    sort: {},
    relationships: [
      {
        from: "brand_id",
        to: "brand_id",
        tableName: "products",
        column: "products",
      },
    ],
    extra: { idFilter: {} },
    meta: {
      table: TABLE,
    },
  }
}

function generateManyRelationshipJson(config: { schema?: string } = {}) {
  return {
    endpoint: {
      datasourceId: "Postgres",
      entityId: "stores",
      operation: "READ",
      schema: config.schema,
    },
    resource: {
      fields: [
        "stores.store_id",
        "stores.store_name",
        "products.product_id",
        "products.product_name",
      ],
    },
    filters: {},
    sort: {},
    paginate: {},
    relationships: [
      {
        from: "store_id",
        to: "product_id",
        tableName: "products",
        column: "products",
        through: "stocks",
        fromPrimary: "store_id",
        toPrimary: "product_id",
      },
    ],
    extra: { idFilter: {} },
    meta: {
      table: TABLE,
    },
  }
}

describe("SQL query builder", () => {
  const limit = 500
  const client = SqlClient.POSTGRES
  let sql: any

  beforeEach(() => {
    sql = new Sql(client, limit)
  })

  it("should allow filtering on a related field", () => {
    const query = sql._query(
      generateReadJson({
        filters: {
          equal: {
            age: 10,
            "task.name": "task 1",
          },
        },
      })
    )
    // order of bindings changes because relationship filters occur outside inner query
    expect(query).toEqual({
      bindings: [10, limit, "task 1"],
      sql: `select * from (select * from "${TABLE_NAME}" where "${TABLE_NAME}"."age" = $1 limit $2) as "${TABLE_NAME}" where "task"."name" = $3`,
    })
  })

  it("should add the schema to the LEFT JOIN", () => {
    const query = sql._query(generateRelationshipJson({ schema: "production" }))
    expect(query).toEqual({
      bindings: [500, 5000],
      sql: `select "brands"."brand_id" as "brands.brand_id", "brands"."brand_name" as "brands.brand_name", "products"."product_id" as "products.product_id", "products"."product_name" as "products.product_name", "products"."brand_id" as "products.brand_id" from (select * from "production"."brands" limit $1) as "brands" left join "production"."products" as "products" on "brands"."brand_id" = "products"."brand_id" limit $2`,
    })
  })

  it("should handle if the schema is not present when doing a LEFT JOIN", () => {
    const query = sql._query(generateRelationshipJson())
    expect(query).toEqual({
      bindings: [500, 5000],
      sql: `select "brands"."brand_id" as "brands.brand_id", "brands"."brand_name" as "brands.brand_name", "products"."product_id" as "products.product_id", "products"."product_name" as "products.product_name", "products"."brand_id" as "products.brand_id" from (select * from "brands" limit $1) as "brands" left join "products" as "products" on "brands"."brand_id" = "products"."brand_id" limit $2`,
    })
  })

  it("should add the schema to both the toTable and throughTable in many-to-many join", () => {
    const query = sql._query(
      generateManyRelationshipJson({ schema: "production" })
    )
    expect(query).toEqual({
      bindings: [500, 5000],
      sql: `select "stores"."store_id" as "stores.store_id", "stores"."store_name" as "stores.store_name", "products"."product_id" as "products.product_id", "products"."product_name" as "products.product_name" from (select * from "production"."stores" limit $1) as "stores" left join "production"."stocks" as "stocks" on "stores"."store_id" = "stocks"."store_id" left join "production"."products" as "products" on "products"."product_id" = "stocks"."product_id" limit $2`,
    })
  })

  it("should ignore high range value if it is an empty object", () => {
    const query = sql._query(
      generateReadJson({
        filters: {
          range: {
            dob: {
              low: "2000-01-01 00:00:00",
              high: {},
            },
          },
        },
      })
    )
    expect(query).toEqual({
      bindings: ["2000-01-01 00:00:00", 500],
      sql: `select * from (select * from "${TABLE_NAME}" where "${TABLE_NAME}"."dob" >= $1 limit $2) as "${TABLE_NAME}"`,
    })
  })

  it("should ignore low range value if it is an empty object", () => {
    const query = sql._query(
      generateReadJson({
        filters: {
          range: {
            dob: {
              low: {},
              high: "2010-01-01 00:00:00",
            },
          },
        },
      })
    )
    expect(query).toEqual({
      bindings: ["2010-01-01 00:00:00", 500],
      sql: `select * from (select * from "${TABLE_NAME}" where "${TABLE_NAME}"."dob" <= $1 limit $2) as "${TABLE_NAME}"`,
    })
  })

  it("should lowercase the values for Oracle LIKE statements", () => {
    let query = new Sql(SqlClient.ORACLE, limit)._query(
      generateReadJson({
        filters: {
          string: {
            name: "John",
          },
        },
      })
    )
    expect(query).toEqual({
      bindings: ["john%", limit],
      sql: `select * from (select * from (select * from "test" where LOWER("test"."name") LIKE :1) where rownum <= :2) "test"`,
    })

    query = new Sql(SqlClient.ORACLE, limit)._query(
      generateReadJson({
        filters: {
          contains: {
            age: [20, 25],
            name: ["John", "Mary"],
          },
        },
      })
    )
    expect(query).toEqual({
      bindings: ["%20%", "%25%", `%"john"%`, `%"mary"%`, limit],
      sql: `select * from (select * from (select * from "test" where (LOWER("test"."age") LIKE :1 AND LOWER("test"."age") LIKE :2) and (LOWER("test"."name") LIKE :3 AND LOWER("test"."name") LIKE :4)) where rownum <= :5) "test"`,
    })

    query = new Sql(SqlClient.ORACLE, limit)._query(
      generateReadJson({
        filters: {
          fuzzy: {
            name: "Jo",
          },
        },
      })
    )
    expect(query).toEqual({
      bindings: [`%jo%`, limit],
      sql: `select * from (select * from (select * from "test" where LOWER("test"."name") LIKE :1) where rownum <= :2) "test"`,
    })
  })

  it("should sort SQL Server tables by the primary key if no sort data is provided", () => {
    let query = new Sql(SqlClient.MS_SQL, limit)._query(
      generateReadJson({
        sort: {},
        paginate: {
          limit: 10,
        },
      })
    )
    expect(query).toEqual({
      bindings: [10],
      sql: `select * from (select top (@p0) * from [test] order by [test].[id] asc) as [test]`,
    })
  })

  it("should not parse JSON string as Date", () => {
    let query = new Sql(SqlClient.POSTGRES, limit)._query(
      generateCreateJson(TABLE_NAME, {
        name: '{ "created_at":"2023-09-09T03:21:06.024Z" }',
      })
    )
    expect(query).toEqual({
      bindings: ['{ "created_at":"2023-09-09T03:21:06.024Z" }'],
      sql: `insert into "test" ("name") values ($1) returning *`,
    })
  })

  it("should parse and trim valid string as Date", () => {
    const dateObj = new Date("2023-09-09T03:21:06.024Z")
    let query = new Sql(SqlClient.POSTGRES, limit)._query(
      generateCreateJson(TABLE_NAME, {
        name: " 2023-09-09T03:21:06.024Z ",
      })
    )
    expect(query).toEqual({
      bindings: [dateObj],
      sql: `insert into "test" ("name") values ($1) returning *`,
    })
  })
})
