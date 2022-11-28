import { default as MySQLIntegration } from "../mysql"
jest.mock("mysql2")

class TestConfiguration {
  integration: any

  constructor(config: any = { ssl: {} }) {
    this.integration = new MySQLIntegration.integration(config)
  }
}

describe("MySQL Integration", () => {
  let config: any

  beforeEach(() => {
    config = new TestConfiguration()
  })

  it("calls the create method with the correct params", async () => {
    const sql = "insert into users (name, age) values ('Joe', 123);"
    await config.integration.create({
      sql,
    })
    expect(config.integration.client.query).toHaveBeenCalledWith(sql, [])
  })

  it("calls the read method with the correct params", async () => {
    const sql = "select * from users;"
    await config.integration.read({
      sql,
    })
    expect(config.integration.client.query).toHaveBeenCalledWith(sql, [])
  })

  it("calls the update method with the correct params", async () => {
    const sql = "update table users set name = 'test';"
    await config.integration.update({
      sql,
    })
    expect(config.integration.client.query).toHaveBeenCalledWith(sql, [])
  })

  it("calls the delete method with the correct params", async () => {
    const sql = "delete from users where name = 'todelete';"
    await config.integration.delete({
      sql,
    })
    expect(config.integration.client.query).toHaveBeenCalledWith(sql, [])
  })

  describe("no rows returned", () => {
    it("returns the correct response when the create response has no rows", async () => {
      const sql = "insert into users (name, age) values ('Joe', 123);"
      const response = await config.integration.create({
        sql,
      })
      expect(response).toEqual([{ created: true }])
    })

    it("returns the correct response when the update response has no rows", async () => {
      const sql = "update table users set name = 'test';"
      const response = await config.integration.update({
        sql,
      })
      expect(response).toEqual([{ updated: true }])
    })

    it("returns the correct response when the delete response has no rows", async () => {
      const sql = "delete from users where name = 'todelete';"
      const response = await config.integration.delete({
        sql,
      })
      expect(response).toEqual([{ deleted: true }])
    })
  })

  describe("binding type coerce", () => {
    it("ignores non-string types ", async () => {
      const sql = "select * from users;"
      const date = new Date()
      await config.integration.read({
        sql,
        bindings: [11, date, ["a", "b", "c"], { id: 1 }],
      })
      expect(config.integration.client.query).toHaveBeenCalledWith(sql, [
        11,
        date,
        ["a", "b", "c"],
        { id: 1 },
      ])
    })

    it("parses strings matching a number regex", async () => {
      const sql = "select * from users;"
      await config.integration.read({
        sql,
        bindings: ["101", "3.14"],
      })
      expect(config.integration.client.query).toHaveBeenCalledWith(
        sql,
        [101, 3.14]
      )
    })

    it("parses strings matching a valid date format", async () => {
      const sql = "select * from users;"
      await config.integration.read({
        sql,
        bindings: [
          "2001-10-30",
          "2010-09-01T13:30:59.123Z",
          "2021-02-05 12:01 PM",
        ],
      })
      expect(config.integration.client.query).toHaveBeenCalledWith(sql, [
        new Date("2001-10-30T00:00:00.000Z"),
        new Date("2010-09-01T13:30:59.123Z"),
        new Date("2021-02-05T12:01:00.000Z"),
      ])
    })

    it("does not parse string matching a valid array of numbers as date", async () => {
      const sql = "select * from users;"
      await config.integration.read({
        sql,
        bindings: ["1,2,2017"],
      })
      expect(config.integration.client.query).toHaveBeenCalledWith(sql, [
        "1,2,2017",
      ])
    })
  })
})
