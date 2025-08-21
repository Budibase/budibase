import { object } from "./utils"
import Resource from "./utils/Resource"

const errorSchema = object({
  status: {
    type: "number",
    description: "The HTTP status code of the error.",
  },
  message: {
    type: "string",
    description: "A descriptive message about the error.",
  },
})

export default new Resource()
  .setExamples({
    error: {},
  })
  .setSchemas({
    error: errorSchema,
  })
