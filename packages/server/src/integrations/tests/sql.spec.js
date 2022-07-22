const Sql = require("../base/sql")
const { SqlClients } = require("../utils")

const TABLE_NAME = "test"

function endpoint(table, operation) {
  return {
    datasourceId: "Postgres",
    operation: operation,
    entityId: table || TABLE_NAME,
  }
}

function generateReadJson({ table, fields, filters, sort, paginate} = {}) {
  return {
    endpoint: endpoint(table || TABLE_NAME, "READ"),
    resource: {
      fields: fields || [],
    },
    filters: filters || {},
    sort: sort || {},
    paginate: paginate || {},
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

describe("SQL query builder", () => {
  const limit = 500
  const client = SqlClients.POSTGRES
  let sql

  beforeEach(() => {
    sql = new Sql(client, limit)
  })

  it("should test a basic read", () => {
    const query = sql._query(generateReadJson())
    expect(query).toEqual({
      bindings: [limit],
      sql: `select * from (select * from "${TABLE_NAME}" limit $1) as "${TABLE_NAME}"`
    })
  })

  it("should test a read with specific columns", () => {
    const nameProp = `${TABLE_NAME}.name`, ageProp = `${TABLE_NAME}.age`
    const query = sql._query(generateReadJson({
      fields: [nameProp, ageProp]
    }))
    expect(query).toEqual({
      bindings: [limit],
      sql: `select "${TABLE_NAME}"."name" as "${nameProp}", "${TABLE_NAME}"."age" as "${ageProp}" from (select * from "${TABLE_NAME}" limit $1) as "${TABLE_NAME}"`
    })
  })

  it("should test a where string starts with read", () => {
    const query = sql._query(generateReadJson({
      filters: {
        string: {
          name: "John",
        }
      }
    }))
    expect(query).toEqual({
      bindings: ["John%", limit],
      sql: `select * from (select * from "${TABLE_NAME}" where "${TABLE_NAME}"."name" ilike $1 limit $2) as "${TABLE_NAME}"`
    })
  })

  it("should test a where range read", () => {
    const query = sql._query(generateReadJson({
      filters: {
        range: {
          age: {
            low: 2,
            high: 10,
          }
        }
      }
    }))
    expect(query).toEqual({
      bindings: [2, 10, limit],
      sql: `select * from (select * from "${TABLE_NAME}" where "${TABLE_NAME}"."age" between $1 and $2 limit $3) as "${TABLE_NAME}"`
    })
  })

  it("should test for multiple IDs with OR", () => {
    const query = sql._query(generateReadJson({
      filters: {
        equal: {
          age: 10,
          name: "John",
        },
        allOr: true,
      }
    }))
    expect(query).toEqual({
      bindings: [10, "John", limit],
      sql: `select * from (select * from "${TABLE_NAME}" where ("${TABLE_NAME}"."age" = $1) or ("${TABLE_NAME}"."name" = $2) limit $3) as "${TABLE_NAME}"`
    })
  })

  it("should allow filtering on a related field", () => {
    const query = sql._query(generateReadJson({
      filters: {
        equal: {
          age: 10,
          "task.name": "task 1",
        },
      },
    }))
    // order of bindings changes because relationship filters occur outside inner query
    expect(query).toEqual({
      bindings: [10, limit, "task 1"],
      sql: `select * from (select * from "${TABLE_NAME}" where "${TABLE_NAME}"."age" = $1 limit $2) as "${TABLE_NAME}" where "task"."name" = $3`
    })
  })

  it("should test an create statement", () => {
    const query = sql._query(generateCreateJson(TABLE_NAME, {
      name: "Michael",
      age: 45,
    }))
    expect(query).toEqual({
      bindings: [45, "Michael"],
      sql: `insert into "${TABLE_NAME}" ("age", "name") values ($1, $2) returning *`
    })
  })

  it("should test an update statement", () => {
    const query = sql._query(generateUpdateJson(TABLE_NAME, {
      name: "John"
    }, {
      equal: {
        id: 1001,
      }
    }))
    expect(query).toEqual({
      bindings: ["John", 1001],
      sql: `update "${TABLE_NAME}" set "name" = $1 where "${TABLE_NAME}"."id" = $2 returning *`
    })
  })

  it("should test a delete statement", () => {
    const query = sql._query(generateDeleteJson(TABLE_NAME, {
      equal: {
        id: 1001,
      }
    }))
    expect(query).toEqual({
      bindings: [1001],
      sql: `delete from "${TABLE_NAME}" where "${TABLE_NAME}"."id" = $1 returning *`
    })
  })

  it("should work with MS-SQL", () => {
    const query = new Sql(SqlClients.MS_SQL, 10)._query(generateReadJson())
    expect(query).toEqual({
      bindings: [10],
      sql: `select * from (select top (@p0) * from [${TABLE_NAME}]) as [${TABLE_NAME}]`
    })
  })

  it("should work with MySQL", () => {
    const query = new Sql(SqlClients.MY_SQL, 10)._query(generateReadJson())
    expect(query).toEqual({
      bindings: [10],
      sql: `select * from (select * from \`${TABLE_NAME}\` limit ?) as \`${TABLE_NAME}\``
    })
  })

  it("should use greater than when only low range specified", () => {
    const date = new Date()
    const query = sql._query(generateReadJson({
      filters: {
        range: {
          property: {
            low: date,
          }
        }
      }
    }))
    expect(query).toEqual({
      bindings: [date, limit],
      sql: `select * from (select * from "${TABLE_NAME}" where "${TABLE_NAME}"."property" > $1 limit $2) as "${TABLE_NAME}"`
    })
  })

  it("should use less than when only high range specified", () => {
    const date = new Date()
    const query = sql._query(generateReadJson({
      filters: {
        range: {
          property: {
            high: date,
          }
        }
      }
    }))
    expect(query).toEqual({
      bindings: [date, limit],
      sql: `select * from (select * from "${TABLE_NAME}" where "${TABLE_NAME}"."property" < $1 limit $2) as "${TABLE_NAME}"`
    })
  })

  it("should use greater than when only low range specified", () => {
    const date = new Date()
    const query = sql._query(generateReadJson({
      filters: {
        range: {
          property: {
            low: date,
          }
        }
      }
    }))
    expect(query).toEqual({
      bindings: [date, limit],
      sql: `select * from (select * from "${TABLE_NAME}" where "${TABLE_NAME}"."property" > $1 limit $2) as "${TABLE_NAME}"`
    })
  })

  it("should use like expression for MS-SQL when filter is contains", () => {
    const query = new Sql(SqlClients.MS_SQL, 10)._query(generateReadJson({
      filters: {
        contains: {
          age: 20,
          name: "John"
        }
      }
    }))
    expect(query).toEqual({
      bindings: [10, "%20%", "%John%"],
      sql: `select * from (select top (@p0) * from [${TABLE_NAME}] where LOWER(${TABLE_NAME}.age) LIKE @p1 and LOWER(${TABLE_NAME}.name) LIKE @p2) as [${TABLE_NAME}]`
    })
  })

  it("should use JSON_CONTAINS expression for MySQL when filter is contains", () => {
    const query = new Sql(SqlClients.MY_SQL, 10)._query(generateReadJson({
      filters: {
        contains: {
          age: 20,
          name: "John"
        }
      }
    }))
    expect(query).toEqual({
      bindings: [10],
      sql: `select * from (select * from \`${TABLE_NAME}\` where JSON_CONTAINS(${TABLE_NAME}.age, '20') and JSON_CONTAINS(${TABLE_NAME}.name, '"John"') limit ?) as \`${TABLE_NAME}\``
    })
  })

  it("should use jsonb operator expression for PostgreSQL when filter is contains", () => {
    const query = new Sql(SqlClients.POSTGRES, 10)._query(generateReadJson({
      filters: {
        contains: {
          age: 20,
          name: "John"
        }
      }
    }))
    expect(query).toEqual({
      bindings: [10],
      sql: `select * from (select * from \"${TABLE_NAME}\" where \"${TABLE_NAME}\".\"age\"::jsonb @> '[20]' and \"${TABLE_NAME}\".\"name\"::jsonb @> '["John"]' limit $1) as \"${TABLE_NAME}\"`
    })
  })
})
