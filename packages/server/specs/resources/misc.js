const { object } = require("./utils")
const Resource = require("./utils/Resource")

module.exports = new Resource().setSchemas({
  nameSearch: object({
    name: {
      type: "string",
      description:
        "The name to be used when searching - this will be used in a case insensitive starts with match.",
    },
  }),
})
