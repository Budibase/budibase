const mockGetCachedLicense = jest.fn()
export const mockTriggerQuota = jest.fn()

jest.mock("../../src/sdk/licensing", () => ({
  client: {
    triggerQuota: mockTriggerQuota,
  },
  cache: {
    getCachedLicense: mockGetCachedLicense,
  },
}))
