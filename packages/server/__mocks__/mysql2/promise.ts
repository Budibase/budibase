module MySQLMock {
  const mysql: any = {}

  const client = {
    connect: jest.fn(),
    end: jest.fn(),
    query: jest.fn(async () => {
      return [[]]
    }),
  }

  mysql.createConnection = jest.fn(async () => {
    return client
  })

  module.exports = mysql
}
