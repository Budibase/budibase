import TestConfiguration from "../../tests/utilities/TestConfiguration"
import { startup } from "../index"
import { users, utils, tenancy } from "@budibase/backend-core"

describe("check BB_ADMIN environment variables", () => {
  const config = new TestConfiguration()
  beforeAll(async () => {
    await config.init()
  })

  it("should be able to create a user with the BB_ADMIN environment variables", async () => {
    const EMAIL = "budibase@budibase.com",
      PASSWORD = "budibase"
    await tenancy.doInTenant(tenancy.DEFAULT_TENANT_ID, async () => {
      await config.withEnv(
        {
          MULTI_TENANCY: "0",
          SELF_HOSTED: "1",
        },
        () =>
          config.withCoreEnv(
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
              expect(await utils.compare(PASSWORD, user?.password!)).toEqual(
                true
              )
            }
          )
      )
    })
  })
})
