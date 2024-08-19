import {
  FieldType,
  Operation,
  PaginationJson,
  QueryJson,
  SearchFilters,
  SortJson,
  SqlClient,
  Table,
  TableSourceType,
} from "@budibase/types"
import { sql } from "@budibase/backend-core"
import { merge } from "lodash"

const Sql = sql.Sql

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

const ORACLE_TABLE: Partial<Table> = {
  schema: {
    name: {
      name: "name",
      type: FieldType.STRING,
    },
  },
}

function endpoint(table: string, operation: Operation) {
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
}: {
  table?: Partial<Table>
  fields?: string[]
  filters?: SearchFilters
  sort?: SortJson
  paginate?: PaginationJson
} = {}): QueryJson {
  let tableObj: Table = { ...TABLE }
  if (table) {
    tableObj = merge(TABLE, table)
  }
  return {
    endpoint: endpoint(tableObj.name || TABLE_NAME, Operation.READ),
    resource: {
      fields: fields || [],
    },
    filters: filters || {},
    sort: sort || {},
    paginate: paginate || undefined,
    meta: {
      table: tableObj,
    },
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

  it("should add the schema to the LEFT JOIN", () => {
    const query = sql._query(generateRelationshipJson({ schema: "production" }))
    expect(query).toEqual({
      bindings: [1, 500, 5000],
      sql: `select * from (select *, DENSE_RANK() over (order by "test.id" asc) as _row_num from (select "brands"."brand_id" as "brands.brand_id", "brands"."brand_name" as "brands.brand_name", "products"."product_id" as "products.product_id", "products"."product_name" as "products.product_name", "products"."brand_id" as "products.brand_id" from "production"."brands" left join "production"."products" as "products" on "brands"."brand_id" = "products"."brand_id" order by "test"."id" asc)) where "_row_num" between $1 and $2 limit $3`,
    })
  })

  it("should handle if the schema is not present when doing a LEFT JOIN", () => {
    const query = sql._query(generateRelationshipJson())
    expect(query).toEqual({
      bindings: [1, 500, 5000],
      sql: `select * from (select *, DENSE_RANK() over (order by "test.id" asc) as _row_num from (select "brands"."brand_id" as "brands.brand_id", "brands"."brand_name" as "brands.brand_name", "products"."product_id" as "products.product_id", "products"."product_name" as "products.product_name", "products"."brand_id" as "products.brand_id" from "brands" left join "products" as "products" on "brands"."brand_id" = "products"."brand_id" order by "test"."id" asc)) where "_row_num" between $1 and $2 limit $3`,
    })
  })

  it("should add the schema to both the toTable and throughTable in many-to-many join", () => {
    const query = sql._query(
      generateManyRelationshipJson({ schema: "production" })
    )
    expect(query).toEqual({
      bindings: [1, 500, 5000],
      sql: `select * from (select *, DENSE_RANK() over (order by "test.id" asc) as _row_num from (select "stores"."store_id" as "stores.store_id", "stores"."store_name" as "stores.store_name", "products"."product_id" as "products.product_id", "products"."product_name" as "products.product_name" from "production"."stores" left join "production"."stocks" as "stocks" on "stores"."store_id" = "stocks"."store_id" left join "production"."products" as "products" on "products"."product_id" = "stocks"."product_id" order by "test"."id" asc)) where "_row_num" between $1 and $2 limit $3`,
    })
  })

  it("should lowercase the values for Oracle LIKE statements", () => {
    let query = new Sql(SqlClient.ORACLE, limit)._query(
      generateReadJson({
        table: ORACLE_TABLE,
        filters: {
          string: {
            name: "John",
          },
        },
      })
    )
    expect(query).toEqual({
      bindings: ["john%", 1, limit, 5000],
      sql: `select * from (select * from (select *, DENSE_RANK() over (order by "test.id" asc) as _row_num from (select * from "test" where LOWER("test"."name") LIKE :1 order by "test"."id" asc)) where "_row_num" between :2 and :3) where rownum <= :4`,
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
      bindings: [`%20%`, `%25%`, `%"john"%`, `%"mary"%`, 1, limit, 5000],
      sql: `select * from (select * from (select *, DENSE_RANK() over (order by "test.id" asc) as _row_num from (select * from "test" where COALESCE(LOWER("test"."age"), '') LIKE :1 AND COALESCE(LOWER("test"."age"), '') LIKE :2 and COALESCE(LOWER("test"."name"), '') LIKE :3 AND COALESCE(LOWER("test"."name"), '') LIKE :4 order by "test"."id" asc)) where "_row_num" between :5 and :6) where rownum <= :7`,
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
      bindings: [`%jo%`, 1, limit, 5000],
      sql: `select * from (select * from (select *, DENSE_RANK() over (order by "test.id" asc) as _row_num from (select * from "test" where LOWER("test"."name") LIKE :1 order by "test"."id" asc)) where "_row_num" between :2 and :3) where rownum <= :4`,
    })
  })

  it("should use an oracle compatible coalesce query for oracle when using the equals filter", () => {
    let query = new Sql(SqlClient.ORACLE, limit)._query(
      generateReadJson({
        table: ORACLE_TABLE,
        filters: {
          equal: {
            name: "John",
          },
        },
      })
    )

    expect(query).toEqual({
      bindings: ["John", 1, limit, 5000],
      sql: `select * from (select * from (select *, DENSE_RANK() over (order by "test.id" asc) as _row_num from (select * from "test" where (to_char("test"."name") IS NOT NULL AND to_char("test"."name") = :1) order by "test"."id" asc)) where "_row_num" between :2 and :3) where rownum <= :4`,
    })
  })

  it("should use an oracle compatible coalesce query for oracle when using the not equals filter", () => {
    let query = new Sql(SqlClient.ORACLE, limit)._query(
      generateReadJson({
        table: ORACLE_TABLE,
        filters: {
          notEqual: {
            name: "John",
          },
        },
      })
    )

    expect(query).toEqual({
      bindings: ["John", 1, limit, 5000],
      sql: `select * from (select * from (select *, DENSE_RANK() over (order by "test.id" asc) as _row_num from (select * from "test" where (to_char("test"."name") IS NOT NULL AND to_char("test"."name") != :1) OR to_char("test"."name") IS NULL order by "test"."id" asc)) where "_row_num" between :2 and :3) where rownum <= :4`,
    })
  })
})
