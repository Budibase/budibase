import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { ResourceType, Table } from "@budibase/types"
import { createAutomationBuilder } from "../../../automations/tests/utilities/AutomationTestBuilder"
import { basicTable, basicScreen } from "../../../tests/utilities/structures"

describe("/api/resources/analyze", () => {
  const config = new TestConfiguration()
  let table: Table

  beforeAll(async () => {
    await config.init()
    table = await config.api.table.save(basicTable())
  })

  afterAll(config.end)

  describe("resource analysis", () => {
    it("should analyze screens for datasource usage", async () => {
      const screen = basicScreen()
      screen.props._children?.push({
        _id: "child-props",
        _instanceName: "child",
        _styles: {},
        _component: "@budibase/standard-components/dataprovider",
        datasource: {
          tableId: table._id,
          type: "table",
        },
      })

      // Save the screen to the database so it can be found
      await config.api.screen.save(screen)

      const result = await config.api.resource.analyse({
        workspaceAppIds: [screen.workspaceAppId!],
      })

      expect(result.body.resources).toContainEqual(
        expect.objectContaining({
          id: table._id,
          name: table.name,
          type: ResourceType.TABLE,
        })
      )
    })

    it("should analyze automations for datasource usage", async () => {
      // Create an automation using the builder
      const { automation } = await createAutomationBuilder(config)
        .onRowSaved({ tableId: table._id! })
        .save()

      const result = await config.api.resource.analyse({
        automationIds: [automation._id!],
      })

      expect(result.body.resources).toContainEqual(
        expect.objectContaining({
          id: table._id,
          name: table.name,
          type: ResourceType.TABLE,
        })
      )
    })

    it("should handle empty inputs", async () => {
      await config.api.resource.analyse(
        {
          workspaceAppIds: [],
          automationIds: [],
        },
        {
          status: 400,
        }
      )
    })
  })
})
