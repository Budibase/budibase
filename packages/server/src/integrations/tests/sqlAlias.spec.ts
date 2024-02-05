import { QueryJson } from "@budibase/types"
import { join } from "path"
import Sql from "../base/sql"
import { SqlClient } from "../utils"

describe("Captures of real examples", () => {
  const limit = 5000

  function getJson(name: string): QueryJson {
    return require(join(__dirname, "sqlQueryJson", name)) as QueryJson
  }

  it("should handle basic retrieval", () => {
    const queryJson = getJson("")
  })

  it("should handle filtering by relationship", () => {
    const queryJson = getJson("filterByRelationship.json")
    let query = new Sql(SqlClient.POSTGRES, limit)._query(queryJson)
    expect(query).toEqual({
      bindings: [100, "assembling", limit],
      sql: `select "a"."productname" as "a.productname", "a"."productid" as "a.productid", "b"."executorid" as "b.executorid", "b"."taskname" as "b.taskname", "b"."taskid" as "b.taskid", "b"."completed" as "b.completed", "b"."qaid" as "b.qaid" from (select * from "products" as "a" order by "a"."productname" asc limit $1) as "a" left join "products_tasks" as "c" on "a"."productid" = "c"."productid" left join "tasks" as "b" on "b"."taskid" = "c"."taskid" where "b"."taskname" = $2 order by "a"."productname" asc limit $3`,
    })
  })
})
