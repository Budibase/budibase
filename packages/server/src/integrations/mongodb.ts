import {
  Integration,
  DatasourceFieldType,
  QueryType,
  IntegrationBase,
  DatasourceFeature,
  ConnectionInfo,
} from "@budibase/types"
import {
  MongoClient,
  ObjectId,
  Filter,
  UpdateFilter,
  FindOneAndUpdateOptions,
  UpdateOptions,
  OperationOptions,
  MongoClientOptions,
} from "mongodb"
import environment from "../environment"

interface MongoDBConfig {
  connectionString: string
  db: string
  tlsCertificateFile: string
  tlsCertificateKeyFile: string
  tlsCAFile: string
}

interface MongoDBQuery {
  json: object | string
  extra: {
    [key: string]: string
  }
}

const getSchema = () => {
  let schema = {
    docs: "https://github.com/mongodb/node-mongodb-native",
    friendlyName: "MongoDB",
    type: "Non-relational",
    description:
      "MongoDB is a general purpose, document-based, distributed database built for modern application developers and for the cloud era.",
    features: {
      [DatasourceFeature.CONNECTION_CHECKING]: true,
    },
    datasource: {
      connectionString: {
        type: DatasourceFieldType.STRING,
        required: true,
        default: "mongodb://localhost:27017",
        display: "Connection string",
      },
      db: {
        type: DatasourceFieldType.STRING,
        required: true,
        display: "DB",
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
      aggregate: {
        type: QueryType.JSON,
        readable: true,
        steps: [
          {
            key: "$addFields",
            template: "{\n\t\n}",
          },
          {
            key: "$bucket",
            template: `{
    "groupBy": "",
    "boundaries": [],
    "default": "",
    "output": {}
  }`,
          },
          {
            key: "$bucketAuto",
            template: `{
    "groupBy": "",
    "buckets": 1,
    "output": {},
    "granularity": "R5"
  }`,
          },
          {
            key: "$changeStream",
            template: `{
    "allChangesForCluster": true,
    "fullDocument": "",
    "fullDocumentBeforeChange": "",
    "resumeAfter": 1,
    "showExpandedEvents": true,
    "startAfter": {},
    "startAtOperationTime": ""
  }`,
          },
          {
            key: "$collStats",
            template: `{
    "latencyStats": { "histograms": true } },
    "storageStats": { "scale": 1 } },
    "count": {},
    "queryExecStats": {}
  }`,
          },
          {
            key: "$count",
            template: ``,
          },
          {
            key: "$densify",
            template: `{
    "field": "",
    "partitionByFields": [],
    "range": {
      "step": 1,
      "unit": 1,
      "bounds": "full"
    }
  }`,
          },
          {
            key: "$documents",
            template: `[]`,
          },
          {
            key: "$facet",
            template: `{\n\t\n}`,
          },
          {
            key: "$fill",
            template: `{
    "partitionBy": "",
    "partitionByFields": [],
    "sortBy": {},
    "output": {}
  }`,
          },
          {
            key: "$geoNear",
            template: `{
    "near": { 
      "type": "Point", 
      "coordinates": [ 
        -73.98142, 40.71782
      ] 
    },
    "key": "location",
    "distanceField": "dist.calculated",
    "query": { "category": "Parks" }
  }`,
          },
          {
            key: "$graphLookup",
            template: `{
    "from": "",
    "startWith": "",
    "connectFromField": "",
    "connectToField": "",
    "as": "",
    "maxDepth": 1,
    "depthField": "",
    "restrictSearchWithMatch": {}
  }`,
          },
          {
            key: "$group",
            template: `{
    "_id": ""
  }`,
          },
          {
            key: "$indexStats",
            template: "{\n\t\n}",
          },
          {
            key: "$limit",
            template: `1`,
          },
          {
            key: "$listLocalSessions",
            template: `{\n\t\n}`,
          },
          {
            key: "$listSessions",
            template: `{\n\t\n}`,
          },
          {
            key: "$lookup",
            template: `{
    "from": "",
    "localField": "",
    "foreignField": "",
    "as": ""
  }`,
          },
          {
            key: "$match",
            template: "{\n\t\n}",
          },
          {
            key: "$merge",
            template: `{
    "into": {},
    "on": "_id",
    "whenMatched": "replace",
    "whenNotMatched": "insert"
  }`,
          },
          {
            key: "$out",
            template: `{
    "db": "",
    "coll": ""
  }`,
          },
          {
            key: "$planCacheStats",
            template: "{\n\t\n}",
          },
          {
            key: "$project",
            template: "{\n\t\n}",
          },
          {
            key: "$redact",
            template: "",
          },
          {
            key: "$replaceRoot",
            template: `{ "newRoot": "" }`,
          },
          {
            key: "$replaceWith",
            template: ``,
          },
          {
            key: "$sample",
            template: `{ "size": 3 }`,
          },
          {
            key: "$set",
            template: "{\n\t\n}",
          },
          {
            key: "$setWindowFields",
            template: `{
    "partitionBy": "",
    "sortBy": {},
    "output": {}
  }`,
          },
          {
            key: "$skip",
            template: `1`,
          },
          {
            key: "$sort",
            template: "{\n\t\n}",
          },
          {
            key: "$sortByCount",
            template: "",
          },
          {
            key: "$unionWith",
            template: `{
    "coll": "",
    "pipeline": []
  }`,
          },
          {
            key: "$unset",
            template: "",
          },
          {
            key: "$unwind",
            template: `{
    "path": "",
    "includeArrayIndex": "",
    "preserveNullAndEmptyArrays": true
  }`,
          },
        ],
      },
    },
    extra: {
      collection: {
        displayName: "Collection",
        type: DatasourceFieldType.STRING,
        required: true,
      },
      actionType: {
        displayName: "Query Type",
        type: DatasourceFieldType.LIST,
        required: true,
        data: {
          read: ["find", "findOne", "findOneAndUpdate", "count", "distinct"],
          create: ["insertOne", "insertMany"],
          update: ["updateOne", "updateMany"],
          delete: ["deleteOne", "deleteMany"],
          aggregate: ["json", "pipeline"],
        },
      },
    },
  }
  if (environment.SELF_HOSTED) {
    schema.datasource = {
      ...schema.datasource,
      //@ts-ignore
      tls: {
        type: DatasourceFieldType.FIELD_GROUP,
        display: "Configure SSL",
        fields: {
          tlsCertificateFile: {
            type: DatasourceFieldType.STRING,
            required: false,
            display: "Certificate file path",
          },
          tlsCertificateKeyFile: {
            type: DatasourceFieldType.STRING,
            required: false,
            display: "Certificate Key file path",
          },
          tlsCAFile: {
            type: DatasourceFieldType.STRING,
            required: false,
            display: "CA file path",
          },
        },
      },
    }
  }
  return schema
}

const SCHEMA: Integration = getSchema()

class MongoIntegration implements IntegrationBase {
  private config: MongoDBConfig
  private client: MongoClient

  constructor(config: MongoDBConfig) {
    this.config = config
    const options: MongoClientOptions = {
      tlsCertificateFile: config.tlsCertificateFile || undefined,
      tlsCertificateKeyFile: config.tlsCertificateKeyFile || undefined,
      tlsCAFile: config.tlsCAFile || undefined,
    }
    this.client = new MongoClient(config.connectionString, options)
  }

  async testConnection() {
    const response: ConnectionInfo = {
      connected: false,
    }
    try {
      await this.connect()
      response.connected = true
    } catch (e: any) {
      response.error = e.message as string
    } finally {
      await this.client.close()
    }
    return response
  }

  async connect() {
    return this.client.connect()
  }

  matchId(value?: string) {
    return value?.match(/(?<=objectid\(['"]).*(?=['"]\))/gi)?.[0]
  }

  hasObjectId(value?: any): boolean {
    return (
      typeof value === "string" && value.toLowerCase().startsWith("objectid")
    )
  }

  createObjectIds(json: any): any {
    const self = this

    function interpolateObjectIds(json: any) {
      for (let field of Object.keys(json || {})) {
        if (json[field] instanceof Object) {
          json[field] = self.createObjectIds(json[field])
        }
        if (self.hasObjectId(json[field])) {
          const id = self.matchId(json[field])
          if (id) {
            json[field] = ObjectId.createFromHexString(id)
          }
        }
      }
      return json
    }

    if (Array.isArray(json)) {
      for (let i = 0; i < json.length; i++) {
        if (self.hasObjectId(json[i])) {
          const id = self.matchId(json[i])
          if (id) {
            json[i] = ObjectId.createFromHexString(id)
          }
        } else {
          json[i] = interpolateObjectIds(json[i])
        }
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
      switch (query.extra.actionType) {
        case "insertOne": {
          return await collection.insertOne(json)
        }
        case "insertMany": {
          return await collection.insertMany(json)
        }
        default: {
          throw new Error(
            `actionType ${query.extra.actionType} does not exist on DB for create`
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

      switch (query.extra.actionType) {
        case "find": {
          if (json) {
            return await collection.find(json).toArray()
          } else {
            return await collection.find().toArray()
          }
        }
        case "findOne": {
          return await collection.findOne(json)
        }
        case "findOneAndUpdate": {
          if (typeof query.json === "string") {
            json = this.parseQueryParams(query.json, "update")
          }
          let findAndUpdateJson = this.createObjectIds(json) as {
            filter: Filter<any>
            update: UpdateFilter<any>
            options: FindOneAndUpdateOptions
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
            `actionType ${query.extra.actionType} does not exist on DB for read`
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
        filter: Filter<any>
        update: UpdateFilter<any>
        options: object
      }

      switch (query.extra.actionType) {
        case "updateOne": {
          return await collection.updateOne(
            json.filter,
            json.update,
            json.options as UpdateOptions
          )
        }
        case "updateMany": {
          return await collection.updateMany(
            json.filter,
            json.update,
            json.options as UpdateOptions
          )
        }
        default: {
          throw new Error(
            `actionType ${query.extra.actionType} does not exist on DB for update`
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
        filter: Filter<any>
        options: OperationOptions
      }
      if (!json.options) {
        json = {
          filter: json,
          options: {},
        }
      }

      switch (query.extra.actionType) {
        case "deleteOne": {
          return await collection.deleteOne(json.filter, json.options)
        }
        case "deleteMany": {
          return await collection.deleteMany(json.filter, json.options)
        }
        default: {
          throw new Error(
            `actionType ${query.extra.actionType} does not exist on DB for delete`
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

  async aggregate(query: {
    json: object
    steps: any[]
    extra: { [key: string]: string }
  }) {
    try {
      await this.connect()
      const db = this.client.db(this.config.db)
      const collection = db.collection(query.extra.collection)
      let response = []
      if (query.extra?.actionType === "pipeline") {
        for await (const doc of collection.aggregate(
          query.steps.map(({ key, value }) => {
            let temp: any = {}
            temp[key] = JSON.parse(value.value)
            return this.createObjectIds(temp)
          })
        )) {
          response.push(doc)
        }
      } else {
        const stages: Array<any> = query.json as Array<any>
        for await (const doc of collection.aggregate(
          stages ? this.createObjectIds(stages) : []
        )) {
          response.push(doc)
        }
      }
      return response
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
