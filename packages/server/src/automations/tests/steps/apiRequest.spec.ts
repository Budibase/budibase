import { setEnv as setCoreEnv } from "@budibase/backend-core"
import { mocks } from "@budibase/backend-core/tests"
import { environmentVariables } from "@budibase/pro"
import { encodeJSBinding } from "@budibase/string-templates"
import {
  AutomationActionStepId,
  AutomationStepOutputs,
  BodyType,
  PaginationConfig,
  RestQueryFields,
} from "@budibase/types"
import TestConfiguration from "../../../../src/tests/utilities/TestConfiguration"
import * as setup from "../utilities"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import { RestIntegration } from "../../../../src/integrations/rest"
import { setEnv } from "../../../../src/environment"

describe("API REST request", () => {
  const config = new TestConfiguration()
  let envCleanup: () => void
  let coreEnvCleanup: () => void

  beforeAll(async () => {
    coreEnvCleanup = setCoreEnv({
      ENCRYPTION_KEY: "some-key",
    })
    envCleanup = setEnv({
      REST_REJECT_UNAUTHORIZED: false,
    })

    await config.init()
    config.devWorkspace = await config.api.workspace.update(
      config.getDevWorkspaceId(),
      {
        snippets: [
          {
            name: "tester",
            code: `return function (test) {
              return "snippet_" + (test || "no_value")
            }
          `,
          },
        ],
      }
    )

    await config.doInTenant(async () => {
      mocks.licenses.useEnvironmentVariables()
      await environmentVariables.update("env-1", {
        production: "a",
        development: "b",
      })
      await environmentVariables.update("env-2", {
        production: "c",
        development: "d",
      })
      const envKeys = await environmentVariables.fetch()

      expect(envKeys).toStrictEqual(["env-1", "env-2"])
    })
  })

  afterAll(async () => {
    envCleanup()
    coreEnvCleanup()
    config.end()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  const mockRestResponse = (response: any) => {
    jest.spyOn(RestIntegration.prototype as any, "_req").mockResolvedValue({
      data: response,
      info: { code: 200, size: "", time: "" },
    })
  }

  it("should be able to execute a query and relay the results", async () => {
    mockRestResponse({ count: 1234 })

    const queryFields: RestQueryFields = {
      disabledHeaders: {},
      headers: {},
      bodyType: BodyType.NONE,
      pagination: {} as PaginationConfig,
      path: "http://myapi.com/api/count",
      queryString: "",
    }

    const restSource = await config.restDatasource()
    const restQuery = await setup.saveRESTQuery(config, restSource, queryFields)

    const { steps } = await createAutomationBuilder(config)
      .onAppAction()
      .apiRequest({ query: { queryId: restQuery._id! } })
      .test({ fields: {} })

    const requestStep = steps.find(
      s => s.stepId === AutomationActionStepId.API_REQUEST
    )
    expect(requestStep).not.toBeUndefined()

    const requestOutputs: AutomationStepOutputs<AutomationActionStepId.API_REQUEST> =
      requestStep?.outputs!
    const response = requestOutputs?.response?.[0]

    expect(requestOutputs.success).toBe(true)
    expect(requestOutputs.info.code).toBe(200)
    expect(response.count).toBe(1234)
  })

  it("should be able to execute an API request with bindings/snippets/env in the query or automation step", async () => {
    mockRestResponse({
      qBinding: "replaced",
      envQBinding: "d",
      autoSnip: "snippet_running",
      autoEnv: "b",
    })

    const encodedSnippet = encodeJSBinding("return snippets.tester('running')")

    const parameters = [
      {
        name: "someBinding",
        default: "hello",
      },
      {
        name: "envBinding",
        default: "{{ env.env-2 }}",
      },
    ]

    const queryFields: RestQueryFields = {
      path: "http://myapi.com/api/count",
      queryString:
        "qBinding={{ someBinding }}&envQBinding={{ envBinding }}&autoSnip={{ snip }}&autoEnv={{ autoEnv }}",
    }

    const restSource = await config.restDatasource()
    const someQuery = await setup.saveRESTQuery(
      config,
      restSource,
      queryFields,
      parameters
    )

    const { steps } = await createAutomationBuilder(config)
      .onAppAction()
      .apiRequest({
        query: {
          queryId: someQuery._id!,
          snip: encodedSnippet,
          someBinding: "replaced",
          autoEnv: "{{ env.env-1 }}",
        },
      })
      .test({ fields: {} })

    const [queryStep] = steps
    expect(queryStep?.inputs?.query?.snip).toBe("snippet_running")

    const requestStep = steps.find(
      s => s.stepId === AutomationActionStepId.API_REQUEST
    )

    const requestOutputs: AutomationStepOutputs<AutomationActionStepId.API_REQUEST> =
      requestStep?.outputs!
    const response = requestOutputs?.response?.[0]

    expect(requestOutputs.success).toBe(true)
    expect(requestOutputs.info.code).toBe(200)
    expect(response.qBinding).toBe("replaced")
    expect(response.envQBinding).toBe("d")
    expect(response.autoSnip).toBe("snippet_running")
    expect(response.autoEnv).toBe("b")
  })

  it("should be able to execute a query and relay the results - for the old execute query steps", async () => {
    mockRestResponse({ count: 1234 })

    const queryFields: RestQueryFields = {
      path: "http://myapi.com/api/count",
    }

    const restSource = await config.restDatasource()
    const restQuery = await setup.saveRESTQuery(config, restSource, queryFields)

    const { steps } = await createAutomationBuilder(config)
      .onAppAction()
      .executeQuery({ query: { queryId: restQuery._id! } })
      .test({ fields: {} })

    const requestStep = steps.find(
      s => s.stepId === AutomationActionStepId.EXECUTE_QUERY
    )
    expect(requestStep).not.toBeUndefined()

    const requestOutputs: AutomationStepOutputs<AutomationActionStepId.EXECUTE_QUERY> =
      requestStep?.outputs!
    const response = requestOutputs?.response?.[0]

    expect(requestOutputs.success).toBe(true)
    expect(requestOutputs.info.code).toBe(200)
    expect(response.count).toBe(1234)
  })
})
