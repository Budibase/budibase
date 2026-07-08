import { buildQuery, runQuery } from "../filters"
import {
  BasicOperator,
  EmptyFilterOption,
  FieldType,
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

describe("date rangeHigh includes the whole day", () => {
  const rangeFor = (value: string) => {
    const query = buildQuery([
      {
        field: "dob",
        type: FieldType.DATETIME,
        operator: "rangeHigh",
        value,
      },
    ])
    return query.$and!.conditions![0].$and!.conditions![0].range!.dob
  }

  it("extends a date-only high bound to the end of that day", () => {
    expect(rangeFor("2020-01-05")).toEqual({
      high: "2020-01-05T23:59:59.999Z",
    })
  })

  it("leaves a high bound with an explicit time untouched", () => {
    expect(rangeFor("2020-01-05T14:30:00.000Z")).toEqual({
      high: "2020-01-05T14:30:00.000Z",
    })
  })

  it("matches rows from later in the target day", () => {
    const docs = [
      { id: 1, dob: "2020-01-05T00:00:00.000Z" },
      { id: 2, dob: "2020-01-05T23:59:00.000Z" },
      { id: 3, dob: "2020-01-06T00:01:00.000Z" },
    ]
    const query = buildQuery([
      {
        field: "dob",
        type: FieldType.DATETIME,
        operator: "rangeHigh",
        value: "2020-01-05",
      },
    ])
    const result = runQuery(docs, query)
    expect(result.map(d => d.id)).toEqual([1, 2])
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
