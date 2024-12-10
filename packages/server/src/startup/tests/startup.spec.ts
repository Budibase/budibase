import { withEnv } from "../../environment"
import TestConfiguration from "../../tests/utilities/TestConfiguration"
import { startup } from "../index"
import {
  users,
  utils,
  tenancy,
  withEnv as withCoreEnv,
} from "@budibase/backend-core"
import nock from "nock"

describe("check BB_ADMIN environment variables", () => {
  const config = new TestConfiguration()
  beforeAll(async () => {
    await config.init()
  })

  beforeEach(() => {
    nock.cleanAll()
  })

  it("should be able to create a user with the BB_ADMIN environment variables", async () => {
    nock("http://localhost:10000")
      .get("/api/global/configs/checklist")
      .reply(200, {})
      .get("/api/global/self/api_key")
      .reply(200, {})

    const EMAIL = "budibase@budibase.com",
      PASSWORD = "budibase"
    await tenancy.doInTenant(tenancy.DEFAULT_TENANT_ID, async () => {
      await withEnv(
        {
          MULTI_TENANCY: "0",
          SELF_HOSTED: "1",
        },
        () =>
          withCoreEnv(
            {
              BB_ADMIN_USER_EMAIL: EMAIL,
              BB_ADMIN_USER_PASSWORD: PASSWORD,
            },
            async () => {
              await startup({ rerun: true })
              const user = await users.getGlobalUserByEmail(EMAIL, {
                cleanup: false,
              })
              expect(user).toBeDefined()
              expect(user?.password).toBeDefined()
              expect(await utils.compare(PASSWORD, user!.password!)).toEqual(
                true
              )
            }
          )
      )
    })
  })
})
