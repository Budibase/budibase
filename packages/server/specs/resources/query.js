const { object } = require("./utils")
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

const querySchema = object({})

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
  })
  .setSchemas({
    query: querySchema,
  })
