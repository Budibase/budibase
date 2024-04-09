import * as setup from "./utilities"
import { checkBuilderEndpoint } from "./utilities/TestFunctions"
import { getCachedVariable } from "../../../threads/utils"
import { context, events } from "@budibase/backend-core"
import sdk from "../../../sdk"

import tk from "timekeeper"
import { mocks } from "@budibase/backend-core/tests"
import { QueryPreview, SourceName } from "@budibase/types"

tk.freeze(mocks.date.MOCK_DATE)

let { basicDatasource } = setup.structures

describe("/datasources", () => {
  let request = setup.getRequest()
  let config = setup.getConfig()
  let datasource: any

  afterAll(setup.afterAll)

  async function setupTest() {
    await config.init()
    datasource = await config.createDatasource()
    jest.clearAllMocks()
  }

  beforeAll(setupTest)

  describe("create", () => {
    it("should create a new datasource", async () => {
      const res = await request
        .post(`/api/datasources`)
        .send(basicDatasource())
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)

      expect(res.body.datasource.name).toEqual("Test")
      expect(res.body.errors).toEqual({})
      expect(events.datasource.created).toHaveBeenCalledTimes(1)
    })

    it("should fail if the datasource is invalid", async () => {
      await config.api.datasource.create(
        {
          name: "Test",
          type: "test",
          source: "invalid" as SourceName,
          config: {},
        },
        {
          status: 500,
          body: {
            message: "No datasource implementation found.",
          },
        }
      )
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
      expect(events.datasource.updated).toHaveBeenCalledTimes(1)
    })

    describe("dynamic variables", () => {
      async function preview(
        datasource: any,
        fields: { path: string; queryString: string }
      ) {
        const queryPreview: QueryPreview = {
          fields,
          datasourceId: datasource._id,
          parameters: [],
          transformer: null,
          queryVerb: "read",
          name: datasource.name,
          schema: {},
          readable: true,
        }
        return config.api.query.preview(queryPreview)
      }

      it("should invalidate changed or removed variables", async () => {
        const { datasource, query } = await config.dynamicVariableDatasource()
        // preview once to cache variables
        await preview(datasource, {
          path: "www.example.com",
          queryString: "test={{ variable3 }}",
        })
        // check variables in cache
        let contents = await getCachedVariable(query._id!, "variable3")
        expect(contents.rows.length).toEqual(1)

        // update the datasource to remove the variables
        datasource.config!.dynamicVariables = []
        const res = await request
          .put(`/api/datasources/${datasource._id}`)
          .send(datasource)
          .set(config.defaultHeaders())
          .expect("Content-Type", /json/)
          .expect(200)
        expect(res.body.errors).toBeUndefined()

        // check variables no longer in cache
        contents = await getCachedVariable(query._id!, "variable3")
        expect(contents).toBe(null)
      })
    })
  })

  describe("fetch", () => {
    beforeAll(setupTest)

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

  describe("destroy", () => {
    beforeAll(setupTest)

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
      expect(events.datasource.deleted).toHaveBeenCalledTimes(1)
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "DELETE",
        url: `/api/datasources/${datasource._id}/${datasource._rev}`,
      })
    })
  })

  describe("check secret replacement", () => {
    async function makeDatasource() {
      datasource = basicDatasource()
      datasource.datasource.config.password = "testing"
      const res = await request
        .post(`/api/datasources`)
        .send(datasource)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      return res.body.datasource
    }

    it("should save a datasource with password", async () => {
      const datasource = await makeDatasource()
      expect(datasource.config.password).toBe("--secret-value--")
    })

    it("should not the password on update with the --secret-value--", async () => {
      const datasource = await makeDatasource()
      await request
        .put(`/api/datasources/${datasource._id}`)
        .send(datasource)
        .set(config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(200)
      await context.doInAppContext(config.getAppId(), async () => {
        const dbDatasource: any = await sdk.datasources.get(datasource._id)
        expect(dbDatasource.config.password).toBe("testing")
      })
    })
  })
})
