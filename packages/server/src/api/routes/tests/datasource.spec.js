const { 
  supertest,
} = require("./utilities")
let TestConfig = require("./utilities/TestConfiguration")
let { basicDatasource } = require("./utilities/structures")
let { checkBuilderEndpoint } = require("./utilities/TestFunctions")

describe("/datasources", () => {
  let request
  let server
  let config

  beforeAll(async () => {
    ({ request, server } = await supertest())
    config = new TestConfig(request)
  });

  afterAll(() => {
    server.close()
  })

  beforeEach(async () => {
    await config.init()
  });

  describe("create", () => {
    it("should create a new datasource", async () => {
      const res = await request
        .post(`/api/datasources`)
        .send(basicDatasource())
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)

        expect(res.res.statusMessage).toEqual("Datasource saved successfully.");            
        expect(res.body.name).toEqual("Test");
      })
    });

  describe("fetch", () => {
    let datasource

    beforeEach(async () => {
      datasource = await config.createDatasource()
    });

    afterEach(() => {
      delete datasource._rev
    });

    it("returns all the datasources from the server", async () => {
      const res = await request
        .get(`/api/datasources`)
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)

        const datasources = res.body
        expect(datasources).toEqual([
          {
            "_id": datasources[0]._id,
            "_rev": datasources[0]._rev,
            ...basicDatasource()
          }
        ]);            
    })

    it("should apply authorization to endpoint", async () => {
        await checkBuilderEndpoint({
          config,
          method: "GET",
          url: `/api/datasources`,
        })
      })
    });

  describe("destroy", () => {
    let datasource

    beforeEach(async () => {
      datasource = await config.createDatasource()
    });

    afterEach(() => {
      delete datasource._rev
    });

    it("deletes queries for the datasource after deletion and returns a success message", async () => {
      await config.createQuery()

      await request
        .delete(`/api/datasources/${datasource._id}/${datasource._rev}`)
        .set(config.defaultHeaders())
        .expect(200)

      const res = await request
        .get(`/api/datasources`)
        .set(config.defaultHeaders())
        .expect('Content-Type', /json/)
        .expect(200)
      
        expect(res.body).toEqual([])
    })

    it("should apply authorization to endpoint", async () => {
      await checkBuilderEndpoint({
        config,
        method: "DELETE",
        url: `/api/datasources/${datasource._id}/${datasource._rev}`,
      })
    })

  });
});
