import {
  Integration,
  DatasourceFieldType,
  QueryType,
  IntegrationBase,
} from "@budibase/types"
import {
  MongoClient,
  ObjectID,
  FilterQuery,
  UpdateQuery,
  FindOneAndUpdateOption,
  UpdateOneOptions,
  UpdateManyOptions,
  CommonOptions,
} from "mongodb"

interface MongoDBConfig {
  connectionString: string
  db: string
}

interface MongoDBQuery {
  json: object | string
  extra: {
    [key: string]: string
  }
}

const SCHEMA: Integration = {
  docs: "https://github.com/mongodb/node-mongodb-native",
  friendlyName: "MongoDB",
  type: "Non-relational",
  description:
    "MongoDB is a general purpose, document-based, distributed database built for modern application developers and for the cloud era.",
  datasource: {
    connectionString: {
      type: DatasourceFieldType.STRING,
      required: true,
      default: "mongodb://localhost:27017",
    },
    db: {
      type: DatasourceFieldType.STRING,
      required: true,
    },
  },
  query: {
    create: {
      type: QueryType.JSON,
    },
    read: {
      type: QueryType.JSON,
    },
    update: {
      type: QueryType.JSON,
    },
    delete: {
      type: QueryType.JSON,
    },
  },
  extra: {
    collection: {
      displayName: "Collection",
      type: DatasourceFieldType.STRING,
      required: true,
    },
    actionTypes: {
      displayName: "Action Types",
      type: DatasourceFieldType.LIST,
      required: true,
      data: {
        read: ["find", "findOne", "findOneAndUpdate", "count", "distinct"],
        create: ["insertOne", "insertMany"],
        update: ["updateOne", "updateMany"],
        delete: ["deleteOne", "deleteMany"],
      },
    },
  },
}

class MongoIntegration implements IntegrationBase {
  private config: MongoDBConfig
  private client: any

  constructor(config: MongoDBConfig) {
    this.config = config
    this.client = new MongoClient(config.connectionString)
  }

  async connect() {
    return this.client.connect()
  }

