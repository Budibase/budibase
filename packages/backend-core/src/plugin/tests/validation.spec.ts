import { validate } from "../utils"
import fetch from "node-fetch"
import { PluginType } from "@budibase/types"

const repoUrl =
  "https://raw.githubusercontent.com/Budibase/budibase-skeleton/master"
const automationLink = `${repoUrl}/automation/schema.json.hbs`
const componentLink = `${repoUrl}/component/schema.json.hbs`
const datasourceLink = `${repoUrl}/datasource/schema.json.hbs`

async function getSchema(link: string) {
  const response = await fetch(link)
  if (response.status > 300) {
    return
  }
  const text = await response.text()
  return JSON.parse(text)
}

async function runTest(opts: { link?: string; schema?: any }) {
  let error
  try {
    let schema = opts.schema
    if (opts.link) {
      schema = await getSchema(opts.link)
    }
    validate(schema)
  } catch (err) {
    error = err
  }
  return error
}

describe("it should be able to validate an automation schema", () => {
  it("should return automation skeleton schema is valid", async () => {
    const error = await runTest({ link: automationLink })
    expect(error).toBeUndefined()
  })

  it("should fail given invalid automation schema", async () => {
    const error = await runTest({
      schema: {
        type: PluginType.AUTOMATION,
        schema: {},
      },
    })
    expect(error).toBeDefined()
  })
})

describe("it should be able to validate a component schema", () => {
  it("should return component skeleton schema is valid", async () => {
    const error = await runTest({ link: componentLink })
    expect(error).toBeUndefined()
  })

  it("should fail given invalid component schema", async () => {
    const error = await runTest({
      schema: {
        type: PluginType.COMPONENT,
        schema: {},
      },
    })
    expect(error).toBeDefined()
  })
})

describe("it should be able to validate a datasource schema", () => {
  it("should return datasource skeleton schema is valid", async () => {
    const error = await runTest({ link: datasourceLink })
    expect(error).toBeUndefined()
  })

  it("should fail given invalid datasource schema", async () => {
    const error = await runTest({
      schema: {
        type: PluginType.DATASOURCE,
        schema: {},
      },
    })
    expect(error).toBeDefined()
  })
})
