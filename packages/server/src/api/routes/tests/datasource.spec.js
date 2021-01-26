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
}

describe("/datasources", () => {
  let request
  let server
  let app
  let appId
  let datasource

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
    it("should create a new datasource", async () => {
      const res = await request
        .post(`/api/datasources`)
        .send(TEST_DATASOURCE)
        .set(defaultHeaders(appId))
        .expect('Content-Type', /json/)
        .expect(200)

        expect(res.res.statusMessage).toEqual("Datasource saved successfully.");            
        expect(res.body.name).toEqual("Test");
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

    it("returns all the datasources from the server", async () => {
      const res = await request
        .get(`/api/datasources`)
        .set(defaultHeaders(appId))
        .expect('Content-Type', /json/)
        .expect(200)

        const datasources = res.body;
        expect(datasources).toEqual([
          {
            "_rev": datasources[0]._rev,
            ...TEST_DATASOURCE
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

    it("deletes queries for the datasource after deletion and returns a success message", async () => {
      await createQuery(datasource.id)

      await request
        .delete(`/api/datasources/${datasource.id}/${datasource.rev}`)
        .set(defaultHeaders(appId))
        .expect(200)

      const res = await request
        .get(`/api/datasources`)
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
