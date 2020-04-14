import { generate } from "shortid"
import { getNewFieldValue } from "../schema/types"

export const getNewRecord = (schema, modelName) => {
  const model = schema.findModel(modelName)

  const record = {
    _id: generate(),
    _modelId: model.id,
  }

  for (let field of model.fields) {
    record[field.name] = getNewFieldValue(field)
  }

  return record
}
