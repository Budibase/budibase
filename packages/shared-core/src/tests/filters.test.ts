import {
  SearchQuery,
  SearchQueryOperators,
  FieldType,
  SearchFilter,
} from "@budibase/types"
import { buildLuceneQuery, runLuceneQuery } from "../filters"

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

  function buildQuery(filters: { [filterKey: string]: any }): SearchQuery {
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
      allOr: false,
    }

    for (const filterKey in filters) {
      query[filterKey as SearchQueryOperators] = filters[filterKey]
    }

    return query
  }

  it("should return input docs if no search query is provided", () => {
    expect(runLuceneQuery(docs)).toBe(docs)
  })

  it("should return matching rows for equal filter", () => {
    const query = buildQuery({
      equal: { order_status: 4 },
    })
    expect(runLuceneQuery(docs, query).map(row => row.order_id)).toEqual([1, 2])
  })

  it("should return matching row for notEqual filter", () => {
    const query = buildQuery({
      notEqual: { order_status: 4 },
    })

    expect(runLuceneQuery(docs, query).map(row => row.order_id)).toEqual([3])
  })

  it("should return starts with matching rows for fuzzy and string filters", () => {
    expect(
      runLuceneQuery(
        docs,
        buildQuery({
          fuzzy: { description: "sm" },
        })
      ).map(row => row.description)
    ).toEqual(["Small box"])
    expect(
      runLuceneQuery(
        docs,
        buildQuery({
          string: { description: "SM" },
        })
      ).map(row => row.description)
    ).toEqual(["Small box"])
  })

  it("should return rows within a range filter", () => {
    const query = buildQuery({
      range: {
        customer_id: {
          low: 500,
          high: 1000,
        },
      },
    })

    expect(runLuceneQuery(docs, query).map(row => row.order_id)).toEqual([3])
  })

  it("should return rows with numeric strings within a range filter", () => {
    const query = buildQuery({
      range: {
        customer_id: {
          low: "500",
          high: "1000",
        },
      },
    })
    expect(runLuceneQuery(docs, query).map(row => row.order_id)).toEqual([3])
  })

  it("should return rows with ISO date strings within a range filter", () => {
    const query = buildQuery({
      range: {
        order_date: {
          low: "2016-01-04T00:00:00.000Z",
          high: "2016-01-11T00:00:00.000Z",
        },
      },
    })

    expect(runLuceneQuery(docs, query).map(row => row.order_id)).toEqual([2])
  })

  it("should return return all docs if an invalid doc value is passed into a range filter", async () => {
    const docs = [
      {
        order_id: 4,
        customer_id: 1758,
        order_status: 5,
        order_date: "{{ Binding.INVALID }}",
        required_date: "2017-03-05T00:00:00.000Z",
        shipped_date: "2017-03-03T00:00:00.000Z",
        store_id: 2,
        staff_id: 7,
        description: undefined,
        label: "",
      },
    ]

    const query = buildQuery({
      range: {
        order_date: {
          low: "2016-01-04T00:00:00.000Z",
          high: "2016-01-11T00:00:00.000Z",
        },
      },
    })

    expect(runLuceneQuery(docs, query)).toEqual(docs)
  })

  it("should return rows with matches on empty filter", () => {
    const query = buildQuery({
      empty: {
        label: null,
      },
    })

    expect(runLuceneQuery(docs, query).map(row => row.order_id)).toEqual([1])
  })

  it("should return rows with matches on notEmpty filter", () => {
    const query = buildQuery({
      notEmpty: {
        label: null,
      },
    })

    expect(runLuceneQuery(docs, query).map(row => row.order_id)).toEqual([2, 3])
  })

  it.each([[523, 259], "523,259"])(
    "should return rows with matches on numeric oneOf filter",
    input => {
      const query = buildQuery({
        oneOf: {
          customer_id: input,
        },
      })

      expect(runLuceneQuery(docs, query).map(row => row.customer_id)).toEqual([
        259, 523,
      ])
    }
  )

  it.each([
    [false, []],
    [true, [1, 2, 3]],
  ])("should return %s  if allOr is %s ", (allOr, expectedResult) => {
    const query = buildQuery({
      allOr,
      oneOf: { staff_id: [10] },
      contains: { description: ["box"] },
    })

    expect(runLuceneQuery(docs, query).map(row => row.order_id)).toEqual(
      expectedResult
    )
  })

  it("should return matching results if allOr is true and only one filter matches with different operands", () => {
    const query = buildQuery({
      allOr: true,
      equal: { order_status: 4 },
      oneOf: { label: ["FRAGILE"] },
    })

    expect(runLuceneQuery(docs, query).map(row => row.order_id)).toEqual([1, 2])
  })

  it("should handle when a value is null or undefined", () => {
    const query = buildQuery({
      allOr: true,
      equal: { order_status: null },
      oneOf: { label: ["FRAGILE"] },
    })

    expect(runLuceneQuery(docs, query).map(row => row.order_id)).toEqual([2])
  })
})

