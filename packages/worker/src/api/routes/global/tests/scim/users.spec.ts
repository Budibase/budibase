import tk from "timekeeper"
import { mocks, structures } from "@budibase/backend-core/tests"
import { ScimCreateUserRequest } from "@budibase/types"
import { TestConfiguration } from "../../../../../tests"

describe("/api/global/scim/v2/users", () => {
  let mockedTime = new Date(structures.generator.timestamp())

  beforeEach(() => {
    tk.reset()
    mockedTime = new Date(structures.generator.timestamp())
    tk.freeze(mockedTime)

    mocks.licenses.useScimIntegration()
  })

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

  const featureDisabledResponse = {
    error: {
      code: "feature_disabled",
      featureName: "scimIntegration",
      type: "license_error",
    },
    message: "scimIntegration is not currently enabled",
    status: 400,
  }

  describe("GET /api/global/scim/v2/users", () => {
    const getScimUsers = config.api.scimUsersAPI.get

    it("unauthorised calls are not allowed", async () => {
      const response = await getScimUsers({
        setHeaders: false,
        expect: 403,
      })

      expect(response).toEqual({ message: "Tenant id not set", status: 403 })
    })

    it("cannot be called when feature is disabled", async () => {
      mocks.licenses.useCloudFree()
      const response = await getScimUsers({ expect: 400 })

      expect(response).toEqual(featureDisabledResponse)
    })

    describe("no users exist", () => {
      it("should retrieve empty list", async () => {
        const response = await getScimUsers()

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
    const postScimUser = config.api.scimUsersAPI.post

    it("unauthorised calls are not allowed", async () => {
      const response = await postScimUser(
        { body: {} as any },
        {
          setHeaders: false,
          expect: 403,
        }
      )

      expect(response).toEqual({ message: "Tenant id not set", status: 403 })
    })

    it("cannot be called when feature is disabled", async () => {
      mocks.licenses.useCloudFree()
      const response = await postScimUser({ body: {} as any }, { expect: 400 })

      expect(response).toEqual(featureDisabledResponse)
    })

    describe("no users exist", () => {
      it("a new user can be created and persisted", async () => {
        const userData = {
          externalId: structures.uuid(),
          email: structures.generator.email(),
          firstName: structures.generator.first(),
          lastName: structures.generator.last(),
        }
        const body: ScimCreateUserRequest = {
          schemas: [
            "urn:ietf:params:scim:schemas:core:2.0:User",
            "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User",
          ],
          externalId: userData.externalId,
          userName: structures.generator.name(),
          active: true,
          emails: [
            {
              primary: true,
              type: "work",
              value: userData.email,
            },
          ],
          meta: {
            resourceType: "User",
          },
          name: {
            formatted: structures.generator.name(),
            familyName: userData.lastName,
            givenName: userData.firstName,
          },
          roles: [],
        }

        const response = await postScimUser({ body })

        const expectedScimUser = {
          schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"],
          id: expect.any(String),
          externalId: userData.externalId,
          meta: {
            resourceType: "User",
            created: mockedTime.toISOString(),
            lastModified: mockedTime.toISOString(),
          },
          userName: `${userData.firstName} ${userData.lastName}`,
          name: {
            formatted: `${userData.firstName} ${userData.lastName}`,
            familyName: userData.lastName,
            givenName: userData.firstName,
          },
          active: true,
          emails: [
            {
              value: userData.email,
              type: "work",
              primary: true,
            },
          ],
        }
        expect(response).toEqual(expectedScimUser)

        const persistedUsers = await config.api.scimUsersAPI.get()
        expect(persistedUsers).toEqual(
          expect.objectContaining({
            totalResults: 1,
            Resources: [expectedScimUser],
          })
        )
      })
    })
  })
})
