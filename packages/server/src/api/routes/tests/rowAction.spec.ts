import _ from "lodash"
import tk from "timekeeper"

import {
  context,
  DEFAULT_BB_DATASOURCE_ID,
  roles,
} from "@budibase/backend-core"
import { automations } from "@budibase/pro"
import {
  CreateRowActionRequest,
  Datasource,
  DocumentType,
  PermissionLevel,
  RowActionResponse,
  Table,
  TableRowActions,
} from "@budibase/types"
import * as setup from "./utilities"
import { generator, mocks } from "@budibase/backend-core/tests"
import { Expectations } from "../../../tests/utilities/api/base"
import {
  DatabaseName,
  datasourceDescribe,
} from "../../../integrations/tests/utils"
import { generateRowActionsID } from "../../../db/utils"

const expectAutomationId = () =>
  expect.stringMatching(`^${DocumentType.AUTOMATION}_.+`)

describe("/rowsActions", () => {
  const config = setup.getConfig()

  let tableId: string

  beforeAll(async () => {
    tk.freeze(new Date())
    await config.init()
  })

  beforeEach(async () => {
    const table = await config.api.table.save(setup.structures.basicTable())
    tableId = table._id!
  })

  afterAll(setup.afterAll)

  const createRowAction = config.api.rowAction.save

  function createRowActionRequest(): CreateRowActionRequest {
    return {
      name: generator.string(),
    }
  }

  function createRowActionRequests(count: number): CreateRowActionRequest[] {
    return generator
      .unique(() => generator.string(), count)
      .map(name => ({ name }))
  }

  function unauthorisedTests(
    apiDelegate: (
      expectations: Expectations,
      testConfig?: { publicUser?: boolean }
    ) => Promise<any>
  ) {
    it("returns unauthorised (401) for unauthenticated requests", async () => {
      await apiDelegate(
        {
          status: 401,
          body: {
            message: "Session not authenticated",
          },
        },
        { publicUser: true }
      )
    })

    it("returns forbidden (403) for non-builder users", async () => {
      const user = await config.createUser({
        builder: {},
      })
      await config.withUser(user, async () => {
        await createRowAction(generator.guid(), createRowActionRequest(), {
          status: 403,
          body: {
            message: "Not Authorized",
          },
        })
      })
    })

    it("returns forbidden (403) for non-builder users even if they have table write permissions", async () => {
      const user = await config.createUser({
        builder: {},
      })
      const tableId = generator.guid()
      for (const role of Object.values(roles.BUILTIN_ROLE_IDS)) {
        await config.api.permission.add({
          roleId: role,
          resourceId: tableId,
          level: PermissionLevel.EXECUTE,
        })
      }

      // replicate changes before checking permissions
      await config.publish()

      await config.withUser(user, async () => {
        await createRowAction(tableId, createRowActionRequest(), {
          status: 403,
          body: {
            message: "Not Authorized",
          },
        })
      })
    })

    it("rejects (404) for a non-existing table", async () => {
      await createRowAction(generator.guid(), createRowActionRequest(), {
        status: 404,
      })
    })
  }

  describe("create", () => {
    unauthorisedTests((expectations, testConfig) =>
      createRowAction(
        tableId,
        createRowActionRequest(),
        expectations,
        testConfig
      )
    )

    it("creates new row actions for tables without existing actions", async () => {
      const rowAction = createRowActionRequest()
      const res = await createRowAction(tableId, rowAction, {
        status: 201,
      })

      expect(res).toEqual({
        name: rowAction.name,
        id: expect.stringMatching(/^row_action_\w+/),
        tableId: tableId,
        automationId: expectAutomationId(),
        allowedSources: [tableId],
      })

      expect(await config.api.rowAction.find(tableId)).toEqual({
        actions: {
          [res.id]: {
            name: rowAction.name,
            id: res.id,
            tableId: tableId,
            automationId: expectAutomationId(),
            allowedSources: [tableId],
          },
        },
      })
    })

    it("trims row action names", async () => {
      const name = "   action  name  "
      const res = await createRowAction(tableId, { name })

      expect(res).toEqual(
        expect.objectContaining({
          name: "action  name",
        })
      )

      expect(await config.api.rowAction.find(tableId)).toEqual({
        actions: {
          [res.id]: expect.objectContaining({
            name: "action  name",
          }),
        },
      })
    })

    it("can create multiple row actions for the same table", async () => {
      const rowActions = createRowActionRequests(3)
      const responses: RowActionResponse[] = []
      for (const action of rowActions) {
        responses.push(await createRowAction(tableId, action))
      }

      expect(await config.api.rowAction.find(tableId)).toEqual({
        actions: {
          [responses[0].id]: {
            name: rowActions[0].name,
            id: responses[0].id,
            tableId,
            automationId: expectAutomationId(),
            allowedSources: [tableId],
          },
          [responses[1].id]: {
            name: rowActions[1].name,
            id: responses[1].id,
            tableId,
            automationId: expectAutomationId(),
            allowedSources: [tableId],
          },
          [responses[2].id]: {
            name: rowActions[2].name,
            id: responses[2].id,
            tableId,
            automationId: expectAutomationId(),
            allowedSources: [tableId],
          },
        },
      })
    })

    it("rejects with bad request when creating with no name", async () => {
      const rowAction: CreateRowActionRequest = {
        name: "",
      }

      await createRowAction(tableId, rowAction, {
        status: 400,
        body: {
          message: 'Invalid body - "name" is not allowed to be empty',
        },
      })
    })

    it("ignores not valid row action data", async () => {
      const rowAction = createRowActionRequest()
      const dirtyRowAction = {
        name: rowAction.name,
        id: generator.guid(),
        valueToIgnore: generator.string(),
      }
      const res = await createRowAction(tableId, dirtyRowAction)

      expect(res).toEqual({
        name: rowAction.name,
        id: expect.any(String),
        tableId,
        automationId: expectAutomationId(),
        allowedSources: [tableId],
      })

      expect(await config.api.rowAction.find(tableId)).toEqual({
        actions: {
          [res.id]: {
            name: rowAction.name,
            id: res.id,
            tableId: tableId,
            automationId: expectAutomationId(),
            allowedSources: [tableId],
          },
        },
      })
    })

    it("can not create multiple row actions with the same name (for the same table)", async () => {
      const action = await createRowAction(tableId, {
        name: "Row action name  ",
      })

      await createRowAction(
        tableId,
        { name: action.name },
        {
          status: 409,
          body: {
            message: "A row action with the same name already exists.",
          },
        }
      )
      await createRowAction(
        tableId,
        { name: "row action name" },
        {
          status: 409,
          body: {
            message: "A row action with the same name already exists.",
          },
        }
      )
    })

    it("can reuse row action names between different tables", async () => {
      const otherTable = await config.api.table.save(
        setup.structures.basicTable()
      )

      const action = await createRowAction(tableId, createRowActionRequest())

      await createRowAction(otherTable._id!, { name: action.name })
    })

    it("an automation is created when creating a new row action", async () => {
      const action1 = await createRowAction(tableId, createRowActionRequest())
      const action2 = await createRowAction(tableId, createRowActionRequest())

      for (const automationId of [action1.automationId, action2.automationId]) {
        expect(await config.api.automation.get(automationId)).toEqual(
          expect.objectContaining({ _id: automationId })
        )
      }
    })
  })

  describe("find", () => {
    unauthorisedTests((expectations, testConfig) =>
      config.api.rowAction.find(tableId, expectations, testConfig)
    )

    it("returns only the actions for the requested table", async () => {
      const rowActions: RowActionResponse[] = []
      for (const action of createRowActionRequests(3)) {
        rowActions.push(await createRowAction(tableId, action))
      }

      const otherTable = await config.api.table.save(
        setup.structures.basicTable()
      )
      await createRowAction(otherTable._id!, createRowActionRequest())

      const response = await config.api.rowAction.find(tableId)
      expect(response).toEqual({
        actions: {
          [rowActions[0].id]: expect.any(Object),
          [rowActions[1].id]: expect.any(Object),
          [rowActions[2].id]: expect.any(Object),
        },
      })
    })

    it("returns empty for tables without row actions", async () => {
      const response = await config.api.rowAction.find(tableId)
      expect(response).toEqual({
        actions: {},
      })
    })
  })

  describe("delete", () => {
    unauthorisedTests((expectations, testConfig) =>
      config.api.rowAction.delete(
        tableId,
        generator.guid(),
        expectations,
        testConfig
      )
    )

    it("can delete existing actions", async () => {
      const actions: RowActionResponse[] = []
      for (const rowAction of createRowActionRequests(3)) {
        actions.push(await createRowAction(tableId, rowAction))
      }

      const actionToDelete = _.sample(actions)!

      await config.api.rowAction.delete(tableId, actionToDelete.id, {
        status: 204,
      })

      expect(await config.api.rowAction.find(tableId)).toEqual(
        expect.objectContaining({
          actions: actions
            .filter(a => a.id !== actionToDelete.id)
            .reduce((acc, c) => ({ ...acc, [c.id]: expect.any(Object) }), {}),
        })
      )
    })

    it("throws Bad Request when trying to delete by a non-existing id", async () => {
      await createRowAction(tableId, createRowActionRequest())

      await config.api.rowAction.delete(tableId, generator.guid(), {
        status: 400,
      })
    })

    it("throws Bad Request when trying to delete by a via another table id", async () => {
      const otherTable = await config.api.table.save(
        setup.structures.basicTable()
      )
      await createRowAction(otherTable._id!, createRowActionRequest())

      const action = await createRowAction(tableId, createRowActionRequest())
      await config.api.rowAction.delete(otherTable._id!, action.id, {
        status: 400,
      })
    })

    it("deletes the linked automation", async () => {
      const actions: RowActionResponse[] = []
      for (const rowAction of createRowActionRequests(3)) {
        actions.push(await createRowAction(tableId, rowAction))
      }

      const actionToDelete = _.sample(actions)!
      await config.api.rowAction.delete(tableId, actionToDelete.id, {
        status: 204,
      })

      await config.api.automation.get(actionToDelete.automationId, {
        status: 404,
      })
      for (const action of actions.filter(a => a.id !== actionToDelete.id)) {
        await config.api.automation.get(action.automationId, {
          status: 200,
        })
      }
    })
  })

  describe("set/unsetTablePermission", () => {
    describe.each([
      ["setTablePermission", config.api.rowAction.setTablePermission],
      ["unsetTablePermission", config.api.rowAction.unsetTablePermission],
    ])("unauthorisedTests for %s", (__, delegateTest) => {
      unauthorisedTests((expectations, testConfig) =>
        delegateTest(tableId, generator.guid(), expectations, testConfig)
      )
    })

    let actionId1: string, actionId2: string

    beforeEach(async () => {
      for (const rowAction of createRowActionRequests(3)) {
        await createRowAction(tableId, rowAction)
      }
      const persisted = await config.api.rowAction.find(tableId)

      const actions = _.sampleSize(Object.keys(persisted.actions), 2)
      actionId1 = actions[0]
      actionId2 = actions[1]
    })

    it("can set table permission", async () => {
      await config.api.rowAction.unsetTablePermission(tableId, actionId1)
      await config.api.rowAction.unsetTablePermission(tableId, actionId2)
      const actionResult = await config.api.rowAction.setTablePermission(
        tableId,
        actionId1
      )
      const expectedAction1 = expect.objectContaining({
        allowedSources: [tableId],
      })

      const expectedActions = expect.objectContaining({
        [actionId1]: expectedAction1,
        [actionId2]: expect.objectContaining({
          allowedSources: [],
        }),
      })
      expect(actionResult).toEqual(expectedAction1)
      expect((await config.api.rowAction.find(tableId)).actions).toEqual(
        expectedActions
      )
    })

    it("can unset table permission", async () => {
      const actionResult = await config.api.rowAction.unsetTablePermission(
        tableId,
        actionId1
      )

      const expectedAction = expect.objectContaining({
        allowedSources: [],
      })
      expect(actionResult).toEqual(expectedAction)
      expect(
        (await config.api.rowAction.find(tableId)).actions[actionId1]
      ).toEqual(expectedAction)
    })

    it.each([
      ["setTablePermission", config.api.rowAction.setTablePermission],
      ["unsetTablePermission", config.api.rowAction.unsetTablePermission],
    ])(
      "cannot update permission for unexisting tables (%s)",
      async (__, delegateTest) => {
        const tableId = generator.guid()
        await delegateTest(tableId, actionId1, {
          status: 404,
        })
      }
    )
  })

  describe("set/unsetViewPermission", () => {
    describe.each([
      ["setViewPermission", config.api.rowAction.setViewPermission],
      ["unsetViewPermission", config.api.rowAction.unsetViewPermission],
    ])("unauthorisedTests for %s", (__, delegateTest) => {
      unauthorisedTests((expectations, testConfig) =>
        delegateTest(
          tableId,
          generator.guid(),
          generator.guid(),
          expectations,
          testConfig
        )
      )
    })

    let actionId1: string, actionId2: string
    let viewId1: string, viewId2: string
    beforeEach(async () => {
      for (const rowAction of createRowActionRequests(3)) {
        await createRowAction(tableId, rowAction)
      }
      const persisted = await config.api.rowAction.find(tableId)

      const actions = _.sampleSize(Object.keys(persisted.actions), 2)
      actionId1 = actions[0]
      actionId2 = actions[1]

      viewId1 = (
        await config.api.viewV2.create(
          setup.structures.viewV2.createRequest(tableId)
        )
      ).id
      viewId2 = (
        await config.api.viewV2.create(
          setup.structures.viewV2.createRequest(tableId)
        )
      ).id
    })

    it("can set permission views", async () => {
      await config.api.rowAction.setViewPermission(tableId, viewId1, actionId1)
      const action1Result = await config.api.rowAction.setViewPermission(
        tableId,
        viewId2,
        actionId1
      )
      const action2Result = await config.api.rowAction.setViewPermission(
        tableId,
        viewId1,
        actionId2
      )

      const expectedAction1 = expect.objectContaining({
        allowedSources: [tableId, viewId1, viewId2],
      })
      const expectedAction2 = expect.objectContaining({
        allowedSources: [tableId, viewId1],
      })

      const expectedActions = expect.objectContaining({
        [actionId1]: expectedAction1,
        [actionId2]: expectedAction2,
      })
      expect(action1Result).toEqual(expectedAction1)
      expect(action2Result).toEqual(expectedAction2)
      expect((await config.api.rowAction.find(tableId)).actions).toEqual(
        expectedActions
      )
    })

    it("can unset permission views", async () => {
      await config.api.rowAction.setViewPermission(tableId, viewId2, actionId1)
      await config.api.rowAction.setViewPermission(tableId, viewId1, actionId2)
      const actionResult = await config.api.rowAction.unsetViewPermission(
        tableId,
        viewId1,
        actionId1
      )

      const expectedAction = expect.objectContaining({
        allowedSources: [tableId, viewId2],
      })
      expect(actionResult).toEqual(expectedAction)
      expect(
        (await config.api.rowAction.find(tableId)).actions[actionId1]
      ).toEqual(expectedAction)
    })

    it.each([
      ["setViewPermission", config.api.rowAction.setViewPermission],
      ["unsetViewPermission", config.api.rowAction.unsetViewPermission],
    ])(
      "cannot update permission views for unexisting views (%s)",
      async (__, delegateTest) => {
        const viewId = generator.guid()

        await delegateTest(tableId, viewId, actionId1, {
          status: 400,
          body: {
            message: `View '${viewId}' not found in '${tableId}'`,
          },
        })
      }
    )

    it.each([
      ["setViewPermission", config.api.rowAction.setViewPermission],
      ["unsetViewPermission", config.api.rowAction.unsetViewPermission],
    ])(
      "cannot update permission views crossing table views (%s)",
      async (__, delegateTest) => {
        const anotherTable = await config.api.table.save(
          setup.structures.basicTable()
        )
        const { id: viewId } = await config.api.viewV2.create(
          setup.structures.viewV2.createRequest(anotherTable._id!)
        )

        await delegateTest(tableId, viewId, actionId1, {
          status: 400,
          body: {
            message: `View '${viewId}' not found in '${tableId}'`,
          },
        })
      }
    )
  })

  describe("trigger", () => {
    let viewId: string
    let rowId: string
    let rowAction: RowActionResponse

    beforeEach(async () => {
      const row = await config.api.row.save(tableId, {})
      rowId = row._id!
      rowAction = await createRowAction(tableId, createRowActionRequest())

      viewId = (
        await config.api.viewV2.create(
          setup.structures.viewV2.createRequest(tableId)
        )
      ).id

      await config.api.rowAction.setViewPermission(
        tableId,
        viewId,
        rowAction.id
      )

      await config.publish()
      // Travel time in order to "trim" the selected `getAutomationLogs`
      tk.travel(Date.now() + 100)
    })

    async function getAutomationLogs() {
      const { data: automationLogs } = await config.doInContext(
        config.getProdAppId(),
        async () =>
          automations.logs.logSearch({ startDate: new Date().toISOString() })
      )
      return automationLogs
    }

    it("can trigger an automation given valid data", async () => {
      expect(await getAutomationLogs()).toBeEmpty()
      await config.api.rowAction.trigger(viewId, rowAction.id, { rowId })
      const automationLogs = await getAutomationLogs()
      expect(automationLogs).toEqual([
        expect.objectContaining({
          automationId: rowAction.automationId,
          trigger: {
            id: "trigger",
            stepId: "ROW_ACTION",
            inputs: null,
            outputs: {
              fields: {},
              id: rowId,
              revision: (await config.api.row.get(tableId, rowId))._rev,
              row: await config.api.row.get(tableId, rowId),
              table: {
                ...(await config.api.table.get(tableId)),
                views: expect.anything(),
              },
              user: expect.objectContaining({
                _id: "ro_ta_users_" + config.getUser()._id,
              }),

              automation: expect.objectContaining({
                _id: rowAction.automationId,
              }),
            },
          },
        }),
      ])
    })

    it("triggers from an allowed table", async () => {
      expect(await getAutomationLogs()).toBeEmpty()
      await config.api.rowAction.trigger(tableId, rowAction.id, { rowId })

      const automationLogs = await getAutomationLogs()
      expect(automationLogs).toEqual([
        expect.objectContaining({
          automationId: rowAction.automationId,
        }),
      ])
    })

    it("rejects triggering from a non-allowed table", async () => {
      await config.api.rowAction.unsetTablePermission(tableId, rowAction.id)
      await config.publish()

      await config.api.rowAction.trigger(
        tableId,
        rowAction.id,
        { rowId },
        {
          status: 403,
          body: {
            message: `Row action '${rowAction.id}' is not enabled for table '${tableId}'`,
          },
        }
      )

      const automationLogs = await getAutomationLogs()
      expect(automationLogs).toEqual([])
    })

    it("rejects triggering from a non-allowed view", async () => {
      const viewId = (
        await config.api.viewV2.create(
          setup.structures.viewV2.createRequest(tableId)
        )
      ).id

      await config.publish()
      await config.api.rowAction.trigger(
        viewId,
        rowAction.id,
        { rowId },
        {
          status: 403,
          body: {
            message: `Row action '${rowAction.id}' is not enabled for view '${viewId}'`,
          },
        }
      )

      const automationLogs = await getAutomationLogs()
      expect(automationLogs).toEqual([])
    })

    it("triggers from an allowed view", async () => {
      const viewId = (
        await config.api.viewV2.create(
          setup.structures.viewV2.createRequest(tableId)
        )
      ).id

      await config.api.rowAction.setViewPermission(
        tableId,
        viewId,
        rowAction.id
      )

      await config.publish()

      expect(await getAutomationLogs()).toBeEmpty()
      await config.api.rowAction.trigger(viewId, rowAction.id, { rowId })

      const automationLogs = await getAutomationLogs()
      expect(automationLogs).toEqual([
        expect.objectContaining({
          automationId: rowAction.automationId,
        }),
      ])
    })

    describe("role permission checks", () => {
      afterAll(() => {
        mocks.licenses.useCloudFree()
      })

      function createUser(role: string) {
        return config.createUser({
          admin: { global: false },
          builder: {},
          roles: { [config.getProdAppId()]: role },
        })
      }

      const allowedRoleConfig = (() => {
        function getRolesLowerThan(role: string) {
          const result = Object.values(roles.BUILTIN_ROLE_IDS).filter(
            r => r !== role && roles.lowerBuiltinRoleID(r, role) === r
          )
          return result
        }
        return Object.values(roles.BUILTIN_ROLE_IDS).flatMap(r =>
          [r, ...getRolesLowerThan(r)].map(p => [r, p])
        )
      })()

      const disallowedRoleConfig = (() => {
        function getRolesHigherThan(role: string) {
          const result = Object.values(roles.BUILTIN_ROLE_IDS).filter(
            r => r !== role && roles.lowerBuiltinRoleID(r, role) === role
          )
          return result
        }
        return Object.values(roles.BUILTIN_ROLE_IDS).flatMap(r =>
          getRolesHigherThan(r).map(p => [r, p])
        )
      })()

      describe.each([
        [
          "view (with implicit views)",
          async () => {
            const viewId = (
              await config.api.viewV2.create(
                setup.structures.viewV2.createRequest(tableId)
              )
            ).id

            await config.api.rowAction.setViewPermission(
              tableId,
              viewId,
              rowAction.id
            )
            return { permissionResource: viewId, triggerResouce: viewId }
          },
        ],
        [
          "view (without implicit views)",
          async () => {
            const viewId = (
              await config.api.viewV2.create(
                setup.structures.viewV2.createRequest(tableId)
              )
            ).id

            // Allow row action on view
            await config.api.rowAction.setViewPermission(
              tableId,
              viewId,
              rowAction.id
            )

            // Delete explicit view permissions so they inherit table permissions
            await config.api.permission.revoke({
              roleId: roles.BUILTIN_ROLE_IDS.PUBLIC, // Don't think this matters since we are revoking the permission
              level: PermissionLevel.READ,
              resourceId: viewId,
            })

            return { permissionResource: tableId, triggerResouce: viewId }
          },
        ],
      ])("checks for %s", (_, getResources) => {
        it.each(allowedRoleConfig)(
          "allows triggering if the user has read permission (user %s, table %s)",
          async (userRole, resourcePermission) => {
            const { permissionResource, triggerResouce } = await getResources()

            await config.api.permission.add({
              level: PermissionLevel.READ,
              resourceId: permissionResource,
              roleId: resourcePermission,
            })

            const normalUser = await createUser(userRole)

            await config.withUser(normalUser, async () => {
              await config.publish()
              await config.api.rowAction.trigger(
                triggerResouce,
                rowAction.id,
                { rowId },
                { status: 200 }
              )
            })
          }
        )

        it.each(disallowedRoleConfig)(
          "rejects if the user does not have table read permission (user %s, table %s)",
          async (userRole, resourcePermission) => {
            const { permissionResource, triggerResouce } = await getResources()
            await config.api.permission.add({
              level: PermissionLevel.READ,
              resourceId: permissionResource,
              roleId: resourcePermission,
            })

            const normalUser = await createUser(userRole)

            await config.withUser(normalUser, async () => {
              await config.publish()
              await config.api.rowAction.trigger(
                triggerResouce,
                rowAction.id,
                { rowId },
                {
                  status: 403,
                  body: { message: "User does not have permission" },
                }
              )

              const automationLogs = await getAutomationLogs()
              expect(automationLogs).toBeEmpty()
            })
          }
        )
      })

      it.each(allowedRoleConfig)(
        "allow running row actions for tables by default",
        async (userRole, resourcePermission) => {
          await config.api.permission.add({
            level: PermissionLevel.READ,
            resourceId: tableId,
            roleId: resourcePermission,
          })

          const normalUser = await createUser(userRole)

          await config.withUser(normalUser, async () => {
            await config.publish()
            await config.api.rowAction.trigger(
              tableId,
              rowAction.id,
              { rowId },
              {
                status: 200,
              }
            )

            const automationLogs = await getAutomationLogs()
            expect(automationLogs).toHaveLength(1)
          })
        }
      )
    })
  })

  describe("scenarios", () => {
    // https://linear.app/budibase/issue/BUDI-8717/
    it("should not brick the app when deleting a table with row actions", async () => {
      const view = await config.api.viewV2.create({
        tableId,
        name: generator.guid(),
        schema: {
          name: { visible: true },
        },
      })

      const rowAction = await config.api.rowAction.save(tableId, {
        name: generator.guid(),
      })

      await config.api.rowAction.setViewPermission(
        tableId,
        view.id,
        rowAction.id
      )

      let actionsResp = await config.api.rowAction.find(tableId)
      expect(actionsResp.actions[rowAction.id]).toEqual({
        ...rowAction,
        allowedSources: [tableId, view.id],
      })

      const table = await config.api.table.get(tableId)
      await config.api.table.destroy(table._id!, table._rev!)

      // In the bug reported by Conor, when a delete got deleted its row action
      // document was not being cleaned up. This meant there existed code paths
      // that would find it and try to reference the tables within it, resulting
      // in errors.
      await config.api.automation.fetch({
        status: 200,
      })
    })
  })
})

