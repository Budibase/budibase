const { 
  createTable,
  supertest,
  createApplication,
  defaultHeaders,
  builderEndpointShouldBlockNormalUsers,
  getDocument
} = require("./couchTestUtils")

describe("/tables", () => {
  let request
  let server
  let app
  let appId

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

  describe("create", () => {
    it("returns a success message when the table is successfully created", done => {
      request
        .post(`/api/tables`)
        .send({ 
          name: "TestTable",
          key: "name",
          schema: {
            name: { type: "string" }
          }
        })
        .set(defaultHeaders(appId))
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (err, res) => {
            expect(res.res.statusMessage).toEqual("Table TestTable saved successfully.");            
            expect(res.body.name).toEqual("TestTable");
            done();
        });
      })

    it("renames all the row fields for a table when a schema key is renamed", async () => {
      const testTable = await createTable(request, appId);

      const testRow = await request
        .post(`/api/${testTable._id}/rows`)
        .send({
          name: "test"
        })
        .set(defaultHeaders(appId))
        .expect('Content-Type', /json/)
        .expect(200)

      const updatedTable = await request
        .post(`/api/tables`)
        .send({ 
          _id: testTable._id,
          _rev: testTable._rev,
          name: "TestTable",
          key: "name",
          _rename: {
            old: "name",
            updated: "updatedName"
          },
          schema: {
            updatedName: { type: "string" }
          }
        })
        .set(defaultHeaders(appId))
        .expect('Content-Type', /json/)
        .expect(200)

        expect(updatedTable.res.statusMessage).toEqual("Table TestTable saved successfully.");            
        expect(updatedTable.body.name).toEqual("TestTable");            

        const res = await request
          .get(`/api/${testTable._id}/rows/${testRow.body._id}`)
          .set(defaultHeaders(appId))
          .expect('Content-Type', /json/)
          .expect(200)

          expect(res.body.updatedName).toEqual("test");
          expect(res.body.name).toBeUndefined();
      });

      it("should apply authorization to endpoint", async () => {
        await builderEndpointShouldBlockNormalUsers({
          request,
          method: "POST",
          url: `/api/tables`,
          appId: appId,
          body: { 
            name: "TestTable",
            key: "name",
            schema: {
              name: { type: "string" }
            }
          }
        })
      })
    });

  describe("fetch", () => {
    let testTable

    beforeEach(async () => {
      testTable = await createTable(request, appId, testTable)
    });

    afterEach(() => {
      delete testTable._rev
    });

    it("returns all the tables for that instance in the response body", done => {
      request
        .get(`/api/tables`)
        .set(defaultHeaders(appId))
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (_, res) => {
            const fetchedTable = res.body[0];
            expect(fetchedTable.name).toEqual(testTable.name);            
            expect(fetchedTable.type).toEqual("table");            
            done();
        });
    })

    it("should apply authorization to endpoint", async () => {
        await builderEndpointShouldBlockNormalUsers({
          request,
          method: "GET",
          url: `/api/tables`,
          appId: appId,
        })
      })
    });

  describe("destroy", () => {
    let testTable;

    beforeEach(async () => {
      testTable = await createTable(request, appId, testTable)
    });

    afterEach(() => {
      delete testTable._rev
    });

    it("returns a success response when a table is deleted.", async done => {
      request
        .delete(`/api/tables/${testTable._id}/${testTable._rev}`)
        .set(defaultHeaders(appId))
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (_, res) => {
            expect(res.res.statusMessage).toEqual(`Table ${testTable._id} deleted.`);            
            done();
        });
      })

    it("deletes linked references to the table after deletion", async done => {
      const linkedTable = await createTable(request, appId, {
        name: "LinkedTable",
        type: "table",
        key: "name",
        schema: {
          name: {
            type: "string",
            constraints: {
              type: "string",
            },
          },
          TestTable: {
            type: "link",
            tableId: testTable._id,
            constraints: {
              type: "array"
            }
          }
        },
      })

      request
        .delete(`/api/tables/${testTable._id}/${testTable._rev}`)
        .set(defaultHeaders(appId))
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (_, res) => {
          expect(res.res.statusMessage).toEqual(`Table ${testTable._id} deleted.`);
          const dependentTable = await getDocument(appId, linkedTable._id)
          expect(dependentTable.schema.TestTable).not.toBeDefined();
          done();
        });
      })

    it("should apply authorization to endpoint", async () => {
      await builderEndpointShouldBlockNormalUsers({
        request,
        method: "DELETE",
        url: `/api/tables/${testTable._id}/${testTable._rev}`,
        appId: appId,
      })
    })

  });
});
