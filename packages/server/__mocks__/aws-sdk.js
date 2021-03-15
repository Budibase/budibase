const aws = {}

const response = body => () => ({ promise: () => body })

function DocumentClient() {
  this.put = jest.fn(response({}))
  this.query = jest.fn(
    response({
      Items: [],
    })
  )
  this.scan = jest.fn(
    response({
      Items: [
        {
          Name: "test",
        },
      ],
    })
  )
  this.get = jest.fn(response({}))
  this.update = jest.fn(response({}))
  this.delete = jest.fn(response({}))
}

function S3() {
  this.listObjects = jest.fn(
    response({
      foo: {},
    })
  )
}

aws.DynamoDB = { DocumentClient }
aws.config = { update: jest.fn() }

module.exports = aws
