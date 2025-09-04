import { setEnv } from "@budibase/backend-core"
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
import nock from "nock"
import TestConfiguration from "../../../../src/tests/utilities/TestConfiguration"
import * as setup from "../utilities"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

describe("API REST request", () => {
  const config = new TestConfiguration()
  let envCleanup: () => void

  beforeAll(async () => {
    envCleanup = setEnv({
      ENCRYPTION_KEY: "some-key",
    })

    await config.init()
    // No snippet/js support in queries. Snippet support in auto
    config.app = await config.api.workspace.update(config.getAppId(), {
      snippets: [
        {
          name: "tester",
          code: `return function (test) {
              return "snippet_" + (test || "no_value")
            }
          `,
        },
      ],
    })

    // Init env vars
    await config.doInTenant(async () => {
      mocks.licenses.useEnvironmentVariables()
      // Set some base variables
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
    config.end()
  })

  beforeEach(() => {
    nock.cleanAll()
  })

  it("should be able to execute a query and relay the results", async () => {
    nock("http://myapi.com/api").get("/count").reply(200, { count: 1234 })

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
    nock("http://myapi.com/api")
      .get("/count")
      .query(true)
      .reply(200, (uri, _body) => {
        // Intercept the request and query the values as they are used.
        const url = new URL(`http://myapi.com${uri}`)
        const qBinding = url.searchParams.get("qBinding")
        const envQBinding = url.searchParams.get("envQBinding")
        const autoSnip = url.searchParams.get("autoSnip")
        const autoEnv = url.searchParams.get("autoEnv")
        return { qBinding, envQBinding, autoSnip, autoEnv }
      })

    // Snippet values - should be processed in the automation
    const encodedSnippet = encodeJSBinding("return snippets.tester('running')")

    // 'Bindings' in the automation UI
    const parameters = [
      {
        name: "someBinding",
        default: "hello",
      },
      {
        name: "envBinding",
        // The development val of env-2 is used in the test
        default: "{{ env.env-2 }}",
      },
    ]

    const queryFields: RestQueryFields = {
      path: "http://myapi.com/api/count",
      queryString: `qBinding={{ someBinding }}&envQBinding={{ envBinding }}&autoSnip={{ snip }}&autoEnv={{ autoEnv }}`,
    }

    // Build the rest source and query.
    const restSource = await config.restDatasource()
    const someQuery = await setup.saveRESTQuery(
      config,
      restSource,
      queryFields,
      parameters
    )

    // Execute the auto
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

    // Confirm snippets are running.
    const [queryStep] = steps
    expect(queryStep?.inputs?.query?.snip).toBe("snippet_running")

    const requestStep = steps.find(
      s => s.stepId === AutomationActionStepId.API_REQUEST
    )

    const requestOutputs: AutomationStepOutputs<AutomationActionStepId.API_REQUEST> =
      requestStep?.outputs!
    const response = requestOutputs?.response?.[0]

    // The value set in the automation should should be passed to the query.
    expect(response.qBinding).toBe("replaced")

    // The env variable configured in the query should be processed
    expect(response.envQBinding).toBe("d")

    // The snippet should have been processed in the automation and the result relayed.
    expect(response.autoSnip).toBe("snippet_running")

    // Env vars should have resolved in the auto and been relayed
    expect(response.autoEnv).toBe("b")
  })

  // Legacy - the old Execute query step doesn't have any tests for the REST datasource type
  // This ensures that old steps configured in this way still run without issue.
  it("should be able to execute a query and relay the results - for the old execute query steps", async () => {
    nock("http://myapi.com/api").get("/count").reply(200, { count: 1234 })

    const queryFields: RestQueryFields = {
      path: "http://myapi.com/api/count",
    }

    const restSource = await config.restDatasource()
    const restQuery = await setup.saveRESTQuery(config, restSource, queryFields)

    const { steps } = await createAutomationBuilder(config)
      .onAppAction()
      .executeQuery({ query: { queryId: restQuery._id! } }) // Main difference
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
