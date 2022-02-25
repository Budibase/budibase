const Resource = require("./utils/Resource")

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

const querySchema = {
  description:
    "The query body must contain the required parameters for the query, this depends on query type, setup and bindings.",
  type: "object",
  additionalProperties: {
    oneOf: [
      { type: "string" },
      { type: "object" },
      { type: "integer" },
      { type: "array" },
      { type: "boolean" },
    ],
  },
}

module.exports = new Resource()
  .setExamples({
    query: {
      value: {
        query: query,
      },
    },
    queries: {
      value: {
        queries: [query],
      },
    },
    restResponse,
    sqlResponse,
  })
  .setSchemas({
    query: querySchema,
  })
