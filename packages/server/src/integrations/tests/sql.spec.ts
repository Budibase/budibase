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
  const relationshipLimit = 500
  const limit = 500
  const client = SqlClient.POSTGRES
  let sql: any

  beforeEach(() => {
    sql = new Sql(client, limit)
  })

  it("should add the schema to the LEFT JOIN", () => {
    const query = sql._query(generateRelationshipJson({ schema: "production" }))
    expect(query).toEqual({
      bindings: [limit, relationshipLimit],
      sql: `with "paginated" as (select "brands".* from "production"."brands" order by "test"."id" asc limit $1) select "brands".*, (select json_agg(json_build_object('brand_id',"products"."brand_id",'product_id',"products"."product_id",'product_name',"products"."product_name")) from (select "products".* from "production"."products" as "products" where "products"."brand_id" = "brands"."brand_id" order by "products"."brand_id" asc limit $2) as "products") as "products" from "paginated" as "brands" order by "test"."id" asc`,
    })
  })

  it("should handle if the schema is not present when doing a LEFT JOIN", () => {
    const query = sql._query(generateRelationshipJson())
    expect(query).toEqual({
      bindings: [limit, relationshipLimit],
      sql: `with "paginated" as (select "brands".* from "brands" order by "test"."id" asc limit $1) select "brands".*, (select json_agg(json_build_object('brand_id',"products"."brand_id",'product_id',"products"."product_id",'product_name',"products"."product_name")) from (select "products".* from "products" as "products" where "products"."brand_id" = "brands"."brand_id" order by "products"."brand_id" asc limit $2) as "products") as "products" from "paginated" as "brands" order by "test"."id" asc`,
    })
  })

  it("should add the schema to both the toTable and throughTable in many-to-many join", () => {
    const query = sql._query(
      generateManyRelationshipJson({ schema: "production" })
    )
    expect(query).toEqual({
      bindings: [limit, relationshipLimit],
      sql: `with "paginated" as (select "stores".* from "production"."stores" order by "test"."id" asc limit $1) select "stores".*, (select json_agg(json_build_object('product_id',"products"."product_id",'product_name',"products"."product_name")) from (select "products".* from "production"."products" as "products" inner join "production"."stocks" as "stocks" on "products"."product_id" = "stocks"."product_id" where "stocks"."store_id" = "stores"."store_id" order by "products"."product_id" asc limit $2) as "products") as "products" from "paginated" as "stores" order by "test"."id" asc`,
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
      sql: `select * from (select * from "test" where LOWER("test"."name") LIKE :1 order by "test"."id" asc) where rownum <= :2`,
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
    const filterSet = [`%20%`, `%25%`, `%"john"%`, `%"mary"%`]
    expect(query).toEqual({
      bindings: [...filterSet, limit],
      sql: `select * from (select * from "test" where COALESCE(LOWER("test"."age"), '') LIKE :1 AND COALESCE(LOWER("test"."age"), '') LIKE :2 and COALESCE(LOWER("test"."name"), '') LIKE :3 AND COALESCE(LOWER("test"."name"), '') LIKE :4 order by "test"."id" asc) where rownum <= :5`,
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
      sql: `select * from (select * from "test" where LOWER("test"."name") LIKE :1 order by "test"."id" asc) where rownum <= :2`,
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
      bindings: ["John", limit],
      sql: `select * from (select * from "test" where (to_char("test"."name") IS NOT NULL AND to_char("test"."name") = :1) order by "test"."id" asc) where rownum <= :2`,
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
      bindings: ["John", limit],
      sql: `select * from (select * from "test" where (to_char("test"."name") IS NOT NULL AND to_char("test"."name") != :1) OR to_char("test"."name") IS NULL order by "test"."id" asc) where rownum <= :2`,
    })
  })
})