  createObjectIds(json: any): object {
    const self = this
    function interpolateObjectIds(json: any) {
      for (let field of Object.keys(json)) {
        if (json[field] instanceof Object) {
          json[field] = self.createObjectIds(json[field])
        }
        if (
          typeof json[field] === "string" &&
          json[field].toLowerCase().startsWith("objectid")
        ) {
          const id = json[field].match(/(?<=objectid\(['"]).*(?=['"]\))/gi)?.[0]
          if (id) {
            json[field] = ObjectID.createFromHexString(id)
          }
        }
      }
      return json
    }

    if (Array.isArray(json)) {
      for (let i = 0; i < json.length; i++) {
        json[i] = interpolateObjectIds(json[i])
      }
      return json
    }
    return interpolateObjectIds(json)
  }

  parseQueryParams(params: string, mode: string) {
    let queryParams = []
    let openCount = 0
    let inQuotes = false
    let i = 0
    let startIndex = 0
    for (let c of params) {
      if (c === '"' && i > 0 && params[i - 1] !== "\\") {
        inQuotes = !inQuotes
      }
      if (c === "{" && !inQuotes) {
        openCount++
        if (openCount === 1) {
          startIndex = i
        }
      } else if (c === "}" && !inQuotes) {
        if (openCount === 1) {
          queryParams.push(JSON.parse(params.substring(startIndex, i + 1)))
        }
        openCount--
      }
      i++
    }
    let group1 = queryParams[0] ?? {}
    let group2 = queryParams[1] ?? {}
    let group3 = queryParams[2] ?? {}
    if (mode === "update") {
      return {
        filter: group1,
        update: group2,
        options: group3,
      }
    }
    return {
      filter: group1,
      options: group2,
    }
  }

  async create(query: MongoDBQuery) {
    try {
      await this.connect()
      const db = this.client.db(this.config.db)
      const collection = db.collection(query.extra.collection)
      let json = this.createObjectIds(query.json)

      // For mongodb we add an extra actionType to specify
      // which method we want to call on the collection
      switch (query.extra.actionTypes) {
        case "insertOne": {
          return await collection.insertOne(json)
        }
        case "insertMany": {
          return await collection.insertMany(json)
        }
        default: {
          throw new Error(
            `actionType ${query.extra.actionTypes} does not exist on DB for create`
          )
        }
      }
    } catch (err) {
      console.error("Error writing to mongodb", err)
      throw err
    } finally {
      await this.client.close()
    }
  }

  async read(query: MongoDBQuery) {
    try {
      await this.connect()
      const db = this.client.db(this.config.db)
      const collection = db.collection(query.extra.collection)
      let json = this.createObjectIds(query.json)

      switch (query.extra.actionTypes) {
        case "find": {
          return await collection.find(json).toArray()
        }
        case "findOne": {
          return await collection.findOne(json)
        }
        case "findOneAndUpdate": {
          if (typeof query.json === "string") {
            json = this.parseQueryParams(query.json, "update")
          }
          let findAndUpdateJson = this.createObjectIds(json) as {
            filter: FilterQuery<any>
            update: UpdateQuery<any>
            options: FindOneAndUpdateOption<any>
          }
          return await collection.findOneAndUpdate(
            findAndUpdateJson.filter,
            findAndUpdateJson.update,
            findAndUpdateJson.options
          )
        }
        case "count": {
          return await collection.countDocuments(json)
        }
        case "distinct": {
          return await collection.distinct(json)
        }
        default: {
          throw new Error(
            `actionType ${query.extra.actionTypes} does not exist on DB for read`
          )
        }
      }
    } catch (err) {
      console.error("Error querying mongodb", err)
      throw err
    } finally {
      await this.client.close()
    }
  }

  async update(query: MongoDBQuery) {
    try {
      await this.connect()
      const db = this.client.db(this.config.db)
      const collection = db.collection(query.extra.collection)
      let queryJson = query.json
      if (typeof queryJson === "string") {
        queryJson = this.parseQueryParams(queryJson, "update")
      }
      let json = this.createObjectIds(queryJson) as {
        filter: FilterQuery<any>
        update: UpdateQuery<any>
        options: object
      }

      switch (query.extra.actionTypes) {
        case "updateOne": {
          return await collection.updateOne(
            json.filter,
            json.update,
            json.options as UpdateOneOptions
          )
        }
        case "updateMany": {
          return await collection.updateMany(
            json.filter,
            json.update,
            json.options as UpdateManyOptions
          )
        }
        default: {
          throw new Error(
            `actionType ${query.extra.actionTypes} does not exist on DB for update`
          )
        }
      }
    } catch (err) {
      console.error("Error writing to mongodb", err)
      throw err
    } finally {
      await this.client.close()
    }
  }

  async delete(query: MongoDBQuery) {
    try {
      await this.connect()
      const db = this.client.db(this.config.db)
      const collection = db.collection(query.extra.collection)
      let queryJson = query.json
      if (typeof queryJson === "string") {
        queryJson = this.parseQueryParams(queryJson, "delete")
      }
      let json = this.createObjectIds(queryJson) as {
        filter: FilterQuery<any>
        options: CommonOptions
      }
      if (!json.options) {
        json = {
          filter: json,
          options: {},
        }
      }

      switch (query.extra.actionTypes) {
        case "deleteOne": {
          return await collection.deleteOne(json.filter, json.options)
        }
        case "deleteMany": {
          return await collection.deleteMany(json.filter, json.options)
        }
        default: {
          throw new Error(
            `actionType ${query.extra.actionTypes} does not exist on DB for delete`
          )
        }
      }
    } catch (err) {
      console.error("Error writing to mongodb", err)
      throw err
    } finally {
      await this.client.close()
    }
  }
}

export default {
  schema: SCHEMA,
  integration: MongoIntegration,
}
