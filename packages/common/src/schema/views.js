import { generate } from "shortid"

export const newView = (modelId = null) => ({
  id: generate(),
  name: "",
  modelId,
})
