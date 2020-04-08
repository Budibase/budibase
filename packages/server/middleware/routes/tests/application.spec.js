const mockCouch = require("mock-couch");
const request = require("supertest");

describe("/applications", () => {
  beforeEach(() => {
    const couchdb = mockCouch.createServer();
    couchdb.listen(5984);

    // This creates a db for Mock Couch. The db is nothing but an array of objects.
    // If we provide an object with an _id property, it will use it. Otherwise, it will create a random one.
    couchdb.addDB("people", [
      { name: "one name", lastname: "one lastname" },
      { _id: "4568797890", name: "second name", lastname: "other lastname" },
    ]);
  });

  describe("create", () => {
    it("returns a success message when the application is successfully created", () => {

    })
  });

  describe("destroy", () => {
    it("returns a success message when the application is successfully deleted", () => {

    })
  });
});
