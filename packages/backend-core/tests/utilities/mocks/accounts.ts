export const getAccount = jest.fn()
export const getAccountByTenantId = jest.fn()

jest.mock("../../../src/cloud/accounts", () => ({
  getAccount,
  getAccountByTenantId,
}))
