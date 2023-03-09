import { InviteUsersResponse, User } from "@budibase/types"

jest.mock("nodemailer")
import { TestConfiguration, mocks, structures } from "../../../../../tests"
const sendMailMock = mocks.email.mock()
import { events, tenancy, accounts as _accounts } from "@budibase/backend-core"
import * as userSdk from "../../../../../sdk/users"

const accounts = jest.mocked(_accounts)

describe("/api/global/scim/v2/users", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("GET /api/global/scim/v2/users", () => {
    describe("no users exist", () => {
      it("should retrieve empty list", async () => {
        const response = await config.api.scimUsersAPI.get()

        expect(response).toEqual({
          Resources: [],
          itemsPerPage: 20,
          schemas: ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
          startIndex: 1,
          totalResults: 0,
        })
      })
    })
  })
})
