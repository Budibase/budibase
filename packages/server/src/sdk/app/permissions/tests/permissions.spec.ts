import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { PermissionLevel } from "@budibase/types"
import { mocks, structures } from "@budibase/backend-core/tests"
import { resourceActionAllowed } from ".."
import { generateViewID } from "../../../../db/utils"

describe("permissions sdk", () => {
  beforeEach(() => {
    new TestConfiguration()
    mocks.licenses.useCloudFree()
  })

  describe("resourceActionAllowed", () => {
    it("non view resources actions are always allowed", async () => {
      const resourceId = structures.users.user()._id!

      const result = await resourceActionAllowed({
        resourceId,
        level: PermissionLevel.READ,
      })

      expect(result).toEqual({ allowed: true })
    })

    it("view resources actions allowed if the feature flag is enabled", async () => {
      mocks.licenses.useViewPermissions()
      const resourceId = generateViewID(structures.generator.guid())

      const result = await resourceActionAllowed({
        resourceId,
        level: PermissionLevel.READ,
      })

      expect(result).toEqual({ allowed: true })
    })

    it("view resources actions allowed if the feature flag is disabled", async () => {
      const resourceId = generateViewID(structures.generator.guid())

      const result = await resourceActionAllowed({
        resourceId,
        level: PermissionLevel.READ,
      })

      expect(result).toEqual({
        allowed: false,
        level: "read",
        resourceType: "view",
      })
    })
  })
})
