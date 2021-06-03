const mysql = {}

const client = {
  connect: jest.fn(),
  query: jest.fn((query, fn) => {
    fn(null, [])
  }),
}

mysql.createConnection = jest.fn(() => client)

module.exports = mysql
