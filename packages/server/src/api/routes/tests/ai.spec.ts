import { z } from "zod"
import { zodResponseFormat } from "openai/helpers/zod"
import { mockChatGPTResponse } from "../../../tests/utilities/mocks/ai/openai"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import nock from "nock"
import { configs, env, features, setEnv } from "@budibase/backend-core"
import {
  AIInnerConfig,
  AIOperationEnum,
  AttachmentSubType,
  ConfigType,
  Feature,
  FieldType,
  License,
  PlanModel,
  PlanType,
  ProviderConfig,
  RelationshipType,
} from "@budibase/types"
import { context } from "@budibase/backend-core"
import { generator } from "@budibase/backend-core/tests"
import { quotas, ai } from "@budibase/pro"
import { MockLLMResponseFn } from "../../../tests/utilities/mocks/ai"
import { mockAnthropicResponse } from "../../../tests/utilities/mocks/ai/anthropic"

function dedent(str: string) {
  return str
    .split("\n")
    .map(line => line.trim())
    .join("\n")
}

type SetupFn = (
  config: TestConfiguration
) => Promise<() => Promise<void> | void>
interface TestSetup {
  name: string
  setup: SetupFn
  mockLLMResponse: MockLLMResponseFn
}

function budibaseAI(): SetupFn {
  return async (config: TestConfiguration) => {
    await config.doInTenant(async () => {
      await configs.save({
        type: ConfigType.AI,
        config: {
          budibaseAI: {
            provider: "BudibaseAI",
            name: "Budibase AI",
            active: true,
            isDefault: true,
          },
        },
      })
    })

    return setEnv({ OPENAI_API_KEY: "test-key", SELF_HOSTED: false })
  }
}

function customAIConfig(providerConfig: Partial<ProviderConfig>): SetupFn {
  return async (config: TestConfiguration) => {
    const innerConfig: AIInnerConfig = {
      myaiconfig: {
        provider: "OpenAI",
        name: "OpenAI",
        apiKey: "test-key",
        defaultModel: "gpt-4o-mini",
        active: true,
        isDefault: true,
        ...providerConfig,
      },
    }

    const { id, rev } = await config.doInTenant(
      async () =>
        await configs.save({
          type: ConfigType.AI,
          config: innerConfig,
        })
    )

    return async () => {
      await config.doInTenant(async () => {
        const db = context.getGlobalDB()
        await db.remove(id, rev)
      })
    }
  }
}

const allProviders: TestSetup[] = [
  {
    name: "OpenAI API key",
    setup: async () => {
      return setEnv({
        OPENAI_API_KEY: "test-key",
      })
    },
    mockLLMResponse: mockChatGPTResponse,
  },
  {
    name: "OpenAI API key with custom config",
    setup: customAIConfig({ provider: "OpenAI", defaultModel: "gpt-4o-mini" }),
    mockLLMResponse: mockChatGPTResponse,
  },
  {
    name: "Anthropic API key with custom config",
    setup: customAIConfig({
      provider: "Anthropic",
      defaultModel: "claude-3-5-sonnet-20240620",
    }),
    mockLLMResponse: mockAnthropicResponse,
  },
  {
    name: "BudibaseAI",
    setup: budibaseAI(),
    mockLLMResponse: mockChatGPTResponse,
  },
]

