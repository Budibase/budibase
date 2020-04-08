import { filter, map } from "lodash/fp"
import { $, isSomething } from "./index"

export const stringNotEmpty = s => isSomething(s) && s.trim().length > 0

export const makerule = (field, error, isValid) => ({ field, error, isValid })

export const validationError = (rule, item) => ({ ...rule, item })

export const applyRuleSet = ruleSet => itemToValidate =>
  $(ruleSet, [map(applyRule(itemToValidate)), filter(isSomething)])

export const applyRule = itemTovalidate => rule =>
  rule.isValid(itemTovalidate) ? null : validationError(rule, itemTovalidate)
