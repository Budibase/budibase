const actual = jest.requireActual("@budibase/pro")
const pro = {
  ...actual,
  licensing: {
    keys: {
      activateLicenseKey: jest.fn(),
      getLicenseKey: jest.fn(),
      deleteLicenseKey: jest.fn(),
    },
    offline: {
      activateOfflineLicense: jest.fn(),
      getOfflineLicenseToken: jest.fn(),
      deleteOfflineLicenseToken: jest.fn(),
    },
    cache: {
      ...actual.licensing.cache,
      refresh: jest.fn(),
    }
  },
  quotas: {
    ...actual.quotas,
    getQuotaUsage: jest.fn()
  },
}

export = pro
