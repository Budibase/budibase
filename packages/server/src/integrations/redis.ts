import {
  ConnectionInfo,
  DatasourceFeature,
  DatasourceFieldType,
  Integration,
  QueryType,
} from "@budibase/types"
import Redis, { RedisOptions } from "ioredis"
import { HOST_ADDRESS } from "./utils"

const SCHEMA: Integration = {
  docs: "https://redis.io/docs/",
  description:
    "Redis is a caching tool, providing powerful key-value store capabilities.",
  friendlyName: "Redis",
  type: "Non-relational",
  features: {
    [DatasourceFeature.CONNECTION_CHECKING]: true,
  },
  datasource: {
    host: {
      type: DatasourceFieldType.STRING,
      required: true,
      default: HOST_ADDRESS,
    },
    port: {
      type: DatasourceFieldType.NUMBER,
      required: true,
      default: 6379,
    },
    username: {
      type: DatasourceFieldType.STRING,
      required: false,
    },
    password: {
      type: DatasourceFieldType.PASSWORD,
      required: false,
    },
    db: {
      type: DatasourceFieldType.NUMBER,
      required: false,
      display: "DB",
      default: 0,
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

export class RedisIntegration {
  private readonly config: RedisOptions
  private client

  constructor(config: RedisOptions) {
    this.config = config
    this.client = new Redis(this.config)
  }

  async testConnection() {
    const response: ConnectionInfo = {
      connected: false,
    }
    try {
      await this.client.ping()
      response.connected = true
    } catch (e: any) {
      response.error = e.message as string
    } finally {
      await this.disconnect()
    }
    return response
  }

  async disconnect() {
    return this.client.quit()
  }

  async redisContext(query: Function) {
    try {
      return await query()
    } catch (err) {
      throw new Error(`Redis error: ${err}`)
    } finally {
      await this.disconnect()
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
      return await this.client.get(query.key)
    })
  }

  async delete(query: { key: string }) {
    return this.redisContext(async () => {
      return await this.client.del(query.key)
    })
  }

  async command(query: { json: string }) {
    return this.redisContext(async () => {
      const commands = query.json.trim().split("\n")
      let pipelineCommands = []
      let tokenised

      for (let command of commands) {
        const valueToken = command.trim().match(/"(.*)"/)
        if (valueToken?.[1]) {
          tokenised = [
            ...command
              .substring(0, command.indexOf(valueToken[0]) - 1)
              .trim()
              .split(" "),
            valueToken?.[1],
          ]
        } else {
          tokenised = command.trim().split(" ")
        }
        // Pipeline only accepts lower case commands
        tokenised[0] = tokenised[0].toLowerCase()
        pipelineCommands.push(tokenised)
      }

      const pipeline = this.client.pipeline(pipelineCommands)
      const result = await pipeline.exec()

      return result?.map((output: any) => {
        if (typeof output === "string") {
          return output
        } else if (Array.isArray(output)) {
          return output[1]
        }
      })
    })
  }
}

export default {
  schema: SCHEMA,
  integration: RedisIntegration,
}
