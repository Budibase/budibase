import { SourceName, type Datasource } from "@budibase/types"
import { isSQL } from "../integrations"

describe("isSQL", () => {
  it("treats Snowflake as a SQL datasource", () => {
    expect(isSQL({ source: SourceName.SNOWFLAKE } as Datasource)).toBe(true)
  })
})
