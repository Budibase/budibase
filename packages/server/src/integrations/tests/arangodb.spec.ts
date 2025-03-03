import { Datasource } from "@budibase/types"
import { ArangodbConfig, ArangoDBIntegration } from "../arangodb"
import { DatabaseName, datasourceDescribe } from "./utils"

const describes = datasourceDescribe({
  only: [DatabaseName.ARANGODB],
})

if (describes.length > 0) {
  describe.each(describes)("ArangoDB Integration", ({ dsProvider }) => {
    let arangodb: ArangoDBIntegration
    let rawDatasource: Datasource

    beforeAll(async () => {
      const ds = await dsProvider()
      rawDatasource = ds.rawDatasource!
      arangodb = new ArangoDBIntegration(
        rawDatasource.config! as ArangodbConfig
      )
    })

    it("can test connection", async () => {
      const result = await arangodb.testConnection()
      expect(result.connected).toBe(true)
    })

    it("can create and read documents", async () => {
      await arangodb.create({ json: { name: "Fred" } })
      const result = await arangodb.read({
        sql: `FOR doc IN ${rawDatasource.config!.collection} RETURN doc`,
      })
      expect(result).toEqual([expect.objectContaining({ name: "Fred" })])
    })
  })
}
