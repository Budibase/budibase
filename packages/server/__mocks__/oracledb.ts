const executeMock = jest.fn(() => ({
  rows: [
    {
      a: "string",
      b: 1,
    },
  ],
}))

const closeMock = jest.fn()

class Connection {
  execute = executeMock
  close = closeMock
}

module.exports = {
  getConnection: jest.fn(() => new Connection()),
  executeMock,
  closeMock,
}
