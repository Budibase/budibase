import { range } from "lodash/fp"
import { structures } from "../.."

jest.mock("../../../src/context")
jest.mock("../../../src/db")

import * as context from "../../../src/context"
import * as db from "../../../src/db"

import { getCreatorCount } from "../../../src/users/users"

describe("Users", () => {
  let getGlobalDBMock: jest.SpyInstance
  let paginationMock: jest.SpyInstance

  beforeEach(() => {
    jest.resetAllMocks()

    getGlobalDBMock = jest.spyOn(context, "getGlobalDB")
    paginationMock = jest.spyOn(db, "pagination")

    jest.spyOn(db, "getGlobalUserParams")
  })

  it("retrieves the number of creators", async () => {
    const getUsers = (offset: number, limit: number, creators = false) => {
      const opts = creators ? { builder: { global: true } } : undefined
      return range(offset, limit).map(() => structures.users.user(opts))
    }
    const page1Data = getUsers(0, 8)
    const page2Data = getUsers(8, 12, true)
    getGlobalDBMock.mockImplementation(() => ({
      name: "fake-db",
      allDocs: () => ({
        rows: [...page1Data, ...page2Data],
      }),
    }))
    paginationMock.mockImplementationOnce(() => ({
      data: page1Data,
      hasNextPage: true,
      nextPage: "1",
    }))
    paginationMock.mockImplementation(() => ({
      data: page2Data,
      hasNextPage: false,
      nextPage: undefined,
    }))
    const creatorsCount = await getCreatorCount()
    expect(creatorsCount).toBe(4)
    expect(paginationMock).toHaveBeenCalledTimes(2)
  })
})
