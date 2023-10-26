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
  Decimal128,
  Long,
  FindOneAndUpdateOptions,
  UpdateOptions,
  MongoClientOptions,
  WithId,
  Document,
} from "mongodb"
import environment from "../environment"
import sdk from "../sdk"
import cloneDeep from "lodash/fp/cloneDeep"

interface MongoDBConfig {
  connectionString: string
  db: string
  tlsCertificateFile: string
  tlsCertificateKeyFile: string
  tlsCAFile: string
}

interface MongoDBQuery {
  parameters?: {
    [key: string]: ExtendedTypeParam
  }
  json: object | string
  extra: {
    [key: string]: string
  }
}

interface ExtendedTypeParam {
  name: string
  default: any
  extendedType: string
}

interface MongoDBQueryParams {
  filter: object
  update?: object
  options?: object
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
  replaceTempIds(
    enriched: { [key: string]: any },
    extended: {
      tempId: string
      value: any
    }
  ) {
    for (let field of Object.keys(enriched || {})) {
      if (
        enriched[field] ===
        extended.tempId.substring(1, extended.tempId.length - 1)
      ) {
        enriched[field] = extended.value
      } else if (
        enriched[field] instanceof Object &&
        !(enriched[field] instanceof ObjectId)
      ) {
        this.replaceTempIds(enriched[field], extended)
      }
    }
  }
  createObjectIds(enriched: { [key: string]: any }) {
    Object.keys(enriched || {}).forEach(field => {
      if (typeof enriched[field] === "string") {
        const objectId = this.matchId(enriched[field])
        if (objectId) {
          enriched[field] = ObjectId.createFromHexString(objectId)
        }
      } else if (
        enriched[field] instanceof Object &&
        !(enriched[field] instanceof ObjectId)
      ) {
        this.createObjectIds(enriched[field])
      }
    })
    return enriched
  }
  createObjectIdsFromBindings(
    json: string,
    extendedParams?: { [key: string]: any }
  ): object {
    let tempId = this.matchId(json)
    let regex = new RegExp(`(objectid\\(['"])${tempId}(['"]\\))`, "gi")
    let objectIds = []
    while (tempId) {
      json = json.replace(regex, tempId.substring(1, tempId.length - 1))
      objectIds.push(tempId)
      tempId = this.matchId(json)
    }
    let jsonObj = JSON.parse(json)
    for (let extended of Object.values(extendedParams || {})) {
      if (objectIds.includes(extended.tempId)) {
        this.replaceTempIds(jsonObj, {
          tempId: extended.tempId,
          value: ObjectId.createFromHexString(extended.value),
        })
      }
    }
    return jsonObj
  }

  getJsonString(value: object | string): string {
    if (typeof value === "string") {
      return value
    }
    return JSON.stringify(value)
  }

  async enrichQuery(
    json: string,
    parameters:
      | {
          [key: string]: ExtendedTypeParam
        }
      | undefined
  ): Promise<object | object[]> {
    let extendedParams: {
      [key: string]: any
    } = cloneDeep(parameters || {})
    for (let [key, value] of Object.entries(parameters || {})) {
      const tempId =
        Date.now().toString(36) + Math.random().toString(36).substring(2)
      if (value.extendedType === "Decimal128") {
        extendedParams[key] = {
          tempId: `"${tempId}"`,
          value: Decimal128.fromString(value.default),
        }
      } else if (value.extendedType === "Long") {
        extendedParams[key] = {
          tempId: `"${tempId}"`,
          value: Long.fromString(value.default),
        }
      } else if (value.extendedType === "ObjectId") {
        extendedParams[key] = {
          tempId: `"${tempId}"`,
          value: value.default
            ? ObjectId.createFromHexString(value.default)
            : new ObjectId(),
        }
      } else if (value.extendedType === "Date") {
        extendedParams[key] = {
          tempId: `"${tempId}"`,
          value: value.default ? new Date(value.default) : null,
        }
      } else {
        extendedParams[key] = {
          tempId: `"${tempId}"`,
          value: value.default,
        }
      }
    }
    let placeholderParams: any = cloneDeep(parameters)
    for (let key of Object.keys(placeholderParams || {})) {
      placeholderParams[key] = extendedParams[key].tempId
    }
    let enriched = await sdk.queries.enrichContext({ json }, placeholderParams)
    if (typeof enriched.json === "string") {
      // create objectids from string for backwards compatibility
      enriched.json = this.createObjectIdsFromBindings(
        enriched.json,
        extendedParams || {}
      )
    }
    for (let extended of Object.values(extendedParams || {})) {
      this.replaceTempIds(enriched.json, extended)
    }
    if (typeof enriched?.json !== "object") {
      throw "Invalid JSON"
    }
    return this.createObjectIds(enriched.json)
  }

