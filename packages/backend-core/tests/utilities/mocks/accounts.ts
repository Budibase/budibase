const mockGetAccount = jest.fn()
const mockGetAccountByTenantId = jest.fn()
const mockGetStatus = jest.fn()

jest.mock("../../../src/cloud/accounts", () => ({
  getAccount: mockGetAccount,
  getAccountByTenantId: mockGetAccountByTenantId,
  getStatus: mockGetStatus,
}))

export const getAccount = mockGetAccount
export const getAccountByTenantId = mockGetAccountByTenantId
export const getStatus = mockGetStatus
