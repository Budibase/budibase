import { events } from "@budibase/backend-core"
import { structures, TestConfiguration } from "../../../../tests"
import { constants } from "@budibase/pro"
import { Feature, License, Quotas } from "@budibase/types"

const mockGetCachedLicense = jest.fn()

jest.mock("@budibase/pro", () => {
  const pro = jest.requireActual("@budibase/pro")
  return {
    ...pro,
    licensing: {
      ...pro.licensing,
      cache: {
        getCachedLicense: () => mockGetCachedLicense,
      },
    },
    users: {
      ...pro.users,
      // Throws an error if this isn't mocked
      createActivity: jest.fn(),
    },
  }
})

interface UseLicenseOpts {
  features?: Feature[]
  quotas?: Quotas
}

export const useLicense = (license: License, opts?: UseLicenseOpts) => {
  if (opts) {
    if (opts.features) {
      license.features.push(...opts.features)
    }
    if (opts.quotas) {
      license.quotas = opts.quotas
    }
  }
  mockGetCachedLicense.mockReturnValue(license)

  return license
}

const useFeature = (feature: Feature) => {
  const license = constants.licenses.CLOUD_FREE_LICENSE
  const opts: UseLicenseOpts = {
    features: [feature],
  }

  return useLicense(license, opts)
}

/*
describe("/api/global/groups", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    useFeature(Feature.USER_GROUPS)
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  describe("create", () => {
    it("should be able to create a new group", async () => {
      const group = structures.groups.UserGroup()
      await config.api.groups.saveGroup(group)

      expect(events.group.created).toBeCalledTimes(1)
      expect(events.group.updated).not.toBeCalled()
      expect(events.group.permissionsEdited).not.toBeCalled()
    })
  })

  describe("update", () => {
    it("should be able to update a basic group", async () => {
      const group = structures.groups.UserGroup()
      let oldGroup = await config.api.groups.saveGroup(group)

      let updatedGroup = {
        ...oldGroup.body,
        ...group,
        name: "New Name",
      }
      await config.api.groups.saveGroup(updatedGroup)

      expect(events.group.updated).toBeCalledTimes(1)
      expect(events.group.permissionsEdited).not.toBeCalled()
    })

    describe("destroy", () => {
      it("should be able to delete a basic group", async () => {
        const group = structures.groups.UserGroup()
        let oldGroup = await config.api.groups.saveGroup(group)
        await config.api.groups.deleteGroup(
          oldGroup.body._id,
          oldGroup.body._rev
        )

        expect(events.group.deleted).toBeCalledTimes(1)
      })
    })
  })
})
*/
