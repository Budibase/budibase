jest.mock("../../quotas")
jest.mock("../../../licensing/licenses/client")

const quotas = require("../../quotas")
const licenseClient = require("../../../licensing/licenses/client")

import { addUsers, removeUsers } from "../users"
import { StaticQuotaName, QuotaUsageType } from "@budibase/types"

describe("User helpers", () => {
  const addUsersFnMock = jest.fn()
  const incrementManyMock = jest.spyOn(quotas, "incrementMany")
  const decrementManyMock = jest.spyOn(quotas, "decrementMany")
  const licenseClientMock = jest.spyOn(licenseClient, "getLicense")

  beforeEach(() => {
    jest.resetAllMocks()
    incrementManyMock.mockImplementation(() => new Promise(res => res("OK")))
    decrementManyMock.mockImplementation(() => new Promise(res => res("OK")))
    licenseClientMock.mockImplementation(() => ({}))
  })

  it("Increments quotas for users and creators when new users is added", async () => {
    const userAdded = 1
    const creatorsAdded = 1
    const response = await addUsers(userAdded, creatorsAdded, addUsersFnMock)
    expect(incrementManyMock).toHaveBeenCalledTimes(1)
    expect(licenseClientMock).toHaveBeenCalledTimes(1)
    expect(incrementManyMock).toHaveBeenCalledWith([
      {
        change: 1,
        name: StaticQuotaName.USERS,
        type: QuotaUsageType.STATIC,
        opts: {
          fn: expect.anything(),
          valueFn: expect.anything(),
        },
      },
      {
        change: 1,
        name: StaticQuotaName.CREATORS,
        type: QuotaUsageType.STATIC,
        opts: {
          valueFn: expect.anything(),
        },
      },
    ])

    expect(response).toBe("OK")
  })

  it("Increments only quotas for users if no creator has been added", async () => {
    const userAdded = 1
    const creatorsAdded = 0
    const response = await addUsers(userAdded, creatorsAdded, addUsersFnMock)
    expect(incrementManyMock).toHaveBeenCalledTimes(1)
    expect(licenseClientMock).toHaveBeenCalledTimes(1)
    expect(incrementManyMock).toHaveBeenCalledWith([
      {
        change: 1,
        name: StaticQuotaName.USERS,
        type: QuotaUsageType.STATIC,
        opts: {
          fn: expect.anything(),
          valueFn: expect.anything(),
        },
      },
    ])

    expect(response).toBe("OK")
  })

  it("Decrements quotas for users and creators when new users are deleted", async () => {
    const userDeleted = 1
    const creatorsDeleted = 1
    await removeUsers(userDeleted, creatorsDeleted)
    expect(decrementManyMock).toHaveBeenCalledTimes(1)
    expect(licenseClientMock).toHaveBeenCalledTimes(1)
    expect(decrementManyMock).toHaveBeenCalledWith([
      {
        change: 1,
        name: StaticQuotaName.USERS,
        type: QuotaUsageType.STATIC,
        opts: {
          valueFn: expect.anything(),
        },
      },
      {
        change: 1,
        name: StaticQuotaName.CREATORS,
        type: QuotaUsageType.STATIC,
        opts: {
          valueFn: expect.anything(),
        },
      },
    ])
  })

  it("Decrements only quotas for users if no creators has been deleted", async () => {
    const userDeleted = 1
    const creatorsDeleted = 0
    await removeUsers(userDeleted, creatorsDeleted)
    expect(decrementManyMock).toHaveBeenCalledTimes(1)
    expect(licenseClientMock).toHaveBeenCalledTimes(1)
    expect(decrementManyMock).toHaveBeenCalledWith([
      {
        change: 1,
        name: StaticQuotaName.USERS,
        type: QuotaUsageType.STATIC,
        opts: {
          valueFn: expect.anything(),
        },
      },
    ])
  })
})
