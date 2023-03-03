import Resource from "./utils/Resource"
import { object } from "./utils"
import { BaseQueryVerbs } from "../../src/constants"

const query = {
  _id: "query_datasource_plus_4d8be0c506b9465daf4bf84d890fdab6_454854487c574d45bc4029b1e153219e",
  datasourceId: "datasource_plus_4d8be0c506b9465daf4bf84d890fdab6",
  parameters: [],
  fields: {
    sql: "select * from persons",
  },
  queryVerb: "read",
  name: "Help",
  schema: {
    personid: {
      name: "personid",
      type: "string",
    },
    lastname: {
      name: "lastname",
      type: "string",
    },
    firstname: {
      name: "firstname",
      type: "string",
    },
    address: {
      name: "address",
      type: "string",
    },
    city: {
      name: "city",
      type: "string",
    },
  },
  transformer: "return data",
  readable: true,
}

const restResponse = {
  value: {
    data: [
      {
        value: "<html lang='en-GB'></html>",
      },
    ],
    pagination: {
      cursor: "2",
    },
    raw: "<html lang='en-GB'></html>",
    headers: {
      "content-type": "text/html; charset=ISO-8859-1",
    },
  },
}

const sqlResponse = {
  value: {
    data: [
      {
        personid: 1,
        lastname: "Hughes",
        firstname: "Mike",
        address: "123 Fake Street",
        city: "Belfast",
      },
      {
        personid: 2,
        lastname: "Smith",
        firstname: "John",
        address: "64 Updown Road",
        city: "Dublin",
      },
    ],
  },
}

const querySchema = object(
  {
    _id: {
      description: "The ID of the query.",
      type: "string",
    },
    datasourceId: {
      description: "The ID of the datasource the query belongs to.",
      type: "string",
    },
    parameters: {
      description: "The bindings which are required to perform this query.",
      type: "array",
      items: {
        type: "string",
      },
    },
    fields: {
      description:
        "The fields that are used to perform this query, e.g. the sql statement",
      type: "object",
    },
    queryVerb: {
      description: "The verb that describes this query.",
      enum: Object.values(BaseQueryVerbs),
    },
    name: {
      description: "The name of the query.",
      type: "string",
    },
    schema: {
      description:
        "The schema of the data returned when the query is executed.",
      type: "object",
    },
    transformer: {
      description:
        "The JavaScript transformer function, applied after the query responds with data.",
      type: "string",
    },
    readable: {
      description: "Whether the query has readable data.",
      type: "boolean",
    },
  },
  { required: ["name", "schema", "_id"] }
)

const executeQuerySchema = {
  description: "The parameters required for executing a query.",
  type: "object",
  properties: {
    parameters: {
      type: "object",
      description:
        "This contains the required parameters for the query, this depends on query type, setup and bindings.",
      additionalProperties: {
        description:
          "Key value properties of any type, depending on the query output schema.",
      },
    },
    pagination: {
      type: "object",
      description:
        "For supported query types (currently on REST) pagination can be performed using these properties.",
      properties: {
        page: {
          type: "string",
          description:
            "The page which has been returned from a previous query.",
        },
        limit: {
          type: "number",
          description: "The number of rows to return per page.",
        },
      },
    },
  },
}

const executeQueryOutputSchema = object(
  {
    data: {
      description: "The data response from the query.",
      type: "array",
      items: {
        type: "object",
      },
    },
    extra: {
      description:
        "Extra information that is not part of the main data, e.g. headers.",
      type: "object",
      properties: {
        headers: {
          description:
            "If carrying out a REST request, this will contain the response headers.",
          type: "object",
        },
        raw: {
          description: "The raw query response, as a string.",
          type: "string",
        },
      },
    },
    pagination: {
      description:
        "If pagination is supported, this will contain the bookmark/anchor information for it.",
      type: "object",
    },
  },
  { required: ["data"] }
)

export default new Resource()
  .setExamples({
    query: {
      value: {
        data: query,
      },
    },
    queries: {
      value: {
        data: [query],
      },
    },
    restResponse,
    sqlResponse,
  })
  .setSchemas({
    executeQuery: executeQuerySchema,
    executeQueryOutput: executeQueryOutputSchema,
    query: querySchema,
    querySearch: object({
      data: {
        type: "array",
        items: querySchema,
      },
    }),
  })
