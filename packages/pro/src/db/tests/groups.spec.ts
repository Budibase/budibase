import { structures } from "@budibase/backend-core/tests"
import { DocumentType, UserGroup } from "@budibase/types"
import _ from "lodash"
import { DBTestConfiguration } from "../../../tests"
import { getByName, save } from "../groups"

describe("groups", () => {
  describe("getBulk", () => {
    beforeEach(() => {
      jest.resetModules()
    })

    it("runs group and workspace lookups in parallel when enrichment is enabled", async () => {
      await jest.isolateModulesAsync(async () => {
        let resolveGroups: (value: UserGroup[]) => void = () => {}
        let resolveWorkspaceIds: (value: string[]) => void = () => {}

        const groupsPromise = new Promise<UserGroup[]>(resolve => {
          resolveGroups = resolve
        })
        const workspaceIdsPromise = new Promise<string[]>(resolve => {
          resolveWorkspaceIds = resolve
        })
        const getMultipleMock = jest.fn<
          Promise<UserGroup[]>,
          [string[], { allowMissing: boolean }]
        >()
        const getAllWorkspacesMock = jest
          .fn()
          .mockReturnValue(workspaceIdsPromise)
        const getGlobalDBMock = jest.fn().mockReturnValue({
          getMultiple: getMultipleMock,
        })

        jest.doMock("@budibase/backend-core", () => {
          const core = jest.requireActual("@budibase/backend-core")
          return {
            ...core,
            db: {
              ...core.db,
              getAllWorkspaces: getAllWorkspacesMock,
            },
            tenancy: {
              ...core.tenancy,
              getGlobalDB: getGlobalDBMock,
            },
          }
        })
        const { getBulk } = await import("../groups")

        getMultipleMock.mockReturnValue(groupsPromise)

        const resultPromise = getBulk(["group_1"], { enriched: true })

        expect(getMultipleMock).toHaveBeenCalledTimes(1)
        expect(getAllWorkspacesMock).toHaveBeenCalledTimes(1)

        resolveGroups([])
        resolveWorkspaceIds([])

        await expect(resultPromise).resolves.toEqual([])
      })
    })

    it("skips workspace lookup when enrichment is disabled", async () => {
      await jest.isolateModulesAsync(async () => {
        const getMultipleMock = jest.fn<
          Promise<UserGroup[]>,
          [string[], { allowMissing: boolean }]
        >()
        const getAllWorkspacesMock = jest.fn()
        const getGlobalDBMock = jest.fn().mockReturnValue({
          getMultiple: getMultipleMock,
        })

        jest.doMock("@budibase/backend-core", () => {
          const core = jest.requireActual("@budibase/backend-core")
          return {
            ...core,
            db: {
              ...core.db,
              getAllWorkspaces: getAllWorkspacesMock,
            },
            tenancy: {
              ...core.tenancy,
              getGlobalDB: getGlobalDBMock,
            },
          }
        })
        const { getBulk } = await import("../groups")

        getMultipleMock.mockResolvedValue([])

        await expect(
          getBulk(["group_1"], { enriched: false })
        ).resolves.toEqual([])
        expect(getAllWorkspacesMock).not.toHaveBeenCalled()
      })
    })
  })

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