describe("AI", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  beforeEach(() => {
    nock.cleanAll()
  })

  describe.each(allProviders)(
    "provider: $name",
    ({ setup, mockLLMResponse }: TestSetup) => {
      let cleanup: () => Promise<void> | void
      beforeAll(async () => {
        cleanup = await setup(config)
      })

      afterAll(async () => {
        const maybePromise = cleanup()
        if (maybePromise) {
          await maybePromise
        }
      })

      describe("POST /api/ai/js", () => {
        let cleanup: () => void
        beforeAll(() => {
          cleanup = features.testutils.setFeatureFlags("*", {
            AI_JS_GENERATION: true,
          })
        })

        afterAll(() => {
          cleanup()
        })

        it("handles correct plain code response", async () => {
          mockLLMResponse(`return 42`)

          const { code } = await config.api.ai.generateJs({ prompt: "test" })
          expect(code).toBe("return 42")
        })

        it("handles correct markdown code response", async () => {
          mockLLMResponse(
            dedent(`
                \`\`\`js
                return 42
                \`\`\`
            `)
          )

          const { code } = await config.api.ai.generateJs({ prompt: "test" })
          expect(code).toBe("return 42")
        })

        it("handles multiple markdown code blocks returned", async () => {
          mockLLMResponse(
            dedent(`
                This:

                \`\`\`js
                return 42
                \`\`\`

                Or this:

                \`\`\`js
                return 10
                \`\`\`
            `)
          )

          const { code } = await config.api.ai.generateJs({ prompt: "test" })
          expect(code).toBe("return 42")
        })

        // TODO: handle when this happens
        it.skip("handles no code response", async () => {
          mockLLMResponse("I'm sorry, you're quite right, etc.")
          const { code } = await config.api.ai.generateJs({ prompt: "test" })
          expect(code).toBe("")
        })

        it("handles LLM errors", async () => {
          mockLLMResponse(() => {
            throw new Error("LLM error")
          })
          await config.api.ai.generateJs({ prompt: "test" }, { status: 500 })
        })
      })

      describe("POST /api/ai/cron", () => {
        it("handles correct cron response", async () => {
          mockLLMResponse("0 0 * * *")

          const { message } = await config.api.ai.generateCron({
            prompt: "test",
          })
          expect(message).toBe("0 0 * * *")
        })

        it("handles expected LLM error", async () => {
          mockLLMResponse("Error generating cron: skill issue")

          await config.api.ai.generateCron(
            {
              prompt: "test",
            },
            { status: 400 }
          )
        })

        it("handles unexpected LLM error", async () => {
          mockLLMResponse(() => {
            throw new Error("LLM error")
          })

          await config.api.ai.generateCron(
            {
              prompt: "test",
            },
            { status: 500 }
          )
        })
      })
    }
  )
})