const descriptions = datasourceDescribe({
  only: [DatabaseName.SQS, DatabaseName.POSTGRES],
})

if (descriptions.length) {
  describe.each(descriptions)(
    "row actions ($dbName)",
    ({ config, dsProvider, isInternal }) => {
      let datasource: Datasource | undefined

      beforeAll(async () => {
        const ds = await dsProvider()
        datasource = ds.datasource
      })

      async function getTable(): Promise<Table> {
        if (isInternal) {
          await config.api.application.addSampleData(config.getAppId())
          const tables = await config.api.table.fetch()
          return tables.find(t => t.sourceId === DEFAULT_BB_DATASOURCE_ID)!
        } else {
          const table = await config.api.table.save(
            setup.structures.tableForDatasource(datasource!)
          )
          return table
        }
      }

      it("should delete all the row actions (and automations) for its tables when a datasource is deleted", async () => {
        async function getRowActionsFromDb(tableId: string) {
          return await context.doInAppContext(config.getAppId(), async () => {
            const db = context.getAppDB()
            const tableDoc = await db.tryGet<TableRowActions>(
              generateRowActionsID(tableId)
            )
            return tableDoc
          })
        }

        const table = await getTable()
        const tableId = table._id!

        await config.api.rowAction.save(tableId, {
          name: generator.guid(),
        })
        await config.api.rowAction.save(tableId, {
          name: generator.guid(),
        })

        const { actions } = (await getRowActionsFromDb(tableId))!
        expect(Object.entries(actions)).toHaveLength(2)

        const { automations } = await config.api.automation.fetch()
        expect(automations).toHaveLength(2)

        const datasource = await config.api.datasource.get(table.sourceId)
        await config.api.datasource.delete(datasource)

        const automationsResp = await config.api.automation.fetch()
        expect(automationsResp.automations).toHaveLength(0)

        expect(await getRowActionsFromDb(tableId)).toBeUndefined()
      })
    }
  )
}
