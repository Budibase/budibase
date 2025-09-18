import { setEnv } from "@budibase/backend-core"
import { mocks } from "@budibase/backend-core/tests"
import { environmentVariables } from "@budibase/pro"
import { encodeJSBinding } from "@budibase/string-templates"
import { AutomationStatus } from "@budibase/types"
import { v4 as uuidv4 } from "uuid"
import TestConfiguration from "../../../../src/tests/utilities/TestConfiguration"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"

describe("Extract state Automations", () => {
  const config = new TestConfiguration()
  let envCleanup: () => void

  beforeAll(async () => {
    envCleanup = setEnv({
      ENCRYPTION_KEY: "some-key",
    })
    await config.init()

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

    // Init env var
    await config.doInTenant(async () => {
      mocks.licenses.useEnvironmentVariables()
      await environmentVariables.update("env-1", {
        production: "a",
        development: "b",
      })
      const envKeys = await environmentVariables.fetch()

      expect(envKeys).toStrictEqual(["env-1"])
    })
  })

  afterAll(() => {
    envCleanup()
    config.end()
  })

  it("should execute a basic script and set the state value", async () => {
    const builder = createAutomationBuilder(config)

    const results = await builder
      .onAppAction()
      .extractState({
        key: "sample",
        value: encodeJSBinding("return 2 + 2"),
      })
      .test({ fields: {} })

    const step = results.steps[0]
    expect(step.outputs.value).toEqual(4)

    // There should be a matching entry in the state
    expect(results.state?.["sample"]).toBe(4)
  })

  it("should process a failed js script leaving valid state intact", async () => {
    const builder = createAutomationBuilder(config)

    const results = await builder
      .onAppAction()
      .extractState({
        key: "invalid",
        value: encodeJSBinding("return 2 +"),
      })
      .extractState({
        key: "valid",
        value: encodeJSBinding("return 2 + 3"),
      })
      .test({ fields: {} })

    const failureStep = results.steps[0]
    expect(failureStep.outputs.success).toBe(false)
    expect(results.status).toEqual(AutomationStatus.ERROR)

    const successStep = results.steps[1]
    expect(successStep.outputs.success).toBe(true)
    expect(successStep.outputs.value).toBe(5)

    // The failure should not cause a total automation failure
    // Successful elements should be present
    expect(results.state?.["valid"]).toEqual(5)
    expect(results.state?.["invalid"]).toBeUndefined()
  })

  it("should be able to reference state and modify the value", async () => {
    const builder = createAutomationBuilder(config)

    const firstStepId = uuidv4()
    const results = await builder
      .onAppAction()
      .extractState(
        {
          key: "first",
          value: encodeJSBinding("return 2 + 5"),
        },
        {
          stepId: firstStepId,
        }
      )
      .extractState({
        key: "first",
        value: encodeJSBinding(`return $('state.[first]') + 3`),
      })
      .test({ fields: {} })

    expect(results.state?.["first"]).toBe(10)
  })

  it("should be able to build complex state vars and bind them", async () => {
    const builder = createAutomationBuilder(config)

    const firstStepId = uuidv4()
    const results = await builder
      .onAppAction()
      .extractState(
        {
          key: "first",
          value: encodeJSBinding("return ['hello']"),
        },
        {
          stepId: firstStepId,
        }
      )
      // take the initial array and add more values.
      .extractState({
        key: "first",
        value: encodeJSBinding(`return [...$('state.[first]'),'there']`),
      })
      .extractState({
        key: "second",
        value: encodeJSBinding(
          `return {firstCount: $('state.[first]').length, test: { complete: true }}`
        ),
      })
      .serverLog({
        text: "{{ state.[second].[test].[complete] }}",
      })
      .test({ fields: {} })

    // You can work with the values via state
    expect(results.state?.["first"]).toStrictEqual(["hello", "there"])
    expect(results.state?.["second"]).toStrictEqual({
      firstCount: 2,
      test: { complete: true },
    })
    // You can navigate the elements you build in state in regular steps.
    expect(results.steps[3].outputs.message).toBe(
      `App ${config.app?.appId} - true`
    )
  })

  it("should process plain text handlebars expression", async () => {
    const builder = createAutomationBuilder(config)

    const results = await builder
      .onAppAction()
      .extractState({
        key: "sample",
        value: "some handlebars text {{ [user].[email] }}",
      })
      .test({ fields: {} })

    const processed = `some handlebars text ${config.user?.email}`
    const step = results.steps[0]
    expect(step.outputs.value).toEqual(processed)
    expect(results.state?.["sample"]).toBe(processed)
  })

  it("should process env variables correctly", async () => {
    const builder = createAutomationBuilder(config)

    const results = await builder
      .onAppAction()
      .extractState({
        key: "samplehb",
        value: "{{ env.env-1 }}",
      })
      .extractState({
        key: "samplejs",
        value: encodeJSBinding("return $('env.env-1')"),
      })
      .test({ fields: {} })

    expect(results.state?.["samplehb"]).toBe("b")
    expect(results.state?.["samplejs"]).toBe("b")

    expect(results.steps[0].outputs.value).toBe("b")
    expect(results.steps[1].outputs.value).toBe("b")
  })

  it("should process snippets correctly", async () => {
    const builder = createAutomationBuilder(config)

    const results = await builder
      .onAppAction()
      .extractState({
        key: "sampleSnippets",
        value: encodeJSBinding("return snippets.tester('sampleSnippets')"),
      })
      .test({ fields: {} })

    expect(results.state?.["sampleSnippets"]).toBe("snippet_sampleSnippets")
    expect(results.steps[0].outputs.value).toBe("snippet_sampleSnippets")
  })

  it("should process state values in a branched path", async () => {
    const builder = createAutomationBuilder(config)

    //someVal
    const results = await builder
      .onAppAction()
      .extractState({
        key: "testValue",
        value: encodeJSBinding("return 5"),
      })
      .branch({
        activeBranch: {
          steps: stepBuilder =>
            stepBuilder
              .extractState({
                key: "testValue", // alter and replace in the branch
                value: encodeJSBinding("return $('state.testValue') + 10"),
              })
              .extractState({
                key: "someOtherValue",
                value: "hi",
              }),
          condition: {
            equal: { [encodeJSBinding("return $('state.testValue')")]: 5 },
          },
        },
        inactiveBranch: {
          steps: stepBuilder =>
            stepBuilder
              .extractState({
                key: "testValue",
                value: encodeJSBinding("return $('state.testValue') + 20"),
              })
              .extractState({
                key: "someOtherValue",
                value: "bye",
              }),
          condition: {
            equal: { [encodeJSBinding("return $('state.testValue')")]: 6 },
          },
        },
      })
      .test({
        fields: {},
      })

    // Should alter an existing value
    expect(results?.state?.testValue).toBe(15)
    // Should initialise a new value.
    expect(results?.state?.someOtherValue).toBe("hi")
  })
})
