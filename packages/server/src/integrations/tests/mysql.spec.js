const pg = require("mysql")
const MySQLIntegration = require("../mysql")
jest.mock("mysql")

class TestConfiguration {
  constructor(config = { ssl: {} }) {
    this.integration = new MySQLIntegration.integration(config) 
    this.query = jest.fn(() => [{ id: 1 }])
    this.integration.query = this.query
  }
}

describe("MySQL Integration", () => {
  let config 

  beforeEach(() => {
    config = new TestConfiguration()
  })

  it("calls the create method with the correct params", async () => {
    const sql = "insert into users (name, age) values ('Joe', 123);"
    const response = await config.integration.create({ 
      sql
    })
    expect(config.query).toHaveBeenCalledWith({ sql })
  })

  it("calls the read method with the correct params", async () => {
    const sql = "select * from users;"
    const response = await config.integration.read({ 
      sql
    })
    expect(config.query).toHaveBeenCalledWith({
      sql
    })
  })

  it("calls the update method with the correct params", async () => {
    const sql = "update table users set name = 'test';"
    const response = await config.integration.update({ 
      sql
    })
    expect(config.query).toHaveBeenCalledWith({ sql })
  })

  it("calls the delete method with the correct params", async () => {
    const sql = "delete from users where name = 'todelete';"
    const response = await config.integration.delete({ 
      sql
    })
    expect(config.query).toHaveBeenCalledWith({ sql })
  })

  describe("no rows returned", () => {
    beforeEach(() => {
      config.query.mockImplementation(() => [])
    })

    it("returns the correct response when the create response has no rows", async () => {
    const sql = "insert into users (name, age) values ('Joe', 123);"
      const response = await config.integration.create({ 
        sql
      })
      expect(response).toEqual([{ created: true }])
    })

    it("returns the correct response when the update response has no rows", async () => {
      const sql = "update table users set name = 'test';"
      const response = await config.integration.update({ 
        sql
      })
      expect(response).toEqual([{ updated: true }])
    })

    it("returns the correct response when the delete response has no rows", async () => {
      const sql = "delete from users where name = 'todelete';"
      const response = await config.integration.delete({ 
        sql
      })
      expect(response).toEqual([{ deleted: true }])
    })
  })
})