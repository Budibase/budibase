import * as backendCore from "@budibase/backend-core"
import {
  DBTestConfiguration,
  generator,
  structures,
} from "@budibase/backend-core/tests"
import { doInUserIdentity } from "../utils"

jest.mock("@budibase/backend-core", (): typeof backendCore => {
  const actual: typeof backendCore = jest.requireActual(
    "@budibase/backend-core"
  )
  return {
    ...actual,
    cache: {
      ...actual.cache,
      user: {
        ...actual.cache.user,
        getUser: jest.fn(actual.cache.user.getUser),
      },
    },
  }
})

const config = new DBTestConfiguration()

describe("doInUserIdentity", () => {
  const cacheGetUserSpy = backendCore.cache.user.getUser as jest.MockedFunction<
    typeof backendCore.cache.user.getUser
  >

  const getIdentityId = async () => backendCore.context.getIdentity()?._id

  it("runs the task as an existing user", async () => {
    await config.doInTenant(async () => {
      const user = structures.users.user({ _id: `us_${generator.guid()}` })
      await backendCore.context.getGlobalDB().put(user)

      const identityId = await doInUserIdentity({
        userId: user._id,
        task: getIdentityId,
      })

      expect(identityId).toEqual(user._id)
    })
  })

  it("runs the task with no user when the user doesn't exist", async () => {
    await config.doInTenant(async () => {
      const identityId = await doInUserIdentity({
        userId: "slack:T123:U123",
        task: getIdentityId,
      })

      expect(identityId).toBeUndefined()
    })
  })

  it("rethrows other lookup failures without running the task", async () => {
    cacheGetUserSpy.mockRejectedValueOnce(new Error("redis down"))
    const task = jest.fn()

    await config.doInTenant(async () => {
      await expect(doInUserIdentity({ userId: "us_1", task })).rejects.toThrow(
        "redis down"
      )
    })

    expect(task).not.toHaveBeenCalled()
  })
})
