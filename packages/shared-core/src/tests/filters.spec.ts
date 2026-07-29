import { buildQuery, cleanupQuery, runQuery } from "../filters"
import {
  ArrayOperator,
  BasicOperator,
  EmptyFilterOption,
  FieldType,
  LogicalOperator,
  UILogicalOperator,
  UISearchFilter,
} from "@budibase/types"

describe("filter to query conversion", () => {
  it("handles a filter with 1 group", () => {
    const filter: UISearchFilter = {
      logicalOperator: UILogicalOperator.ALL,
      onEmptyFilter: EmptyFilterOption.RETURN_NONE,
      groups: [
        {
          logicalOperator: UILogicalOperator.ALL,
          filters: [
            {
              field: "city",
              operator: BasicOperator.STRING,
              value: "lon",
            },
          ],
        },
      ],
    }
    const query = buildQuery(filter)
    expect(query).toEqual({
      onEmptyFilter: "none",
      $and: {
        conditions: [
          {
            $and: {
              conditions: [
                {
                  string: {
                    city: "lon",
                  },
                },
              ],
            },
          },
        ],
      },
    })
  })

  it("handles an empty filter", () => {
    const filter = undefined
    const query = buildQuery(filter)
    expect(query).toEqual({})
  })

  it("handles legacy filters", () => {
    const filter = [
      {
        field: "city",
        operator: BasicOperator.STRING,
        value: "lon",
      },
    ]
    const query = buildQuery(filter)
    expect(query).toEqual({
      onEmptyFilter: "all",
      $and: {
        conditions: [
          {
            $and: {
              conditions: [
                {
                  string: {
                    city: "lon",
                  },
                },
              ],
            },
          },
        ],
      },
    })
  })

  it("handles nested groups", () => {
    const filter: UISearchFilter = {
      logicalOperator: UILogicalOperator.ALL,
      onEmptyFilter: EmptyFilterOption.RETURN_NONE,
      groups: [
        {
          logicalOperator: UILogicalOperator.ALL,
          filters: [
            {
              field: "city",
              operator: BasicOperator.STRING,
              value: "lon",
            },
          ],
        },
        {
          logicalOperator: UILogicalOperator.ALL,
          groups: [
            {
              logicalOperator: UILogicalOperator.ANY,
              filters: [
                {
                  valueType: "Binding",
                  field: "country.country_name",
                  type: FieldType.STRING,
                  operator: BasicOperator.EQUAL,
                  noValue: false,
                  value: "England",
                },
              ],
            },
          ],
        },
      ],
    }
    const query = buildQuery(filter)
    expect(query).toEqual({
      onEmptyFilter: "none",
      $and: {
        conditions: [
          {
            $and: {
              conditions: [
                {
                  string: {
                    city: "lon",
                  },
                },
              ],
            },
          },
          {
            $and: {
              conditions: [
                {
                  $or: {
                    conditions: [
                      {
                        equal: {
                          "country.country_name": "England",
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    })
  })
})

describe("runQuery notOneOf", () => {
  const docs = [
    { id: 1, name: "foo" },
    { id: 2, name: "bar" },
    { id: 3, name: "baz" },
    { id: 4, name: null },
  ]

  it("returns docs whose value is not in the list", () => {
    const result = runQuery(docs, { notOneOf: { name: ["foo"] } })
    expect(result.map(d => d.id)).toEqual([2, 3, 4])
  })

  it("excludes all matching values", () => {
    const result = runQuery(docs, { notOneOf: { name: ["foo", "bar"] } })
    expect(result.map(d => d.id)).toEqual([3, 4])
  })

  it("includes docs with an empty value", () => {
    const result = runQuery(docs, { notOneOf: { name: ["baz"] } })
    expect(result.map(d => d.id)).toEqual([1, 2, 4])
  })

  it("is the inverse of oneOf for non-empty values", () => {
    const oneOfResult = runQuery(docs, { oneOf: { name: ["foo", "bar"] } })
    const notOneOfResult = runQuery(docs, {
      notOneOf: { name: ["foo", "bar"] },
    })
    expect(oneOfResult.map(d => d.id)).toEqual([1, 2])
    expect(notOneOfResult.map(d => d.id)).toEqual([3, 4])
  })
})

describe("empty array filters", () => {
  const docs = [
    { id: 1, name: "foo", status: "Available" },
    { id: 2, name: "bar", status: "Unavailable" },
  ]

  it("removes empty array membership filters when the query is empty", () => {
    const query = cleanupQuery({
      [ArrayOperator.ONE_OF]: { name: [] },
      [ArrayOperator.NOT_ONE_OF]: { name: [] },
    })

    expect(query).toEqual({
      [ArrayOperator.ONE_OF]: {},
      [ArrayOperator.NOT_ONE_OF]: {},
    })
  })

  it("preserves empty arrays for array membership operators in populated queries", () => {
    const query = cleanupQuery({
      [LogicalOperator.AND]: {
        conditions: [
          { [ArrayOperator.ONE_OF]: { name: [] } },
          { [BasicOperator.EQUAL]: { status: "Available" } },
        ],
      },
    })

    expect(query).toEqual({
      [LogicalOperator.AND]: {
        conditions: [
          { [ArrayOperator.ONE_OF]: { name: [] } },
          { [BasicOperator.EQUAL]: { status: "Available" } },
        ],
      },
    })
  })

  it("respects RETURN_ALL for an empty oneOf filter", () => {
    const result = runQuery(docs, {
      onEmptyFilter: EmptyFilterOption.RETURN_ALL,
      [ArrayOperator.ONE_OF]: { name: [] },
    })

    expect(result).toEqual(docs)
  })

  it("respects RETURN_NONE for an empty oneOf filter", () => {
    const result = runQuery(docs, {
      onEmptyFilter: EmptyFilterOption.RETURN_NONE,
      [ArrayOperator.ONE_OF]: { name: [] },
    })

    expect(result).toEqual([])
  })

  it("removes empty strings for array membership operators", () => {
    const query = cleanupQuery({
      [ArrayOperator.ONE_OF]: {
        // @ts-expect-error Verifies invalid empty string cleanup
        name: "",
      },
      [ArrayOperator.NOT_ONE_OF]: {
        // @ts-expect-error Verifies invalid empty string cleanup
        name: "",
      },
    })

    expect(query).toEqual({
      [ArrayOperator.ONE_OF]: {},
      [ArrayOperator.NOT_ONE_OF]: {},
    })
  })

  it("matches no rows when an ALL group contains oneOf an empty array", () => {
    const result = runQuery(docs, {
      [LogicalOperator.AND]: {
        conditions: [
          { [ArrayOperator.ONE_OF]: { name: [] } },
          { [BasicOperator.EQUAL]: { status: "Available" } },
        ],
      },
    })

    expect(result).toEqual([])
  })

  it("ignores oneOf an empty array when matching an ANY group", () => {
    const result = runQuery(docs, {
      [LogicalOperator.OR]: {
        conditions: [
          { [ArrayOperator.ONE_OF]: { name: [] } },
          { [BasicOperator.EQUAL]: { status: "Available" } },
        ],
      },
    })

    expect(result).toEqual([docs[0]])
  })

  it("matches every row for notOneOf an empty array", () => {
    const result = runQuery(docs, {
      [ArrayOperator.NOT_ONE_OF]: { name: [] },
    })

    expect(result).toEqual(docs)
  })
})
