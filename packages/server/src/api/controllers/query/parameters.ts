import { findHBSBlocks } from "@budibase/string-templates"
import type { Query } from "@budibase/types"
import type { QueryEventParameters } from "../../../threads/definitions"

const validateQueryInputs = (parameters: QueryEventParameters) => {
  for (const [key, value] of Object.entries(parameters)) {
    if (typeof value !== "string") {
      continue
    }
    if (findHBSBlocks(value).length !== 0) {
      throw new Error(
        `Parameter '${key}' input contains a handlebars binding - this is not allowed.`
      )
    }
  }
}

export const enrichParameters = ({
  query,
  requestParameters = {},
}: {
  query: Query
  requestParameters?: QueryEventParameters
}): QueryEventParameters => {
  const paramNotSet = (value: unknown) => value === "" || value == undefined
  validateQueryInputs(requestParameters)
  for (const parameter of query.parameters) {
    let value = requestParameters[parameter.name]
    if (value == null || value === "") {
      value = parameter.default
    }
    if (query.nullDefaultSupport && paramNotSet(value)) {
      value = null
    }
    requestParameters[parameter.name] = value
  }
  return requestParameters
}
