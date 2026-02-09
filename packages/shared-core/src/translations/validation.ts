import { createTranslationDefinitions } from "./types"

const category = "validation"

export const validationTranslations = createTranslationDefinitions(category, [
  {
    key: "required",
    name: "Required field error",
    defaultValue: "Required",
  },
])
