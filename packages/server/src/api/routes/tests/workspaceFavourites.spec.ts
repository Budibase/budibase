import {
  Automation,
  Datasource,
  Query,
  Table,
  User,
  ViewV2,
  WorkspaceApp,
  WorkspaceResource,
} from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import {
  basicAutomation,
  basicQuery,
  basicTable,
  basicView,
} from "../../../tests/utilities/structures"
import * as setup from "./utilities"
import { structures } from "@budibase/backend-core/tests"
import { utils } from "@budibase/backend-core"

describe("/workspace", () => {
  const config = new TestConfiguration()

  let altUser: User
  let table: Table
  let datasource: Datasource
  let query: Query
  let viewV2: ViewV2
  let automation: Automation
  let workspaceApp: WorkspaceApp

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()
    altUser = await config.createUser({ _id: `us_${utils.newid()}` })
    datasource = await config.createDatasource()
  })

  beforeEach(async () => {})

  const resourceCreators: Partial<
    Record<WorkspaceResource, (opts?: any) => Promise<any>>
  > = {
    [WorkspaceResource.TABLE]: async () =>
      await config.api.table.save(basicTable()),

    [WorkspaceResource.VIEW]: async (opts?: any) =>
      await config.api.viewV2.create(basicView(opts?.tableId!)),

    [WorkspaceResource.QUERY]: async () =>
      await config.api.query.save(basicQuery(datasource?._id!)),

    [WorkspaceResource.AUTOMATION]: async () => {
      const resp = await config.api.automation.post(basicAutomation())
      return resp.automation
    },
    [WorkspaceResource.WORKSPACE_APP]: async () => {
      const resp = await config.api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "Test Workspace App",
          url: "/testapp",
        })
      )
      return resp.workspaceApp
    },
  } as const

  const createResource = async (
    resourceType: WorkspaceResource,
    opts?: any
  ) => {
    const creator = resourceCreators[resourceType]
    if (!creator) {
      throw new Error(`Unsupported resource type: ${resourceType}`)
    }
    return await creator(opts)
  }

  const favouriteAndVerify = async (
    resourceId: string,
    resourceType: WorkspaceResource
  ) => {
    const resp = await config.api.workspaceFavourites.save({
      resourceType,
      resourceId,
    })

    expect(resp).toEqual(
      expect.objectContaining({
        createdBy: config.user?._id!,
        resourceType,
        resourceId,
      })
    )
  }
  // Favourite each supported type
  it("should be able to favourite a valid table", async () => {
    table = await createResource(WorkspaceResource.TABLE)
    await favouriteAndVerify(table._id!, WorkspaceResource.TABLE)
  })

  it("should be able to favourite a valid view", async () => {
    viewV2 = await createResource(WorkspaceResource.VIEW, {
      tableId: table._id,
    })

    await favouriteAndVerify(viewV2.id!, WorkspaceResource.VIEW)
  })

  it("should be able to favourite a valid query", async () => {
    query = await createResource(WorkspaceResource.QUERY)
    await favouriteAndVerify(query._id!, WorkspaceResource.QUERY)
  })

  it("should be able to favourite a valid automation", async () => {
    automation = await createResource(WorkspaceResource.AUTOMATION)
    await favouriteAndVerify(automation._id!, WorkspaceResource.AUTOMATION)
  })

  it("should be able to favourite a valid workspace app", async () => {
    workspaceApp = await createResource(WorkspaceResource.WORKSPACE_APP)
    await favouriteAndVerify(workspaceApp._id!, WorkspaceResource.WORKSPACE_APP)
  })

  // All types will check their respective sources. Its important to check
  // all dupe attempts fail.
  it("should not allow a duplicate favourite of any resource type", async () => {
    const resources = [
      { resource: table, type: WorkspaceResource.TABLE },
      { resource: viewV2, type: WorkspaceResource.VIEW },
      { resource: query, type: WorkspaceResource.QUERY },
      { resource: automation, type: WorkspaceResource.AUTOMATION },
      { resource: workspaceApp, type: WorkspaceResource.WORKSPACE_APP },
    ]

    for (const { resource, type } of resources) {
      const id = "version" in resource ? resource.id : resource._id

      // Duplicate save should fail with 409
      await config.api.workspaceFavourites.save(
        {
          resourceType: type,
          resourceId: id!,
        },
        { status: 409 }
      )
    }
  })

  it("should not allow the creation of a favourite for a resource that cannot be found", async () => {
    for (const type of Object.values(WorkspaceResource)) {
      await config.api.workspaceFavourites.save(
        {
          resourceType: type,
          resourceId: "complete_rubbish",
        },
        { status: 404 }
      )
    }
  })

  it("should fetch all the users favourited resources", async () => {
    const resources = [table, viewV2, query, automation, workspaceApp]
    const resp = await config.api.workspaceFavourites.fetchAll()

    expect(resp.favourites.length).toBe(5)

    const resourceIds = resources.map(r => ("version" in r ? r.id : r._id))
    const favouriteResourceIds = resp.favourites.map(r => r.resourceId)

    const mergedSet = new Set([...resourceIds, ...favouriteResourceIds])

    // Should have no dupe ids
    expect(mergedSet.size).toBe(5)
  })

  it("should fetch a different users favourites based on the current users context", async () => {
    await config.withUser(altUser, async () => {
      const resp = await config.api.workspaceFavourites.fetchAll()
      // This user shouldn't have any, even though the default user has 5
      expect(resp.favourites.length).toBe(0)
    })
  })

  it("should allow different users to favourite the same resources", async () => {
    await config.withUser(altUser, async () => {
      // Favourite existing, favourite resources
      await config.api.workspaceFavourites.save({
        resourceType: WorkspaceResource.WORKSPACE_APP,
        resourceId: workspaceApp._id!,
      })

      await config.api.workspaceFavourites.save({
        resourceType: WorkspaceResource.AUTOMATION,
        resourceId: automation._id!,
      })

      const resp = await config.api.workspaceFavourites.fetchAll()

      // The alt user, should now have their own favourites
      expect(resp.favourites.length).toBe(2)
    })
  })

  it("should allow the default user to delete their favourites", async () => {
    const resp = await config.api.workspaceFavourites.fetchAll()
    const target = resp.favourites[0]

    // Delete the target from the users favourites
    const deleteResp = await config.api.workspaceFavourites.delete(target)
    expect(deleteResp.id).toBe(target._id)

    // Confirm its missing
    const updated = await config.api.workspaceFavourites.fetchAll()
    expect(updated.favourites.length).toBe(4)

    const found = updated.favourites.find(f => f._id === target._id)
    expect(found).toBeUndefined()
  })

  it("should allow the alt user to delete their favourites", async () => {
    await config.withUser(altUser, async () => {
      const resp = await config.api.workspaceFavourites.fetchAll()
      const target = resp.favourites[0]

      // Delete the target from the alt users favourites
      const deleteResp = await config.api.workspaceFavourites.delete(target)
      expect(deleteResp.id).toBe(target._id)

      // Confirm its missing
      const updated = await config.api.workspaceFavourites.fetchAll()
      expect(updated.favourites.length).toBe(1)

      const found = updated.favourites.find(f => f._id === target._id)
      expect(found).toBeUndefined()
    })
  })

  it("should gracefully handle attempts to delete invalid favourites", async () => {
    await config.api.workspaceFavourites.delete(
      {
        _id: "nonsense",
        _rev: "nonsense",
        resourceType: WorkspaceResource.QUERY,
        resourceId: "",
        createdBy: "",
      },
      { status: 404 }
    )
  })
})
