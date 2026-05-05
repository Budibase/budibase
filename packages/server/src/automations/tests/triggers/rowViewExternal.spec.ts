import { generator, mocks } from "@budibase/backend-core/tests"
import { Datasource, FieldType, Table, TableSourceType } from "@budibase/types"
import {
  DatabaseName,
  datasourceDescribe,
} from "../../../integrations/tests/utils"
import { captureAutomationResults } from "../utilities"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

const descriptions = datasourceDescribe({ only: [DatabaseName.MYSQL] })

if (descriptions.length) {
  describe.each(descriptions)(
    "external row view automation triggers ($dbName)",
    ({ config, dsProvider }) => {
      let datasource: Datasource

      beforeAll(async () => {
        const ds = await dsProvider()
        datasource = ds.datasource!
        mocks.licenses.useCloudFree()
      })

      afterAll(() => {
        config.end()
      })

      const createExternalTable = async (): Promise<Table> => {
        return config.api.table.save({
          name: generator.guid().substring(0, 10),
          type: "table",
          sourceType: TableSourceType.EXTERNAL,
          sourceId: datasource._id!,
          primary: ["id"],
          primaryDisplay: "name",
          schema: {
            id: {
              type: FieldType.NUMBER,
              name: "id",
              autocolumn: true,
              constraints: {
                presence: true,
              },
            },
            name: {
              type: FieldType.STRING,
              name: "name",
              constraints: {
                type: "string",
              },
            },
            description: {
              type: FieldType.STRING,
              name: "description",
              default: "hidden value",
              constraints: {
                type: "string",
              },
            },
          },
        })
      }

      const createNameOnlyView = async (tableId: string) => {
        return config.api.viewV2.create({
          tableId,
          name: generator.guid(),
          schema: {
            name: {
              visible: true,
            },
            description: {
              visible: false,
            },
          },
        })
      }

      it("includes columns hidden by a view when a row is created through that view", async () => {
        const table = await createExternalTable()
        const view = await createNameOnlyView(table._id!)
        const { automation } = await createAutomationBuilder(config)
          .onRowSaved({ tableId: table._id! })
          .serverLog({ text: "Row created!" })
          .save()

        await config.api.workspace.publish()

        const results = await captureAutomationResults(automation, async () => {
          await config.withProdApp(async () => {
            await config.api.row.save(view.id, {
              name: "foo",
            })
          })
        })

        expect(results).toHaveLength(1)
        expect(results[0].data.event.row).toEqual(
          expect.objectContaining({
            name: "foo",
            description: "hidden value",
          })
        )
      })

      it("includes columns hidden by a view when a row is updated through that view", async () => {
        const table = await createExternalTable()
        const view = await createNameOnlyView(table._id!)
        const { automation } = await createAutomationBuilder(config)
          .onRowUpdated({ tableId: table._id! })
          .serverLog({ text: "Row updated!" })
          .save()

        await config.api.workspace.publish()

        const results = await captureAutomationResults(automation, async () => {
          await config.withProdApp(async () => {
            const row = await config.api.row.save(table._id!, {
              name: "foo",
              description: "hidden value",
            })
            await config.api.row.save(view.id, {
              _id: row._id!,
              name: "bar",
            })
          })
        })

        expect(results).toHaveLength(1)
        expect(results[0].data.event.row).toEqual(
          expect.objectContaining({
            name: "bar",
            description: "hidden value",
          })
        )
      })
    }
  )
}
