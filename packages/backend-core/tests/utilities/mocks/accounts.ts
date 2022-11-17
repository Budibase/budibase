export const getAccount = jest.fn()
export const getAccountByTenantId = jest.fn()
export const getStatus = jest.fn()

jest.mock("../../../src/cloud/accounts", () => ({
  getAccount,
  getAccountByTenantId,
  getStatus,
}))
