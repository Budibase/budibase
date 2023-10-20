import { structures } from "../../../tests"
import * as context from "../../context"
import * as lookup from "../lookup"
import * as accountSdk from "../../accounts"
import { UserDB } from "../db"
import { uuid } from "../../../tests/core/utilities/structures"
import { CloudAccount, Hosting } from "@budibase/types"

jest.mock("../../context")
jest.mock("../lookup")
jest.mock("../../accounts")

describe("Users DB", () => {
  describe("Bulk create", () => {
    let getTenantMock = jest.spyOn(context, "getTenantId")
    let searchExistingEmailsMock = jest.spyOn(lookup, "searchExistingEmails")
    let getAccountByTenantIdMock = jest.spyOn(
      accountSdk,
      "getAccountByTenantId"
    )
    let addUsersMock = jest.fn()

    it("Modify quotas to include creators count when a new user is created", async () => {
      const user = structures.users.user({
        tenantId: uuid().toString(),
        builder: { global: true },
      })
      const account = structures.accounts.account({
        tenantId: user.tenantId,
        hosting: Hosting.CLOUD,
      })
      getTenantMock.mockImplementation(() => user.tenantId)
      searchExistingEmailsMock.mockImplementation(() => Promise.resolve([]))
      getAccountByTenantIdMock.mockImplementation(() =>
        Promise.resolve(account as CloudAccount)
      )
      addUsersMock.mockReturnValue(
        new Promise(res =>
          res({
            successful: [user],
          })
        )
      )
      const quotaFn = { addUsers: addUsersMock, removeUsers: jest.fn() }
      const groupFn = {
        addUsers: addUsersMock,
        getBulk: jest.fn(),
        getGroupBuilderAppIds: jest.fn(),
      }
      const featuresFn = {
        isSSOEnforced: jest.fn(),
        isAppBuildersEnabled: jest.fn(),
      }
      UserDB.init(quotaFn, groupFn, featuresFn)
      const response = await UserDB.bulkCreate([user], [])

      expect(response.successful).toEqual([user])
      expect(addUsersMock).toHaveBeenCalledTimes(1)
      const newUsersAdded = 1
      const newCreatorsAdded = 1
      expect(addUsersMock).toHaveBeenCalledWith(
        newUsersAdded,
        newCreatorsAdded,
        expect.anything()
      )
    })
  })
})
