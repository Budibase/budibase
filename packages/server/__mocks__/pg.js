const pg = {}

// constructor
function Client() {}

Client.prototype.query = async function() {
  return {
    rows: [
      {
        a: "string",
        b: 1,
      },
    ],
  }
}

Client.prototype.connect = async function() {}

pg.Client = Client

module.exports = pg
