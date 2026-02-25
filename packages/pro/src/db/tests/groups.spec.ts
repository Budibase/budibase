import { structures } from "@budibase/backend-core/tests"
import { DBTestConfiguration } from "../../../tests"
import { getByName, save } from "../groups"
import { DocumentType } from "@budibase/types"
import _ from "lodash"

describe("groups", () => {
  describe("getByName", () => {
    const config = new DBTestConfiguration()

    it("when a group exists, it can be found when searched by name", async () => {
      const existingGroup = {
        _id: `${DocumentType.GROUP}_${structures.generator.guid()}`,
        ...structures.userGroups.userGroup(),
      }
      await config.doInTenant(async () => {
        await save(existingGroup)

        const result = await getByName(existingGroup.name)
        expect(result!._id).toBe(existingGroup._id)
      })
    })

    it("when multiple groups exist, a specific one can be found when searched by name", async () => {
      const existingGroups = Array.from({ length: 10 }, () => ({
        _id: `${DocumentType.GROUP}_${structures.generator.guid()}`,
        ...structures.userGroups.userGroup(),
      }))
      const groupToSearch = _.sample(existingGroups)!
      await config.doInTenant(async () => {
        for (const g of existingGroups) {
          await save(g)
        }

        const result = await getByName(groupToSearch.name)
        expect(result!._id).toBe(groupToSearch._id)
      })
    })

    it("when groups exist, searching for an unexisting one returns undefined", async () => {
      const existingGroup = {
        _id: `${DocumentType.GROUP}_${structures.generator.guid()}`,
        ...structures.userGroups.userGroup(),
      }
      await config.doInTenant(async () => {
        await save(existingGroup)

        const result = await getByName(structures.generator.name())
        expect(result).toBeUndefined()
      })
    })

    it("a group search ignores case sensitivity", async () => {
      const existingGroup = {
        _id: `${DocumentType.GROUP}_${structures.generator.guid()}`,
        ...structures.userGroups.userGroup(),
        name: "group to search",
      }
      await config.doInTenant(async () => {
        await save(existingGroup)

        const result = await getByName("GROUP to search")
        expect(result?._id).toBe(existingGroup._id)
      })
    })

    it("a group search must match the full name", async () => {
      const existingGroup = {
        _id: `${DocumentType.GROUP}_${structures.generator.guid()}`,
        ...structures.userGroups.userGroup(),
        name: "group to search",
      }
      await config.doInTenant(async () => {
        await save(existingGroup)

        const result = await getByName("group")
        expect(result).toBeUndefined()
      })
    })
  })
})
