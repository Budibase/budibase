const sqlServer = require("mssql")
const MSSQLIntegration = require("../microsoftSqlServer")
jest.mock("mssql")

class TestConfiguration {
  constructor(config = {}) {
    this.integration = new MSSQLIntegration.integration(config) 
  }
}

describe("MS SQL Server Integration", () => {
  let config 

  beforeEach(() => {
    config = new TestConfiguration()
  })

  it("calls the create method with the correct params", async () => {
    const sql = "insert into users (name, age) values ('Joe', 123);"
    const response = await config.integration.create({ 
      sql
    })
    expect(config.integration.client.query).toHaveBeenCalledWith(sql, undefined)
  })

  it("calls the read method with the correct params", async () => {
    const sql = "select * from users;"
    const response = await config.integration.read({ 
      sql
    })
    expect(config.integration.client.query).toHaveBeenCalledWith(sql, undefined)
  })

  describe("no rows returned", () => {
    beforeEach(async () => {
      await config.integration.connect()
      config.integration.client.query.mockImplementation(() => ({ rows: [] }))
    })

    it("returns the correct response when the create response has no rows", async () => {
    const sql = "insert into users (name, age) values ('Joe', 123);"
      const response = await config.integration.create({ 
        sql
      })
      expect(response).toEqual([{ created: true }])
    })
  })
})