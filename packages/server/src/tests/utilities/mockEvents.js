const core = require("@budibase/backend-core")

const events = {
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
}

core.events = events
module.exports = {
  events,
}
