import { SearchQuery, SearchQueryOperators } from "@budibase/types"
import { runLuceneQuery } from "../filters"
import { expect, describe, it } from "vitest"

describe("runLuceneQuery", () => {
  const docs = [
    {
      order_id: 1,
      customer_id: 259,
      order_status: 4,
      order_date: "2016-01-01T00:00:00.000Z",
      required_date: "2016-01-03T00:00:00.000Z",
      shipped_date: "2016-01-03T00:00:00.000Z",
      store_id: 1,
      staff_id: 2,
      description: "Large box",
      label: undefined,
    },
    {
      order_id: 2,
      customer_id: 1212,
      order_status: 4,
      order_date: "2016-01-05T00:00:00.000Z",
      required_date: "2016-01-04T00:00:00.000Z",
      shipped_date: "2016-01-03T00:00:00.000Z",
      store_id: 2,
      staff_id: 6,
      description: "Small box",
      label: "FRAGILE",
    },
    {
      order_id: 3,
      customer_id: 523,
      order_status: 5,
      order_date: "2016-01-12T00:00:00.000Z",
      required_date: "2016-01-05T00:00:00.000Z",
      shipped_date: "2016-01-03T00:00:00.000Z",
      store_id: 2,
      staff_id: 7,
      description: "Heavy box",
      label: "HEAVY",
    },
  ]

  function buildQuery(
    filterKey: string,
    value: { [key: string]: any }
  ): SearchQuery {
    const query: SearchQuery = {
      string: {},
      fuzzy: {},
      range: {},
      equal: {},
      notEqual: {},
      empty: {},
      notEmpty: {},
      contains: {},
      notContains: {},
      oneOf: {},
      containsAny: {},
    }
    query[filterKey as SearchQueryOperators] = value
    return query
  }

  it("should return input docs if no search query is provided", () => {
    expect(runLuceneQuery(docs)).toBe(docs)
  })

  it("should return matching rows for equal filter", () => {
    const query = buildQuery("equal", {
      order_status: 4,
    })
    expect(runLuceneQuery(docs, query).map(row => row.order_id)).toEqual([1, 2])
  })

  it("should return matching row for notEqual filter", () => {
    const query = buildQuery("notEqual", {
      order_status: 4,
    })
    expect(runLuceneQuery(docs, query).map(row => row.order_id)).toEqual([3])
  })

  it("should return starts with matching rows for fuzzy and string filters", () => {
    expect(
      runLuceneQuery(
        docs,
        buildQuery("fuzzy", {
          description: "sm",
        })
      ).map(row => row.description)
    ).toEqual(["Small box"])
    expect(
      runLuceneQuery(
        docs,
        buildQuery("string", {
          description: "SM",
        })
      ).map(row => row.description)
    ).toEqual(["Small box"])
  })

  it("should return rows within a range filter", () => {
    const query = buildQuery("range", {
      customer_id: {
        low: 500,
        high: 1000,
      },
    })
    expect(runLuceneQuery(docs, query).map(row => row.order_id)).toEqual([3])
  })

  it("should return rows with numeric strings within a range filter", () => {
    const query = buildQuery("range", {
      customer_id: {
        low: "500",
        high: "1000",
      },
    })
    expect(runLuceneQuery(docs, query).map(row => row.order_id)).toEqual([3])
  })

  it("should return rows with ISO date strings within a range filter", () => {
    const query = buildQuery("range", {
      order_date: {
        low: "2016-01-04T00:00:00.000Z",
        high: "2016-01-11T00:00:00.000Z",
      },
    })
    expect(runLuceneQuery(docs, query).map(row => row.order_id)).toEqual([2])
  })

  it("should throw an error is an invalid doc value is passed into a range filter", async () => {
    const query = buildQuery("range", {
      order_date: {
        low: "2016-01-04T00:00:00.000Z",
        high: "2016-01-11T00:00:00.000Z",
      },
    })
    expect(() =>
      runLuceneQuery(
        [
          {
            order_id: 4,
            customer_id: 1758,
            order_status: 5,
            order_date: "INVALID",
            required_date: "2017-03-05T00:00:00.000Z",
            shipped_date: "2017-03-03T00:00:00.000Z",
            store_id: 2,
            staff_id: 7,
            description: undefined,
            label: "",
          },
        ],
        query
      )
    ).toThrowError("Cannot perform range filter - invalid type.")
  })

  it("should return rows with matches on empty filter", () => {
    const query = buildQuery("empty", {
      label: null,
    })
    expect(runLuceneQuery(docs, query).map(row => row.order_id)).toEqual([1])
  })

  it("should return rows with matches on notEmpty filter", () => {
    const query = buildQuery("notEmpty", {
      label: null,
    })
    expect(runLuceneQuery(docs, query).map(row => row.order_id)).toEqual([2, 3])
  })
})
