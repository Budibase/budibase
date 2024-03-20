// eslint-disable-next-line @typescript-eslint/no-unused-vars
module ArangoMock {
  const arangodb: any = {}

  arangodb.Database = function () {
    this.query = jest.fn(() => ({
      all: jest.fn(),
    }))
    this.collection = jest.fn(() => "collection")
    this.close = jest.fn()
  }

  // @ts-ignore
  arangodb.aql = (strings, ...args) => {
    let str = strings.join("{}")

    for (let arg of args) {
      str = str.replace("{}", arg)
    }

    return str
  }

  module.exports = arangodb
}
