const Sql = require("../base/sql")

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
  const client = "pg"
  let sql

  beforeEach(() => {
    sql = new Sql(client, limit)
  })

  it("should test a basic read", () => {
    const query = sql.buildQuery(generateReadJson())
    expect(query).toEqual(`select * from "${TABLE_NAME}" limit ${limit}`)
  })

  it("should test a read with specific columns", () => {
    const query = sql.buildQuery(generateReadJson({
      fields: ["name", "age"]
    }))
    expect(query).toEqual(`select "name", "age" from "${TABLE_NAME}" limit ${limit}`)
  })

  it("should test a where string starts with read", () => {
    const query = sql.buildQuery(generateReadJson({
      filters: {
        string: {
          name: "John",
        }
      }
    }))
    expect(query).toEqual(`select * from "${TABLE_NAME}" where "name" like 'John%' limit ${limit}`)
  })

  it("should test a where range read", () => {
    const query = sql.buildQuery(generateReadJson({
      filters: {
        range: {
          age: {
            low: 2,
            high: 10,
          }
        }
      }
    }))
    expect(query).toEqual(`select * from "${TABLE_NAME}" where "age" between 2 and 10 limit ${limit}`)
  })

  it("should test an create statement", () => {
    const query = sql.buildQuery(generateCreateJson(TABLE_NAME, {
      name: "Michael",
      age: 45,
    }))
    expect(query).toEqual(`insert into "${TABLE_NAME}" ("age", "name") values (45, 'Michael')`)
  })

  it("should test an update statement", () => {
    const query = sql.buildQuery(generateUpdateJson(TABLE_NAME, {
      name: "John"
    }, {
      equal: {
        id: 1001,
      }
    }))
    expect(query).toEqual(`update "${TABLE_NAME}" set "name" = 'John' where "id" = 1001`)
  })

  it("should test a delete statement", () => {
    const query = sql.buildQuery(generateDeleteJson(TABLE_NAME, {
      equal: {
        id: 1001,
      }
    }))
    expect(query).toEqual(`delete from "${TABLE_NAME}" where "id" = 1001`)
  })

  it("should work with MS-SQL", () => {
    const query = new Sql("mssql", 10).buildQuery(generateReadJson())
    expect(query).toEqual(`select top (10) * from [${TABLE_NAME}]`)
  })

  it("should work with mySQL", () => {
    const query = new Sql("mysql", 10).buildQuery(generateReadJson())
    expect(query).toEqual(`select * from \`${TABLE_NAME}\` limit 10`)
  })
})
