jest.mock("pg")
import * as setup from "./utilities"
import { checkBuilderEndpoint } from "./utilities/TestFunctions"
import { checkCacheForDynamicVariable } from "../../../threads/utils"
import { events } from "@budibase/backend-core"

let { basicDatasource } = setup.structures
const pg = require("pg")

describe("/datasources", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()
  let datasource: any

  afterAll(setup.afterAll)

  beforeEach(async () => {
    await config.init()
    datasource = await config.createDatasource()
    jest.clearAllMocks()
  })

  describe("create", () => {
    it("should create a new datasource", async () => {
      const res = await request
        .post(`/api/datasources`)
        .send(basicDatasource())
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body.datasource.name).toEqual("Test")
      expect(res.body.errors).toBeUndefined()
      expect(events.datasource.created).toBeCalledTimes(1)
    })
  })

  describe("update", () => {
    it("should update an existing datasource", async () => {
      datasource.name = "Updated Test"
      const res = await request
        .put(`/api/datasources/${datasource._id}`)
        .send(datasource)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body.datasource.name).toEqual("Updated Test")
      expect(res.body.errors).toBeUndefined()
      expect(events.datasource.updated).toBeCalledTimes(1)
    })

    describe("dynamic variables", () => {
      async function preview(
        datasource: any,
        fields: { path: string; queryString: string }
      ) {
        return config.previewQuery(request, config, datasource, fields)
      }

      it("should invalidate changed or removed variables", async () => {
        const { datasource, query } = await config.dynamicVariableDatasource()
        // preview once to cache variables
        await preview(datasource, {
          path: "www.test.com",
          queryString: "test={{ variable3 }}",
        })
        // check variables in cache
        let contents = await checkCacheForDynamicVariable(
          query._id,
          "variable3"
        )
        expect(contents.rows.length).toEqual(1)

        // update the datasource to remove the variables
        datasource.config.dynamicVariables = []
        const res = await request
          .put(`/api/datasources/${datasource._id}`)
          .send(datasource)
          .set(config.defaultHeaders())
          .expect("Content-Type", /json/)
          .expect(200)
        expect(res.body.errors).toBeUndefined()

        // check variables no longer in cache
        contents = await checkCacheForDynamicVariable(query._id, "variable3")
        expect(contents).toBe(null)
      })
    })
  })

  describe("fetch", () => {
    it("returns all the datasources from the server", async () => {
      const res = await request
        .get(`/api/datasources`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      const datasources = res.body

      // remove non-deterministic fields
      for (let source of datasources) {
        delete source._id
        delete source._rev
      }

      expect(datasources).toMatchSnapshot()
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "GET",
        url: `/api/datasources`,
      })
    })
  })

  describe("find", () => {
    it("should be able to find a datasource", async () => {
      const res = await request
        .get(`/api/datasources/${datasource._id}`)
        .set(config.defaultHeaders())
        .expect(200)
      expect(res.body._rev).toBeDefined()
      expect(res.body._id).toEqual(datasource._id)
    })
  })

  describe("query", () => {
    it("should be able to query a pg datasource", async () => {
      const res = await request
        .post(`/api/datasources/query`)
        .send({
          endpoint: {
            datasourceId: datasource._id,
            operation: "READ",
            // table name below
            entityId: "users",
          },
          resource: {
            fields: ["users.name", "users.age"],
          },
          filters: {
            string: {
              name: "John",
            },
          },
        })
        .set(config.defaultHeaders())
        .expect(200)
      // this is mock data, can't test it
      expect(res.body).toBeDefined()
      const expSql = `select "users"."name" as "users.name", "users"."age" as "users.age" from (select * from "users" where "users"."name" ilike $1 limit $2) as "users"`
      expect(pg.queryMock).toHaveBeenCalledWith(expSql, ["John%", 5000])
    })
  })

  describe("destroy", () => {
    it("deletes queries for the datasource after deletion and returns a success message", async () => {
      await config.createQuery()

      await request
        .delete(`/api/datasources/${datasource._id}/${datasource._rev}`)
        .set(config.defaultHeaders())
        .expect(200)

      const res = await request
        .get(`/api/datasources`)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body.length).toEqual(1)
      expect(events.datasource.deleted).toBeCalledTimes(1)
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "DELETE",
        url: `/api/datasources/${datasource._id}/${datasource._rev}`,
      })
    })
  })
})
