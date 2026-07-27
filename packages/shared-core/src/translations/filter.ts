import { createTranslationDefinitions } from "./types"

const category = "filter"

export const filterTranslations = createTranslationDefinitions(category, [
  {
    key: "is",
    name: "Is operator label",
    defaultValue: "Is",
  },
  {
    key: "isNot",
    name: "Is not operator label",
    defaultValue: "Is not",
  },
  {
    key: "startsWith",
    name: "Starts with operator label",
    defaultValue: "Starts with",
  },
  {
    key: "like",
    name: "Like operator label",
    defaultValue: "Like",
  },
  {
    key: "empty",
    name: "Is empty operator label",
    defaultValue: "Is empty",
  },
  {
    key: "notEmpty",
    name: "Is not empty operator label",
    defaultValue: "Is not empty",
  },
  {
    key: "isIn",
    name: "Is in operator label",
    defaultValue: "Is in",
  },
  {
    key: "notOneOf",
    name: "Is not in operator label",
    defaultValue: "Is not in",
  },
  {
    key: "moreThanOrEqualTo",
    name: "More than or equal to operator label",
    defaultValue: "More than or equal to",
  },
  {
    key: "lessThanOrEqualTo",
    name: "Less than or equal to operator label",
    defaultValue: "Less than or equal to",
  },
  {
    key: "between",
    name: "Between operator label",
    defaultValue: "Between",
  },
  {
    key: "true",
    name: "True option label",
    defaultValue: "True",
  },
  {
    key: "false",
    name: "False option label",
    defaultValue: "False",
  },
])
