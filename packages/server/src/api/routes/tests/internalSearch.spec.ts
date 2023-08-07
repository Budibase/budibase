const nodeFetch = require("node-fetch")
nodeFetch.mockSearch()
import { SearchParams } from "@budibase/backend-core"
import * as search from "../../../sdk/app/rows/search/internalSearch"
import { Row } from "@budibase/types"

// this will be mocked out for _search endpoint
const PARAMS: SearchParams<Row> = {
  tableId: "ta_12345679abcdef",
  version: "1",
  bookmark: undefined,
  sort: undefined,
  sortOrder: "ascending",
  sortType: "string",
}

function checkLucene(resp: any, expected: any, params = PARAMS) {
  const query = resp.rows[0].query
  const json = JSON.parse(query)
  if (PARAMS.sort) {
    expect(json.sort).toBe(`${PARAMS.sort}<${PARAMS.sortType}>`)
  }
  if (PARAMS.bookmark) {
    expect(json.bookmark).toBe(PARAMS.bookmark)
  }
  expect(json.include_docs).toBe(true)
  expect(json.q).toBe(`${expected} AND tableId:"${params.tableId}"`)
  expect(json.limit).toBe(params.limit || 50)
}

describe("internal search", () => {
  it("default query", async () => {
    const response = await search.paginatedSearch({}, PARAMS)
    checkLucene(response, `*:*`)
  })

  it("test equal query", async () => {
    const response = await search.paginatedSearch(
      {
        equal: {
          column: "1",
        },
      },
      PARAMS
    )
    checkLucene(response, `*:* AND column:"1"`)
  })

  it("test notEqual query", async () => {
    const response = await search.paginatedSearch(
      {
        notEqual: {
          column: "1",
        },
      },
      PARAMS
    )
    checkLucene(response, `*:* AND !column:"1"`)
  })

  it("test OR query", async () => {
    const response = await search.paginatedSearch(
      {
        allOr: true,
        equal: {
          column: "2",
        },
        notEqual: {
          column: "1",
        },
      },
      PARAMS
    )
    checkLucene(response, `(column:"2" OR !column:"1")`)
  })

  it("test AND query", async () => {
    const response = await search.paginatedSearch(
      {
        equal: {
          column: "2",
        },
        notEqual: {
          column: "1",
        },
      },
      PARAMS
    )
    checkLucene(response, `(*:* AND column:"2" AND !column:"1")`)
  })

  it("test pagination query", async () => {
    const updatedParams = {
      ...PARAMS,
      limit: 100,
      bookmark: "awd",
      sort: "column",
    }
    const response = await search.paginatedSearch(
      {
        string: {
          column: "2",
        },
      },
      updatedParams
    )
    checkLucene(response, `*:* AND column:2*`, updatedParams)
  })

  it("test range query", async () => {
    const response = await search.paginatedSearch(
      {
        range: {
          column: { low: 1, high: 2 },
        },
      },
      PARAMS
    )
    checkLucene(response, `*:* AND column:[1 TO 2]`, PARAMS)
  })

  it("test empty query", async () => {
    const response = await search.paginatedSearch(
      {
        empty: {
          column: "",
        },
      },
      PARAMS
    )
    checkLucene(response, `*:* AND (*:* -column:["" TO *])`, PARAMS)
  })

  it("test notEmpty query", async () => {
    const response = await search.paginatedSearch(
      {
        notEmpty: {
          column: "",
        },
      },
      PARAMS
    )
    checkLucene(response, `*:* AND column:["" TO *]`, PARAMS)
  })

  it("test oneOf query", async () => {
    const response = await search.paginatedSearch(
      {
        oneOf: {
          column: ["a", "b"],
        },
      },
      PARAMS
    )
    checkLucene(response, `*:* AND column:("a" OR "b")`, PARAMS)
  })

  it("test contains query", async () => {
    const response = await search.paginatedSearch(
      {
        contains: {
          column: "a",
          colArr: [1, 2, 3],
        },
      },
      PARAMS
    )
    checkLucene(
      response,
      `(*:* AND column:a AND colArr:(1 AND 2 AND 3))`,
      PARAMS
    )
  })

  it("test multiple of same column", async () => {
    const response = await search.paginatedSearch(
      {
        allOr: true,
        equal: {
          "1:column": "a",
          "2:column": "b",
          "3:column": "c",
        },
      },
      PARAMS
    )
    checkLucene(response, `(column:"a" OR column:"b" OR column:"c")`, PARAMS)
  })

  it("check a weird case for lucene building", async () => {
    const response = await search.paginatedSearch(
      {
        equal: {
          "1:1:column": "a",
        },
      },
      PARAMS
    )
    checkLucene(response, `*:* AND 1\\:column:"a"`, PARAMS)
  })

  it("test containsAny query", async () => {
    const response = await search.paginatedSearch(
      {
        containsAny: {
          column: ["a", "b", "c"],
        },
      },
      PARAMS
    )
    checkLucene(response, `*:* AND column:(a OR b OR c)`, PARAMS)
  })

  it("test notContains query", async () => {
    const response = await search.paginatedSearch(
      {
        notContains: {
          column: ["a", "b", "c"],
        },
      },
      PARAMS
    )
    checkLucene(response, `*:* AND NOT column:(a AND b AND c)`, PARAMS)
  })

  it("test equal without version query", async () => {
    PARAMS.version = undefined
    const response = await search.paginatedSearch(
      {
        equal: {
          column: "1",
        },
      },
      PARAMS
    )

    const query = response.rows[0].query
    const json = JSON.parse(query)
    if (PARAMS.sort) {
      expect(json.sort).toBe(`${PARAMS.sort}<${PARAMS.sortType}>`)
    }
    if (PARAMS.bookmark) {
      expect(json.bookmark).toBe(PARAMS.bookmark)
    }
    expect(json.include_docs).toBe(true)
    expect(json.q).toBe(`*:* AND column:"1" AND tableId:${PARAMS.tableId}`)
  })
})
