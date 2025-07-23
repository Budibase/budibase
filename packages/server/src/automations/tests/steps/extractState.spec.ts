import { setEnv } from "@budibase/backend-core"
import { mocks } from "@budibase/backend-core/tests"
import { environmentVariables } from "@budibase/pro"
import TestConfiguration from "../../../../src/tests/utilities/TestConfiguration"
import { encodeJSBinding } from "@budibase/string-templates"
import { createAutomationBuilder } from "../utilities/AutomationTestBuilder"
import { AutomationStatus } from "@budibase/types"
import { v4 as uuidv4 } from "uuid"
import { steps } from "packages/shared-core/src/automations"

/**
 *
 * Overkill?
 * Text,
 * js, Snippets
 *
 * confirm all behaviours
 */

describe("Extract state Automations", () => {
  const config = new TestConfiguration()
  beforeAll(async () => {
    await config.init()

    config.app = await config.api.application.update(config.getAppId(), {
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
    config.end()
  })

  it("should execute a basic script and set the state value", async () => {
    const builder = createAutomationBuilder(config)

    const results = await builder
      .onAppAction()
      .extractState({
        name: "sample",
        code: encodeJSBinding("return 2 + 2"),
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
        name: "invalid",
        code: encodeJSBinding("return 2 +"),
      })
      .extractState({
        name: "valid",
        code: encodeJSBinding("return 2 + 3"),
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
          name: "first",
          code: encodeJSBinding("return 2 + 5"),
        },
        {
          stepId: firstStepId,
        }
      )
      .extractState({
        name: "first",
        code: encodeJSBinding(`return $('state.[first]') + 3`),
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
          name: "first",
          code: encodeJSBinding("return ['hello']"),
        },
        {
          stepId: firstStepId,
        }
      )
      // take the initial array and add more values.
      .extractState({
        name: "first",
        code: encodeJSBinding(`return [...$('state.[first]'),'there']`),
      })
      .extractState({
        name: "second",
        code: encodeJSBinding(
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
        name: "sample",
        code: "some handlebars text {{ [user].[email] }}",
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
        name: "samplehb",
        code: "{{ env.env-1 }}",
      })
      .extractState({
        name: "samplejs",
        code: encodeJSBinding("return $('env.env-1')"),
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
        name: "sampleSnippets",
        code: encodeJSBinding("return snippets.tester('sampleSnippets')"),
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
        name: "testValue",
        code: encodeJSBinding("return 5"),
      })
      .branch({
        activeBranch: {
          steps: stepBuilder =>
            stepBuilder
              .extractState({
                name: "testValue", // alter and replace in the branch
                code: encodeJSBinding("return $('state.testValue') + 10"),
              })
              .extractState({
                name: "someOtherValue",
                code: "hi",
              }),
          condition: {
            equal: { [encodeJSBinding("return $('state.testValue')")]: 5 },
          },
        },
        inactiveBranch: {
          steps: stepBuilder =>
            stepBuilder
              .extractState({
                name: "testValue",
                code: encodeJSBinding("return $('state.testValue') + 20"),
              })
              .extractState({
                name: "someOtherValue",
                code: "bye",
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
