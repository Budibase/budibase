module.exports = {
  ConnectionPool: jest.fn(() => ({
    connect: jest.fn(() => ({
      request: jest.fn(() => ({
        query: jest.fn(sql => ({ recordset: [sql] })),
      })),
    })),
  })),
  query: jest.fn(() => ({
    recordset: [
      {
        a: "string",
        b: 1,
      },
    ],
  })),
}
