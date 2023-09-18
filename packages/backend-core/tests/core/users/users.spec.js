const _ = require('lodash/fp')
const {structures} = require("../../../tests")

jest.mock("../../../src/context")
jest.mock("../../../src/db")

const context = require("../../../src/context")
const db = require("../../../src/db")

const {getCreatorCount} = require('../../../src/users/users')

describe("Users", () => {

  let getGlobalDBMock
  let getGlobalUserParamsMock
  let paginationMock

  beforeEach(() => {
    jest.resetAllMocks()

    getGlobalDBMock = jest.spyOn(context, "getGlobalDB")
    getGlobalUserParamsMock = jest.spyOn(db, "getGlobalUserParams")
    paginationMock = jest.spyOn(db, "pagination")
  })

  it("Retrieves the number of creators", async () => {
    const getUsers = (offset, limit, creators = false) => {
      const range = _.range(offset, limit)
      const opts = creators ? {builder: {global: true}} : undefined
      return range.map(() => structures.users.user(opts))
    }
    const page1Data = getUsers(0, 8)
    const page2Data = getUsers(8, 12, true)
    getGlobalDBMock.mockImplementation(() => ({
      name   : "fake-db",
      allDocs: () => ({
        rows: [...page1Data, ...page2Data]
      })
    }))
    paginationMock.mockImplementationOnce(() => ({
      data: page1Data,
      hasNextPage: true,
      nextPage: "1"
    }))
    paginationMock.mockImplementation(() => ({
      data: page2Data,
      hasNextPage: false,
      nextPage: undefined
    }))
    const creatorsCount = await getCreatorCount()
    expect(creatorsCount).toBe(4)
    expect(paginationMock).toHaveBeenCalledTimes(2)
  })
})
