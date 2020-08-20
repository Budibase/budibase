const TOKEN_MAP = {
  EQUALS: "===",
  LT: "<",
  LTE: "<=",
  MT: ">",
  MTE: ">=",
  CONTAINS: "includes()",
  AND: "&&",
  OR: "||"
}

function parseFilters(filters) {
  const expression = filters.map(filter => {
    if (filter.conjunction) return TOKEN_MAP[filter.conjunction];
    
    return `doc["${filter.key}"] ${TOKEN_MAP[filter.condition]} "${filter.value}"`
  })
  
  return expression.join(" ")
}

function statsViewTemplate({ field, modelId, groupBy }) {
  return {
    meta: {
      field,
      modelId,
      groupBy,
      filter: [
        {
          key: "Status",
          condition: "Equals",
          value: "VIP",
        },
        {
          conjunction: "AND"
        },
        {
          key: "Status",
          condition: "Equals",
          value: "VIP",
        }
      ],
      schema: {
        sum: "number",
        min: "number",
        max: "number",
        count: "number",
        sumsqr: "number",
        avg: "number",
      },
    },
    map: `function (doc) {
      if (doc.modelId === "${modelId}") {
        emit(doc["${groupBy || "_id"}"], doc["${field}"]);  
      }
    }`,
    reduce: "_stats",
  }
}

module.exports = statsViewTemplate
