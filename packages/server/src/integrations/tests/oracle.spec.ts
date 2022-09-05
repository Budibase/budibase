const oracledb = require("oracledb")
import { default as OracleIntegration } from "../oracle"
jest.mock("oracledb")

class TestConfiguration {
  integration: any

  constructor(config: any = {}) {
    this.integration = new OracleIntegration.integration(config)
  }
}

const options = { autoCommit: true }

describe("Oracle Integration", () => {
  let config: any

  beforeEach(() => {
    jest.clearAllMocks()
    config = new TestConfiguration()
  })

  afterEach(() => {
    expect(oracledb.closeMock).toHaveBeenCalled()
    expect(oracledb.closeMock).toHaveBeenCalledTimes(1)
  })

  it("calls the create method with the correct params", async () => {
    const sql = "insert into users (name, age) values ('Joe', 123);"
    await config.integration.create({
      sql,
    })
    expect(oracledb.executeMock).toHaveBeenCalledWith(sql, [], options)
    expect(oracledb.executeMock).toHaveBeenCalledTimes(1)
  })

  it("calls the read method with the correct params", async () => {
    const sql = "select * from users;"
    await config.integration.read({
      sql,
    })
    expect(oracledb.executeMock).toHaveBeenCalledWith(sql, [], options)
    expect(oracledb.executeMock).toHaveBeenCalledTimes(1)
  })

  it("calls the update method with the correct params", async () => {
    const sql = "update table users set name = 'test';"
    const response = await config.integration.update({
      sql,
    })
    expect(oracledb.executeMock).toHaveBeenCalledWith(sql, [], options)
    expect(oracledb.executeMock).toHaveBeenCalledTimes(1)
  })

  it("calls the delete method with the correct params", async () => {
    const sql = "delete from users where name = 'todelete';"
    await config.integration.delete({
      sql,
    })
    expect(oracledb.executeMock).toHaveBeenCalledWith(sql, [], options)
    expect(oracledb.executeMock).toHaveBeenCalledTimes(1)
  })

  describe("no rows returned", () => {
    beforeEach(() => {
      oracledb.executeMock.mockImplementation(() => ({ rows: [] }))
    })

    it("returns the correct response when the create response has no rows", async () => {
      const sql = "insert into users (name, age) values ('Joe', 123);"
      const response = await config.integration.create({
        sql,
      })
      expect(response).toEqual([{ created: true }])
      expect(oracledb.executeMock).toHaveBeenCalledTimes(1)
    })

    it("returns the correct response when the update response has no rows", async () => {
      const sql = "update table users set name = 'test';"
      const response = await config.integration.update({
        sql,
      })
      expect(response).toEqual([{ updated: true }])
      expect(oracledb.executeMock).toHaveBeenCalledTimes(1)
    })

    it("returns the correct response when the delete response has no rows", async () => {
      const sql = "delete from users where name = 'todelete';"
      const response = await config.integration.delete({
        sql,
      })
      expect(response).toEqual([{ deleted: true }])
      expect(oracledb.executeMock).toHaveBeenCalledTimes(1)
    })
  })
})
