import { TestConfiguration } from "../../../../../tests"

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
    it("unauthorised calls are not allowed", async () => {
      const response = await config.api.scimUsersAPI.get({
        setHeaders: false,
        expect: 403,
      })

      expect(response).toEqual({ message: "Tenant id not set", status: 403 })
    })

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

  describe("POST /api/global/scim/v2/users", () => {
    it("unauthorised calls are not allowed", async () => {
      const response = await config.api.scimUsersAPI.post(
        { body: {} as any },
        {
          setHeaders: false,
          expect: 403,
        }
      )

      expect(response).toEqual({ message: "Tenant id not set", status: 403 })
    })

    describe("no users exist", () => {
      it("a new user can be created", async () => {
        const body = {} as any
        const response = await config.api.scimUsersAPI.post(body)

        expect(response).toEqual({
          schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"],
          id: "48af03ac28ad4fb88478",
          externalId: "0a21f0f2-8d2a-4f8e-bf98-7363c4aed4ef",
          meta: {
            resourceType: "User",
            created: "2018-03-27T19:59:26.000Z",
            lastModified: "2018-03-27T19:59:26.000Z",
          },
          userName: "Test_User_ab6490ee-1e48-479e-a20b-2d77186b5dd1",
          name: {
            formatted: "givenName familyName",
            familyName: "familyName",
            givenName: "givenName",
          },
          active: true,
          emails: [
            {
              value:
                "Test_User_fd0ea19b-0777-472c-9f96-4f70d2226f2e@testuser.com",
              type: "work",
              primary: true,
            },
          ],
        })
      })
    })
  })
})
