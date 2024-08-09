import { isLogicalSearchOperator, SearchFilters } from "@budibase/types"
import { cloneDeep } from "lodash/fp"

export const removeInvalidFilters = (
  filters: SearchFilters,
  validFields: string[]
) => {
  const result = cloneDeep(filters)

  validFields = validFields.map(f => f.toLowerCase())
  for (const filterKey of Object.keys(result) as (keyof SearchFilters)[]) {
    if (typeof result[filterKey] !== "object") {
      continue
    }
    if (isLogicalSearchOperator(filterKey)) {
      const resultingConditions: SearchFilters[] = []
      for (const condition of result[filterKey].conditions) {
        const resultingCondition = removeInvalidFilters(condition, validFields)
        if (Object.keys(resultingCondition).length) {
          resultingConditions.push(resultingCondition)
        }
      }
      if (resultingConditions.length) {
        result[filterKey].conditions = resultingConditions
      } else {
        delete result[filterKey]
      }
      continue
    }

    const filter = result[filterKey]
    for (const columnKey of Object.keys(filter)) {
      if (
        !validFields.map(f => f.toLowerCase()).includes(columnKey.toLowerCase())
      ) {
        delete filter[columnKey]
      }
    }
    if (!Object.keys(filter).length) {
      delete result[filterKey]
    }
  }

  return result
}
