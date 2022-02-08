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
  Client.prototype.connect = jest.fn()
  Client.prototype.release = jest.fn()

  function Pool() {}

  const on = jest.fn()
  Pool.prototype.query = query
  Pool.prototype.connect = jest.fn(() => {
    // @ts-ignore
    return new Client()
  })
  Pool.prototype.on = on

  pg.Client = Client
  pg.Pool = Pool
  pg.queryMock = query
  pg.on = on

  module.exports = pg
}
