import type { Query } from "@budibase/types"
import { basicQuery } from "../../../../tests/utilities/structures"
import type { QueryEventParameters } from "../../../../threads/definitions"
import { enrichParameters } from "../parameters"

describe("query parameter enrichment", () => {
  it.each([
    '"{{ user.email }}"',
    '{"nested":"{{ user.email }}"}',
    '["safe", "{{ user.email }}"]',
    '{"nested":[{"value":"{{ user.email }}"}]}',
  ])("rejects runtime bindings in %s", value => {
    const requestParameters: QueryEventParameters = JSON.parse(
      `{"input":${value}}`
    )

    expect(() =>
      enrichParameters({ query: basicQuery("datasource"), requestParameters })
    ).toThrow(
      "Parameter 'input' input contains a handlebars binding - this is not allowed."
    )
  })

  it("preserves nested runtime values without bindings", () => {
    const requestParameters: QueryEventParameters = JSON.parse(
      '{"input":{"nested":["safe",42,null,true,{"value":"text"}]}}'
    )

    expect(
      enrichParameters({ query: basicQuery("datasource"), requestParameters })
    ).toEqual(requestParameters)
  })

  it("accepts queries with no parameter definitions", () => {
    const query: Query = JSON.parse(
      JSON.stringify({ ...basicQuery("datasource"), parameters: undefined })
    )

    expect(enrichParameters({ query })).toEqual({})
  })

  it("preserves configured bindings in defaults", () => {
    const query = {
      ...basicQuery("datasource"),
      parameters: [{ name: "input", default: "{{ user.email }}" }],
    }

    expect(enrichParameters({ query })).toEqual({ input: "{{ user.email }}" })
  })
})
