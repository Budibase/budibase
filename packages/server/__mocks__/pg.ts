const query = jest.fn(() => ({
  rows: [
    {
      a: "string",
      b: 1,
    },
  ],
}))

class Client {
  query = query
  end = jest.fn(cb => {
    if (cb) cb()
  })
  connect = jest.fn()
  release = jest.fn()
}

const on = jest.fn()

module.exports = {
  Client,
  queryMock: query,
  on,
}
