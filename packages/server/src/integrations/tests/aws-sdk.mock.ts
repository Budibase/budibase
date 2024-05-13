const response = (body: any, extra?: any) => () => ({
  promise: () => body,
  ...extra,
})

class DocumentClient {
  put = jest.fn(response({}))
  query = jest.fn(
    response({
      Items: [],
    })
  )
  scan = jest.fn(
    response({
      Items: [
        {
          Name: "test",
        },
      ],
    })
  )
  get = jest.fn(response({}))
  update = jest.fn(response({}))
  delete = jest.fn(response({}))
}

class S3 {
  listObjects = jest.fn(
    response({
      Contents: [],
    })
  )
  createBucket = jest.fn(
    response({
      Contents: {},
    })
  )
  deleteObjects = jest.fn(
    response({
      Contents: {},
    })
  )
  getSignedUrl = jest.fn((operation, params) => {
    return `http://example.com/${params.Bucket}/${params.Key}`
  })
  headBucket = jest.fn(
    response({
      Contents: {},
    })
  )
  upload = jest.fn(
    response({
      Contents: {},
    })
  )
  getObject = jest.fn(
    response(
      {
        Body: "",
      },
      {
        createReadStream: jest.fn().mockReturnValue("stream"),
      }
    )
  )
}

module.exports = {
  DynamoDB: {
    DocumentClient,
  },
  S3,
  config: {
    update: jest.fn(),
  },
}
