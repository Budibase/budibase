const pg = {}

// constructor
function Client() {}

Client.prototype.query = jest.fn(() => ({
  rows: [
    {
      a: "string",
      b: 1,
    },
  ],
}))

Client.prototype.connect = jest.fn()

pg.Client = Client

module.exports = pg
