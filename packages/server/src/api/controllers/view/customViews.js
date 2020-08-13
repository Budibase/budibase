const FORMULA_MAP = {
  SUM: "_sum",
  COUNT: "_count",
  STATS: "_stats"
};

function customViewTemplate({
  field,
  formula,
  modelId
}) {
  return {
    meta: {
      field,
      formula,
      modelId
    },
    map: `function (doc) {
      if (doc.modelId === "${modelId}") {
        emit(doc._id, doc["${field}"]);  
      }
    }`,
    reduce: "_stats" 
  }
}

module.exports = customViewTemplate