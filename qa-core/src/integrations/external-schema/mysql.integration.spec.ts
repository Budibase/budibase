import { GenericContainer } from "testcontainers"
import mysql from "../../../../packages/server/src/integrations/mysql"

jest.unmock("mysql2/promise")

describe("datasource validators", () => {
  describe("mysql", () => {
    let config: any

    beforeAll(async () => {
      const container = await new GenericContainer("mysql")
        .withExposedPorts(3306)
        .withEnv("MYSQL_ROOT_PASSWORD", "admin")
        .withEnv("MYSQL_DATABASE", "db")
        .withEnv("MYSQL_USER", "user")
        .withEnv("MYSQL_PASSWORD", "password")
        .start()

      const host = container.getContainerIpAddress()
      const port = container.getMappedPort(3306)
      config = {
        host,
        port,
        user: "user",
        database: "db",
        password: "password",
        rejectUnauthorized: true,
      }
    })

    it("can export an empty database", async () => {
      const integration = new mysql.integration(config)
      const result = await integration.getExternalSchema()
      expect(result).toMatchInlineSnapshot(
        `"CREATE DATABASE \`db\` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */"`
      )
    })

    it("can export a database with tables", async () => {
      const integration = new mysql.integration(config)

      await integration.internalQuery({
        sql: `
        CREATE TABLE users (
            id INT AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL,
            role VARCHAR(15) NOT NULL,
            PRIMARY KEY (id)
        );


      CREATE TABLE products (
        id INT AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        price DECIMAL,
        PRIMARY KEY (id)
      );
        `,
      })

      const result = await integration.getExternalSchema()
      expect(result).toMatchInlineSnapshot(`
        "CREATE DATABASE \`db\` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */
        CREATE TABLE \`products\` (
          \`id\` int NOT NULL AUTO_INCREMENT,
          \`name\` varchar(100) NOT NULL,
          \`price\` decimal(10,0) DEFAULT NULL,
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
        CREATE TABLE \`users\` (
          \`id\` int NOT NULL AUTO_INCREMENT,
          \`name\` varchar(100) NOT NULL,
          \`role\` varchar(15) NOT NULL,
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci"
      `)
    })

    it("does not export a data", async () => {
      const integration = new mysql.integration(config)

      await integration.internalQuery({
        sql: `INSERT INTO users (name, role) VALUES ('John Doe', 'Administrator');`,
      })

      await integration.internalQuery({
        sql: `INSERT INTO products (name, price) VALUES ('Book', 7.68);`,
      })

      const result = await integration.getExternalSchema()
      expect(result).toMatchInlineSnapshot(`
        "CREATE DATABASE \`db\` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */
        CREATE TABLE \`products\` (
          \`id\` int NOT NULL AUTO_INCREMENT,
          \`name\` varchar(100) NOT NULL,
          \`price\` decimal(10,0) DEFAULT NULL,
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
        CREATE TABLE \`users\` (
          \`id\` int NOT NULL AUTO_INCREMENT,
          \`name\` varchar(100) NOT NULL,
          \`role\` varchar(15) NOT NULL,
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci"
      `)
    })
  })
})
