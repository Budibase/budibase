jest.mock("../../../events", () => {
  return {
    account: {
      created: jest.fn(),
      deleted: jest.fn(),
      verified: jest.fn(),
    },
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
      SSOCreated: jest.fn(),
      SSOUpdated: jest.fn(),
      SSOActivated: jest.fn(),
      SSODeactivated: jest.fn(),
    },
    automation: {
      created: jest.fn(),
      deleted: jest.fn(),
      tested: jest.fn(),
      // run: jest.fn(),
      stepCreated: jest.fn(),
      stepDeleted: jest.fn(),
      triggerUpdated: jest.fn(),
    },
    datasource: {
      created: jest.fn(),
      updated: jest.fn(),
      deleted: jest.fn(),
    },
    email: {
      SMTPCreated: jest.fn(),
      SMTPUpdated: jest.fn(),
    },
    layout: {
      created: jest.fn(),
      deleted: jest.fn(),
    },
  }
})

const events = require("../../../events")

module.exports = events
