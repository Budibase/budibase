import mysqlDriver from "mysql2/promise"
import oracledb from "oracledb"
import { Client } from "pg"
import mssql, { connectToSafeHost } from "../microsoftSqlServer"
import mysql from "../mysql"
import oracle from "../oracle"
import postgres from "../postgres"
import { BLOCKED } from "./utils/outbound"

describe("SQL connectors with the default blacklist", () => {
  describe("Postgres", () => {
    const config = {
      host: "127.0.0.1",
      port: 5432,
      database: "postgres",
      user: "postgres",
      password: "password",
      schema: "public",
    }

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it.each([
      "169.254.169.254",
      "127.0.0.1",
      "localhost",
      "::ffff:169.254.169.254",
      "/var/run/postgresql",
    ])("does not connect to %s", async host => {
      const integration = new postgres.integration({ ...config, host })

      const response = await integration.testConnection()

      expect(response.connected).toBe(false)
      expect(response.error).toContain(BLOCKED)
    })

    it("does not run queries against a blocked host", async () => {
      const integration = new postgres.integration(config)

      await expect(integration.read("SELECT 1")).rejects.toThrow(BLOCKED)
    })

    it("ignores config keys that would redirect the driver", async () => {
      const connect = jest
        .spyOn(Client.prototype, "connect")
        .mockImplementation(() => Promise.reject(new Error("not connecting")))
      const integration = new postgres.integration({
        ...config,
        host: "203.0.113.10",
        ...{
          connectionString: "postgres://user:password@127.0.0.1:6543/other",
          stream: () => {
            throw new Error("stream should not be used")
          },
        },
      })

      await integration.testConnection()

      expect(connect.mock.contexts[0]).toMatchObject({
        host: "203.0.113.10",
        port: 5432,
        database: "postgres",
      })
    })
  })

  describe("MySQL", () => {
    const config = {
      host: "127.0.0.1",
      port: 3306,
      user: "root",
      password: "password",
      database: "mysql",
      rejectUnauthorized: true,
    }

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it.each([
      "169.254.169.254",
      "127.0.0.1",
      "localhost",
      "::ffff:169.254.169.254",
      "/var/run/mysqld/mysqld.sock",
    ])("does not connect to %s", async host => {
      const integration = new mysql.integration({ ...config, host })

      const response = await integration.testConnection()

      expect(response.connected).toBe(false)
      expect(response.error).toContain(BLOCKED)
    })

    it("does not run queries against a blocked host", async () => {
      const integration = new mysql.integration(config)

      await expect(integration.read("SELECT 1")).rejects.toThrow(BLOCKED)
    })

    it("ignores config keys that would redirect the driver", async () => {
      const createConnection = jest
        .spyOn(mysqlDriver, "createConnection")
        .mockImplementation(() => Promise.reject(new Error("not connecting")))
      const integration = new mysql.integration({
        ...config,
        host: "203.0.113.10",
        socketPath: "/var/run/mysqld/mysqld.sock",
        ...{ uri: "mysql://root:password@127.0.0.1:3307/other" },
      })

      await integration.testConnection()

      expect(Object.keys(createConnection.mock.calls[0][0]).sort()).toEqual([
        "database",
        "host",
        "multipleStatements",
        "password",
        "port",
        "ssl",
        "stream",
        "timezone",
        "typeCast",
        "user",
      ])
    })
  })

  describe("SQL Server", () => {
    const config = {
      user: "sa",
      password: "password",
      server: "127.0.0.1",
      port: 1433,
      database: "master",
      schema: "dbo",
    }

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it.each([
      "169.254.169.254",
      "127.0.0.1",
      "localhost",
      "::ffff:169.254.169.254",
      "127.0.0.1\\SQLEXPRESS",
      "localhost\\SQLEXPRESS",
    ])("does not connect to %s", async server => {
      const integration = new mssql.integration({ ...config, server })

      const response = await integration.testConnection()

      expect(response.connected).toBe(false)
      expect(response.error).toContain(BLOCKED)
    })

    it("does not run queries against a blocked host", async () => {
      const integration = new mssql.integration(config)

      await expect(integration.read("SELECT 1")).rejects.toThrow(BLOCKED)
    })

    it("does not follow a routing redirect to a blocked host", async () => {
      await expect(
        connectToSafeHost({ host: "169.254.169.254", port: 1433 })
      ).rejects.toThrow(BLOCKED)
    })
  })

  describe("Oracle", () => {
    const config = {
      host: "127.0.0.1",
      port: 1521,
      database: "FREEPDB1",
      user: "system",
      password: "password",
    }

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it.each([
      "169.254.169.254",
      "127.0.0.1",
      "localhost",
      "::ffff:169.254.169.254",
      "203.0.113.10,127.0.0.1",
      "tcps://127.0.0.1",
      "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=127.0.0.1)(PORT=1521)))",
    ])("does not connect to %s", async host => {
      const integration = new oracle.integration({ ...config, host })

      const response = await integration.testConnection()

      expect(response.connected).toBe(false)
      expect(response.error).toContain(BLOCKED)
    })

    it("does not run queries against a blocked host", async () => {
      const integration = new oracle.integration(config)

      await expect(integration.read("SELECT 1 FROM DUAL")).rejects.toThrow(
        BLOCKED
      )
    })

    it.each([
      { field: "port", value: "1521,127.0.0.1:1521" },
      { field: "database", value: "FREEPDB1?https_proxy=127.0.0.1" },
      { field: "database", value: "FREEPDB1)(HOST=127.0.0.1" },
    ])("does not connect with $field $value", async ({ field, value }) => {
      const getConnection = jest.spyOn(oracledb, "getConnection")
      const integration = new oracle.integration({
        ...config,
        host: "203.0.113.10",
        [field]: value,
      })

      const response = await integration.testConnection()

      expect(response.connected).toBe(false)
      expect(getConnection).not.toHaveBeenCalled()
    })
  })
})
