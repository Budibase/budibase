import { AutomationIOType, ToolAction } from "@budibase/types"
import sdk from "../../../../sdk"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import { basicQuery } from "../../../../tests/utilities/structures"
import { createAutomationBuilder } from "../../../../automations/tests/utilities/AutomationTestBuilder"
import { prepareAppTriggerFields } from "../../../../automations/triggers"
import { prepareQueryParameters } from "../../../../api/controllers/query"
import { createRestQueryTool } from "../../restQuery"
import { toToolSet, type AiToolDefinition } from "../.."
import createAutomationTools from "../automations"

describe("query and automation preflight", () => {
  const config = new TestConfiguration()

  beforeEach(() => {
    jest.spyOn(config, "getDevWorkspaceId").mockReturnValue("app_dev_test")
  })

  afterEach(() => jest.restoreAllMocks())
  afterAll(() => config.end())

  const wrap = (definition: AiToolDefinition) => {
    const intercept = jest.fn().mockResolvedValue({ pending: true })
    const execute = jest.fn()
    const tools = toToolSet(
      [{ ...definition, tool: { ...definition.tool, execute } }],
      new Map(),
      new Map([[definition.name, { intercept }]])
    )
    const propose = (input: object) =>
      tools[definition.name].execute!(input, {
        toolCallId: "call_1",
        messages: [],
        context: undefined,
      })
    return { propose, intercept, execute }
  }

  const query = {
    ...basicQuery("datasource_test"),
    _id: "query_test",
    nullDefaultSupport: true,
    parameters: [
      { name: "region", default: "eu" },
      { name: "filter", default: "" },
    ],
  }

  it("uses query execution's defaults without modifying input", async () => {
    jest.spyOn(sdk.queries, "find").mockResolvedValue(query)
    const { propose, intercept, execute } = wrap(createRestQueryTool(query))
    const input = { region: "" }
    const canonical = prepareQueryParameters({ query, parameters: input })
    await propose(input)
    await propose(canonical)
    expect(intercept).toHaveBeenLastCalledWith(
      { region: "eu", filter: null },
      expect.anything()
    )
    expect(input).toEqual({ region: "" })
    expect(execute).not.toHaveBeenCalled()
  })

  it("rejects query handlebars before escalation", async () => {
    jest.spyOn(sdk.queries, "find").mockResolvedValue(query)
    const { propose, intercept, execute } = wrap(createRestQueryTool(query))
    await expect(propose({ region: "{{ user.name }}" })).rejects.toThrow(
      "handlebars"
    )
    expect(intercept).not.toHaveBeenCalled()
    expect(execute).not.toHaveBeenCalled()
  })

  it("checks current query parameters", async () => {
    jest
      .spyOn(sdk.queries, "find")
      .mockResolvedValue({ ...query, parameters: [] })
    const { propose, intercept, execute } = wrap(createRestQueryTool(query))
    await expect(propose({ region: "eu" })).rejects.toThrow()
    expect(intercept).not.toHaveBeenCalled()
    expect(execute).not.toHaveBeenCalled()
  })

  const automation = () => ({
    ...createAutomationBuilder(config)
      .onAppAction({
        fields: {
          description: AutomationIOType.STRING,
          amount: AutomationIOType.NUMBER,
        },
      })
      .build(),
    _id: "automation_test",
    _rev: "1-test",
  })

  it("uses trigger preparation and accepts its canonical payload on resume", async () => {
    const resource = automation()
    jest.spyOn(sdk.automations, "get").mockResolvedValue(resource)
    const definition = createAutomationTools([resource]).find(
      tool => tool.action === ToolAction.TRIGGER
    )!
    const { propose, intercept, execute } = wrap(definition)
    const input = { fields: { description: "", amount: 15 } }
    const canonical = {
      fields: prepareAppTriggerFields({ automation: resource, params: input }),
    }
    await propose(input)
    await propose(canonical)
    expect(intercept).toHaveBeenLastCalledWith(
      { fields: { description: null, amount: 15 } },
      expect.anything()
    )
    expect(input.fields.description).toBe("")
    expect(execute).not.toHaveBeenCalled()
  })

  it("rejects disabled automations before escalation", async () => {
    const resource = automation()
    jest
      .spyOn(sdk.automations, "get")
      .mockResolvedValue({ ...resource, disabled: true })
    const definition = createAutomationTools([resource]).find(
      tool => tool.action === ToolAction.TRIGGER
    )!
    const { propose, intercept, execute } = wrap(definition)
    await expect(propose({ fields: { amount: 15 } })).rejects.toThrow(
      "disabled"
    )
    expect(intercept).not.toHaveBeenCalled()
    expect(execute).not.toHaveBeenCalled()
  })

  it("rejects fields removed from the current automation", async () => {
    const resource = automation()
    const current = {
      ...createAutomationBuilder(config).onAppAction({ fields: {} }).build(),
      _id: resource._id,
      _rev: "2-test",
    }
    jest.spyOn(sdk.automations, "get").mockResolvedValue(current)
    const definition = createAutomationTools([resource]).find(
      tool => tool.action === ToolAction.TRIGGER
    )!
    const { propose, intercept, execute } = wrap(definition)
    await expect(propose({ fields: { amount: 15 } })).rejects.toThrow()
    expect(intercept).not.toHaveBeenCalled()
    expect(execute).not.toHaveBeenCalled()
  })
})
