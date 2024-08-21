import tk from "timekeeper"
import _ from "lodash"
import { generator, mocks, structures } from "@budibase/backend-core/tests"
import {
  CloudAccount,
  ScimCreateUserRequest,
  ScimGroupResponse,
  ScimUpdateRequest,
  ScimUserResponse,
} from "@budibase/types"
import { TestConfiguration } from "../../../../tests"
import { events } from "@budibase/backend-core"

jest.setTimeout(30000)

describe("scim", () => {
  async function setup() {
    jest.resetAllMocks()
    tk.freeze(mocks.date.MOCK_DATE)
    mocks.licenses.useScimIntegration()
    mocks.licenses.useGroups()

    await config.setSCIMConfig(true)
  }

  beforeAll(setup)
  beforeEach(setup)

  const config = new TestConfiguration()

  const unauthorisedTests = (fn: (...params: any) => Promise<any>) => {
    describe("unauthorised calls", () => {
      it("unauthorised calls are not allowed", async () => {
        const response = await fn(...Array(fn.length - 1).fill({}), {
          setHeaders: false,
          expect: 403,
        })

        expect(response).toEqual({ message: "Tenant id not set", status: 403 })
      })

      it("cannot be called when feature is disabled", async () => {
        mocks.licenses.useCloudFree()
        const response = await fn(...Array(fn.length - 1).fill({}), {
          expect: 400,
        })

        expect(response).toEqual({
          error: {
            code: "feature_disabled",
            featureName: "scim",
          },
          message: "scim is not currently enabled",
          status: 400,
        })
      })

      it("cannot be called when feature is enabled but the config disabled", async () => {
        await config.setSCIMConfig(false)
        const response = await fn(...Array(fn.length - 1).fill({}), {
          expect: 400,
        })

        expect(response).toEqual({
          error: {
            code: "feature_disabled",
            featureName: "scim",
          },
          message: "scim is not currently enabled",
          status: 400,
        })
      })
    })
  }

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  describe("/api/global/scim/v2/users", () => {
    describe("GET /api/global/scim/v2/users", () => {
      const getScimUsers = config.api.scimUsersAPI.get

      unauthorisedTests(getScimUsers)

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
                `emails[type eq "work"].value eq "${
                  userToFetch?.emails![0].value
                }"`
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

      unauthorisedTests(postScimUser)

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

        it("a new user can minim information", async () => {
          const userData = {
            externalId: structures.uuid(),
            email: structures.generator.email(),
            username: structures.generator.name(),
            firstName: undefined,
            lastName: undefined,
          }
          const body = structures.scim.createUserRequest(userData)

          const response = await postScimUser({ body })

          const expectedScimUser = {
            schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"],
            id: expect.any(String),
            externalId: userData.externalId,
            meta: {
              resourceType: "User",
              created: mocks.date.MOCK_DATE.toISOString(),
              lastModified: mocks.date.MOCK_DATE.toISOString(),
            },
            userName: userData.username,
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
          expect(persistedUsers.Resources).toEqual(
            expect.arrayContaining([expectedScimUser])
          )
        })

        it("an event is dispatched", async () => {
          const body = structures.scim.createUserRequest()

          await postScimUser({ body })

          expect(events.user.created).toHaveBeenCalledTimes(1)
        })

        it("if the username is an email, the user name will be used as email", async () => {
          const email = structures.generator.email()

          const body: ScimCreateUserRequest = structures.scim.createUserRequest(
            { username: email }
          )
          delete body.emails

          await postScimUser({ body })

          const user = await config.getUser(email)
          expect(user).toBeDefined()
          expect(user!.email).toEqual(email)
        })

        it("if multiple emails are provided, the first primary one is used as email", async () => {
          const email = structures.generator.email()

          const body: ScimCreateUserRequest = {
            ...structures.scim.createUserRequest(),
            emails: [
              {
                primary: false,
                type: "work",
                value: structures.generator.email(),
              },
              {
                primary: true,
                type: "work",
                value: email,
              },
              {
                primary: true,
                type: "work",
                value: structures.generator.email(),
              },
            ],
          }

          await postScimUser({ body })

          const user = await config.getUser(email)
          expect(user).toBeDefined()
          expect(user!.email).toEqual(email)
        })

        it("if no email is provided and the user name is not an email, an exception is thrown", async () => {
          const body: ScimCreateUserRequest = structures.scim.createUserRequest(
            { username: structures.generator.name() }
          )
          delete body.emails

          await postScimUser({ body }, { expect: 500 })
        })
      })

      it("creating an external user that conflicts an internal one syncs the existing user", async () => {
        const { body: internalUser } = await config.api.users.saveUser(
          structures.users.user()
        )

        const scimUserData = {
          externalId: structures.uuid(),
          email: internalUser.email,
          firstName: structures.generator.first(),
          lastName: structures.generator.last(),
          username: structures.generator.name(),
        }
        const scimUserRequest = structures.scim.createUserRequest(scimUserData)

        const res = await postScimUser(
          { body: scimUserRequest },
          { expect: 200 }
        )

        const expectedScimUser: ScimUserResponse = {
          schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"],
          id: internalUser._id!,
          externalId: scimUserRequest.externalId,
          meta: {
            resourceType: "User",
            // @ts-ignore
            created: mocks.date.MOCK_DATE.toISOString(),
            // @ts-ignore
            lastModified: mocks.date.MOCK_DATE.toISOString(),
          },
          userName: scimUserData.username,
          name: {
            formatted: `${scimUserData.firstName} ${scimUserData.lastName}`,
            familyName: scimUserData.lastName,
            givenName: scimUserData.firstName,
          },
          active: true,
          emails: [
            {
              value: internalUser.email,
              type: "work",
              primary: true,
            },
          ],
        }

        expect(res).toEqual(expectedScimUser)
      })

      it("a user cannot be SCIM synchronised with another SCIM user", async () => {
        const { body: internalUser } = await config.api.users.saveUser(
          structures.users.user()
        )

        await postScimUser(
          {
            body: structures.scim.createUserRequest({
              email: internalUser.email,
            }),
          },
          { expect: 200 }
        )

        await postScimUser(
          {
            body: structures.scim.createUserRequest({
              email: internalUser.email,
            }),
          },
          { expect: 409 }
        )
      })
    })

    describe("GET /api/global/scim/v2/users/:id", () => {
      let user: ScimUserResponse

      beforeAll(async () => {
        const body = structures.scim.createUserRequest()

        user = await config.api.scimUsersAPI.post({ body })
      })

      const findScimUser = config.api.scimUsersAPI.find

      unauthorisedTests(findScimUser)

      it("should return existing user", async () => {
        const response = await findScimUser(user.id)

        expect(response).toEqual(user)
      })

      it("should return 404 when requesting unexisting user id", async () => {
        const response = await findScimUser(structures.uuid(), { expect: 404 })

        expect(response).toEqual(
          expect.objectContaining({
            status: 404,
          })
        )
      })
    })

    describe("PATCH /api/global/scim/v2/users/:id", () => {
      const patchScimUser = config.api.scimUsersAPI.patch

      let user: ScimUserResponse

      beforeEach(async () => {
        const body = structures.scim.createUserRequest()

        user = await config.api.scimUsersAPI.post({ body })
      })

      unauthorisedTests(patchScimUser)

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
            formatted: `${user.name!.givenName} ${newFamilyName}`,
          },
        }
        expect(response).toEqual(expectedScimUser)

        const persistedUser = await config.api.scimUsersAPI.find(user.id)
        expect(persistedUser).toEqual(expectedScimUser)
      })

      it.each([false, "false", "False"])(
        "deactivating an active user (sending %s) will delete it",
        async activeValue => {
          const body: ScimUpdateRequest = {
            schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
            Operations: [{ op: "Replace", path: "active", value: activeValue }],
          }

          await patchScimUser(
            { id: user.id, body },
            { expect: 204, skipContentTypeCheck: true }
          )

          await config.api.scimUsersAPI.find(user.id, { expect: 404 })
        }
      )

      it("supports updating unmapped fields", async () => {
        const value = structures.generator.letter()
        const body: ScimUpdateRequest = {
          schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
          Operations: [
            {
              op: "Add",
              path: "preferredLanguage",
              value,
            },
          ],
        }

        const response = await patchScimUser({ id: user.id, body })

        const expectedScimUser = {
          ...user,
          preferredLanguage: value,
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

        expect(events.user.updated).toHaveBeenCalledTimes(1)
      })

      it("an existing user's email can be updated", async () => {
        const newEmail = structures.generator.email()
        const body: ScimUpdateRequest = {
          schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
          Operations: [
            {
              op: "Replace",
              path: 'emails[type eq "work"].value',
              value: newEmail,
            },
          ],
        }

        const response = await patchScimUser({ id: user.id, body })

        const expectedScimUser: ScimUserResponse = {
          ...user,
          emails: [
            {
              value: newEmail,
              type: "work",
              primary: true,
            },
          ],
        }
        expect(response).toEqual(expectedScimUser)

        const persistedUser = await config.api.scimUsersAPI.find(user.id)
        expect(persistedUser).toEqual(expectedScimUser)

        expect((await config.api.users.getUser(user.id)).body).toEqual(
          expect.objectContaining({ _id: user.id, email: newEmail })
        )
      })
    })

    describe("DELETE /api/global/scim/v2/users/:id", () => {
      const deleteScimUser = config.api.scimUsersAPI.delete

      let user: ScimUserResponse

      beforeEach(async () => {
        const body = structures.scim.createUserRequest()

        user = await config.api.scimUsersAPI.post({ body })
      })

      unauthorisedTests(deleteScimUser)

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

        expect(events.user.deleted).toHaveBeenCalledTimes(1)
      })

      it("an account holder cannot be removed even when synched", async () => {
        const account: CloudAccount = {
          ...structures.accounts.account(),
          budibaseUserId: user.id,
          email: user.emails![0].value,
        }
        mocks.accounts.getAccount.mockResolvedValue(account)

        await deleteScimUser(user.id, {
          expect: {
            message: "Account holder cannot be deleted",
            status: 400,
            error: { code: "http" },
          },
        })

        await config.api.scimUsersAPI.find(user.id, { expect: 200 })
      })
    })
  })

  describe("/api/global/scim/v2/groups", () => {
    describe("GET /api/global/scim/v2/groups", () => {
      const getScimGroups = config.api.scimGroupsAPI.get

      unauthorisedTests(getScimGroups)

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

          const groupNames = generator.unique(
            () => generator.word(),
            groupCount
          )

          for (const groupName of groupNames) {
            const body = structures.scim.createGroupRequest({
              displayName: groupName,
            })
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

        it("can fetch groups using displayName filters", async () => {
          const groupToFetch = _.sample(groups)
          const response = await getScimGroups({
            params: { filter: `displayName eq "${groupToFetch!.displayName}"` },
          })

          expect(response).toEqual({
            Resources: [groupToFetch],
            itemsPerPage: 1,
            schemas: ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
            startIndex: 1,
            totalResults: 1,
          })
        })

        it("can fetch groups excluding members", async () => {
          const response = await getScimGroups({
            params: { excludedAttributes: "members" },
          })

          expect(response).toEqual({
            Resources: expect.arrayContaining(
              groups.map(g => {
                const { members, ...groupData } = g
                return groupData
              })
            ),
            itemsPerPage: 25,
            schemas: ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
            startIndex: 1,
            totalResults: groupCount,
          })
        })

        it("can fetch groups excluding multiple fields", async () => {
          const response = await getScimGroups({
            params: { excludedAttributes: "members,displayName" },
          })

          expect(response).toEqual({
            Resources: expect.arrayContaining(
              groups.map(g => {
                const { members, displayName, ...groupData } = g
                return groupData
              })
            ),
            itemsPerPage: 25,
            schemas: ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
            startIndex: 1,
            totalResults: groupCount,
          })
        })

        it("can fetch groups even if internal groups exist", async () => {
          await config.api.groups.saveGroup(structures.userGroups.userGroup())
          await config.api.groups.saveGroup(structures.userGroups.userGroup())

          const response = await getScimGroups()

          expect(response).toEqual({
            Resources: expect.arrayContaining(groups),
            itemsPerPage: 25,
            schemas: ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
            startIndex: 1,
            totalResults: groupCount,
          })

          expect((await config.api.groups.fetch()).body.data).toHaveLength(
            25 + 2 // scim groups + internal groups
          )
        })
      })
    })

    describe("POST /api/global/scim/v2/groups", () => {
      const postScimGroup = config.api.scimGroupsAPI.post

      beforeAll(async () => {
        await config.useNewTenant()
      })

      unauthorisedTests(postScimGroup)

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

      it("creating an external group that conflicts an internal one syncs the existing group", async () => {
        const groupToSave = structures.userGroups.userGroup()
        const { body: internalGroup } = await config.api.groups.saveGroup(
          groupToSave
        )

        const scimGroupData = {
          externalId: structures.uuid(),
          displayName: groupToSave.name,
        }

        const res = await postScimGroup(
          { body: structures.scim.createGroupRequest(scimGroupData) },
          { expect: 200 }
        )

        expect(res).toEqual(
          expect.objectContaining({
            id: internalGroup._id!,
            externalId: scimGroupData.externalId,
            displayName: scimGroupData.displayName,
          })
        )
      })

      it("a group cannot be SCIM synchronised with another SCIM group", async () => {
        const groupToSave = structures.userGroups.userGroup()
        await config.api.groups.saveGroup(groupToSave)

        const createGroupRequest = structures.scim.createGroupRequest({
          displayName: groupToSave.name,
        })
        await postScimGroup({ body: createGroupRequest }, { expect: 200 })

        await postScimGroup({ body: createGroupRequest }, { expect: 409 })
      })
    })

    describe("GET /api/global/scim/v2/groups/:id", () => {
      let group: ScimGroupResponse

      beforeAll(async () => {
        const body = structures.scim.createGroupRequest()

        group = await config.api.scimGroupsAPI.post({ body })
      })

      const findScimGroup = config.api.scimGroupsAPI.find

      unauthorisedTests(findScimGroup)

      it("should return existing group", async () => {
        const response = await findScimGroup(group.id)

        expect(response).toEqual(group)
      })

      it("should return 404 when requesting unexisting group id", async () => {
        const response = await findScimGroup(structures.uuid(), { expect: 404 })

        expect(response).toEqual(
          expect.objectContaining({
            status: 404,
          })
        )
      })

      it("should allow excluding members", async () => {
        const response = await findScimGroup(group.id, {
          qs: "excludedAttributes=members",
        })

        const { members, ...expectedResponse } = group

        expect(response).toEqual(expectedResponse)
      })
    })

    describe("DELETE /api/global/scim/v2/groups/:id", () => {
      const deleteScimGroup = config.api.scimGroupsAPI.delete

      let group: ScimGroupResponse

      beforeAll(async () => {
        const body = structures.scim.createGroupRequest()

        group = await config.api.scimGroupsAPI.post({ body })
      })

      unauthorisedTests(deleteScimGroup)

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

      unauthorisedTests(patchScimGroup)

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
