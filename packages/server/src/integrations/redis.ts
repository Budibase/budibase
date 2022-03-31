import { Integration, QueryTypes } from "../definitions/datasource"
import { IntegrationBase } from "./base/IntegrationBase"

module RedisModule {
  const redis = require("ioredis")

  interface RedisConfig {
    host: string
    port: number
    username: string
    password?: string
  }

  const SCHEMA: Integration = {
    docs: "https://redis.io/docs/",
    description: "",
    friendlyName: "Redis",
    datasource: {
      host: {
        type: "string",
        required: true,
        default: "localhost",
      },
      port: {
        type: "number",
        required: true,
        default: 6379,
      },
      username: {
        type: "string",
        required: false,
      },
      password: {
        type: "password",
        required: false,
      },
    },
    query: {
      read: {
        type: QueryTypes.JSON,
      },
    },
  }

  class RedisIntegration implements IntegrationBase {
    private readonly config: RedisConfig
    private client: any

    constructor(config: RedisConfig) {
      this.config = config
      this.client = {}
    }

    async read(query: { bucket: string }) {}
  }

  module.exports = {
    schema: SCHEMA,
    integration: RedisIntegration,
  }
}