describe("buildLuceneQuery", () => {
  it("should return a basic search query template if the input is not an array", () => {
    const filter: any = "NOT_AN_ARRAY"
    expect(buildLuceneQuery(filter)).toEqual({
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
    })
  })

  it("should parseFloat if the type is a number, but the value is a numeric string", () => {
    const filter: SearchFilter[] = [
      {
        operator: SearchQueryOperators.EQUAL,
        field: "customer_id",
        type: FieldType.NUMBER,
        value: "1212",
      },
      {
        operator: SearchQueryOperators.ONE_OF,
        field: "customer_id",
        type: FieldType.NUMBER,
        value: "1000,1212,3400",
      },
    ]
    expect(buildLuceneQuery(filter)).toEqual({
      string: {},
      fuzzy: {},
      range: {},
      equal: {
        customer_id: 1212,
      },
      notEqual: {},
      empty: {},
      notEmpty: {},
      contains: {},
      notContains: {},
      oneOf: {
        customer_id: [1000, 1212, 3400],
      },
      containsAny: {},
    })
  })

  it("should not parseFloat if the type is a number, but the value is a handlebars binding string", () => {
    const filter: SearchFilter[] = [
      {
        operator: SearchQueryOperators.EQUAL,
        field: "customer_id",
        type: FieldType.NUMBER,
        value: "{{ customer_id }}",
      },
      {
        operator: SearchQueryOperators.ONE_OF,
        field: "customer_id",
        type: FieldType.NUMBER,
        value: "{{ list_of_customer_ids }}",
      },
    ]
    expect(buildLuceneQuery(filter)).toEqual({
      string: {},
      fuzzy: {},
      range: {},
      equal: {
        customer_id: "{{ customer_id }}",
      },
      notEqual: {},
      empty: {},
      notEmpty: {},
      contains: {},
      notContains: {},
      oneOf: {
        customer_id: "{{ list_of_customer_ids }}",
      },
      containsAny: {},
    })
  })

  it("should cast string to boolean if the type is boolean", () => {
    const filter: SearchFilter[] = [
      {
        operator: SearchQueryOperators.EQUAL,
        field: "a",
        type: FieldType.BOOLEAN,
        value: "not_true",
      },
      {
        operator: SearchQueryOperators.NOT_EQUAL,
        field: "b",
        type: FieldType.BOOLEAN,
        value: "not_true",
      },
      {
        operator: SearchQueryOperators.EQUAL,
        field: "c",
        type: FieldType.BOOLEAN,
        value: "true",
      },
    ]
    expect(buildLuceneQuery(filter)).toEqual({
      string: {},
      fuzzy: {},
      range: {},
      equal: {
        b: true,
        c: true,
      },
      notEqual: {
        a: true,
      },
      empty: {},
      notEmpty: {},
      contains: {},
      notContains: {},
      oneOf: {},
      containsAny: {},
    })
  })

  it("should split the string for contains operators", () => {
    const filter: SearchFilter[] = [
      {
        operator: SearchQueryOperators.CONTAINS,
        field: "description",
        type: FieldType.ARRAY,
        value: "Large box,Heavy box,Small box",
      },
      {
        operator: SearchQueryOperators.NOT_CONTAINS,
        field: "description",
        type: FieldType.ARRAY,
        value: "Large box,Heavy box,Small box",
      },
      {
        operator: SearchQueryOperators.CONTAINS_ANY,
        field: "description",
        type: FieldType.ARRAY,
        value: "Large box,Heavy box,Small box",
      },
    ]
    expect(buildLuceneQuery(filter)).toEqual({
      string: {},
      fuzzy: {},
      range: {},
      equal: {},
      notEqual: {},
      empty: {},
      notEmpty: {},
      contains: {
        description: ["Large box", "Heavy box", "Small box"],
      },
      notContains: {
        description: ["Large box", "Heavy box", "Small box"],
      },
      oneOf: {},
      containsAny: {
        description: ["Large box", "Heavy box", "Small box"],
      },
    })
  })
})
