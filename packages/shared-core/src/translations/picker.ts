import { createTranslationDefinitions } from "./types"

const category = "picker"

export const pickerTranslations = createTranslationDefinitions(category, [
  {
    key: "searchPlaceholder",
    name: "Picker search placeholder",
    defaultValue: "Search",
  },
  {
    key: "searchByFieldPlaceholder",
    name: "Picker search by field placeholder",
    defaultValue: "Search by {field}",
  },
])
