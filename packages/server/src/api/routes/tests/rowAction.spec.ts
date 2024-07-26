import _ from "lodash"
import tk from "timekeeper"

import {
  CreateRowActionRequest,
  DocumentType,
  RowActionResponse,
} from "@budibase/types"
import * as setup from "./utilities"
import { generator } from "@budibase/backend-core/tests"

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

  function unauthorisedTests() {
    it("returns unauthorised (401) for unauthenticated requests", async () => {
      await createRowAction(
        tableId,
        createRowActionRequest(),
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
    unauthorisedTests()

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
      })

      expect(await config.api.rowAction.find(tableId)).toEqual({
        actions: {
          [res.id]: {
            name: rowAction.name,
            id: res.id,
            tableId: tableId,
            automationId: expectAutomationId(),
          },
        },
      })
    })

    it("trims row action names", async () => {
      const name = "   action  name  "
      const res = await createRowAction(tableId, { name }, { status: 201 })

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
          },
          [responses[1].id]: {
            name: rowActions[1].name,
            id: responses[1].id,
            tableId,
            automationId: expectAutomationId(),
          },
          [responses[2].id]: {
            name: rowActions[2].name,
            id: responses[2].id,
            tableId,
            automationId: expectAutomationId(),
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
      const res = await createRowAction(tableId, dirtyRowAction, {
        status: 201,
      })

      expect(res).toEqual({
        name: rowAction.name,
        id: expect.any(String),
        tableId,
        automationId: expectAutomationId(),
      })

      expect(await config.api.rowAction.find(tableId)).toEqual({
        actions: {
          [res.id]: {
            name: rowAction.name,
            id: res.id,
            tableId: tableId,
            automationId: expectAutomationId(),
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
        expect(
          await config.api.automation.get(automationId, { status: 200 })
        ).toEqual(expect.objectContaining({ _id: automationId }))
      }
    })
  })

  describe("find", () => {
    unauthorisedTests()

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

  describe("update", () => {
    unauthorisedTests()

    it("can update existing actions", async () => {
      for (const rowAction of createRowActionRequests(3)) {
        await createRowAction(tableId, rowAction)
      }

      const persisted = await config.api.rowAction.find(tableId)

      const [actionId, actionData] = _.sample(
        Object.entries(persisted.actions)
      )!

      const updatedName = generator.string()

      const res = await config.api.rowAction.update(tableId, actionId, {
        name: updatedName,
      })

      expect(res).toEqual({
        id: actionId,
        tableId,
        name: updatedName,
        automationId: actionData.automationId,
      })

      expect(await config.api.rowAction.find(tableId)).toEqual(
        expect.objectContaining({
          actions: expect.objectContaining({
            [actionId]: {
              name: updatedName,
              id: actionData.id,
              tableId: actionData.tableId,
              automationId: actionData.automationId,
            },
          }),
        })
      )
    })

    it("trims row action names", async () => {
      const rowAction = await createRowAction(
        tableId,
        createRowActionRequest(),
        {
          status: 201,
        }
      )

      const res = await config.api.rowAction.update(tableId, rowAction.id, {
        name: "   action  name  ",
      })

      expect(res).toEqual(expect.objectContaining({ name: "action  name" }))

      expect(await config.api.rowAction.find(tableId)).toEqual(
        expect.objectContaining({
          actions: expect.objectContaining({
            [rowAction.id]: expect.objectContaining({
              name: "action  name",
            }),
          }),
        })
      )
    })

    it("throws Bad Request when trying to update by a non-existing id", async () => {
      await createRowAction(tableId, createRowActionRequest())

      await config.api.rowAction.update(
        tableId,
        generator.guid(),
        createRowActionRequest(),
        { status: 400 }
      )
    })

    it("throws Bad Request when trying to update by a via another table id", async () => {
      const otherTable = await config.api.table.save(
        setup.structures.basicTable()
      )
      await createRowAction(otherTable._id!, createRowActionRequest())

      const action = await createRowAction(tableId, createRowActionRequest())
      await config.api.rowAction.update(
        otherTable._id!,
        action.id,
        createRowActionRequest(),
        { status: 400 }
      )
    })

    it("can not use existing row action names (for the same table)", async () => {
      const action1 = await createRowAction(tableId, createRowActionRequest())
      const action2 = await createRowAction(tableId, createRowActionRequest())

      await config.api.rowAction.update(
        tableId,
        action1.id,
        { name: action2.name },
        {
          status: 409,
          body: {
            message: "A row action with the same name already exists.",
          },
        }
      )
    })

    it("does not throw with name conflicts for the same row action", async () => {
      const action1 = await createRowAction(tableId, createRowActionRequest())

      await config.api.rowAction.update(tableId, action1.id, {
        name: action1.name,
      })
    })
  })

  describe("delete", () => {
    unauthorisedTests()

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
})
