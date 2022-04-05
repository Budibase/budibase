jest.mock("../../../events", () => {
  return {
    app: {
      created: jest.fn(),
      updated: jest.fn(),
      deleted: jest.fn(),
      published: jest.fn(),
      unpublished: jest.fn(),
      templateImported: jest.fn(),
      fileImported: jest.fn(),
      versionUpdated: jest.fn(),
      versionReverted: jest.fn(),
      reverted: jest.fn(),
      exported: jest.fn(),
    },
    auth: {
      login: jest.fn(),
      logout: jest.fn(),
    },
    datasource: {
      created: jest.fn(),
      updated: jest.fn(),
      deleted: jest.fn(),
    },
  }
})

const events = require("../../../events")

module.exports = events
