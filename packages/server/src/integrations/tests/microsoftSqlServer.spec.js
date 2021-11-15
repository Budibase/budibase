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

  beforeEach(async () => {
    config = new TestConfiguration()
  })

  describe("check sql used", () => {
    beforeEach(async () => {
      await config.integration.connect()
    })

    it("calls the create method with the correct params", async () => {
      const sql = "insert into users (name, age) values ('Joe', 123);"
      const response = await config.integration.create({
        sql
      })
      expect(config.integration.client.request).toHaveBeenCalledWith()
      expect(response[0]).toEqual(sql)
    })

    it("calls the read method with the correct params", async () => {
      const sql = "select * from users;"
      const response = await config.integration.read({
        sql
      })
      expect(config.integration.client.request).toHaveBeenCalledWith()
      expect(response[0]).toEqual(sql)
    })
  })

  describe("no rows returned", () => {
    beforeEach(async () => {
      await config.integration.connect()
    })

    it("returns the correct response when the create response has no rows", async () => {
    const sql = "insert into users (name, age) values ('Joe', 123);"
      const response = await config.integration.create({ 
        sql
      })
      expect(response[0]).toEqual(sql)
    })
  })
})