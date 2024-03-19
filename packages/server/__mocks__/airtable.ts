module AirtableMock {
  const Airtable = () => {
    // @ts-ignore
    this.base = jest.fn()
  }

  module.exports = Airtable
}
