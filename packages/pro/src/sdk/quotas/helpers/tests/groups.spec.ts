import { addGroup, removeGroup } from "../groups"
import { StaticQuotaName, QuotaUsageType } from "@budibase/types"

import * as quotas from "../../quotas"
import * as licenseClient from "../../../licensing/licenses/client"

// Mock quotas functions at module level
jest.mock("../../quotas", () => {
  return {
    incrementMany: jest.fn(),
    decrementMany: jest.fn(),
    increment: jest.fn(),
    decrement: jest.fn(),
  }
})

describe("Group helpers", () => {
  const addGroupFnMock = jest.fn()
  const incrementManyMock = jest.mocked(quotas.incrementMany)
  const decrementManyMock = jest.mocked(quotas.decrementMany)
  const incrementMock = jest.mocked(quotas.increment)
  const decrementMock = jest.mocked(quotas.decrement)
  const licenseClientMock = jest.mocked(licenseClient.getLicense)

  beforeEach(() => {
    jest.resetAllMocks()
    incrementManyMock.mockResolvedValue(undefined)
    decrementManyMock.mockResolvedValue(undefined)
    licenseClientMock.mockResolvedValue(undefined)
  })

  it("Increments quotas for groups when a new group is created", async () => {
    await addGroup(addGroupFnMock)
    expect(incrementMock).toHaveBeenCalledTimes(1)
    expect(decrementMock).not.toHaveBeenCalled()

    expect(incrementMock).toHaveBeenCalledWith(
      StaticQuotaName.USER_GROUPS,
      QuotaUsageType.STATIC,
      { fn: addGroupFnMock }
    )
  })

  it("Decrement quotas for groups when a new group is removed", async () => {
    await removeGroup()
    expect(decrementMock).toHaveBeenCalledTimes(1)
    expect(incrementMock).not.toHaveBeenCalled()

    expect(decrementMock).toHaveBeenCalledWith(
      StaticQuotaName.USER_GROUPS,
      QuotaUsageType.STATIC
    )
  })
})
