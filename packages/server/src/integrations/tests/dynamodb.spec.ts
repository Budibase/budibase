import { Datasource } from "@budibase/types"
import { DynamoDBConfig, DynamoDBIntegration } from "../dynamodb"
import { DatabaseName, datasourceDescribe } from "./utils"
import {
  CreateTableCommandInput,
  DynamoDB,
  DynamoDBClientConfig,
} from "@aws-sdk/client-dynamodb"

const describes = datasourceDescribe({ only: [DatabaseName.DYNAMODB] })

async function createTable(client: DynamoDB, req: CreateTableCommandInput) {
  try {
    await client.deleteTable({ TableName: req.TableName })
  } catch (e: any) {
    if (e.name !== "ResourceNotFoundException") {
      throw e
    }
  }

  return await client.createTable(req)
}

if (describes.length > 0) {
  describe.each(describes)("DynamoDB Integration", ({ dsProvider }) => {
    let table = "Users"
    let rawDatasource: Datasource
    let dynamodb: DynamoDBIntegration

    function item(json: Record<string, any>) {
      return { table, json: { Item: json } }
    }

    function key(json: Record<string, any>) {
      return { table, json: { Key: json } }
    }

    beforeEach(async () => {
      const ds = await dsProvider()
      rawDatasource = ds.rawDatasource!
      dynamodb = new DynamoDBIntegration(
        rawDatasource.config! as DynamoDBConfig
      )

      const config: DynamoDBClientConfig = {
        credentials: {
          accessKeyId: "test",
          secretAccessKey: "test",
        },
        region: "us-east-1",
        endpoint: rawDatasource.config!.endpoint,
      }

      const client = new DynamoDB(config)
      await createTable(client, {
        TableName: table,
        KeySchema: [{ AttributeName: "Id", KeyType: "HASH" }],
        AttributeDefinitions: [{ AttributeName: "Id", AttributeType: "N" }],
        ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
      })
    })

    it("can create and read a record", async () => {
      await dynamodb.create(item({ Id: 1, Name: "John" }))

      const resp = await dynamodb.get(key({ Id: 1 }))
      expect(resp.Item).toEqual({ Id: 1, Name: "John" })
    })

    it("can scan", async () => {
      await dynamodb.create(item({ Id: 1, Name: "John" }))
      await dynamodb.create(item({ Id: 2, Name: "Jane" }))
      await dynamodb.create(item({ Id: 3, Name: "Jack" }))

      const resp = await dynamodb.scan({ table, json: {}, index: null })
      expect(resp).toEqual(
        expect.arrayContaining([
          { Id: 1, Name: "John" },
          { Id: 2, Name: "Jane" },
          { Id: 3, Name: "Jack" },
        ])
      )
    })

    it("can update", async () => {
      await dynamodb.create(item({ Id: 1, Foo: "John" }))
      await dynamodb.update({
        table,
        json: {
          Key: { Id: 1 },
          UpdateExpression: "SET Foo = :foo",
          ExpressionAttributeValues: { ":foo": "Jane" },
        },
      })

      const updatedRecord = await dynamodb.get(key({ Id: 1 }))
      expect(updatedRecord.Item).toEqual({ Id: 1, Foo: "Jane" })
    })

    it("can delete", async () => {
      await dynamodb.create(item({ Id: 1, Name: "John" }))
      await dynamodb.delete(key({ Id: 1 }))

      const deletedRecord = await dynamodb.get(key({ Id: 1 }))
      expect(deletedRecord.Item).toBeUndefined()
    })
  })
}
