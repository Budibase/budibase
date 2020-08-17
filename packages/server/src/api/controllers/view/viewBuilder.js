function statsViewTemplate({
  field,
  modelId,
  groupBy
}) {
  return {
    meta: {
      field,
      modelId,
      groupBy,
      schema: {
        sum: "number",
        min: "number",
        max: "number",
        count: "number",
        sumsqr: "number",
        avg: "number"
      }
    },
    map: `function (doc) {
      if (doc.modelId === "${modelId}") {
        emit(doc["${groupBy || "_id"}"], doc["${field}"]);  
      }
    }`,
    reduce: "_stats" 
  }
}

module.exports = statsViewTemplate