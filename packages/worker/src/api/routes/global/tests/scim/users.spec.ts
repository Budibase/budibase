import tk from "timekeeper"
import _ from "lodash"
import { mocks, structures } from "@budibase/backend-core/tests"
import { ScimUpdateRequest, ScimUserResponse } from "@budibase/types"
import { TestConfiguration } from "../../../../../tests"

mocks.licenses.useScimIntegration()

describe("/api/global/scim/v2/users", () => {
  beforeEach(() => {
    mocks.licenses.useScimIntegration()
  })

  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  const featureDisabledResponse = {
    error: {
      code: "feature_disabled",
      featureName: "scim",
    },
    message: "scim is not currently enabled",
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

    describe("multiple users exist", () => {
      const userCount = 30
      let users: ScimUserResponse[]

      beforeAll(async () => {
        users = []

        for (let i = 0; i < userCount; i++) {
          const body = structures.scim.createUserRequest()
          users.push(await config.api.scimUsersAPI.post({ body }))
        }

        users = users.sort((a, b) => (a.id > b.id ? 1 : -1))
      })

      it("fetches full first page", async () => {
        const response = await getScimUsers()

        expect(response).toEqual({
          Resources: expect.arrayContaining(users.slice(0, 20)),
          itemsPerPage: 20,
          schemas: ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
          startIndex: 1,
          totalResults: userCount,
        })
      })

      it("fetches second page", async () => {
        const response = await getScimUsers({ params: { startIndex: 20 } })

        expect(response).toEqual({
          Resources: users.slice(20),
          itemsPerPage: 20,
          schemas: ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
          startIndex: 21,
          totalResults: userCount,
        })
      })

      it("can filter by user name", async () => {
        const userToFetch = _.sample(users)

        const response = await getScimUsers({
          params: {
            filter: encodeURI(`userName eq "${userToFetch?.userName}"`),
          },
        })

        expect(response).toEqual({
          Resources: [userToFetch],
          itemsPerPage: 20,
          schemas: ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
          startIndex: 1,
          totalResults: 1,
        })
      })

      it("can filter by external id", async () => {
        const userToFetch = _.sample(users)

        const response = await getScimUsers({
          params: {
            filter: encodeURI(`externalId eq "${userToFetch?.externalId}"`),
          },
        })

        expect(response).toEqual({
          Resources: [userToFetch],
          itemsPerPage: 20,
          schemas: ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
          startIndex: 1,
          totalResults: 1,
        })
      })

      it("can filter by email", async () => {
        const userToFetch = _.sample(users)

        const response = await getScimUsers({
          params: {
            filter: encodeURI(
              `emails[type eq "work"].value eq "${userToFetch?.emails[0].value}"`
            ),
          },
        })

        expect(response).toEqual({
          Resources: [userToFetch],
          itemsPerPage: 20,
          schemas: ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
          startIndex: 1,
          totalResults: 1,
        })
      })
    })
  })

  describe("POST /api/global/scim/v2/users", () => {
    const postScimUser = config.api.scimUsersAPI.post

    beforeAll(async () => {
      await config.useNewTenant()
    })

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
        const mockedTime = new Date(structures.generator.timestamp())
        tk.freeze(mockedTime)

        const userData = {
          externalId: structures.uuid(),
          email: structures.generator.email(),
          firstName: structures.generator.first(),
          lastName: structures.generator.last(),
          username: structures.generator.name(),
        }
        const body = structures.scim.createUserRequest(userData)

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
          userName: userData.username,
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

  describe("GET /api/global/scim/v2/users/:id", () => {
    let user: ScimUserResponse

    beforeEach(async () => {
      const body = structures.scim.createUserRequest()

      user = await config.api.scimUsersAPI.post({ body })
    })

    const findScimUser = config.api.scimUsersAPI.find

    it("unauthorised calls are not allowed", async () => {
      const response = await findScimUser(user.id, {
        setHeaders: false,
        expect: 403,
      })

      expect(response).toEqual({ message: "Tenant id not set", status: 403 })
    })

    it("cannot be called when feature is disabled", async () => {
      mocks.licenses.useCloudFree()
      const response = await findScimUser(user.id, { expect: 400 })

      expect(response).toEqual(featureDisabledResponse)
    })

    it("should return existing user", async () => {
      const response = await findScimUser(user.id)

      expect(response).toEqual(user)
    })

    it("should return 404 when requesting unexisting user id", async () => {
      const response = await findScimUser(structures.uuid(), { expect: 404 })

      expect(response).toEqual({
        message: "missing",
        status: 404,
      })
    })
  })

  describe("PATCH /api/global/scim/v2/users/:id", () => {
    const patchScimUser = config.api.scimUsersAPI.patch

    let user: ScimUserResponse

    beforeEach(async () => {
      const body = structures.scim.createUserRequest()

      user = await config.api.scimUsersAPI.post({ body })
    })

    it("unauthorised calls are not allowed", async () => {
      const response = await patchScimUser({} as any, {
        setHeaders: false,
        expect: 403,
      })

      expect(response).toEqual({ message: "Tenant id not set", status: 403 })
    })

    it("cannot be called when feature is disabled", async () => {
      mocks.licenses.useCloudFree()
      const response = await patchScimUser({} as any, { expect: 400 })

      expect(response).toEqual(featureDisabledResponse)
    })

    it("an existing user can be updated", async () => {
      const newUserName = structures.generator.name()
      const newFamilyName = structures.generator.last()
      const body: ScimUpdateRequest = {
        schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
        Operations: [
          {
            op: "Replace",
            path: "userName",
            value: newUserName,
          },
          {
            op: "Replace",
            path: "name.familyName",
            value: newFamilyName,
          },
        ],
      }

      const response = await patchScimUser({ id: user.id, body })

      const expectedScimUser: ScimUserResponse = {
        ...user,
        userName: newUserName,
        name: {
          ...user.name,
          familyName: newFamilyName,
          formatted: `${user.name.givenName} ${newFamilyName}`,
        },
      }
      expect(response).toEqual(expectedScimUser)

      const persistedUser = await config.api.scimUsersAPI.find(user.id)
      expect(persistedUser).toEqual(expectedScimUser)
    })

    it.each([false, "false", "False"])(
      "can deactive an active user (sending %s)",
      async activeValue => {
        const body: ScimUpdateRequest = {
          schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
          Operations: [{ op: "Replace", path: "active", value: activeValue }],
        }

        const response = await patchScimUser({ id: user.id, body })

        const expectedScimUser: ScimUserResponse = {
          ...user,
          active: false,
        }
        expect(response).toEqual(expectedScimUser)

        const persistedUser = await config.api.scimUsersAPI.find(user.id)
        expect(persistedUser).toEqual(expectedScimUser)
      }
    )

    it.each([true, "true", "True"])(
      "can activate an inactive user (sending %s)",
      async activeValue => {
        // Deactivate user
        await patchScimUser({
          id: user.id,
          body: {
            schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
            Operations: [{ op: "Replace", path: "active", value: true }],
          },
        })

        const body: ScimUpdateRequest = {
          schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
          Operations: [{ op: "Replace", path: "active", value: activeValue }],
        }

        const response = await patchScimUser({ id: user.id, body })

        const expectedScimUser: ScimUserResponse = {
          ...user,
          active: true,
        }
        expect(response).toEqual(expectedScimUser)

        const persistedUser = await config.api.scimUsersAPI.find(user.id)
        expect(persistedUser).toEqual(expectedScimUser)
      }
    )

    it("supports updating unmapped fields", async () => {
      const body: ScimUpdateRequest = {
        schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
        Operations: [
          {
            op: "Add",
            path: "displayName",
            value: structures.generator.name(),
          },
          {
            op: "Add",
            path: "preferredLanguage",
            value: structures.generator.letter(),
          },
        ],
      }

      const response = await patchScimUser({ id: user.id, body })

      const expectedScimUser: ScimUserResponse = {
        ...user,
      }
      expect(response).toEqual(expectedScimUser)

      const persistedUser = await config.api.scimUsersAPI.find(user.id)
      expect(persistedUser).toEqual(expectedScimUser)
    })
  })

  describe("DELETE /api/global/scim/v2/users/:id", () => {
    const deleteScimUser = config.api.scimUsersAPI.delete

    let user: ScimUserResponse

    beforeEach(async () => {
      const body = structures.scim.createUserRequest()

      user = await config.api.scimUsersAPI.post({ body })
    })

    it("unauthorised calls are not allowed", async () => {
      const response = await deleteScimUser(user.id, {
        setHeaders: false,
        expect: 403,
      })

      expect(response).toEqual({ message: "Tenant id not set", status: 403 })
    })

    it("cannot be called when feature is disabled", async () => {
      mocks.licenses.useCloudFree()
      const response = await deleteScimUser(user.id, { expect: 400 })

      expect(response).toEqual(featureDisabledResponse)
    })

    it("an existing user can be deleted", async () => {
      const response = await deleteScimUser(user.id, { expect: 204 })

      expect(response).toEqual({})

      await config.api.scimUsersAPI.find(user.id, { expect: 404 })
    })

    it("an non existing user can not be deleted", async () => {
      await deleteScimUser(structures.uuid(), { expect: 404 })
    })
  })
})
