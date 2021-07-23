/**
 * Builds a lucene JSON query from the filter structure generated in the builder
 * @param filter the builder filter structure
 */
export const buildLuceneQuery = filter => {
  let query = {
    string: {},
    fuzzy: {},
    range: {},
    equal: {},
    notEqual: {},
    empty: {},
    notEmpty: {},
  }
  if (Array.isArray(filter)) {
    filter.forEach(expression => {
      let { operator, field, type, value } = expression
      // Parse all values into correct types
      if (type === "datetime" && value) {
        value = new Date(value).toISOString()
      }
      if (type === "number") {
        value = parseFloat(value)
      }
      if (type === "boolean") {
        value = value?.toLowerCase() === "true"
      }
      if (operator.startsWith("range")) {
        if (!query.range[field]) {
          query.range[field] = {
            low:
              type === "number"
                ? Number.MIN_SAFE_INTEGER
                : "0000-00-00T00:00:00.000Z",
            high:
              type === "number"
                ? Number.MAX_SAFE_INTEGER
                : "9999-00-00T00:00:00.000Z",
          }
        }
        if (operator === "rangeLow" && value != null && value !== "") {
          query.range[field].low = value
        } else if (operator === "rangeHigh" && value != null && value !== "") {
          query.range[field].high = value
        }
      } else if (query[operator]) {
        if (type === "boolean") {
          // Transform boolean filters to cope with null.
          // "equals false" needs to be "not equals true"
          // "not equals false" needs to be "equals true"
          if (operator === "equal" && value === false) {
            query.notEqual[field] = true
          } else if (operator === "notEqual" && value === false) {
            query.equal[field] = true
          } else {
            query[operator][field] = value
          }
        } else {
          query[operator][field] = value
        }
      }
    })
  }

  return query
}

/**
 * Performs a client-side lucene search on an array of data
 * @param docs the data
 * @param query the JSON lucene query
 */
export const luceneQuery = (docs, query) => {
  if (!query) {
    return docs
  }

  // Iterates over a set of filters and evaluates a fail function against a doc
  const match = (type, failFn) => doc => {
    const filters = Object.entries(query[type] || {})
    for (let i = 0; i < filters.length; i++) {
      if (failFn(filters[i][0], filters[i][1], doc)) {
        return false
      }
    }
    return true
  }

  // Process a string match (fails if the value does not start with the string)
  const stringMatch = match("string", (key, value, doc) => {
    return !doc[key] || !doc[key].startsWith(value)
  })

  // Process a range match
  const rangeMatch = match("range", (key, value, doc) => {
    return !doc[key] || doc[key] < value.low || doc[key] > value.high
  })

  // Process an equal match (fails if the value is different)
  const equalMatch = match("equal", (key, value, doc) => {
    return doc[key] !== value
  })

  // Process a not-equal match (fails if the value is the same)
  const notEqualMatch = match("notEqual", (key, value, doc) => {
    return doc[key] === value
  })

  // Process an empty match (fails if the value is not empty)
  const emptyMatch = match("empty", (key, value, doc) => {
    return doc[key] != null && doc[key] !== ""
  })

  // Process a not-empty match (fails is the value is empty)
  const notEmptyMatch = match("notEmpty", (key, value, doc) => {
    return doc[key] == null || doc[key] === ""
  })

  // Match a document against all criteria
  const docMatch = doc => {
    return (
      stringMatch(doc) &&
      rangeMatch(doc) &&
      equalMatch(doc) &&
      notEqualMatch(doc) &&
      emptyMatch(doc) &&
      notEmptyMatch(doc)
    )
  }

  // Process all docs
  return docs.filter(docMatch)
}

/**
 * Performs a client-side sort from the equivalent server-side lucene sort
 * parameters.
 * @param docs the data
 * @param sort the sort column
 * @param sortOrder the sort order ("ascending" or "descending")
 * @param sortType the type of sort ("string" or "number")
 */
export const luceneSort = (docs, sort, sortOrder, sortType = "string") => {
  if (!sort || !sortOrder || !sortType) {
    return docs
  }
  const parse = sortType === "string" ? x => `${x}` : x => parseFloat(x)
  return docs.slice().sort((a, b) => {
    const colA = parse(a[sort])
    const colB = parse(b[sort])
    if (sortOrder === "Descending") {
      return colA > colB ? -1 : 1
    } else {
      return colA > colB ? 1 : -1
    }
  })
}

/**
 * Limits the specified docs to the specified number of rows from the equivalent
 * server-side lucene limit parameters.
 * @param docs the data
 * @param limit the number of docs to limit to
 */
export const luceneLimit = (docs, limit) => {
  const numLimit = parseFloat(limit)
  if (isNaN(numLimit)) {
    return docs
  }
  return docs.slice(0, numLimit)
}
