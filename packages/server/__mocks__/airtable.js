class Airtable {
  constructor() {}

  base() {
    return () => ({
      query: jest.fn(),
      create: jest.fn(),
      select: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    })
  }
}

module.exports = Airtable
