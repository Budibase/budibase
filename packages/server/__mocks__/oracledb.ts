module OracleDbMock {
  // mock execute
  const execute = jest.fn(() => ({
    rows: [
      {
        a: "string",
        b: 1,
      },
    ],
  }))

  const close = jest.fn()

  // mock connection
  function Connection() {}
  Connection.prototype.execute = execute
  Connection.prototype.close = close

  // mock oracledb
  const oracleDb: any = {}
  oracleDb.getConnection = jest.fn(() => {
    // @ts-ignore
    return new Connection()
  })

  // expose mocks
  oracleDb.executeMock = execute
  oracleDb.closeMock = close

  module.exports = oracleDb
}
