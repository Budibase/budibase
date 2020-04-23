import { generate } from "shortid"

export const getNewRecord = (schema, modelName) => {
  const model = schema.findModel(modelName)

  const record = {
    _id: generate(),
    modelId: model._id,
  }

  for (let field in model.schema.properties) {
    record[field] = field.default
  }

  return record
}
