import { default as FirebaseIntegration } from "../firebase"

jest.mock("@google-cloud/firestore")

class TestConfiguration {
  integration: any

  constructor(config: any = {}) {
    this.integration = new FirebaseIntegration.integration(config)
  }
}

describe("Firebase Integration", () => {
  let config: any
  let tableName = "Users"

  beforeEach(() => {
    config = new TestConfiguration({
      serviceAccount: "{}",
    })
  })

  it("calls the create method with the correct params", async () => {
    await config.integration.create({
      table: tableName,
      json: {
        Name: "Test Name",
      },
      extra: {
        collection: "test",
      },
    })
    expect(config.integration.client.collection).toHaveBeenCalledWith("test")
    expect(config.integration.client.set).toHaveBeenCalledWith({
      Name: "Test Name",
      id: "test_id",
    })
  })

  it("calls the read method with the correct params", async () => {
    const response = await config.integration.read({
      table: tableName,
      json: {
        Name: "Test",
      },
      extra: {
        collection: "test",
        filterField: "field",
        filter: "==",
        filterValue: "value",
      },
    })
    expect(config.integration.client.collection).toHaveBeenCalledWith("test")
    expect(config.integration.client.where).toHaveBeenCalledWith(
      "field",
      "==",
      "value"
    )
    expect(response).toEqual([{ result: "test" }])
  })

  it("calls the update method with the correct params", async () => {
    const response = await config.integration.update({
      table: tableName,
      json: {
        id: "test",
        Name: "Test",
      },
      extra: {
        collection: "test",
      },
    })
    expect(config.integration.client.collection).toHaveBeenCalledWith("test")
    expect(config.integration.client.update).toHaveBeenCalledWith({
      Name: "Test",
      id: "test",
    })
    expect(response).toEqual({
      result: "test",
    })
  })

  it("calls the delete method with the correct params", async () => {
    await config.integration.delete({
      table: tableName,
      json: {
        id: "test",
        Name: "Test",
      },
      extra: {
        collection: "test",
      },
    })
    expect(config.integration.client.collection).toHaveBeenCalledWith("test")
    expect(config.integration.client.doc).toHaveBeenCalledWith("test")
    expect(config.integration.client.delete).toHaveBeenCalled()
  })
})
