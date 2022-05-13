import { Object } from "aws-sdk/clients/customerprofiles"
import {
  Integration,
  DatasourceFieldTypes,
  QueryTypes,
} from "../definitions/datasource"
import { IntegrationBase } from "./base/IntegrationBase"

module MongoDBModule {
  const { MongoClient, ObjectID } = require("mongodb")

  interface MongoDBConfig {
    connectionString: string
    db: string
  }

  interface UpdateDoc {
    filter: object
    update: object
    options: Object
  }

  const SCHEMA: Integration = {
    docs: "https://github.com/mongodb/node-mongodb-native",
    friendlyName: "MongoDB",
    description:
      "MongoDB is a general purpose, document-based, distributed database built for modern application developers and for the cloud era.",
    datasource: {
      connectionString: {
        type: DatasourceFieldTypes.STRING,
        required: true,
        default: "mongodb://localhost:27017",
      },
      db: {
        type: DatasourceFieldTypes.STRING,
        required: true,
      },
    },
    query: {
      create: {
        type: QueryTypes.JSON,
      },
      read: {
        type: QueryTypes.JSON,
      },
      update: {
        type: QueryTypes.JSON,
      },
      delete: {
        type: QueryTypes.JSON,
      },
    },
    extra: {
      collection: {
        displayName: "Collection",
        type: DatasourceFieldTypes.STRING,
        required: true,
      },
      actionTypes: {
        displayName: "Action Types",
        type: DatasourceFieldTypes.LIST,
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
          if (field === "_id" && typeof json[field] === "string") {
            const id = json["_id"].match(
              /(?<=objectid\(['"]).*(?=['"]\))/gi
            )?.[0]
            if (id) {
              json["_id"] = new ObjectID.createFromHexString(id)
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

    async create(query: { json: object; extra: { [key: string]: string } }) {
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

    async read(query: { json: object; extra: { [key: string]: string } }) {
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
            let findAndUpdateJson = json as UpdateDoc
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

    async update(query: { json: UpdateDoc; extra: { [key: string]: string } }) {
      try {
        await this.connect()
        const db = this.client.db(this.config.db)
        const collection = db.collection(query.extra.collection)
        let json = this.createObjectIds(query.json) as UpdateDoc

        switch (query.extra.actionTypes) {
          case "updateOne": {
            return await collection.updateOne(
              json.filter,
              json.update,
              json.options
            )
          }
          case "updateMany": {
            return await collection.updateMany(
              json.filter,
              json.update,
              json.options
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

    async delete(query: { json: object; extra: { [key: string]: string } }) {
      try {
        await this.connect()
        const db = this.client.db(this.config.db)
        const collection = db.collection(query.extra.collection)
        let json = this.createObjectIds(query.json)

        switch (query.extra.actionTypes) {
          case "deleteOne": {
            return await collection.deleteOne(json)
          }
          case "deleteMany": {
            return await collection.deleteMany(json)
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

  module.exports = {
    schema: SCHEMA,
    integration: MongoIntegration,
  }
}
