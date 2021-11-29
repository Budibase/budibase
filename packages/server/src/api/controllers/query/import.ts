import CouchDB from "../../../db"
import { queryValidation } from "./validation"
import { generateQueryID } from "../../../db/utils"
import { Spec as Swagger2, Operation } from "swagger-schema-official"
const curlconverter = require("curlconverter")
import { URL } from "url"

// {
//   "_id": "query_datasource_d62738f2d72a466997ffbf46f4952404_e7258ad382cd4c37961b81730633ff2d",
//   "_rev": "1-e702a18eaa96c7cb4be1b402c34eaa59",
//   "datasourceId": "datasource_d62738f2d72a466997ffbf46f4952404",
//   "parameters": [
//   {
//     "name": "paramtest",
//     "default": "defaultValue"
//   }
// ],
//   "fields": {
//     "headers": {
//       "headertest": "test"
//     },
//     "queryString": "query=test",
//     "path": "/path/test"
//   },
//   "queryVerb": "read",
//   "transformer": "return data.test",
//   "schema": {},
//   "name": "name",
//   "readable": true
// }

// return joiValidator.body(Joi.object({
//   _id: Joi.string(),
//   _rev: Joi.string(),
//   name: Joi.string().required(),
//   fields: Joi.object().required(),
//   datasourceId: Joi.string().required(),
//   readable: Joi.boolean(),
//   parameters: Joi.array().items(Joi.object({
//     name: Joi.string(),
//     default: Joi.string().allow(""),
//   })),
//   queryVerb: Joi.string().allow().required(),
//   extra: Joi.object().optional(),
//   schema: Joi.object({}).required().unknown(true),
//   transformer: Joi.string().optional(),
// }))

interface Parameter {
  name: string
  default: string
}

interface Query {
  _id?: string
  datasourceId: string
  name: string
  parameters: Parameter[]
  fields: {
    headers: any
    queryString: string
    path: string
  }
  transformer: string | null
  schema: any
  readable: boolean
  queryVerb: string
}

enum Strategy {
  SWAGGER2,
  OPENAPI3,
  CURL,
}

enum MethodToVerb {
  get = "read",
  post = "create",
  put = "update",
  patch = "patch",
  delete = "delete",
}

interface ImportResult {
  errorQueries: Query[]
}

interface DatasourceInfo {
  url: string
  name: string
  defaultHeaders: any[]
}

const parseImportStrategy = (data: string): Strategy => {
  try {
    const json = JSON.parse(data)
    if (json.swagger === "2.0") {
      return Strategy.CURL
    } else if (json.openapi?.includes("3.0")) {
      return Strategy.OPENAPI3
    }
  } catch (jsonError) {
    try {
      parseCurl(data)
      return Strategy.CURL
    } catch (curlError) {
      // do nothing
    }
  }

  throw new Error(`The import data could not be processed`)
}

const processPath = (path: string): string => {
  if (path?.startsWith("/")) {
    return path.substring(1)
  }

  return path
}

// SWAGGER

const parseSwagger2Info = (swagger2: Swagger2): DatasourceInfo => {
  const scheme = swagger2.schemes?.includes("https") ? "https" : "http"
  const basePath = swagger2.basePath || ""
  const host = swagger2.host || "<host>"
  const url = `${scheme}://${host}${basePath}`
  const name = swagger2.info.title || "Swagger Import"

  return {
    url: url,
    name: name,
    defaultHeaders: [],
  }
}

const parseSwagger2Queries = (
  datasourceId: string,
  swagger2: Swagger2
): Query[] => {
  const queries = []

  for (let [pathName, path] of Object.entries(swagger2.paths)) {
    for (let [methodName, op] of Object.entries(path)) {
      let operation = op as Operation

      const name = operation.operationId || pathName
      const queryString = ""
      const headers = {}
      const parameters: Parameter[] = []

      const query = constructQuery(
        datasourceId,
        name,
        methodName,
        pathName,
        queryString,
        headers,
        parameters
      )
      queries.push(query)
    }
  }

  return queries
}

// OPEN API

const parseOpenAPI3Info = (data: any): DatasourceInfo => {
  return {
    url: "http://localhost:3000",
    name: "swagger",
    defaultHeaders: [],
  }
}

const parseOpenAPI3Queries = (datasourceId: string, data: string): Query[] => {
  return []
}

// CURL

const parseCurl = (data: string): any => {
  const curlJson = curlconverter.toJsonString(data)
  return JSON.parse(curlJson)
}

const parseCurlDatasourceInfo = (data: any): DatasourceInfo => {
  const curl = parseCurl(data)

  const url = new URL(curl.url)

  return {
    url: url.origin,
    name: url.hostname,
    defaultHeaders: [],
  }
}

const parseCurlQueries = (datasourceId: string, data: string): Query[] => {
  const curl = parseCurl(data)

  const url = new URL(curl.url)
  const name = url.pathname
  const path = url.pathname
  const method = curl.method
  const queryString = url.search
  const headers = curl.headers

  const query = constructQuery(
    datasourceId,
    name,
    method,
    path,
    queryString,
    headers
  )
  return [query]
}

const verbFromMethod = (method: string) => {
  const verb = (<any>MethodToVerb)[method]
  if (!verb) {
    throw new Error(`Unsupported method: ${method}`)
  }
  return verb
}

const constructQuery = (
  datasourceId: string,
  name: string,
  method: string,
  path: string,
  queryString: string,
  headers: any = {},
  parameters: Parameter[] = []
): Query => {
  const readable = true
  const queryVerb = verbFromMethod(method)
  const transformer = "return data"
  const schema = {}
  path = processPath(path)

  const query: Query = {
    datasourceId,
    name,
    parameters,
    fields: {
      headers,
      queryString,
      path,
    },
    transformer,
    schema,
    readable,
    queryVerb,
  }

  return query
}

export const getDatasourceInfo = (data: string): DatasourceInfo => {
  const strategy = parseImportStrategy(data)

  let info: DatasourceInfo
  switch (strategy) {
    case Strategy.SWAGGER2:
      info = parseSwagger2Info(JSON.parse(data))
      break
    case Strategy.OPENAPI3:
      info = parseOpenAPI3Info(JSON.parse(data))
      break
    case Strategy.CURL:
      info = parseCurlDatasourceInfo(data)
      break
  }

  return info
}

export const importQueries = async (
  appId: string,
  datasourceId: string,
  data: string
): Promise<ImportResult> => {
  const strategy = parseImportStrategy(data)

  // constuct the queries
  let queries: Query[]
  switch (strategy) {
    case Strategy.SWAGGER2:
      queries = parseSwagger2Queries(datasourceId, JSON.parse(data))
      break
    case Strategy.OPENAPI3:
      queries = parseOpenAPI3Queries(datasourceId, JSON.parse(data))
      break
    case Strategy.CURL:
      queries = parseCurlQueries(datasourceId, data)
      break
  }

  // validate queries
  const errorQueries = []
  const schema = queryValidation()
  queries = queries
    .filter(query => {
      const validation = schema.validate(query)
      if (validation.error) {
        errorQueries.push(query)
        return false
      }
      return true
    })
    .map(query => {
      query._id = generateQueryID(query.datasourceId)
      return query
    })

  // persist queries
  const db = new CouchDB(appId)
  for (const query of queries) {
    try {
      await db.put(query)
    } catch (error) {
      errorQueries.push(query)
    }
  }

  return {
    errorQueries,
  }
}
