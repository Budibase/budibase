import { buildQuery } from "../filters"
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
