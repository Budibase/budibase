const mysql = {}

const client = {
  connect: jest.fn(),
  query: jest.fn(),
}

mysql.createConnection = jest.fn(() => client)

module.exports = mysql
