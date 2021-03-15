class Airtable {
  constructor() {
    this.create = jest.fn()
  }

  base() {
    return () => ({
      create: this.create,
    })
  }
}

module.exports = Airtable
