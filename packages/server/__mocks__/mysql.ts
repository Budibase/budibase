module MySQLMock {
  const mysql: any = {}

  const client = {
    connect: jest.fn(),
    query: jest.fn((query, bindings, fn) => {
      fn(null, [])
    }),
  }

  mysql.createConnection = jest.fn(() => client)

  module.exports = mysql
}
