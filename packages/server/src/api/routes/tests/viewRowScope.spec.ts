import { roles } from "@budibase/backend-core"
import {
  BasicOperator,
  PermissionLevel,
  Row,
  RowExportFormat,
  Table,
} from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { basicTable } from "../../../tests/utilities/structures"
import sdk from "../../../sdk"

describe("view row route scope", () => {
  const config = new TestConfiguration()
  let table: Table
  let viewId: string
  let visibleRow: Row
  let hiddenRow: Row

  beforeAll(async () => {
    await config.init()
    table = await config.api.table.save(basicTable())
    visibleRow = await config.api.row.save(table._id!, {
      name: "mine",
      description: "visible",
    })
    hiddenRow = await config.api.row.save(table._id!, {
      name: "other",
      description: "secret",
    })
    const view = await config.api.viewV2.create({
      tableId: table._id!,
      name: "Mine",
      queryUI: {
        groups: [
          {
            filters: [
              {
                operator: BasicOperator.EQUAL,
                field: "name",
                value: "mine",
              },
            ],
          },
        ],
      },
      schema: {
        name: { visible: true },
        description: { visible: false },
      },
    })
    viewId = view.id
    await config.api.permission.add({
      roleId: roles.BUILTIN_ROLE_IDS.BASIC,
      resourceId: viewId,
      level: PermissionLevel.READ,
    })
    await config.api.permission.add({
      roleId: roles.BUILTIN_ROLE_IDS.BASIC,
      resourceId: viewId,
      level: PermissionLevel.WRITE,
    })
    await config.publish()
  })

  afterAll(() => config.end())

  it("rejects a different row even when the search result count matches", async () => {
    await config.loginAsRole(roles.BUILTIN_ROLE_IDS.BASIC, async () => {
      const search = jest
        .spyOn(sdk.rows, "search")
        .mockResolvedValueOnce({ rows: [visibleRow] })
      try {
        await config.api.row.exportRows(
          viewId,
          { rows: [hiddenRow._id!] },
          undefined,
          { status: 404 }
        )
      } finally {
        search.mockRestore()
      }
    })
  })

  it("keeps enriched reads and searches within visible view fields", async () => {
    await config.loginAsRole(roles.BUILTIN_ROLE_IDS.BASIC, async () => {
      await config.api.row.getEnriched(viewId, hiddenRow._id!, {
        status: 404,
      })
      const row = await config.api.row.getEnriched(viewId, visibleRow._id!)
      expect(row.description).toBeUndefined()
      await config.api.row.search(
        viewId,
        { query: { equal: { description: "secret" } } },
        { status: 400 }
      )
      const result = await config.api.row.search(viewId, {
        query: { equal: { name: "mine" } },
      })
      expect(result.rows.map(row => row._id)).toEqual([visibleRow._id])
    })
  })

  it("blocks updates, deletes and exports of rows outside the view", async () => {
    await config.loginAsRole(roles.BUILTIN_ROLE_IDS.BASIC, async () => {
      await config.api.row.patch(
        viewId,
        {
          ...hiddenRow,
          _id: hiddenRow._id!,
          _rev: hiddenRow._rev!,
          tableId: table._id!,
          name: "changed",
        },
        { status: 404 }
      )
      await config.api.row.bulkDelete(
        viewId,
        { rows: [hiddenRow._id!] },
        { status: 404 }
      )
      await config.api.row.exportRows(
        viewId,
        { rows: [hiddenRow._id!] },
        undefined,
        { status: 404 }
      )
      await config.api.row.exportRows(
        viewId,
        { rows: [visibleRow._id!], columns: ["description"] },
        undefined,
        { status: 400 }
      )
      const exported = await config.api.row.exportRows(viewId, {
        rows: [visibleRow._id!],
      })
      expect(exported).toContain("mine")
      expect(exported).not.toContain("visible")
    })
    const row = await config.api.row.get(table._id!, hiddenRow._id!)
    expect(row.name).toEqual("other")
  })

  it.each([undefined, [], ["name"]])(
    "exports only visible schema and values with columns %j",
    async columns => {
      await config.loginAsRole(roles.BUILTIN_ROLE_IDS.BASIC, async () => {
        const exported = await config.api.row.exportRows(
          viewId,
          { rows: [visibleRow._id!], columns },
          RowExportFormat.JSON_WITH_SCHEMA
        )
        expect(JSON.parse(exported)).toEqual({
          schema: { name: table.schema.name },
          rows: [{ name: "mine" }],
        })
      })
    }
  )

  describe("views with no visible columns", () => {
    let emptyViewId: string

    beforeAll(async () => {
      const view = await config.api.viewV2.create({
        tableId: table._id!,
        name: "No visible columns",
        schema: {
          name: { visible: false },
          description: { visible: false },
        },
      })
      emptyViewId = view.id
      await config.api.permission.add({
        roleId: roles.BUILTIN_ROLE_IDS.BASIC,
        resourceId: emptyViewId,
        level: PermissionLevel.READ,
      })
      await config.api.permission.add({
        roleId: roles.BUILTIN_ROLE_IDS.BASIC,
        resourceId: emptyViewId,
        level: PermissionLevel.WRITE,
      })
      await config.publish()
    })

    it.each(Object.values(RowExportFormat))(
      "rejects %s exports with omitted or empty columns",
      async format => {
        await config.loginAsRole(roles.BUILTIN_ROLE_IDS.BASIC, async () => {
          for (const columns of [undefined, []]) {
            await config.api.row.exportRows(
              emptyViewId,
              { rows: [visibleRow._id!], columns },
              format,
              { status: 400 }
            )
          }
        })
      }
    )
  })

  describe("current-user-filtered views", () => {
    let userViewId: string

    beforeAll(async () => {
      const view = await config.api.viewV2.create({
        tableId: table._id!,
        name: "Current user's rows",
        queryUI: {
          groups: [
            {
              filters: [
                {
                  operator: BasicOperator.EQUAL,
                  field: "name",
                  value: "{{ [user].[globalId] }}",
                },
              ],
            },
          ],
        },
        schema: {
          name: { visible: true },
          description: { visible: true },
        },
      })
      userViewId = view.id
      await config.api.permission.add({
        roleId: roles.BUILTIN_ROLE_IDS.BASIC,
        resourceId: userViewId,
        level: PermissionLevel.READ,
      })
      await config.api.permission.add({
        roleId: roles.BUILTIN_ROLE_IDS.BASIC,
        resourceId: userViewId,
        level: PermissionLevel.WRITE,
      })
      await config.publish()
    })

    it.each(["patch", "delete", "export"])(
      "allows a reader to %s their own rows and rejects other rows",
      async operation => {
        await config.withProdApp(async () => {
          const foreignRow = await config.api.row.save(table._id!, {
            name: "other@example.com",
            description: "secret",
          })
          await config.loginAsRole(roles.BUILTIN_ROLE_IDS.BASIC, async () => {
            const ownRow = await config.api.row.save(userViewId, {
              name: config.getUser()._id,
              description: "owned",
            })

            if (operation === "patch") {
              await config.api.row.patch(
                userViewId,
                {
                  ...foreignRow,
                  _id: foreignRow._id!,
                  _rev: foreignRow._rev!,
                  tableId: table._id!,
                  description: "unauthorized",
                },
                { status: 404 }
              )
              const updated = await config.api.row.patch(userViewId, {
                ...ownRow,
                _id: ownRow._id!,
                _rev: ownRow._rev!,
                tableId: table._id!,
                description: "updated",
              })
              expect(updated.description).toEqual("updated")
            } else if (operation === "delete") {
              await config.api.row.bulkDelete(
                userViewId,
                { rows: [ownRow._id!, foreignRow._id!] },
                { status: 404 }
              )
              const deleted = await config.api.row.bulkDelete(userViewId, {
                rows: [ownRow._id!],
              })
              expect(deleted.map(row => row._id)).toEqual([ownRow._id])
            } else {
              await config.api.row.exportRows(
                userViewId,
                { rows: [ownRow._id!, foreignRow._id!] },
                undefined,
                { status: 404 }
              )
              const exported = await config.api.row.exportRows(userViewId, {
                rows: [ownRow._id!],
              })
              expect(JSON.parse(exported)).toEqual([
                expect.objectContaining({
                  name: config.getUser()._id,
                  description: "owned",
                }),
              ])
            }
          })

          const unchanged = await config.api.row.get(
            table._id!,
            foreignRow._id!
          )
          expect(unchanged.description).toEqual("secret")
        })
      }
    )
  })
})
