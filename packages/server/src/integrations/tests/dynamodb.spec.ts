import { Datasource } from "@budibase/types"
import { DynamoDBConfig, DynamoDBIntegration } from "../dynamodb"
import { DatabaseName, datasourceDescribe } from "./utils"

const describes = datasourceDescribe({ only: [DatabaseName.DYNAMODB] })

if (describes.length > 0) {
  describe.each(describes)("DynamoDB Integration", ({ dsProvider }) => {
    let tableName = "Users"
    let rawDatasource: Datasource
    let dynamodb: DynamoDBIntegration

    beforeEach(async () => {
      const ds = await dsProvider()
      rawDatasource = ds.rawDatasource!
      dynamodb = new DynamoDBIntegration(
        rawDatasource.config! as DynamoDBConfig
      )
    })

    it.only("calls the create method with the correct params", async () => {
      await dynamodb.create({
        table: tableName,
        json: {
          Name: "John",
        },
      })
    })

    it("calls the read method with the correct params", async () => {
      const indexName = "Test"

      const response = await dynamodb.read({
        table: tableName,
        index: indexName,
        json: {},
      })
      expect(config.integration.client.query).toHaveBeenCalledWith({
        TableName: tableName,
        IndexName: indexName,
      })
      expect(response).toEqual([])
    })

    it("calls the scan method with the correct params", async () => {
      const indexName = "Test"

      const response = await dynamodb.scan({
        table: tableName,
        index: indexName,
        json: {},
      })
      expect(config.integration.client.scan).toHaveBeenCalledWith({
        TableName: tableName,
        IndexName: indexName,
      })
      expect(response).toEqual([])
    })

    it("calls the get method with the correct params", async () => {
      await dynamodb.get({
        table: tableName,
        json: {
          Id: 123,
        },
      })

      expect(config.integration.client.get).toHaveBeenCalledWith({
        TableName: tableName,
        Id: 123,
      })
    })

    it("calls the update method with the correct params", async () => {
      await dynamodb.update({
        table: tableName,
        json: {
          Name: "John",
        },
      })
      expect(config.integration.client.update).toHaveBeenCalledWith({
        TableName: tableName,
        Name: "John",
      })
    })

    it("calls the delete method with the correct params", async () => {
      await dynamodb.delete({
        table: tableName,
        json: {
          Name: "John",
        },
      })
      expect(config.integration.client.delete).toHaveBeenCalledWith({
        TableName: tableName,
        Name: "John",
      })
    })

    it("configures the dynamoDB constructor based on an empty endpoint parameter", async () => {
      const config = {
        region: "us-east-1",
        accessKeyId: "test",
        secretAccessKey: "test",
      }

      const integration: any = new DynamoDBIntegration.integration(config)

      expect(integration.config).toEqual({
        currentClockSkew: true,
        ...config,
      })
    })

    it("configures the dynamoDB constructor based on a localhost endpoint parameter", async () => {
      const config = {
        region: "us-east-1",
        accessKeyId: "test",
        secretAccessKey: "test",
        endpoint: "localhost:8080",
      }

      const integration: any = new DynamoDBIntegration.integration(config)

      expect(integration.config).toEqual({
        region: "us-east-1",
        currentClockSkew: true,
        endpoint: "localhost:8080",
      })
    })

    it("configures the dynamoDB constructor based on a remote endpoint parameter", async () => {
      const config = {
        region: "us-east-1",
        accessKeyId: "test",
        secretAccessKey: "test",
        endpoint: "dynamodb.aws.foo.net",
      }

      const integration = new DynamoDBIntegration.integration(config)

      // @ts-ignore
      expect(integration.config).toEqual({
        currentClockSkew: true,
        ...config,
      })
    })
  })
}
