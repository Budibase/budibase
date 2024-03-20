const client = {
  connect: jest.fn(),
  query: jest.fn((query, bindings, fn) => {
    fn(null, [])
  }),
}

module.exports = {
  createConnection: jest.fn(() => client),
  client,
}
