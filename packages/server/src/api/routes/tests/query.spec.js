const { 
  supertest,
  createApplication,
  defaultHeaders,
  builderEndpointShouldBlockNormalUsers,
  getDocument,
  insertDocument
} = require("./couchTestUtils")
let { generateDatasourceID, generateQueryID } = require("../../../db/utils")

const DATASOURCE_ID = generateDatasourceID()
const TEST_DATASOURCE = {
  _id: DATASOURCE_ID,
  type: "datasource",
  name: "Test",
  source: "POSTGRES",
  config: {},
  type: "datasource",
}

const TEST_QUERY = {
  _id: generateQueryID(DATASOURCE_ID),
  datasourceId: DATASOURCE_ID,
  name:"New Query",
  parameters:[],
  fields:{},
  schema:{},
  queryVerb:"read",
  queryType:"Table",
}

describe("/queries", () => {
  let request
  let server
  let app
  let appId
  let datasource
  let query

  beforeAll(async () => {
    ({ request, server } = await supertest())
  });

  afterAll(() => {
    server.close()
  })

  beforeEach(async () => {
    app = await createApplication(request)
    appId = app.instance._id
  });

  async function createDatasource() {
    return await insertDocument(appId, TEST_DATASOURCE)
  }

  async function createQuery() {
    return await insertDocument(appId, TEST_QUERY)
  }

  describe("create", () => {
    it("should create a new query", async () => {
      const res = await request
        .post(`/api/queries`)
        .send(TEST_QUERY)
        .set(defaultHeaders(appId))
        .expect('Content-Type', /json/)
        .expect(200)

        expect(res.res.statusMessage).toEqual(`Query ${TEST_QUERY.name} saved successfully.`);            
        expect(res.body).toEqual({
          _rev: res.body._rev,
          ...TEST_QUERY,
        });
      })
    });

  describe("fetch", () => {
    let datasource

    beforeEach(async () => {
      datasource = await createDatasource()
    });

    afterEach(() => {
      delete datasource._rev
    });

    it("returns all the queries from the server", async () => {
      const query = await createQuery()
      const res = await request
        .get(`/api/queries`)
        .set(defaultHeaders(appId))
        .expect('Content-Type', /json/)
        .expect(200)

        const queries = res.body;
        expect(queries).toEqual([
          {
            "_rev": query.rev,
            ...TEST_QUERY
          }
        ]);            
    })

    it("should apply authorization to endpoint", async () => {
        await builderEndpointShouldBlockNormalUsers({
          request,
          method: "GET",
          url: `/api/datasources`,
          appId: appId,
        })
      })
    });

  describe("destroy", () => {
    let datasource;

    beforeEach(async () => {
      datasource = await createDatasource()
    });

    afterEach(() => {
      delete datasource._rev
    });

    it("deletes a query and returns a success message", async () => {
      const query = await createQuery()

      await request
        .delete(`/api/queries/${query.id}/${query.rev}`)
        .set(defaultHeaders(appId))
        .expect(200)

      const res = await request
        .get(`/api/queries`)
        .set(defaultHeaders(appId))
        .expect('Content-Type', /json/)
        .expect(200)
      
        expect(res.body).toEqual([])
    })

    it("should apply authorization to endpoint", async () => {
      await builderEndpointShouldBlockNormalUsers({
        request,
        method: "DELETE",
        url: `/api/datasources/${datasource._id}/${datasource._rev}`,
        appId: appId,
      })
    })
  });
});
