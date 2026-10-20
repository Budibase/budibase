import { context, roles } from "@budibase/backend-core"
import {
  PermissionLevel,
  PermissionType,
  Query,
  SourceName,
} from "@budibase/types"
import sdk from "../../../../sdk"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import {
  basicDatasource,
  basicQuery,
} from "../../../../tests/utilities/structures"

const { PUBLIC, BASIC } = roles.BUILTIN_ROLE_IDS

describe("MongoDB public query permissions", () => {
  const config = new TestConfiguration()
  let query: Query

  beforeAll(async () => {
    await config.init()
  })

  afterAll(async () => {
    await config.end()
  })

  beforeEach(async () => {
    const datasource = await config.api.datasource.create({
      ...basicDatasource().datasource,
      source: SourceName.MONGODB,
    })
    query = await config.api.query.save(basicQuery(datasource._id!))
  })

  const seedExistingPublicQuery = async () => {
    await config.doInContext(undefined, async () => {
      const db = context.getWorkspaceDB()
      const publicRole =
        (await sdk.permissions.getAllDBRoles(db)).find(
          role => role._id === roles.getDBRoleID(PUBLIC)
        ) || roles.getBuiltinRoles()[PUBLIC]
      await db.put({
        ...publicRole,
        _id: roles.getDBRoleID(PUBLIC),
        permissions: {
          ...publicRole.permissions,
          [query._id!]: [PermissionLevel.READ, PermissionLevel.WRITE],
        },
      })
    })
  }

  it.each([PermissionLevel.READ, PermissionLevel.WRITE])(
    "rejects new public %s grants through the permissions API",
    async level => {
      await config.api.permission.add(
        { roleId: PUBLIC, resourceId: query._id!, level },
        { status: 400 }
      )
      const result = await config.api.permission.get(query._id!)
      expect(result.permissions[level].role).not.toBe(PUBLIC)
    }
  )

  it("allows private access to MongoDB queries", async () => {
    await config.api.permission.add({
      roleId: BASIC,
      resourceId: query._id!,
      level: PermissionLevel.WRITE,
    })
    const result = await config.api.permission.get(query._id!)
    expect(result.permissions.write.role).toBe(BASIC)
  })

  it("preserves public access when an existing query is edited", async () => {
    await seedExistingPublicQuery()
    await config.api.query.save({ ...query, name: "Edited query" })
    await config.api.permission.add({
      roleId: PUBLIC,
      resourceId: query._id!,
      level: PermissionLevel.WRITE,
    })
    const allowed = await config.doInContext(undefined, () =>
      sdk.permissions.canRoleAccessResource({
        roleId: PUBLIC,
        resourceId: query._id!,
        permissionType: PermissionType.QUERY,
        permissionLevel: PermissionLevel.WRITE,
      })
    )
    expect(allowed).toBe(true)
  })

  it("cannot restore public access after making an existing query private", async () => {
    await seedExistingPublicQuery()
    await config.api.permission.add({
      roleId: BASIC,
      resourceId: query._id!,
      level: PermissionLevel.WRITE,
    })
    await config.api.permission.add(
      { roleId: PUBLIC, resourceId: query._id!, level: PermissionLevel.WRITE },
      { status: 400 }
    )
    const result = await config.api.permission.get(query._id!)
    expect(result.permissions.write.role).toBe(BASIC)
  })

  it("allows public REST queries but prevents changing their datasource to MongoDB", async () => {
    const datasource = await config.api.datasource.create({
      ...basicDatasource().datasource,
      source: SourceName.REST,
    })
    const restQuery = await config.api.query.save(basicQuery(datasource._id!))
    await config.api.permission.add({
      roleId: PUBLIC,
      resourceId: restQuery._id!,
      level: PermissionLevel.WRITE,
    })
    await config.api.query.save(
      { ...restQuery, datasourceId: query.datasourceId },
      { status: 400 }
    )
    expect((await config.api.query.get(restQuery._id!)).datasourceId).toBe(
      datasource._id
    )
    await config.api.datasource.update(
      { ...datasource, source: SourceName.MONGODB },
      { status: 400 }
    )
    expect((await config.api.datasource.get(datasource._id!)).source).toBe(
      SourceName.REST
    )
  })
})
