const mysql = {}

const client = {
  connect: jest.fn(),
  query: jest.fn(console.log),
}

mysql.createConnection = jest.fn(() => client)

module.exports = mysql
