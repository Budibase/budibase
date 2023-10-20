const Sql = require("../base/sql").default
const { SqlClient } = require("../utils")

const TABLE_NAME = "test"

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
}: any = {}) {
  return {
    endpoint: endpoint(table || TABLE_NAME, "READ"),
    resource: {
      fields: fields || [],
    },
    filters: filters || {},
    sort: sort || {},
    paginate: paginate || {},
    meta: {
      table: {
        name: table || TABLE_NAME,
        primary: ["id"],
      },
    },
  }
}

function generateCreateJson(table = TABLE_NAME, body = {}) {
  return {
    endpoint: endpoint(table, "CREATE"),
    body,
  }
}

function generateUpdateJson(table = TABLE_NAME, body = {}, filters = {}) {
  return {
    endpoint: endpoint(table, "UPDATE"),
    filters,
    body,
  }
}

function generateDeleteJson(table = TABLE_NAME, filters = {}) {
  return {
    endpoint: endpoint(table, "DELETE"),
    filters,
  }
}

function generateRelationshipJson(config: { schema?: string } = {}) {
  return {
    endpoint: {
      datasourceId: "Postgres",
      entityId: "brands",
      operation: "READ",
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
    paginate: {},
    relationships: [
      {
        from: "brand_id",
        to: "brand_id",
        tableName: "products",
        column: "products",
      },
    ],
    extra: { idFilter: {} },
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
  }
}

describe("SQL query builder", () => {
  const limit = 500
  const client = SqlClient.POSTGRES
  let sql: any

  beforeEach(() => {
    sql = new Sql(client, limit)
  })

  it("should test a basic read", () => {
    const query = sql._query(generateReadJson())
    expect(query).toEqual({
      bindings: [limit],
      sql: `select * from (select * from "${TABLE_NAME}" limit $1) as "${TABLE_NAME}"`,
    })
  })

  it("should test a read with specific columns", () => {
    const nameProp = `${TABLE_NAME}.name`,
      ageProp = `${TABLE_NAME}.age`
    const query = sql._query(
      generateReadJson({
        fields: [nameProp, ageProp],
      })
    )
    expect(query).toEqual({
      bindings: [limit],
      sql: `select "${TABLE_NAME}"."name" as "${nameProp}", "${TABLE_NAME}"."age" as "${ageProp}" from (select * from "${TABLE_NAME}" limit $1) as "${TABLE_NAME}"`,
    })
  })

  it("should test a where string starts with read", () => {
    const query = sql._query(
      generateReadJson({
        filters: {
          string: {
            name: "John",
          },
        },
      })
    )
    expect(query).toEqual({
      bindings: ["John%", limit],
      sql: `select * from (select * from "${TABLE_NAME}" where "${TABLE_NAME}"."name" ilike $1 limit $2) as "${TABLE_NAME}"`,
    })
  })

  it("should test a where range read", () => {
    const query = sql._query(
      generateReadJson({
        filters: {
          range: {
            age: {
              low: 2,
              high: 10,
            },
          },
        },
      })
    )
    expect(query).toEqual({
      bindings: [2, 10, limit],
      sql: `select * from (select * from "${TABLE_NAME}" where "${TABLE_NAME}"."age" between $1 and $2 limit $3) as "${TABLE_NAME}"`,
    })
  })

  it("should test for multiple IDs with OR", () => {
    const query = sql._query(
      generateReadJson({
        filters: {
          equal: {
            age: 10,
            name: "John",
          },
          allOr: true,
        },
      })
    )
    expect(query).toEqual({
      bindings: [10, "John", limit],
      sql: `select * from (select * from "${TABLE_NAME}" where ("${TABLE_NAME}"."age" = $1) or ("${TABLE_NAME}"."name" = $2) limit $3) as "${TABLE_NAME}"`,
    })
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

  it("should test an create statement", () => {
    const query = sql._query(
      generateCreateJson(TABLE_NAME, {
        name: "Michael",
        age: 45,
      })
    )
    expect(query).toEqual({
      bindings: [45, "Michael"],
      sql: `insert into "${TABLE_NAME}" ("age", "name") values ($1, $2) returning *`,
    })
  })

  it("should test an update statement", () => {
    const query = sql._query(
      generateUpdateJson(
        TABLE_NAME,
        {
          name: "John",
        },
        {
          equal: {
            id: 1001,
          },
        }
      )
    )
    expect(query).toEqual({
      bindings: ["John", 1001],
      sql: `update "${TABLE_NAME}" set "name" = $1 where "${TABLE_NAME}"."id" = $2 returning *`,
    })
  })

  it("should test a delete statement", () => {
    const query = sql._query(
      generateDeleteJson(TABLE_NAME, {
        equal: {
          id: 1001,
        },
      })
    )
    expect(query).toEqual({
      bindings: [1001],
      sql: `delete from "${TABLE_NAME}" where "${TABLE_NAME}"."id" = $1 returning *`,
    })
  })

  it("should work with MS-SQL", () => {
    const query = new Sql(SqlClient.MS_SQL, 10)._query(generateReadJson())
    expect(query).toEqual({
      bindings: [10],
      sql: `select * from (select top (@p0) * from [${TABLE_NAME}]) as [${TABLE_NAME}]`,
    })
  })

  it("should work with MySQL", () => {
    const query = new Sql(SqlClient.MY_SQL, 10)._query(generateReadJson())
    expect(query).toEqual({
      bindings: [10],
      sql: `select * from (select * from \`${TABLE_NAME}\` limit ?) as \`${TABLE_NAME}\``,
    })
  })

  it("should use greater than when only low range specified", () => {
    const date = new Date()
    const query = sql._query(
      generateReadJson({
        filters: {
          range: {
            property: {
              low: date,
            },
          },
        },
      })
    )
    expect(query).toEqual({
      bindings: [date, limit],
      sql: `select * from (select * from "${TABLE_NAME}" where "${TABLE_NAME}"."property" > $1 limit $2) as "${TABLE_NAME}"`,
    })
  })

  it("should use less than when only high range specified", () => {
    const date = new Date()
    const query = sql._query(
      generateReadJson({
        filters: {
          range: {
            property: {
              high: date,
            },
          },
        },
      })
    )
    expect(query).toEqual({
      bindings: [date, limit],
      sql: `select * from (select * from "${TABLE_NAME}" where "${TABLE_NAME}"."property" < $1 limit $2) as "${TABLE_NAME}"`,
    })
  })

  it("should use greater than when only low range specified", () => {
    const date = new Date()
    const query = sql._query(
      generateReadJson({
        filters: {
          range: {
            property: {
              low: date,
            },
          },
        },
      })
    )
    expect(query).toEqual({
      bindings: [date, limit],
      sql: `select * from (select * from "${TABLE_NAME}" where "${TABLE_NAME}"."property" > $1 limit $2) as "${TABLE_NAME}"`,
    })
  })

  it("should use AND like expression for MS-SQL when filter is contains", () => {
    const query = new Sql(SqlClient.MS_SQL, 10)._query(
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
      bindings: [10, "%20%", "%25%", `%"john"%`, `%"mary"%`],
      sql: `select * from (select top (@p0) * from [${TABLE_NAME}] where (LOWER([${TABLE_NAME}].[age]) LIKE @p1 AND LOWER([${TABLE_NAME}].[age]) LIKE @p2) and (LOWER([${TABLE_NAME}].[name]) LIKE @p3 AND LOWER([${TABLE_NAME}].[name]) LIKE @p4)) as [${TABLE_NAME}]`,
    })
  })

  it("should use JSON_CONTAINS expression for MySQL when filter is contains", () => {
    const query = new Sql(SqlClient.MY_SQL, 10)._query(
      generateReadJson({
        filters: {
          contains: {
            age: [20],
            name: ["John"],
          },
        },
      })
    )
    expect(query).toEqual({
      bindings: [10],
      sql: `select * from (select * from \`${TABLE_NAME}\` where JSON_CONTAINS(${TABLE_NAME}.age, '[20]') and JSON_CONTAINS(${TABLE_NAME}.name, '["John"]') limit ?) as \`${TABLE_NAME}\``,
    })
  })

  it("should use jsonb operator expression for PostgreSQL when filter is contains", () => {
    const query = new Sql(SqlClient.POSTGRES, 10)._query(
      generateReadJson({
        filters: {
          contains: {
            age: [20],
            name: ["John"],
          },
        },
      })
    )
    expect(query).toEqual({
      bindings: [10],
      sql: `select * from (select * from \"${TABLE_NAME}\" where \"${TABLE_NAME}\".\"age\"::jsonb @> '[20]' and \"${TABLE_NAME}\".\"name\"::jsonb @> '["John"]' limit $1) as \"${TABLE_NAME}\"`,
    })
  })

  it("should use NOT like expression for MS-SQL when filter is notContains", () => {
    const query = new Sql(SqlClient.MS_SQL, 10)._query(
      generateReadJson({
        filters: {
          notContains: {
            age: [20],
            name: ["John"],
          },
        },
      })
    )
    expect(query).toEqual({
      bindings: [10, "%20%", `%"john"%`],
      sql: `select * from (select top (@p0) * from [${TABLE_NAME}] where NOT (LOWER([${TABLE_NAME}].[age]) LIKE @p1) and NOT (LOWER([${TABLE_NAME}].[name]) LIKE @p2)) as [${TABLE_NAME}]`,
    })
  })

  it("should use NOT JSON_CONTAINS expression for MySQL when filter is notContains", () => {
    const query = new Sql(SqlClient.MY_SQL, 10)._query(
      generateReadJson({
        filters: {
          notContains: {
            age: [20],
            name: ["John"],
          },
        },
      })
    )
    expect(query).toEqual({
      bindings: [10],
      sql: `select * from (select * from \`${TABLE_NAME}\` where NOT JSON_CONTAINS(${TABLE_NAME}.age, '[20]') and NOT JSON_CONTAINS(${TABLE_NAME}.name, '["John"]') limit ?) as \`${TABLE_NAME}\``,
    })
  })

  it("should use jsonb operator NOT expression for PostgreSQL when filter is notContains", () => {
    const query = new Sql(SqlClient.POSTGRES, 10)._query(
      generateReadJson({
        filters: {
          notContains: {
            age: [20],
            name: ["John"],
          },
        },
      })
    )
    expect(query).toEqual({
      bindings: [10],
      sql: `select * from (select * from \"${TABLE_NAME}\" where NOT \"${TABLE_NAME}\".\"age\"::jsonb @> '[20]' and NOT \"${TABLE_NAME}\".\"name\"::jsonb @> '["John"]' limit $1) as \"${TABLE_NAME}\"`,
    })
  })

  it("should use OR like expression for MS-SQL when filter is containsAny", () => {
    const query = new Sql(SqlClient.MS_SQL, 10)._query(
      generateReadJson({
        filters: {
          containsAny: {
            age: [20, 25],
            name: ["John", "Mary"],
          },
        },
      })
    )
    expect(query).toEqual({
      bindings: [10, "%20%", "%25%", `%"john"%`, `%"mary"%`],
      sql: `select * from (select top (@p0) * from [${TABLE_NAME}] where (LOWER([${TABLE_NAME}].[age]) LIKE @p1 OR LOWER([${TABLE_NAME}].[age]) LIKE @p2) and (LOWER([${TABLE_NAME}].[name]) LIKE @p3 OR LOWER([${TABLE_NAME}].[name]) LIKE @p4)) as [${TABLE_NAME}]`,
    })
  })

  it("should use JSON_OVERLAPS expression for MySQL when filter is containsAny", () => {
    const query = new Sql(SqlClient.MY_SQL, 10)._query(
      generateReadJson({
        filters: {
          containsAny: {
            age: [20, 25],
            name: ["John", "Mary"],
          },
        },
      })
    )
    expect(query).toEqual({
      bindings: [10],
      sql: `select * from (select * from \`${TABLE_NAME}\` where JSON_OVERLAPS(${TABLE_NAME}.age, '[20,25]') and JSON_OVERLAPS(${TABLE_NAME}.name, '["John","Mary"]') limit ?) as \`${TABLE_NAME}\``,
    })
  })

  it("should use ?| operator expression for PostgreSQL when filter is containsAny", () => {
    const query = new Sql(SqlClient.POSTGRES, 10)._query(
      generateReadJson({
        filters: {
          containsAny: {
            age: [20, 25],
            name: ["John", "Mary"],
          },
        },
      })
    )
    expect(query).toEqual({
      bindings: [10],
      sql: `select * from (select * from \"${TABLE_NAME}\" where \"${TABLE_NAME}\".\"age\"::jsonb ?| array [20,25] and \"${TABLE_NAME}\".\"name\"::jsonb ?| array ['John','Mary'] limit $1) as \"${TABLE_NAME}\"`,
    })
  })

  it("should add the schema to the LEFT JOIN", () => {
    const query = sql._query(generateRelationshipJson({ schema: "production" }))
    expect(query).toEqual({
      bindings: [500, 5000],
      sql: `select "brands"."brand_id" as "brands.brand_id", "brands"."brand_name" as "brands.brand_name", "products"."product_id" as "products.product_id", "products"."product_name" as "products.product_name", "products"."brand_id" as "products.brand_id" from (select * from "production"."brands" limit $1) as "brands" left join "production"."products" on "brands"."brand_id" = "products"."brand_id" limit $2`,
    })
  })

  it("should handle if the schema is not present when doing a LEFT JOIN", () => {
    const query = sql._query(generateRelationshipJson())
    expect(query).toEqual({
      bindings: [500, 5000],
      sql: `select "brands"."brand_id" as "brands.brand_id", "brands"."brand_name" as "brands.brand_name", "products"."product_id" as "products.product_id", "products"."product_name" as "products.product_name", "products"."brand_id" as "products.brand_id" from (select * from "brands" limit $1) as "brands" left join "products" on "brands"."brand_id" = "products"."brand_id" limit $2`,
    })
  })

  it("should add the schema to both the toTable and throughTable in many-to-many join", () => {
    const query = sql._query(
      generateManyRelationshipJson({ schema: "production" })
    )
    expect(query).toEqual({
      bindings: [500, 5000],
      sql: `select "stores"."store_id" as "stores.store_id", "stores"."store_name" as "stores.store_name", "products"."product_id" as "products.product_id", "products"."product_name" as "products.product_name" from (select * from "production"."stores" limit $1) as "stores" left join "production"."stocks" on "stores"."store_id" = "stocks"."store_id" left join "production"."products" on "products"."product_id" = "stocks"."product_id" limit $2`,
    })
  })

  it("should handle table names with dashes when performing a LIKE in MySQL", () => {
    const tableName = "Table-Name-With-Dashes"
    const query = new Sql(SqlClient.MY_SQL, limit)._query(
      generateReadJson({
        table: tableName,
        filters: {
          string: {
            name: "John",
          },
        },
      })
    )
    expect(query).toEqual({
      bindings: ["john%", limit],
      sql: `select * from (select * from \`${tableName}\` where LOWER(\`${tableName}\`.\`name\`) LIKE ? limit ?) as \`${tableName}\``,
    })
  })

  it("should handle table names with dashes when performing a LIKE in SQL Server", () => {
    const tableName = "Table-Name-With-Dashes"
    const query = new Sql(SqlClient.MS_SQL, limit)._query(
      generateReadJson({
        table: tableName,
        filters: {
          string: {
            name: "John",
          },
        },
      })
    )
    expect(query).toEqual({
      bindings: [limit, "john%"],
      sql: `select * from (select top (@p0) * from [${tableName}] where LOWER([${tableName}].[name]) LIKE @p1) as [${tableName}]`,
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
      sql: `select * from (select * from \"${TABLE_NAME}\" where \"${TABLE_NAME}\".\"dob\" > $1 limit $2) as \"${TABLE_NAME}\"`,
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
      sql: `select * from (select * from \"${TABLE_NAME}\" where \"${TABLE_NAME}\".\"dob\" < $1 limit $2) as \"${TABLE_NAME}\"`,
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
      sql: `select * from (select * from (select * from \"test\" where LOWER(\"test\".\"name\") LIKE :1) where rownum <= :2) \"test\"`,
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
      sql: `select * from (select * from (select * from \"test\" where (LOWER(\"test\".\"age\") LIKE :1 AND LOWER(\"test\".\"age\") LIKE :2) and (LOWER(\"test\".\"name\") LIKE :3 AND LOWER(\"test\".\"name\") LIKE :4)) where rownum <= :5) \"test\"`,
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
      sql: `select * from (select * from (select * from \"test\" where LOWER(\"test\".\"name\") LIKE :1) where rownum <= :2) \"test\"`,
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
      sql: `insert into \"test\" (\"name\") values ($1) returning *`,
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
      sql: `insert into \"test\" (\"name\") values ($1) returning *`,
    })
  })
})
