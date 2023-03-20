import tk from "timekeeper"
import _ from "lodash"
import { mocks, structures } from "@budibase/backend-core/tests"
import { ScimCreateGroupRequest, ScimGroupResponse } from "@budibase/types"
import { TestConfiguration } from "../../../../../tests"

mocks.licenses.useScimIntegration()

function createScimCreateGroupRequest(groupData?: {
  externalId?: string
  displayName?: string
}) {
  const {
    externalId = structures.uuid(),
    displayName = structures.generator.word(),
  } = groupData || {}

  const group: ScimCreateGroupRequest = {
    schemas: [
      "urn:ietf:params:scim:schemas:core:2.0:Group",
      "http://schemas.microsoft.com/2006/11/ResourceManagement/ADSCIM/2.0/Group",
    ],
    externalId: externalId,
    displayName: displayName,
    meta: {
      resourceType: "Group",
    },
  }
  return group
}

describe("/api/global/scim/v2/groups", () => {
  beforeEach(() => {
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
          const body = createScimCreateGroupRequest()
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
      const response = await postScimGroup({ body: {} as any }, { expect: 400 })

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
        const body = createScimCreateGroupRequest(groupData)

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
})
