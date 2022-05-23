module PgMock {
  const pg: any = {}

  const query = jest.fn(() => ({
    rows: [
      {
        a: "string",
        b: 1,
      },
    ],
  }))

  // constructor
  function Client() {}

  Client.prototype.query = query
  Client.prototype.end = jest.fn(cb => {
    if (cb) cb()
  })
  Client.prototype.connect = jest.fn()
  Client.prototype.release = jest.fn()

  const on = jest.fn()

  pg.Client = Client
  pg.queryMock = query
  pg.on = on

  module.exports = pg
}
