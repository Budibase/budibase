import { validate } from "../utils"
import fetch from "node-fetch"
import { PluginType } from "@budibase/types"
import nock from "nock"

const automationLink = `http://example.com/automation/schema.json`
const componentLink = `http://example.com/component/schema.json`
const datasourceLink = `http://example.com/datasource/schema.json`

function mockDatasourceSchema() {
  nock("http://example.com")
    .get("/datasource/schema.json")
    .reply(200, {
      type: "datasource",
      metadata: {},
      schema: {
        docs: "https://docs.budibase.com",
        friendlyName: "Basic HTTP",
        type: "API",
        description: "Performs a basic HTTP calls to a URL",
        datasource: {
          url: {
            type: "string",
            required: true,
          },
          cookie: {
            type: "string",
            required: false,
          },
        },
        query: {
          create: {
            type: "json",
          },
          read: {
            type: "fields",
            fields: {
              queryString: {
                display: "Query string",
                type: "string",
                required: false,
              },
            },
          },
          update: {
            type: "json",
          },
          delete: {
            type: "fields",
            fields: {
              id: {
                type: "string",
                required: true,
              },
            },
          },
        },
      },
    })
}

function mockAutomationSchema() {
  nock("http://example.com")
    .get("/automation/schema.json")
    .reply(200, {
      type: "automation",
      metadata: {},
      schema: {
        name: "{{ name }}",
        tagline: "{{ description }}",
        icon: "Actions",
        description: "{{ description }}",
        type: "action",
        stepId: "{{ name }}",
        inputs: {
          text: "",
        },
        schema: {
          inputs: {
            properties: {
              text: {
                type: "string",
                title: "Log",
              },
            },
            required: ["text"],
          },
          outputs: {
            properties: {
              success: {
                type: "boolean",
                description: "Whether the action was successful",
              },
              message: {
                type: "string",
                description: "What was output",
              },
            },
            required: ["success", "message"],
          },
        },
      },
    })
}

function mockComponentSchema() {
  nock("http://example.com")
    .get("/component/schema.json")
    .reply(200, {
      type: "component",
      metadata: {},
      schema: {
        name: "{{ name }}",
        friendlyName: "{{ name }}",
        description: "{{ description }}",
        icon: "Text",
        settings: [
          {
            type: "text",
            key: "text",
            label: "Text",
          },
        ],
      },
    })
}

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

describe("plugin validation", () => {
  beforeEach(() => {
    nock.cleanAll()
    mockAutomationSchema()
    mockComponentSchema()
    mockDatasourceSchema()
  })

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
})
