import * as setup from "../../tests/utilities"
import { roles } from "@budibase/backend-core"
import { basicTable } from "../../../../tests/utilities/structures"
import { Table, User } from "@budibase/types"
import { PublicAPIRequest } from "./Request"

describe("check public API security", () => {
  const config = setup.getConfig()
  let builderRequest: PublicAPIRequest,
    appUserRequest: PublicAPIRequest,
    table: Table,
    appUser: User

  beforeAll(async () => {
    await config.init()
    const builderUser = await config.globalUser()
    appUser = await config.globalUser({
      builder: { global: false },
      roles: {
        [config.getProdAppId()]: roles.BUILTIN_ROLE_IDS.BASIC,
      },
    })
    builderRequest = await PublicAPIRequest.init(config, builderUser)
    appUserRequest = await PublicAPIRequest.init(config, appUser)
    table = (await builderRequest.tables.create(basicTable())).data
  })

  it("should allow with builder API key", async () => {
    const res = await builderRequest.rows.search(
      table._id!,
      {},
      {
        status: 200,
      }
    )
    expect(res.data.length).toEqual(0)
  })

  it("should 403 when from browser, but API key", async () => {
    await appUserRequest.rows.search(
      table._id!,
      {},
      {
        status: 403,
      }
    )
  })

  it("should re-direct when using cookie", async () => {
    const headers = await config.login({
      userId: appUser._id!,
      builder: false,
      prodApp: false,
    })
    await config.withHeaders(
      {
        ...headers,
        "User-Agent": config.browserUserAgent(),
      },
      async () => {
        await config.api.row.search(
          table._id!,
          { query: {} },
          {
            status: 302,
          }
        )
      }
    )
  })
})
