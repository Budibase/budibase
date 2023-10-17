module AirtableMock {
  function Airtable() {
    // @ts-ignore
    this.base = jest.fn()
  }

  module.exports = Airtable
}
