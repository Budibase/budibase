import { roles } from "@budibase/backend-core"
import { generator } from "@budibase/backend-core/tests"
import { BasicOperator, FieldType, PermissionLevel } from "@budibase/types"
import type { Row, User } from "@budibase/types"
import { datasourceDescribe } from "../../../integrations/tests/utils"
import { basicTable } from "../../../tests/utilities/structures"

const descriptions = datasourceDescribe({ plus: true })

if (descriptions.length) {
  describe.each(descriptions)(
    "view row read boundaries ($dbName)",
    ({ config, dsProvider }) => {
      let tableId: string
      let viewId: string
      let visibleRow: Row
      let hiddenRow: Row
      let user: User

      beforeAll(async () => {
        const { datasource } = await dsProvider()
        const table = await config.api.table.save(
          basicTable(datasource, {
            name: generator.guid().replaceAll("-", "").substring(0, 16),
            schema: {
              files: { name: "files", type: FieldType.ATTACHMENTS },
              file: { name: "file", type: FieldType.ATTACHMENT_SINGLE },
            },
          })
        )
        tableId = table._id!
        const view = await config.api.viewV2.create({
          tableId,
          name: "Visible rows",
          schema: Object.fromEntries(
            Object.keys(table.schema).map(name => [name, { visible: true }])
          ),
          queryUI: {
            groups: [
              {
                filters: [
                  {
                    field: "name",
                    operator: BasicOperator.EQUAL,
                    value: "visible",
                  },
                ],
              },
            ],
          },
        })
        viewId = view.id
        await config.api.permission.add({
          resourceId: tableId,
          roleId: roles.BUILTIN_ROLE_IDS.ADMIN,
          level: PermissionLevel.READ,
        })
        await config.api.permission.add({
          resourceId: viewId,
          roleId: roles.BUILTIN_ROLE_IDS.BASIC,
          level: PermissionLevel.READ,
        })
        await config.publish()
        await config.withProdApp(async () => {
          const createRow = async ({ name }: { name: string }) => {
            const attachments = await config.api.attachment.upload(
              tableId,
              `${name}.txt`,
              Buffer.from(`${name} attachment`)
            )
            return config.api.row.save(tableId, {
              name,
              files: attachments,
              file: attachments[0],
            })
          }
          visibleRow = await createRow({ name: "visible" })
          hiddenRow = await createRow({ name: "hidden" })
        })
        user = await config.createUser({
          admin: { global: false },
          builder: { global: false },
          roles: {
            [config.getProdWorkspaceId()]: roles.BUILTIN_ROLE_IDS.BASIC,
          },
        })
      })

      const asViewUser = async (run: () => Promise<void>) => {
        await config.withUser(user, () => config.withProdApp(run))
      }

      it("only lists rows matching the view filter", async () => {
        await asViewUser(async () => {
          const result = await config.api.row.search(viewId, { query: {} })
          expect(result.rows.map(row => row._id)).toEqual([visibleRow._id])
        })
      })

      it("only fetches rows matching the view filter", async () => {
        await asViewUser(async () => {
          const rows = await config.api.row.fetch(viewId)
          expect(rows.map(row => row._id)).toEqual([visibleRow._id])
        })
      })

      it("enriches a visible row through the view", async () => {
        await asViewUser(async () => {
          const row = await config.api.row.getEnriched(viewId, visibleRow._id!)
          expect(row).toMatchObject({ _id: visibleRow._id, name: "visible" })
        })
      })

      it("rejects enriching a hidden row through the view", async () => {
        await asViewUser(async () => {
          await config.api.row.getEnriched(viewId, hiddenRow._id!, {
            status: 404,
          })
        })
      })

      it("rejects direct table enrichment for the view-only user", async () => {
        await asViewUser(async () => {
          await config.api.row.getEnriched(tableId, hiddenRow._id!, {
            status: 403,
          })
        })
      })

      it("reads a visible row through the view", async () => {
        await asViewUser(async () => {
          const row = await config.api.row.get(viewId, visibleRow._id!)
          expect(row).toMatchObject({ _id: visibleRow._id, name: "visible" })
        })
      })

      it("rejects a hidden row through the view", async () => {
        await asViewUser(async () => {
          await config.api.row.get(viewId, hiddenRow._id!, { status: 404 })
        })
      })

      it("rejects direct table reads for the view-only user", async () => {
        await asViewUser(async () => {
          await config.api.row.get(tableId, hiddenRow._id!, { status: 403 })
        })
      })

      describe.each(["files", "file"])("%s attachments", columnName => {
        it("downloads a visible row attachment through the view", async () => {
          await asViewUser(async () => {
            const response = await config.api.row.downloadAttachment({
              sourceId: viewId,
              rowId: visibleRow._id!,
              columnName,
              expectations: {
                headers: { "Content-Type": /^text\/plain/ },
              },
            })
            expect(response.text).toBe("visible attachment")
          })
        })

        it("rejects a hidden row attachment through the view", async () => {
          await asViewUser(async () => {
            await config.api.row.downloadAttachment({
              sourceId: viewId,
              rowId: hiddenRow._id!,
              columnName,
              expectations: { status: 404, body: { message: "Row not found" } },
            })
          })
        })

        it("rejects direct table attachment downloads for the view-only user", async () => {
          await asViewUser(async () => {
            await config.api.row.downloadAttachment({
              sourceId: tableId,
              rowId: hiddenRow._id!,
              columnName,
              expectations: { status: 403 },
            })
          })
        })
      })
    }
  )
}
