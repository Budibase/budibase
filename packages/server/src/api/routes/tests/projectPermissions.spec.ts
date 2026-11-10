import { context, db, features, roles } from "@budibase/backend-core"
import {
  BuiltinPermissionID,
  DocumentType,
  FeatureFlag,
  PermissionLevel,
  ResourceType,
  SourceName,
  type Role,
  type Workspace,
} from "@budibase/types"
import sdk from "../../../sdk"
import * as importSetup from "../../../sdk/workspace/projects/importSetup"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import {
  basicDatasource,
  basicQuery,
  basicTable,
} from "../../../tests/utilities/structures"

jest.mock("../../../sdk/workspace/projects/importSetup", () => ({
  __esModule: true,
  ...jest.requireActual<
    typeof import("../../../sdk/workspace/projects/importSetup")
  >("../../../sdk/workspace/projects/importSetup"),
}))

describe("project package permissions", () => {
  const config = new TestConfiguration()

  beforeEach(async () => {
    await config.newTenant()
  })

  afterEach(() => jest.restoreAllMocks())
  afterAll(() => config.end())

  const withProjectsEnabled = async (task: () => Promise<void>) =>
    features.testutils.withFeatureFlags(
      config.getTenantId(),
      { [FeatureFlag.PROJECTS]: true },
      task
    )

  const setWorkspaceCreationVersion = async ({
    workspaceId,
    creationVersion,
  }: {
    workspaceId: string
    creationVersion: string
  }) => {
    const workspaceDB = db.getDB(workspaceId)
    const metadata = await workspaceDB.get<Workspace>(
      DocumentType.WORKSPACE_METADATA
    )
    await workspaceDB.put({ ...metadata, creationVersion })
  }

  const createPackage = async ({
    readRole = roles.BUILTIN_ROLE_IDS.ADMIN,
  }: { readRole?: string } = {}) => {
    const { project } = await config.api.project.create({ name: "Restricted" })
    const table = await config.api.table.save({
      ...basicTable(),
      projectIds: [project._id],
    })
    const view = await config.api.viewV2.create({
      tableId: table._id!,
      name: "Restricted view",
    })
    const datasource = await config.api.datasource.create({
      ...basicDatasource().datasource,
      source: SourceName.REST,
      config: { url: "https://example.com" },
      projectIds: [project._id],
    })
    const query = await config.api.query.save({
      ...basicQuery(datasource._id!),
      fields: { path: "/", method: "GET" },
    })
    for (const resourceId of [table._id!, view.id]) {
      await config.api.permission.add({
        resourceId,
        roleId: readRole,
        level: PermissionLevel.READ,
      })
      await config.api.permission.add({
        resourceId,
        roleId: roles.BUILTIN_ROLE_IDS.ADMIN,
        level: PermissionLevel.WRITE,
      })
    }
    await config.api.permission.add({
      resourceId: query._id!,
      roleId: roles.BUILTIN_ROLE_IDS.ADMIN,
      level: PermissionLevel.READ,
    })
    await config.api.permission.add({
      resourceId: query._id!,
      roleId: roles.BUILTIN_ROLE_IDS.ADMIN,
      level: PermissionLevel.EXECUTE,
    })
    await config.api.permission.add({
      resourceId: query._id!,
      roleId: roles.BUILTIN_ROLE_IDS.ADMIN,
      level: PermissionLevel.WRITE,
    })
    return {
      table,
      view,
      query,
      buffer: await config.api.project.export(project._id),
    }
  }

  it.each([false, true])(
    "preserves table, view and query restrictions on a round trip (cross workspace: %s)",
    async crossWorkspace => {
      await withProjectsEnabled(async () => {
        const source = await createPackage()
        const destination = crossWorkspace
          ? await config.api.workspace.create({ name: "Destination" })
          : config.getDevWorkspaceId()
        await config.withApp(destination, async () => {
          const unrelated = await config.api.table.save(basicTable())
          await config.api.permission.add({
            resourceId: unrelated._id!,
            roleId: roles.BUILTIN_ROLE_IDS.PUBLIC,
            level: PermissionLevel.READ,
          })
          const imported = await config.api.project.import(source.buffer)
          const tableId = imported.resources[ResourceType.TABLE]![0]
          const queryId = imported.resources[ResourceType.QUERY]![0]
          const table = await config.api.table.get(tableId)
          const view = Object.values(table.views || {}).find(
            view => view.name === source.view.name
          )!
          const tablePermissions = await config.api.permission.get(tableId)
          const queryPermissions = await config.api.permission.get(queryId)
          const viewPermissions = await config.api.permission.get(
            "id" in view ? view.id : ""
          )
          const unrelatedPermissions = await config.api.permission.get(
            unrelated._id!
          )
          expect(tablePermissions.permissions).toMatchObject({
            read: { role: "ADMIN" },
            write: { role: "ADMIN" },
          })
          expect(viewPermissions.permissions).toMatchObject({
            read: { role: "ADMIN" },
            write: { role: "ADMIN" },
          })
          expect(queryPermissions.permissions).toMatchObject({
            read: { role: "ADMIN" },
            write: { role: "ADMIN" },
            execute: { role: "ADMIN" },
          })
          expect(unrelatedPermissions.permissions.read.role).toBe("PUBLIC")

          await config.publish()
          await config.loginAsRole(roles.BUILTIN_ROLE_IDS.BASIC, async () => {
            const headers = config.defaultHeaders({}, true)
            await config
              .request!.get(`/api/${tableId}/rows`)
              .set(headers)
              .expect(403)
            await config
              .request!.post(`/api/${tableId}/rows`)
              .set(headers)
              .send({ name: "Denied" })
              .expect(403)
            await config
              .request!.post(`/api/v2/queries/${queryId}`)
              .set(headers)
              .send({})
              .expect(403)
          })
        })
      })
    }
  )

  it.each([false, true])(
    "maps custom roles only in their source workspace (cross workspace: %s)",
    async crossWorkspace => {
      await withProjectsEnabled(async () => {
        const role = await config.api.roles.save({
          name: "Operators",
          permissionId: BuiltinPermissionID.WRITE,
          inherits: roles.BUILTIN_ROLE_IDS.BASIC,
          permissions: {},
        })
        const source = await createPackage({ readRole: role._id! })
        const destination = crossWorkspace
          ? await config.api.workspace.create({ name: "Destination" })
          : config.getDevWorkspaceId()
        await config.withApp(destination, async () => {
          if (crossWorkspace) {
            await config.api.roles.save({
              name: "Operators",
              permissionId: BuiltinPermissionID.WRITE,
              inherits: roles.BUILTIN_ROLE_IDS.BASIC,
              permissions: {},
            })
          }
          const imported = await config.api.project.import(source.buffer)
          const { permissions } = await config.api.permission.get(
            imported.resources.table![0]
          )
          expect(permissions.read.role).toBe(
            crossWorkspace
              ? "ADMIN"
              : roles.getExternalRoleID(role._id!, role.version)
          )
          expect(
            imported.unsupportedContent.some(
              item => item.type === "custom_role_permissions"
            )
          ).toBe(crossWorkspace)
        })
      })
    }
  )

  it.each([false, true])(
    "maps legacy POWER grants only when the destination supports POWER (legacy destination: %s)",
    async legacyDestination => {
      await withProjectsEnabled(async () => {
        await setWorkspaceCreationVersion({
          workspaceId: config.getDevWorkspaceId(),
          creationVersion: "2.9.0",
        })
        const source = await createPackage({
          readRole: roles.BUILTIN_ROLE_IDS.POWER,
        })
        const destination = await config.api.workspace.create({
          name: "Destination",
        })
        await setWorkspaceCreationVersion({
          workspaceId: destination.appId,
          creationVersion: legacyDestination ? "2.9.0" : "3.0.0",
        })
        await config.withApp(destination, async () => {
          const imported = await config.api.project.import(source.buffer)
          const { permissions } = await config.api.permission.get(
            imported.resources.table![0]
          )
          const powerRole = await context
            .getWorkspaceDB()
            .tryGet<Role>(roles.getDBRoleID(roles.BUILTIN_ROLE_IDS.POWER))
          expect(permissions.read.role).toBe(
            legacyDestination ? "POWER" : "ADMIN"
          )
          expect(!!powerRole).toBe(legacyDestination)
          expect(
            imported.unsupportedContent.some(
              item => item.type === "custom_role_permissions"
            )
          ).toBe(!legacyDestination)
        })
      })
    }
  )

  it("rolls back imported permissions without changing unrelated destination permissions", async () => {
    await withProjectsEnabled(async () => {
      const source = await createPackage()
      const destination = await config.api.workspace.create({
        name: "Destination",
      })
      await config.withApp(destination, async () => {
        const unrelated = await config.api.table.save(basicTable())
        await config.api.permission.add({
          resourceId: unrelated._id!,
          roleId: roles.BUILTIN_ROLE_IDS.PUBLIC,
          level: PermissionLevel.READ,
        })
        await config.api.permission.add({
          resourceId: unrelated._id!,
          roleId: roles.BUILTIN_ROLE_IDS.BASIC,
          level: PermissionLevel.WRITE,
        })
        const readRolePermissions = () =>
          config.doInContext(destination.appId, async () => {
            const dbRoles = await sdk.permissions.getAllDBRoles(
              context.getWorkspaceDB()
            )
            return Object.fromEntries(
              dbRoles.map(role => [role._id!, role.permissions])
            )
          })
        const before = await readRolePermissions()
        jest
          .spyOn(importSetup, "refreshProjectImportSetup")
          .mockRejectedValueOnce(new Error("Import setup failed"))
        await config.api.project.import({
          file: source.buffer,
          expectations: { status: 500 },
        })
        expect(await readRolePermissions()).toEqual(before)
        const { projects } = await config.api.project.fetch()
        expect(projects).toEqual([])
      })
    })
  })

  it("retains restrictions on surviving resources when failed import cleanup has conflicts", async () => {
    await withProjectsEnabled(async () => {
      const source = await createPackage()
      const destination = await config.api.workspace.create({
        name: "Destination",
      })
      await config.withApp(destination, async () => {
        const unrelated = await config.api.table.save({
          ...basicTable(),
          name: "Unrelated",
        })
        await config.api.permission.add({
          resourceId: unrelated._id!,
          roleId: roles.BUILTIN_ROLE_IDS.PUBLIC,
          level: PermissionLevel.READ,
        })
        jest
          .spyOn(importSetup, "refreshProjectImportSetup")
          .mockRejectedValueOnce(new Error("Import setup failed"))
        const actualBulkRemove = db.DatabaseImpl.prototype.bulkRemove
        const bulkRemove = jest
          .spyOn(db.DatabaseImpl.prototype, "bulkRemove")
          .mockImplementationOnce(async function (
            this: db.DatabaseImpl,
            docs,
            opts
          ) {
            return await actualBulkRemove.call(
              this,
              docs.map(doc => ({
                ...doc,
                _rev: "1-00000000000000000000000000000000",
              })),
              opts
            )
          })
        try {
          await config.api.project.import({
            file: source.buffer,
            expectations: { status: 500 },
          })
        } finally {
          bulkRemove.mockRestore()
        }

        const tables = await config.api.table.fetch()
        const survivingTable = tables.find(
          table => table.name === source.table.name
        )!
        const { permissions } = await config.api.permission.get(
          survivingTable._id!
        )
        const unrelatedPermissions = await config.api.permission.get(
          unrelated._id!
        )
        const { projects } = await config.api.project.fetch()
        expect(permissions).toMatchObject({
          read: { role: "ADMIN" },
          write: { role: "ADMIN" },
        })
        expect(unrelatedPermissions.permissions.read.role).toBe("PUBLIC")
        expect(projects).toEqual([])

        await config.publish()
        await config.loginAsRole(roles.BUILTIN_ROLE_IDS.BASIC, async () => {
          const headers = config.defaultHeaders({}, true)
          await config
            .request!.get(`/api/${survivingTable._id}/rows`)
            .set(headers)
            .expect(403)
          await config
            .request!.post(`/api/${survivingTable._id}/rows`)
            .set(headers)
            .send({ name: "Denied" })
            .expect(403)
        })
      })
    })
  })
})
