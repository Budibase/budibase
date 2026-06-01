import { BodyType, PaginationConfig, RestQueryFields } from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { basicTable } from "../../../tests/utilities/structures"
import * as automation from "../../index"
import * as setup from "../utilities"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import { RestIntegration } from "../../../integrations/rest"

describe("External ticket sync automations", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
    await automation.init()
  })

  beforeEach(async () => {
    await config.api.automation.deleteAll()
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await automation.shutdown()
    config.end()
  })

  it("fetches ticket status from an API query and stores the result", async () => {
    jest.spyOn(RestIntegration.prototype as any, "_req").mockResolvedValue({
      data: [{ ticketId: "SUP-42", status: "resolved", owner: "Ada" }],
      info: { code: 200, size: "", time: "" },
    })

    const table = await config.api.table.save(basicTable())
    const restSource = await config.restDatasource()
    const queryFields: RestQueryFields = {
      disabledHeaders: {},
      headers: {},
      bodyType: BodyType.NONE,
      pagination: {} as PaginationConfig,
      path: "https://support.example.com/tickets/{{ ticketId }}",
      queryString: "",
    }
    const restQuery = await setup.saveRESTQuery(config, restSource, queryFields)

    const results = await createAutomationBuilder(config)
      .onAppAction()
      .apiRequest(
        {
          query: {
            queryId: restQuery._id!,
            ticketId: "{{ trigger.fields.ticketId }}",
          },
        },
        { stepName: "Fetch Ticket" }
      )
      .createRow({
        row: {
          tableId: table._id,
          name: "{{ steps.[Fetch Ticket].response.0.ticketId }}",
          description:
            "{{ steps.[Fetch Ticket].response.0.status }} by {{ steps.[Fetch Ticket].response.0.owner }}",
        },
      })
      .queryRows({ tableId: table._id! })
      .serverLog({
        text: "Synced {{ steps.3.rows.0.name }} as {{ steps.3.rows.0.description }}",
      })
      .test({
        fields: {
          ticketId: "SUP-42",
        },
      })

    expect(results.steps[0].outputs).toMatchObject({
      success: true,
      info: {
        code: 200,
      },
    })
    expect(results.steps[2].outputs.rows[0]).toMatchObject({
      name: "SUP-42",
      description: "resolved by Ada",
    })
    expect(results.steps[3].outputs.message).toContain(
      "Synced SUP-42 as resolved by Ada"
    )
  })
})
