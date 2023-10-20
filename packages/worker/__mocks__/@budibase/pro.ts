const actual = jest.requireActual("@budibase/pro")
const pro = {
  ...actual,
  features: {
    ...actual.features,
    isSSOEnforced: jest.fn(),
  },
  licensing: {
    keys: {
      activateLicenseKey: jest.fn(),
      getLicenseKey: jest.fn(),
      deleteLicenseKey: jest.fn(),
    },
    offline: {
      activateOfflineLicenseToken: jest.fn(),
      getOfflineLicenseToken: jest.fn(),
      deleteOfflineLicenseToken: jest.fn(),
      getIdentifierBase64: jest.fn(),
    },
    cache: {
      ...actual.licensing.cache,
      refresh: jest.fn(),
    },
  },
  quotas: {
    ...actual.quotas,
    getQuotaUsage: jest.fn(),
  },
}

export = pro
