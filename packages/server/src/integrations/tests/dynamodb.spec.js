const AWS = require("aws-sdk")
const DynamoDBIntegration = require("../dynamodb")
jest.mock("aws-sdk")

class TestConfiguration {
  constructor(config = {}) {
    this.integration = new DynamoDBIntegration.integration(config) 
  }
}

describe("DynamoDB Integration", () => {
  let config 
  let tableName = "Users"

  beforeEach(() => {
    config = new TestConfiguration()
  })

  it("calls the create method with the correct params", async () => {
    const response = await config.integration.create({ 
      table: tableName,
      json: {
        Name: "John"
      }
    })
    expect(config.integration.client.put).toHaveBeenCalledWith({
      TableName: tableName,
      Name: "John"
    })
  })

  it("calls the read method with the correct params", async () => {
    const indexName = "Test"

    const response = await config.integration.read({ 
      table: tableName,
      index: indexName, 
      json: {}
    })
    expect(config.integration.client.query).toHaveBeenCalledWith({
      TableName: tableName,
      IndexName: indexName,
    })
    expect(response).toEqual([])
  })

  it("calls the scan method with the correct params", async () => {
    const indexName = "Test"

    const response = await config.integration.scan({ 
      table: tableName,
      index: indexName, 
      json: {}
    })
    expect(config.integration.client.scan).toHaveBeenCalledWith({
      TableName: tableName,
      IndexName: indexName,
    })
    expect(response).toEqual([{
      Name: "test"
    }])
  })

  it("calls the get method with the correct params", async () => {
    const response = await config.integration.get({ 
      table: tableName,
      json: {
        Id: 123
      }
    })

    expect(config.integration.client.get).toHaveBeenCalledWith({
      TableName: tableName,
      Id: 123
    })
  })

  it("calls the update method with the correct params", async () => {
    const response = await config.integration.update({ 
      table: tableName,
      json: {
        Name: "John"
      }
    })
    expect(config.integration.client.update).toHaveBeenCalledWith({
      TableName: tableName,
      Name: "John"
    })
  })

  it("calls the delete method with the correct params", async () => {
    const response = await config.integration.delete({ 
      table: tableName,
      json: {
        Name: "John"
      }
    })
    expect(config.integration.client.delete).toHaveBeenCalledWith({
      TableName: tableName,
      Name: "John"
    })
  })
})