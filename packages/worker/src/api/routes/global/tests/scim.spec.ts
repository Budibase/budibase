import tk from "timekeeper"
import _ from "lodash"
import { events } from "@budibase/backend-core"
import { mocks, structures } from "@budibase/backend-core/tests"
import {
  ScimGroupResponse,
  ScimUpdateRequest,
  ScimUserResponse,
} from "@budibase/types"
import { TestConfiguration } from "../../../../tests"

mocks.licenses.useScimIntegration()

describe("scim", () => {
  beforeEach(() => {
    jest.resetAllMocks()
    tk.freeze(mocks.date.MOCK_DATE)

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

  describe("/api/global/scim/v2/users", () => {
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
        const response = await postScimUser(
          { body: {} as any },
          { expect: 400 }
        )

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

        it("an event is dispatched", async () => {
          const body = structures.scim.createUserRequest()

          await postScimUser({ body })

          expect(events.user.created).toBeCalledTimes(1)
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

      it("an event is dispatched", async () => {
        const body: ScimUpdateRequest = {
          schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
          Operations: [
            {
              op: "Replace",
              path: "userName",
              value: structures.generator.name(),
            },
          ],
        }

        await patchScimUser({ id: user.id, body })

        expect(events.user.updated).toBeCalledTimes(1)
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

      it("an event is dispatched", async () => {
        await deleteScimUser(user.id, { expect: 204 })

        expect(events.user.deleted).toBeCalledTimes(1)
      })
    })
  })

  describe("/api/global/scim/v2/groups", () => {
    describe("GET /api/global/scim/v2/groups", () => {
      const getScimGroups = config.api.scimGroupsAPI.get

      it("unauthorised calls are not allowed", async () => {
        const response = await getScimGroups({
          setHeaders: false,
          expect: 403,
        })

        expect(response).toEqual({ message: "Tenant id not set", status: 403 })
      })

      it("cannot be called when feature is disabled", async () => {
        mocks.licenses.useCloudFree()
        const response = await getScimGroups({ expect: 400 })

        expect(response).toEqual(featureDisabledResponse)
      })

      describe("no groups exist", () => {
        it("should retrieve empty list", async () => {
          const response = await getScimGroups()

          expect(response).toEqual({
            Resources: [],
            itemsPerPage: 0,
            schemas: ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
            startIndex: 1,
            totalResults: 0,
          })
        })
      })

      describe("multiple groups exist", () => {
        const groupCount = 25
        let groups: ScimGroupResponse[]

        beforeAll(async () => {
          groups = []

          for (let i = 0; i < groupCount; i++) {
            const body = structures.scim.createGroupRequest()
            groups.push(await config.api.scimGroupsAPI.post({ body }))
          }

          groups = groups.sort((a, b) => (a.id > b.id ? 1 : -1))
        })

        it("can fetch all groups without filters", async () => {
          const response = await getScimGroups()

          expect(response).toEqual({
            Resources: expect.arrayContaining(groups),
            itemsPerPage: 25,
            schemas: ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
            startIndex: 1,
            totalResults: groupCount,
          })
        })
      })
    })

    describe("POST /api/global/scim/v2/groups", () => {
      const postScimGroup = config.api.scimGroupsAPI.post

      beforeAll(async () => {
        await config.useNewTenant()
      })

      it("unauthorised calls are not allowed", async () => {
        const response = await postScimGroup(
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
        const response = await postScimGroup(
          { body: {} as any },
          { expect: 400 }
        )

        expect(response).toEqual(featureDisabledResponse)
      })

      describe("no groups exist", () => {
        it("a new group can be created and persisted", async () => {
          const mockedTime = new Date(structures.generator.timestamp())
          tk.freeze(mockedTime)

          const groupData = {
            externalId: structures.uuid(),
            displayName: structures.generator.word(),
          }
          const body = structures.scim.createGroupRequest(groupData)

          const response = await postScimGroup({ body })

          const expectedScimGroup = {
            schemas: ["urn:ietf:params:scim:schemas:core:2.0:Group"],
            id: expect.any(String),
            externalId: groupData.externalId,
            displayName: groupData.displayName,
            meta: {
              resourceType: "Group",
              created: mockedTime.toISOString(),
              lastModified: mockedTime.toISOString(),
            },
            members: [],
          }
          expect(response).toEqual(expectedScimGroup)

          const persistedGroups = await config.api.scimGroupsAPI.get()
          expect(persistedGroups).toEqual(
            expect.objectContaining({
              totalResults: 1,
              Resources: [expectedScimGroup],
            })
          )
        })
      })
    })

    describe("GET /api/global/scim/v2/groups/:id", () => {
      let group: ScimGroupResponse

      beforeEach(async () => {
        const body = structures.scim.createGroupRequest()

        group = await config.api.scimGroupsAPI.post({ body })
      })

      const findScimGroup = config.api.scimGroupsAPI.find

      it("unauthorised calls are not allowed", async () => {
        const response = await findScimGroup(group.id, {
          setHeaders: false,
          expect: 403,
        })

        expect(response).toEqual({ message: "Tenant id not set", status: 403 })
      })

      it("cannot be called when feature is disabled", async () => {
        mocks.licenses.useCloudFree()
        const response = await findScimGroup(group.id, { expect: 400 })

        expect(response).toEqual(featureDisabledResponse)
      })

      it("should return existing group", async () => {
        const response = await findScimGroup(group.id)

        expect(response).toEqual(group)
      })

      it("should return 404 when requesting unexisting group id", async () => {
        const response = await findScimGroup(structures.uuid(), { expect: 404 })

        expect(response).toEqual({
          message: "missing",
          status: 404,
        })
      })
    })

    describe("DELETE /api/global/scim/v2/groups/:id", () => {
      const deleteScimGroup = config.api.scimGroupsAPI.delete

      let group: ScimGroupResponse

      beforeEach(async () => {
        const body = structures.scim.createGroupRequest()

        group = await config.api.scimGroupsAPI.post({ body })
      })

      it("unauthorised calls are not allowed", async () => {
        const response = await deleteScimGroup(group.id, {
          setHeaders: false,
          expect: 403,
        })

        expect(response).toEqual({ message: "Tenant id not set", status: 403 })
      })

      it("cannot be called when feature is disabled", async () => {
        mocks.licenses.useCloudFree()
        const response = await deleteScimGroup(group.id, { expect: 400 })

        expect(response).toEqual(featureDisabledResponse)
      })

      it("an existing group can be deleted", async () => {
        const response = await deleteScimGroup(group.id, { expect: 204 })

        expect(response).toEqual({})

        await config.api.scimGroupsAPI.find(group.id, { expect: 404 })
      })

      it("an non existing group can not be deleted", async () => {
        await deleteScimGroup(structures.uuid(), { expect: 404 })
      })
    })

    describe("PATCH /api/global/scim/v2/groups/:id", () => {
      const patchScimGroup = config.api.scimGroupsAPI.patch

      let group: ScimGroupResponse
      let users: ScimUserResponse[]

      beforeAll(async () => {
        users = []
        for (let i = 0; i < 30; i++) {
          const body = structures.scim.createUserRequest()
          users.push(await config.api.scimUsersAPI.post({ body }))
        }

        users = users.sort((a, b) => (a.id > b.id ? 1 : -1))

        const body = structures.scim.createGroupRequest()
        group = await config.api.scimGroupsAPI.post({ body })
      })

      it("unauthorised calls are not allowed", async () => {
        const response = await patchScimGroup({} as any, {
          setHeaders: false,
          expect: 403,
        })

        expect(response).toEqual({ message: "Tenant id not set", status: 403 })
      })

      it("cannot be called when feature is disabled", async () => {
        mocks.licenses.useCloudFree()
        const response = await patchScimGroup({} as any, { expect: 400 })

        expect(response).toEqual(featureDisabledResponse)
      })

      it("an existing group can be updated", async () => {
        const newDisplayName = structures.generator.word()

        const body: ScimUpdateRequest = {
          schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
          Operations: [
            {
              op: "Replace",
              path: "displayName",
              value: newDisplayName,
            },
          ],
        }

        const response = await patchScimGroup({ id: group.id, body })

        const expectedScimGroup = {
          ...group,
          displayName: newDisplayName,
        }
        expect(response).toEqual(expectedScimGroup)

        const persistedGroup = await config.api.scimGroupsAPI.find(group.id)
        expect(persistedGroup).toEqual(expectedScimGroup)
      })

      describe("adding users", () => {
        beforeAll(async () => {
          const body = structures.scim.createGroupRequest()
          group = await config.api.scimGroupsAPI.post({ body })
        })

        it("a new user can be added to an existing group", async () => {
          const userToAdd = users[0]

          const body: ScimUpdateRequest = {
            schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
            Operations: [
              {
                op: "Add",
                path: "members",
                value: [
                  {
                    $ref: null,
                    value: userToAdd.id,
                  },
                ],
              },
            ],
          }

          const response = await patchScimGroup({ id: group.id, body })

          const expectedScimGroup: ScimGroupResponse = {
            ...group,
            members: [
              {
                value: userToAdd.id,
              },
            ],
          }
          expect(response).toEqual(expectedScimGroup)

          const persistedGroup = await config.api.scimGroupsAPI.find(group.id)
          expect(persistedGroup).toEqual(expectedScimGroup)
        })

        it("multiple users can be added to an existing group", async () => {
          const body: ScimUpdateRequest = {
            schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
            Operations: [
              {
                op: "Add",
                path: "members",
                value: [
                  {
                    $ref: null,
                    value: users[1].id,
                  },
                  {
                    $ref: null,
                    value: users[2].id,
                  },
                  {
                    $ref: null,
                    value: users[3].id,
                  },
                ],
              },
            ],
          }

          const response = await patchScimGroup({ id: group.id, body })

          const expectedScimGroup: ScimGroupResponse = {
            ...group,
            members: [
              {
                value: users[0].id,
              },
              {
                value: users[1].id,
              },
              {
                value: users[2].id,
              },
              {
                value: users[3].id,
              },
            ],
          }
          expect(response).toEqual(expectedScimGroup)

          const persistedGroup = await config.api.scimGroupsAPI.find(group.id)
          expect(persistedGroup).toEqual(expectedScimGroup)
        })

        it("existing users can be removed from to an existing group", async () => {
          const body: ScimUpdateRequest = {
            schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
            Operations: [
              {
                op: "Remove",
                path: "members",
                value: [
                  {
                    $ref: null,
                    value: users[0].id,
                  },
                  {
                    $ref: null,
                    value: users[2].id,
                  },
                ],
              },
            ],
          }

          const response = await patchScimGroup({ id: group.id, body })

          const expectedScimGroup: ScimGroupResponse = {
            ...group,
            members: expect.arrayContaining([
              {
                value: users[1].id,
              },
              {
                value: users[3].id,
              },
            ]),
          }
          expect(response).toEqual(expectedScimGroup)

          const persistedGroup = await config.api.scimGroupsAPI.find(group.id)
          expect(persistedGroup).toEqual(expectedScimGroup)
        })

        it("adding and removing can be added in a single operation", async () => {
          const body: ScimUpdateRequest = {
            schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
            Operations: [
              {
                op: "Remove",
                path: "members",
                value: [
                  {
                    $ref: null,
                    value: users[1].id,
                  },
                ],
              },
              {
                op: "Add",
                path: "members",
                value: [
                  {
                    $ref: null,
                    value: users[4].id,
                  },
                ],
              },
            ],
          }

          const response = await patchScimGroup({ id: group.id, body })

          const expectedScimGroup: ScimGroupResponse = {
            ...group,
            members: expect.arrayContaining([
              {
                value: users[3].id,
              },
              {
                value: users[4].id,
              },
            ]),
          }
          expect(response).toEqual(expectedScimGroup)

          const persistedGroup = await config.api.scimGroupsAPI.find(group.id)
          expect(persistedGroup).toEqual(expectedScimGroup)
        })

        it("adding members and updating fields can performed in a single operation", async () => {
          const newDisplayName = structures.generator.word()

          const body: ScimUpdateRequest = {
            schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
            Operations: [
              {
                op: "Replace",
                path: "displayName",
                value: newDisplayName,
              },
              {
                op: "Add",
                path: "members",
                value: [
                  {
                    $ref: null,
                    value: users[5].id,
                  },
                ],
              },
            ],
          }

          const response = await patchScimGroup({ id: group.id, body })

          const expectedScimGroup: ScimGroupResponse = {
            ...group,
            displayName: newDisplayName,
            members: expect.arrayContaining([
              {
                value: users[3].id,
              },
              {
                value: users[4].id,
              },
              {
                value: users[5].id,
              },
            ]),
          }
          expect(response).toEqual(expectedScimGroup)

          const persistedGroup = await config.api.scimGroupsAPI.find(group.id)
          expect(persistedGroup).toEqual(expectedScimGroup)
        })
      })
    })
  })
})
