const mssql = {}

mssql.query = jest.fn(() => ({
  recordset: [
    {
      a: "string",
      b: 1,
    },
  ],
}))

mssql.connect = jest.fn(() => ({ recordset: [] }))

module.exports = mssql
