import { GenericContainer, Wait } from "testcontainers"
import { Duration, TemporalUnit } from "node-duration"
import mssql from "../../../../packages/server/src/integrations/microsoftSqlServer"

jest.unmock("mssql")

describe("getExternalSchema", () => {
  describe("mssql", () => {
    let config: any

    beforeAll(async () => {
      const password = "Str0Ng_p@ssW0rd!"
      const container = await new GenericContainer(
        "mcr.microsoft.com/mssql/server"
      )
        .withExposedPorts(1433)
        .withEnv("ACCEPT_EULA", "Y")
        .withEnv("MSSQL_SA_PASSWORD", password)
        .withEnv("MSSQL_PID", "Developer")
        .withWaitStrategy(Wait.forHealthCheck())
        .withHealthCheck({
          test: `/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "${password}" -Q "SELECT 1" -b -o /dev/null`,
          interval: new Duration(1000, TemporalUnit.MILLISECONDS),
          timeout: new Duration(3, TemporalUnit.SECONDS),
          retries: 20,
          startPeriod: new Duration(100, TemporalUnit.MILLISECONDS),
        })
        .start()

      const host = container.getContainerIpAddress()
      const port = container.getMappedPort(1433)
      config = {
        user: "sa",
        password,
        server: host,
        port: port,
        database: "master",
        schema: "dbo",
      }
    })

    it("can export an empty database", async () => {
      const integration = new mssql.integration(config)
      const result = await integration.getExternalSchema()
      expect(result).toMatchInlineSnapshot(`""`)
    })

    it("can export a database with tables", async () => {
      const integration = new mssql.integration(config)

      await integration.connect()
      await integration.internalQuery({
        sql: `
      CREATE TABLE users (
          id INT IDENTITY(1,1) PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          role VARCHAR(15) NOT NULL
      );
      
      CREATE TABLE products (
          id INT IDENTITY(1,1) PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          price DECIMAL(10, 2) NOT NULL
      );
      `,
      })

      const result = await integration.getExternalSchema()
      expect(result).toMatchInlineSnapshot(`
        "CREATE TABLE [products] (
        id int(4) NOT NULL,
        name varchar(100) NOT NULL,
        price decimal(9) NOT NULL,
         CONSTRAINT [PK_products] PRIMARY KEY (id)
        );
        CREATE TABLE [users] (
        id int(4) NOT NULL,
        name varchar(100) NOT NULL,
        role varchar(15) NOT NULL,
         CONSTRAINT [PK_users] PRIMARY KEY (id)
        );"
      `)
    })

    it("does not export a data", async () => {
      const integration = new mssql.integration(config)

      await integration.connect()
      await integration.internalQuery({
        sql: `INSERT INTO [users] ([name], [role]) VALUES ('John Doe', 'Administrator');
        INSERT INTO [products] ([name], [price]) VALUES ('Book', 7.68);
        `,
      })

      const result = await integration.getExternalSchema()
      expect(result).toMatchInlineSnapshot(`
        "CREATE TABLE [products] (
        id int(4) NOT NULL,
        name varchar(100) NOT NULL,
        price decimal(9) NOT NULL,
         CONSTRAINT [PK_products] PRIMARY KEY (id)
        );
        CREATE TABLE [users] (
        id int(4) NOT NULL,
        name varchar(100) NOT NULL,
        role varchar(15) NOT NULL,
         CONSTRAINT [PK_users] PRIMARY KEY (id)
        );"
      `)
    })
  })
})
