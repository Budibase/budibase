import Sql from "../sql"
import {
  EnrichedQueryJson,
  FieldType,
  Operation,
  QuerySortJson,
  SortOrder,
  SortType,
  SqlClient,
  SqlQuery,
  Table,
  TableSourceType,
} from "@budibase/types"

const table: Table = {
  _id: "tbl",
  type: "table",
  name: "tbl",
  sourceType: TableSourceType.EXTERNAL,
  sourceId: "ds",
  primary: ["id"],
  schema: {
    id: { name: "id", type: FieldType.NUMBER, autocolumn: true },
    approvers: { name: "approvers", type: FieldType.STRING },
    createdAt: { name: "createdAt", type: FieldType.STRING },
  },
}

const buildQuery = (sort: QuerySortJson): EnrichedQueryJson => ({
  operation: Operation.READ,
  table,
  tables: { [table.name]: table },
  filters: {},
  sort,
  paginate: { limit: 25, page: 1 },
  relationships: [],
  resource: { fields: [] },
})

const awaitingFirst: QuerySortJson = {
  approvers: {
    direction: SortOrder.DESCENDING,
    type: SortType.STRING,
    containsValue: "us_1",
  },
  createdAt: { direction: SortOrder.ASCENDING, type: SortType.STRING },
}

describe("containsValue sort", () => {
  it("orders SQLite rows containing the value first, ahead of the other sort keys", () => {
    const result = new Sql(SqlClient.SQL_LITE)._query(
      buildQuery(awaitingFirst)
    ) as SqlQuery

    expect(result.sql).toMatch(
      /order by \(`[^`]+`\.`approvers` LIKE \?\) desc, `[^`]+`\.`createdAt` asc/
    )
    expect(result.bindings).toContain('%"us_1"%')
  })

  it("skips the containsValue sort on other databases and keeps the rest", () => {
    const result = new Sql(SqlClient.POSTGRES)._query(
      buildQuery(awaitingFirst)
    ) as SqlQuery

    expect(result.sql).not.toContain("LIKE")
    expect(result.sql).toMatch(/order by "[^"]+"\."createdAt" asc/)
    expect(result.bindings).not.toContain('%"us_1"%')
  })
})
