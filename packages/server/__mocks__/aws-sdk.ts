import fs from "fs"
import { join } from "path"

module AwsMock {
  const aws: any = {}

  const response = (body: any, extra?: any) => () => ({
    promise: () => body,
    ...extra,
  })

  function DocumentClient() {
    // @ts-ignore
    this.put = jest.fn(response({}))
    // @ts-ignore
    this.query = jest.fn(
      response({
        Items: [],
      })
    )
    // @ts-ignore
    this.scan = jest.fn(
      response({
        Items: [
          {
            Name: "test",
          },
        ],
      })
    )
    // @ts-ignore
    this.get = jest.fn(response({}))
    // @ts-ignore
    this.update = jest.fn(response({}))
    // @ts-ignore
    this.delete = jest.fn(response({}))
  }

  function S3() {
    // @ts-ignore
    this.listObjects = jest.fn(
      response({
        Contents: [],
      })
    )

    // @ts-ignore
    this.createBucket = jest.fn(
      response({
        Contents: {},
      })
    )

    // @ts-ignore
    this.deleteObjects = jest.fn(
      response({
        Contents: {},
      })
    )

    // @ts-ignore
    this.getSignedUrl = (operation, params) => {
      return `http://example.com/${params.Bucket}/${params.Key}`
    }

    // @ts-ignore
    this.headBucket = jest.fn(
      response({
        Contents: {},
      })
    )

    // @ts-ignore
    this.upload = jest.fn(
      response({
        Contents: {},
      })
    )

    // @ts-ignore
    this.getObject = jest.fn(
      response(
        {
          Body: "",
        },
        {
          createReadStream: jest
            .fn()
            .mockReturnValue(
              fs.createReadStream(join(__dirname, "aws-sdk.ts"))
            ),
        }
      )
    )
  }

  aws.DynamoDB = { DocumentClient }
  aws.S3 = S3
  aws.config = { update: jest.fn() }

  module.exports = aws
}
