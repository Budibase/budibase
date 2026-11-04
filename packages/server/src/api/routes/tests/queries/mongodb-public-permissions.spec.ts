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
  basicRole,
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

  it.each([BASIC, PUBLIC])(
    "preserves custom role access when the role inherits from %s",
    async inherits => {
      const role = await config.api.roles.save({ ...basicRole(), inherits })
      const roleId = roles.getExternalRoleID(role._id!, role.version)
      for (const level of [PermissionLevel.READ, PermissionLevel.WRITE]) {
        await config.api.permission.add({
          roleId,
          resourceId: query._id!,
          level,
        })
      }

      await config.api.query.save({
        ...query,
        name: "Custom role query edited",
      })

      await config.api.permission.add(
        {
          roleId: PUBLIC,
          resourceId: query._id!,
          level: PermissionLevel.WRITE,
        },
        { status: 400 }
      )

      const result = await config.api.permission.get(query._id!)
      expect(result.permissions).toMatchObject({
        read: { role: roleId },
        write: { role: roleId },
      })
      await config.doInContext(undefined, async () => {
        for (const permissionLevel of [
          PermissionLevel.READ,
          PermissionLevel.WRITE,
        ]) {
          expect(
            await sdk.permissions.canRoleAccessResource({
              roleId,
              resourceId: query._id!,
              permissionType: PermissionType.QUERY,
              permissionLevel,
            })
          ).toBe(true)
          expect(
            await sdk.permissions.canRoleAccessResource({
              roleId: PUBLIC,
              resourceId: query._id!,
              permissionType: PermissionType.QUERY,
              permissionLevel,
            })
          ).toBe(false)
        }
      })
    }
  )

  it.each([PermissionLevel.READ, PermissionLevel.WRITE])(
    "denies existing public %s access",
    async permissionLevel => {
      await seedExistingPublicQuery()
      const allowed = await config.doInContext(undefined, () =>
        sdk.permissions.canRoleAccessResource({
          roleId: PUBLIC,
          resourceId: query._id!,
          permissionType: PermissionType.QUERY,
          permissionLevel,
        })
      )
      expect(allowed).toBe(false)
    }
  )

  it("rejects public access when an existing public query is edited", async () => {
    await seedExistingPublicQuery()
    await config.api.query.save({ ...query, name: "Edited query" })
    await config.api.permission.add(
      { roleId: PUBLIC, resourceId: query._id!, level: PermissionLevel.WRITE },
      { status: 400 }
    )
    const allowed = await config.doInContext(undefined, () =>
      sdk.permissions.canRoleAccessResource({
        roleId: PUBLIC,
        resourceId: query._id!,
        permissionType: PermissionType.QUERY,
        permissionLevel: PermissionLevel.WRITE,
      })
    )
    expect(allowed).toBe(false)
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
