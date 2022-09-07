import { DatasourceFieldType, Integration, QueryType } from "@budibase/types"
import Redis from "ioredis"

module RedisModule {
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
    type: "Non-relational",
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
      create: {
        type: QueryType.FIELDS,
        fields: {
          key: {
            type: DatasourceFieldType.STRING,
            required: true,
          },
          value: {
            type: DatasourceFieldType.STRING,
            required: true,
          },
          ttl: {
            type: DatasourceFieldType.NUMBER,
          },
        },
      },
      read: {
        readable: true,
        type: QueryType.FIELDS,
        fields: {
          key: {
            type: DatasourceFieldType.STRING,
            required: true,
          },
        },
      },
      delete: {
        type: QueryType.FIELDS,
        fields: {
          key: {
            type: DatasourceFieldType.STRING,
            required: true,
          },
        },
      },
      command: {
        readable: true,
        displayName: "Redis Command",
        type: QueryType.JSON,
      },
    },
  }

  class RedisIntegration {
    private readonly config: RedisConfig
    private client: any

    constructor(config: RedisConfig) {
      this.config = config
      this.client = new Redis({
        host: this.config.host,
        port: this.config.port,
        username: this.config.username,
        password: this.config.password,
      })
    }

    async disconnect() {
      this.client.disconnect()
    }

    async redisContext(query: Function) {
      try {
        return await query()
      } catch (err) {
        throw new Error(`Redis error: ${err}`)
      } finally {
        this.disconnect()
      }
    }

    async create(query: { key: string; value: string; ttl: number }) {
      return this.redisContext(async () => {
        const response = await this.client.set(query.key, query.value)
        if (query.ttl) {
          await this.client.expire(query.key, query.ttl)
        }
        return response
      })
    }

    async read(query: { key: string }) {
      return this.redisContext(async () => {
        const response = await this.client.get(query.key)
        return response
      })
    }

    async delete(query: { key: string }) {
      return this.redisContext(async () => {
        const response = await this.client.del(query.key)
        return response
      })
    }

    async command(query: { json: string }) {
      return this.redisContext(async () => {
        // commands split line by line
        const commands = query.json.trim().split("\n")
        let pipelineCommands = []

        // process each command separately
        for (let command of commands) {
          const tokenised = command.trim().split(" ")
          // Pipeline only accepts lower case commands
          tokenised[0] = tokenised[0].toLowerCase()
          pipelineCommands.push(tokenised)
        }

        const pipeline = this.client.pipeline(pipelineCommands)
        const result = await pipeline.exec()

        return result.map((output: string | string[]) => output[1])
      })
    }
  }

  module.exports = {
    schema: SCHEMA,
    integration: RedisIntegration,
  }
}
