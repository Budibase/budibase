import nock from "nock"
import { DynamoDBIntegration } from "../dynamodb"
import { enrichContext } from "../../sdk/workspace/queries/queries"

jest.mock("../../sdk/utils", () => ({
  getEnvironmentVariables: jest.fn(() => ({})),
}))

describe("DynamoDB null binding serialization", () => {
  it("marshals native null as a NULL attribute while keeping text and falsy values", async () => {
    const integration = new DynamoDBIntegration({
      accessKeyId: "test",
      secretAccessKey: "test",
      region: "us-east-1",
      endpoint: "https://example.com",
    })
    const request = nock("https://example.com")
      .post("/", {
        TableName: "Items",
        Item: {
          Id: { N: "1" },
          native: { NULL: true },
          text: { S: "null" },
          zero: { N: "0" },
          disabled: { BOOL: false },
        },
      })
      .reply(200, {})
    const query = await enrichContext({
      table: "Items",
      json: '{"Item":{"Id":1,"native":null,"text":"null","zero":0,"disabled":false}}',
    })

    await integration.create({ table: query.table, json: query.json })

    expect(request.isDone()).toBe(true)
  })
})
