import {
  Integration,
  DatasourceFieldType,
  QueryType,
  IntegrationBase,
} from "@budibase/types"

const { ClickHouse } = require('clickhouse');

interface ClickHouseConfig {
  url: string
  username: string
  password: string
  databaseName: string
}

const SCHEMA: Integration = {
  docs: "https://github.com/ClickHouse/ClickHouse",
  friendlyName: "ClickHouse",
  type: "Relational",
  description:
    "ClickHouse® is an open-source column-oriented database management system that allows generating analytical data reports in real-time.",
  datasource: {
    url: {
      type: DatasourceFieldType.STRING,
      default: "http://localhost:8123",
      required: true,
    },
    username: {
      type: DatasourceFieldType.STRING,
      default: "default",
      required: true,
    },
    password: {
      type: DatasourceFieldType.PASSWORD,
      default: "",
      required: false,
    },
    databaseName: {
      type: DatasourceFieldType.STRING,
      default: "default",
      required: true,
    },
  },
  query: {
    read: {
      type: QueryType.SQL,
    }
  },
}

class ClickHouseIntegration implements IntegrationBase {
  private config: ClickHouseConfig
  private client: any

  constructor(config: ClickHouseConfig) {
    const newConfig = {
      url: config.url,
      config: {
        database: config.databaseName,
      },
      basicAuth: {
        username: config.username,
        password: config.password,
      },
    }

    this.config = config
    this.client = new ClickHouse(newConfig)
  }

  async read(query: { sql: any }) {
    try {
      return await this.client.query(query.sql).toPromise();
    } catch (err) {
      // @ts-ignore
      console.error("Error querying ClickHouse", err.message)
      throw err
    }
  }


}

export default {
  schema: SCHEMA,
  integration: ClickHouseIntegration,
}