  convertResponseType(doc: WithId<Document> | null): object | null {
    if (!doc) {
      return doc
    }
    for (let [key, value] of Object.entries(doc)) {
      switch (value?._bsontype) {
        case "Timestamp":
          doc[key] = value.toJSON()["$timestamp"]
          break
        case "Decimal128":
          doc[key] = value.toString()
          break
        case "Long":
          doc[key] = value.toString()
          break
      }
    }
    return doc
  }
  convertResponseTypes(response: WithId<Document>[]): object {
    for (let doc of response) {
      this.convertResponseType(doc)
    }
    return response
  }

  async parseQueryParams(
    json: string,
    mode: string,
    parameters:
      | {
          [key: string]: ExtendedTypeParam
        }
      | undefined
  ): Promise<MongoDBQueryParams> {
    let queryParams = []
    let openCount = 0
    let inQuotes = false
    let i = 0
    let startIndex = 0
    for (let c of json) {
      if (c === '"' && i > 0 && json[i - 1] !== "\\") {
        inQuotes = !inQuotes
      }
      if (c === "{" && !inQuotes) {
        openCount++
        if (openCount === 1) {
          startIndex = i
        }
      } else if (c === "}" && !inQuotes) {
        if (openCount === 1) {
          queryParams.push(json.substring(startIndex, i + 1))
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
        filter: await this.enrichQuery(group1, parameters),
        update: await this.enrichQuery(group2, parameters),
        options: await this.enrichQuery(group3, parameters),
      }
    }
    return {
      filter: await this.enrichQuery(group1, parameters),
      options: await this.enrichQuery(group2, parameters),
    }
  }

  async create(query: MongoDBQuery) {
    try {
      await this.connect()
      const db = this.client.db(this.config.db)
      const collection = db.collection(query.extra.collection)
      let json = await this.enrichQuery(
        this.getJsonString(query.json),
        query.parameters
      )

      // For mongodb we add an extra actionType to specify
      // which method we want to call on the collection
      switch (query.extra.actionType) {
        case "insertOne": {
          return await collection.insertOne(json)
        }
        case "insertMany": {
          return await collection.insertMany(json as object[])
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
      let json = {}
      if (query.extra.actionType !== "findOneAndUpdate") {
        json = await this.enrichQuery(
          this.getJsonString(query.json),
          query.parameters
        )
      }

      switch (query.extra.actionType) {
        case "find": {
          if (json) {
            return this.convertResponseTypes(
              await collection.find(json).toArray()
            )
          } else {
            return this.convertResponseTypes(await collection.find().toArray())
          }
        }
        case "findOne": {
          return this.convertResponseType(await collection.findOne(json))
        }
        case "findOneAndUpdate": {
          let json = await this.parseQueryParams(
            this.getJsonString(query.json),
            "update",
            query.parameters
          )
          return this.convertResponseType(
            (
              await collection.findOneAndUpdate(
                json.filter,
                json.update || {},
                json.options as FindOneAndUpdateOptions
              )
            )?.value
          )
        }
        case "count": {
          return await collection.countDocuments(json)
        }
        case "distinct": {
          return await collection.distinct(json?.toString())
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
      let json = await this.parseQueryParams(
        this.getJsonString(query.json),
        "update",
        query.parameters
      )
      switch (query.extra.actionType) {
        case "updateOne": {
          return await collection.updateOne(
            json.filter,
            json.update || {},
            json.options as UpdateOptions
          )
        }
        case "updateMany": {
          return await collection.updateMany(
            json.filter,
            json.update || {},
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
      let json = await this.parseQueryParams(
        this.getJsonString(query.json),
        "delete",
        query.parameters
      )
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
    json: string | object
    steps: any[]
    extra: { [key: string]: string }
    parameters?: {
      [key: string]: ExtendedTypeParam
    }
  }) {
    try {
      await this.connect()
      const db = this.client.db(this.config.db)
      const collection = db.collection(query.extra.collection)
      let response = []
      if (query.extra?.actionType === "pipeline") {
        let steps = []
        for (let step of query.steps) {
          steps.push({
            [step.key]: await this.enrichQuery(
              step.value.value,
              query.parameters
            ),
          })
        }
        for await (const doc of collection.aggregate(steps)) {
          response.push(doc)
        }
      } else {
        const stages = (await this.enrichQuery(
          this.getJsonString(query.json),
          query.parameters
        )) as object[]
        for await (const doc of collection.aggregate(stages ?? [])) {
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
