import { generate } from "shortid"

export const newModel = () => ({
  id: generate(),
  name: "",
  fields: [],
  validationRules: [],
  primaryField: "",
  views: [],
})

/**
 *
 * @param {Array} models
 * @param {string} modelId
 * @returns {}
 */
export const canDeleteModel = (models, modelId) => {
  const errors = []

  for (let model of models) {
    const links = model.fields.filter(
      f => f.type === "link" && f.typeOptions.modelId === modelId
    )

    for (let link of links) {
      errors.push(
        `The "${model.name}" model links to this model, via field "${link.name}"`
      )
    }
  }

  return {
    errors,
    canDelete: errors.length > 0,
  }
}
