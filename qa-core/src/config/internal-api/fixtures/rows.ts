import { Row } from "@budibase/types"

export const generateNewRowForTable = (tableId: string): Row => {
  return {
    TestColumn: "TestRow",
    tableId: tableId,
  }
}

export const searchBody = (primaryDisplay: string): any => {
  return {
    bookmark: null,
    limit: 10,
    paginate: true,
    query: {
      contains: {},
      containsAny: {},
      empty: {},
      equal: {},
      fuzzy: {},
      notContains: {},
      notEmpty: {},
      notEqual: {},
      oneOf: {},
      range: {},
      string: {},
    },
    sort: primaryDisplay,
    sortOrder: "ascending",
    sortType: "string",
  }
}
