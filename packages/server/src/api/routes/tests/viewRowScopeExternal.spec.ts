import type { Knex } from "knex"
import { roles } from "@budibase/backend-core"
import { generator } from "@budibase/backend-core/tests"
import {
  BasicOperator,
  PermissionLevel,
  type Row,
  type Table,
} from "@budibase/types"
import {
  DatabaseName,
  datasourceDescribe,
} from "../../../integrations/tests/utils"

const descriptions = datasourceDescribe({ only: [DatabaseName.POSTGRES] })

if (descriptions.length) {
  describe.each(descriptions)(
    "view row scope with composite keys ($dbName)",
    ({ config, dsProvider }) => {
      const tableName = `view_scope_${generator.guid().replaceAll("-", "")}`
      let client: Knex
      let table: Table
      let viewId: string
      let visibleRow: Row
      let hiddenRow: Row

      beforeAll(async () => {
        const { datasource, client: dbClient } = await dsProvider()
        client = dbClient!
        await client.schema.createTable(tableName, table => {
          table.integer("group_id")
          table.integer("item_id")
          table.string("owner")
          table.string("description")
          table.primary(["group_id", "item_id"])
        })
        const { datasource: imported } =
          await config.api.datasource.fetchSchema({
            datasourceId: datasource!._id!,
          })
        table = imported.entities![tableName]
        const view = await config.api.viewV2.create({
          tableId: table._id!,
          name: "Visible composite rows",
          queryUI: {
            groups: [
              {
                filters: [
                  {
                    field: "owner",
                    operator: BasicOperator.EQUAL,
                    value: "mine",
                  },
                ],
              },
            ],
          },
          schema: {
            group_id: { visible: true },
            item_id: { visible: true },
            owner: { visible: true },
            description: { visible: true },
          },
        })
        viewId = view.id
        for (const level of [PermissionLevel.READ, PermissionLevel.WRITE]) {
          await config.api.permission.add({
            roleId: roles.BUILTIN_ROLE_IDS.BASIC,
            resourceId: viewId,
            level,
          })
        }
        await config.publish()
      })

      beforeEach(async () => {
        await client(tableName).delete()
        await client(tableName).insert([
          { group_id: 1, item_id: 1, owner: "mine", description: "visible" },
          { group_id: 1, item_id: 2, owner: "other", description: "secret" },
        ])
        const rows = await config.api.row.fetch(table._id!)
        visibleRow = rows.find(row => row.item_id === 1)!
        hiddenRow = rows.find(row => row.item_id === 2)!
      })

      afterAll(async () => {
        try {
          await client.schema.dropTableIfExists(tableName)
        } finally {
          await client.destroy()
          await config.end()
        }
      })

      it.each(["patch", "delete", "export"])(
        "%s checks the complete composite key against the view",
        async operation => {
          await config.loginAsRole(roles.BUILTIN_ROLE_IDS.BASIC, async () => {
            if (operation === "patch") {
              await config.api.row.patch(
                viewId,
                {
                  ...hiddenRow,
                  _id: hiddenRow._id!,
                  _rev: hiddenRow._rev!,
                  tableId: table._id!,
                  description: "unauthorized",
                },
                { status: 404 }
              )
              const updated = await config.api.row.patch(viewId, {
                ...visibleRow,
                _id: visibleRow._id!,
                _rev: visibleRow._rev!,
                tableId: table._id!,
                description: "updated",
              })
              expect(updated.description).toEqual("updated")
            } else if (operation === "delete") {
              await config.api.row.bulkDelete(
                viewId,
                { rows: [hiddenRow._id!] },
                { status: 404 }
              )
              await config.api.row.bulkDelete(
                viewId,
                { rows: [visibleRow._id!, hiddenRow._id!] },
                { status: 404 }
              )
              await config.api.row.bulkDelete(viewId, {
                rows: [visibleRow._id!],
              })
              expect(await client(tableName).where({ item_id: 1 })).toEqual([])
            } else {
              await config.api.row.exportRows(
                viewId,
                { rows: [hiddenRow._id!] },
                undefined,
                { status: 404 }
              )
              await config.api.row.exportRows(
                viewId,
                { rows: [visibleRow._id!, hiddenRow._id!] },
                undefined,
                { status: 404 }
              )
              const exported = await config.api.row.exportRows(viewId, {
                rows: [visibleRow._id!],
              })
              expect(JSON.parse(exported)).toEqual([
                expect.objectContaining({
                  group_id: 1,
                  item_id: 1,
                  description: "visible",
                }),
              ])
            }
          })
          expect(await client(tableName).where({ item_id: 2 })).toEqual([
            { group_id: 1, item_id: 2, owner: "other", description: "secret" },
          ])
        }
      )
    }
  )
}