describe("BudibaseAI", () => {
  const config = new TestConfiguration()
  let cleanup: () => void | Promise<void>
  beforeAll(async () => {
    await config.init()
    cleanup = await budibaseAI()(config)
  })

  afterAll(async () => {
    if ("then" in cleanup) {
      await cleanup()
    } else {
      cleanup()
    }
    config.end()
  })

  async function getQuotaUsage() {
    return await context.doInSelfHostTenantUsingCloud(
      config.getTenantId(),
      async () => {
        return await quotas.getQuotaUsage()
      }
    )
  }

  describe("POST /api/ai/chat", () => {
    let licenseKey = "test-key"
    let internalApiKey = "api-key"

    let envCleanup: () => void
    let featureCleanup: () => void
    beforeAll(() => {
      envCleanup = setEnv({
        SELF_HOSTED: false,
        INTERNAL_API_KEY: internalApiKey,
      })
      featureCleanup = features.testutils.setFeatureFlags("*", {
        AI_JS_GENERATION: true,
      })
    })

    afterAll(() => {
      featureCleanup()
      envCleanup()
    })

    beforeEach(async () => {
      await config.newTenant()
      nock.cleanAll()
      const license: License = {
        plan: {
          type: PlanType.FREE,
          model: PlanModel.PER_USER,
          usesInvoicing: false,
        },
        features: [Feature.BUDIBASE_AI],
        quotas: {} as any,
        tenantId: config.tenantId,
      }
      nock(env.ACCOUNT_PORTAL_URL)
        .get(`/api/license/${licenseKey}`)
        .reply(200, license)
    })

    it("handles correct chat response", async () => {
      let usage = await getQuotaUsage()
      expect(usage._id).toBe(`quota_usage_${config.getTenantId()}`)
      expect(usage.monthly.current.budibaseAICredits).toBe(0)

      mockChatGPTResponse("Hi there!")
      const { messages } = await config.api.ai.chat({
        messages: [{ role: "user", content: "Hello!" }],
        licenseKey: licenseKey,
      })
      expect(messages).toEqual([
        {
          role: "user",
          content: "Hello!",
        },
        {
          role: "assistant",
          content: "Hi there!",
        },
      ])

      usage = await getQuotaUsage()
      expect(usage.monthly.current.budibaseAICredits).toBeGreaterThan(0)
    })

    it("handles chat response error", async () => {
      mockChatGPTResponse(() => {
        throw new Error("LLM error")
      })
      await config.api.ai.chat(
        {
          messages: [{ role: "user", content: "Hello!" }],
          licenseKey: "test-key",
        },
        { status: 500 }
      )
    })

    it("handles no license", async () => {
      nock.cleanAll()
      nock(env.ACCOUNT_PORTAL_URL).get(`/api/license/${licenseKey}`).reply(404)
      await config.api.ai.chat(
        {
          messages: [{ role: "user", content: "Hello!" }],
          licenseKey: "test-key",
        },
        {
          status: 403,
        }
      )
    })

    it("handles no license key", async () => {
      await config.api.ai.chat(
        {
          messages: [{ role: "user", content: "Hello!" }],
          // @ts-expect-error - intentionally wrong
          licenseKey: undefined,
        },
        {
          status: 403,
        }
      )
    })

    it("handles text format", async () => {
      let usage = await getQuotaUsage()
      expect(usage._id).toBe(`quota_usage_${config.getTenantId()}`)
      expect(usage.monthly.current.budibaseAICredits).toBe(0)

      const gptResponse = generator.word()
      mockChatGPTResponse(gptResponse, { format: "text" })
      const { messages } = await config.api.ai.chat({
        messages: [{ role: "user", content: "Hello!" }],
        format: "text",
        licenseKey: licenseKey,
      })
      expect(messages).toEqual([
        {
          role: "user",
          content: "Hello!",
        },
        {
          role: "assistant",
          content: gptResponse,
        },
      ])

      usage = await getQuotaUsage()
      expect(usage.monthly.current.budibaseAICredits).toBeGreaterThan(0)
    })

    it("handles json format", async () => {
      let usage = await getQuotaUsage()
      expect(usage._id).toBe(`quota_usage_${config.getTenantId()}`)
      expect(usage.monthly.current.budibaseAICredits).toBe(0)

      const gptResponse = JSON.stringify({
        [generator.word()]: generator.word(),
      })
      mockChatGPTResponse(gptResponse, { format: "json" })
      const { messages } = await config.api.ai.chat({
        messages: [{ role: "user", content: "Hello!" }],
        format: "json",
        licenseKey: licenseKey,
      })
      expect(messages).toEqual([
        {
          role: "user",
          content: "Hello!",
        },
        {
          role: "assistant",
          content: gptResponse,
        },
      ])

      usage = await getQuotaUsage()
      expect(usage.monthly.current.budibaseAICredits).toBeGreaterThan(0)
    })

    it("handles structured outputs", async () => {
      let usage = await getQuotaUsage()
      expect(usage._id).toBe(`quota_usage_${config.getTenantId()}`)
      expect(usage.monthly.current.budibaseAICredits).toBe(0)

      const gptResponse = generator.guid()
      const structuredOutput = zodResponseFormat(
        z.object({
          [generator.word()]: z.string(),
        }),
        "key"
      )
      mockChatGPTResponse(gptResponse, { format: structuredOutput })
      const { messages } = await config.api.ai.chat({
        messages: [{ role: "user", content: "Hello!" }],
        format: structuredOutput,
        licenseKey: licenseKey,
      })
      expect(messages).toEqual([
        {
          role: "user",
          content: "Hello!",
        },
        {
          role: "assistant",
          content: gptResponse,
        },
      ])

      usage = await getQuotaUsage()
      expect(usage.monthly.current.budibaseAICredits).toBeGreaterThan(0)
    })
  })

  describe("POST /api/ai/tables", () => {
    let featureCleanup: () => void
    beforeAll(() => {
      featureCleanup = features.testutils.setFeatureFlags("*", {
        AI_TABLE_GENERATION: true,
      })
    })

    afterAll(() => {
      featureCleanup()
    })

    beforeEach(async () => {
      await config.newTenant()
      nock.cleanAll()
    })

    const mockAIGenerationStructure = (
      generationStructure: ai.GenerationStructure
    ) =>
      mockChatGPTResponse(JSON.stringify(generationStructure), {
        format: zodResponseFormat(ai.generationStructure, "key"),
      })

    const mockAIColumnGeneration = (
      generationStructure: ai.GenerationStructure,
      aiColumnGeneration: ai.AIColumnSchemas
    ) =>
      mockChatGPTResponse(JSON.stringify(aiColumnGeneration), {
        format: zodResponseFormat(
          ai.aiColumnSchemas(
            ai.aiTableResponseToTableSchema(generationStructure)
          ),
          "key"
        ),
      })

    const mockDataGeneration = (
      dataGeneration: Record<string, Record<string, any>[]>
    ) =>
      mockChatGPTResponse(JSON.stringify(dataGeneration), {
        format: zodResponseFormat(ai.tableDataStructuredOutput([]), "key"),
      })

    const mockProcessAIColumn = (response: string) =>
      mockChatGPTResponse(response)

    it("handles correct chat response", async () => {
      const prompt = "Create me a table for managing IT tickets"
      const generationStructure: ai.GenerationStructure = {
        tables: [
          {
            name: "Tickets",
            primaryDisplay: "Title",
            schema: [
              {
                name: "Title",
                type: FieldType.STRING,
                constraints: {
                  presence: true,
                },
              },
              {
                name: "Description",
                type: FieldType.LONGFORM,
                constraints: {
                  presence: true,
                },
              },
              {
                name: "Priority",
                type: FieldType.OPTIONS,
                constraints: {
                  inclusion: ["Low", "Medium", "High"],
                  presence: true,
                },
              },
              {
                name: "Status",
                type: FieldType.OPTIONS,
                constraints: {
                  inclusion: ["Open", "In Progress", "Closed"],
                  presence: true,
                },
              },
              {
                name: "Assignee",
                type: FieldType.LINK,
                tableId: "Employees",
                relationshipType: RelationshipType.MANY_TO_ONE,
                reverseFieldName: "AssignedTickets",
                relationshipId: "TicketUser",
              },
              {
                name: "Created Date",
                type: FieldType.DATETIME,
                ignoreTimezones: false,
                dateOnly: true,
              },
              {
                name: "Resolution Time (Days)",
                type: FieldType.FORMULA,
                formula:
                  'return (new Date() - new Date($("Created Date"))) / (1000 * 60 * 60 * 24);',
                responseType: FieldType.NUMBER,
              },
              {
                name: "Attachment",
                type: FieldType.ATTACHMENT_SINGLE,
              },
            ],
          },
          {
            name: "Employees",
            primaryDisplay: "First Name",
            schema: [
              {
                name: "First Name",
                type: FieldType.STRING,
                constraints: {
                  presence: true,
                },
              },
              {
                name: "Last Name",
                type: FieldType.STRING,
                constraints: {
                  presence: true,
                },
              },
              {
                name: "Position",
                type: FieldType.STRING,
                constraints: {
                  presence: true,
                },
              },
              {
                name: "Photo",
                type: FieldType.ATTACHMENT_SINGLE,
                subtype: AttachmentSubType.IMAGE,
              },
              {
                name: "Documents",
                type: FieldType.ATTACHMENTS,
              },

              {
                name: "AssignedTickets",
                type: FieldType.LINK,
                tableId: "Tickets",
                relationshipType: RelationshipType.ONE_TO_MANY,
                reverseFieldName: "Assignee",
                relationshipId: "TicketUser",
              },
            ],
          },
        ],
      }
      mockAIGenerationStructure(generationStructure)

      const aiColumnGeneration: ai.AIColumnSchemas = {
        Tickets: [
          {
            name: "Ticket Summary",
            type: FieldType.AI,
            operation: AIOperationEnum.SUMMARISE_TEXT,
            columns: ["Title", "Description"],
          },
          {
            name: "Translated Description",
            type: FieldType.AI,
            operation: AIOperationEnum.TRANSLATE,
            column: "Description",
            language: "es",
          },
        ],
        Employees: [
          {
            name: "Role Category",
            type: FieldType.AI,
            operation: AIOperationEnum.CATEGORISE_TEXT,
            columns: ["Position"],
            categories: "Manager,Staff,Intern,Contractor",
          },
        ],
      }
      mockAIColumnGeneration(generationStructure, aiColumnGeneration)

      nock("https://photourl.com").get("/any.png").reply(200).persist()

      const dataGeneration: Record<string, Record<string, any>[]> = {
        Tickets: [
          {
            Title: "System slow performance",
            Description:
              "User reports significant slowdowns when using multiple applications simultaneously on their PC.",
            Priority: "Medium",
            Status: "Closed",
            "Created Date": "2025-04-17",
            Attachment: {
              name: "performance_logs.txt",
              extension: ".txt",
              content: "performance logs",
            },
          },
          {
            Title: "Email delivery failure",
            Description:
              "Emails sent to external clients are bouncing back. Bounce back message: '550: Recipient address rejected'.",
            Priority: "Medium",
            Status: "In Progress",
            "Created Date": "2025-04-19",
            Attachment: {
              name: "email_bounce_back.txt",
              extension: ".txt",
              content: "Email delivery failure",
            },
          },
          {
            Title: "Software installation request",
            Description:
              "Request to install Adobe Photoshop on user’s workstation for design work.",
            Priority: "Low",
            Status: "In Progress",
            "Created Date": "2025-04-18",
            Attachment: {
              name: "software_request_form.pdf",
              extension: ".pdf",
              content: "Software installation request",
            },
          },
          {
            Title: "Unable to connect to VPN",
            Description:
              "User is experiencing issues when trying to connect to the VPN. Error message: 'VPN connection failed due to incorrect credentials'.",
            Priority: "High",
            Status: "Open",
            "Created Date": "2025-04-20",
            Attachment: {
              name: "vpn_error_screenshot.pdf",
              extension: ".pdf",
              content: "vpn error",
            },
          },
        ],
        Employees: [
          {
            "First Name": "Joshua",
            "Last Name": "Lee",
            Position: "Application Developer",
            Photo: "https://photourl.com/any.png",
            Documents: [
              {
                name: "development_guidelines.pdf",
                extension: ".pdf",
                content: "any content",
              },
              {
                name: "project_documents.txt",
                extension: ".txt",
                content: "any content",
              },
            ],
          },
          {
            "First Name": "Emily",
            "Last Name": "Davis",
            Position: "Software Deployment Technician",
            Photo: "https://photourl.com/any.png",
            Documents: [
              {
                name: "software_license_list.txt",
                extension: ".txt",
                content: "any content",
              },
              {
                name: "deployment_guide.pdf",
                extension: ".pdf",
                content: "any content",
              },
              {
                name: "installation_logs.txt",
                extension: ".txt",
                content: "any content",
              },
            ],
          },
          {
            "First Name": "James",
            "Last Name": "Smith",
            Position: "IT Support Specialist",
            Photo: "https://photourl.com/any.png",
            Documents: [
              {
                name: "certificates.pdf",
                extension: ".pdf",
                content: "any content",
              },
              {
                name: "employment_contract.pdf",
                extension: ".pdf",
                content: "any content",
              },
            ],
          },
          {
            "First Name": "Jessica",
            "Last Name": "Taylor",
            Position: "Cybersecurity Analyst",
            Photo: "https://photourl.com/any.png",
            Documents: [
              {
                name: "security_audit_report.pdf",
                extension: ".pdf",
                content: "any content",
              },
              {
                name: "incident_response_plan.pdf",
                extension: ".pdf",
                content: "any content",
              },
            ],
          },
          {
            "First Name": "Ashley",
            "Last Name": "Harris",
            Position: "Database Administrator",
            Photo: "https://photourl.com/any.png",
            Documents: [
              {
                name: "database_backup.txt",
                extension: ".txt",
                content: "any content",
              },
              {
                name: "permission_settings.pdf",
                extension: ".pdf",
                content: "any content",
              },
            ],
          },
        ],
      }
      mockDataGeneration(dataGeneration)

      mockProcessAIColumn("Mock LLM Response")

      const { createdTables } = await config.api.ai.generateTables({ prompt })
      expect(createdTables).toEqual([
        { id: expect.stringMatching(/ta_\w+/), name: "Tickets" },
        { id: expect.stringMatching(/ta_\w+/), name: "Employees" },
      ])

      const tables = [
        await config.api.table.get(createdTables[0].id),
        await config.api.table.get(createdTables[1].id),
      ]
      expect(tables).toEqual([
        expect.objectContaining({
          name: "Tickets",
          schema: {
            Title: {
              name: "Title",
              type: "string",
              constraints: {
                presence: true,
              },
              aiGenerated: true,
            },
            Description: {
              name: "Description",
              type: "longform",
              constraints: {
                presence: true,
              },
              aiGenerated: true,
            },
            Priority: {
              name: "Priority",
              type: "options",
              constraints: {
                inclusion: ["Low", "Medium", "High"],
                presence: true,
              },
              aiGenerated: true,
            },
            Status: {
              name: "Status",
              type: "options",
              constraints: {
                inclusion: ["Open", "In Progress", "Closed"],
                presence: true,
              },
              aiGenerated: true,
            },
            Assignee: {
              name: "Assignee",
              type: "link",
              tableId: createdTables[1].id,
              fieldName: "AssignedTickets",
              relationshipType: "one-to-many",
              aiGenerated: true,
            },
            "Created Date": {
              name: "Created Date",
              type: "datetime",
              ignoreTimezones: false,
              dateOnly: true,
              aiGenerated: true,
            },
            "Resolution Time (Days)": {
              name: "Resolution Time (Days)",
              type: "formula",
              formula:
                '{{ js "cmV0dXJuIChuZXcgRGF0ZSgpIC0gbmV3IERhdGUoJCgiQ3JlYXRlZCBEYXRlIikpKSAvICgxMDAwICogNjAgKiA2MCAqIDI0KTs=" }}',
              responseType: "number",
              aiGenerated: true,
            },
            Attachment: {
              name: "Attachment",
              type: "attachment_single",
              aiGenerated: true,
            },
            "Ticket Summary": {
              name: "Ticket Summary",
              type: "ai",
              operation: "SUMMARISE_TEXT",
              columns: ["Title", "Description"],
              aiGenerated: true,
            },
            "Translated Description": {
              name: "Translated Description",
              type: "ai",
              operation: "TRANSLATE",
              column: "Description",
              language: "es",
              aiGenerated: true,
            },
          },
          aiGenerated: true,
        }),
        expect.objectContaining({
          name: "Employees 2",
          schema: {
            "First Name": {
              constraints: {
                presence: true,
              },
              name: "First Name",
              type: "string",
              aiGenerated: true,
            },
            "Last Name": {
              constraints: {
                presence: true,
              },
              name: "Last Name",
              type: "string",
              aiGenerated: true,
            },
            Photo: {
              name: "Photo",
              subtype: "image",
              type: "attachment_single",
              aiGenerated: true,
            },
            Position: {
              constraints: {
                presence: true,
              },
              name: "Position",
              type: "string",
              aiGenerated: true,
            },
            AssignedTickets: {
              fieldName: "Assignee",
              name: "AssignedTickets",
              relationshipType: "many-to-one",
              tableId: createdTables[0].id,
              type: "link",
              aiGenerated: true,
            },
            Documents: {
              name: "Documents",
              type: "attachment",
              aiGenerated: true,
            },
            "Role Category": {
              categories: "Manager,Staff,Intern,Contractor",
              columns: ["Position"],
              name: "Role Category",
              operation: "CATEGORISE_TEXT",
              type: "ai",
              aiGenerated: true,
            },
          },
          aiGenerated: true,
        }),
      ])

      const tickets = await config.api.row.fetch(createdTables[0].id)
      expect(tickets).toHaveLength(4)

      const employees = await config.api.row.fetch(createdTables[1].id)
      expect(employees).toHaveLength(5)
    })
  })
})
