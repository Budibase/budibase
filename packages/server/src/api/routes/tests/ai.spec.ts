import { z } from "zod"
import {
  mockAISDKChatGPTResponse,
  mockChatGPTResponse,
  mockChatGPTStreamFailure,
  mockOpenAIFileUpload,
} from "../../../tests/utilities/mocks/ai/openai"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { setupDefaultCompletionsAIConfig } from "../../../tests/utilities/aiConfig"
import nock from "nock"
import { context, env, setEnv } from "@budibase/backend-core"
import {
  AIOperationEnum,
  AttachmentSubType,
  Feature,
  FieldType,
  License,
  PlanModel,
  PlanType,
  RelationshipType,
} from "@budibase/types"
import { generator } from "@budibase/backend-core/tests"
import { quotas, ai } from "@budibase/pro"
import { withEnv as serverWithEnv } from "../../../environment"

function toResponseFormat(schema: z.ZodType) {
  return {
    type: "json_schema" as const,
    json_schema: {
      name: "response",
      strict: false,
      schema: z.toJSONSchema(schema, { target: "draft-7" }),
    },
  }
}

function dedent(str: string) {
  return str
    .split("\n")
    .map(line => line.trim())
    .join("\n")
}

describe("AI", () => {
  const config = new TestConfiguration()
  let cleanup: (() => Promise<void>) | undefined
  let cleanupEnv: (() => void) | undefined

  beforeAll(async () => {
    cleanupEnv = setEnv({ SELF_HOSTED: false })
    await config.init()
    await config.newTenant()
    cleanup = await setupDefaultCompletionsAIConfig(config)
  })

  afterAll(async () => {
    cleanupEnv?.()
    if (cleanup) {
      await cleanup()
    }
    config.end()
  })

  describe("POST /api/ai/js", () => {
    it("handles correct plain code response", async () => {
      mockAISDKChatGPTResponse(`return 42`)

      const { code } = await config.api.ai.generateJs({ prompt: "test" })
      expect(code).toBe("return 42")
    })

    it("handles correct markdown code response", async () => {
      mockAISDKChatGPTResponse(
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
      mockAISDKChatGPTResponse(
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
      mockAISDKChatGPTResponse("I'm sorry, you're quite right, etc.")
      const { code } = await config.api.ai.generateJs({ prompt: "test" })
      expect(code).toBe("")
    })

    it("handles LLM errors", async () => {
      mockAISDKChatGPTResponse(
        () => {
          throw new Error("LLM error")
        },
        { times: 3 }
      )
      await config.api.ai.generateJs({ prompt: "test" }, { status: 500 })
    })
  })

  describe("POST /api/ai/cron", () => {
    it("handles correct cron response", async () => {
      mockAISDKChatGPTResponse("0 0 * * *")

      const { message } = await config.api.ai.generateCron({
        prompt: "test",
      })
      expect(message).toBe("0 0 * * *")
    })

    it("handles expected LLM error", async () => {
      mockAISDKChatGPTResponse("Error generating cron: skill issue")

      await config.api.ai.generateCron(
        {
          prompt: "test",
        },
        { status: 400 }
      )
    })

    it("handles unexpected LLM error", async () => {
      mockAISDKChatGPTResponse(
        () => {
          throw new Error("LLM error")
        },
        { times: 3 }
      )

      await config.api.ai.generateCron(
        {
          prompt: "test",
        },
        { status: 500 }
      )
    })
  })
})

describe("BudibaseAI", () => {
  const config = new TestConfiguration()
  let cleanup: (() => void | Promise<void>)[] = []
  beforeAll(async () => {
    await config.init()
    cleanup.push(setEnv({ SELF_HOSTED: false }))
  })

  afterAll(async () => {
    for (const fn of cleanup) {
      const result = fn()
      if (result && "then" in result) {
        await result
      }
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
    beforeAll(() => {
      envCleanup = setEnv({
        SELF_HOSTED: false,
        ACCOUNT_PORTAL_API_KEY: internalApiKey,
      })
    })

    afterAll(() => {
      envCleanup()
    })

    beforeEach(async () => {
      await config.newTenant()
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
      mockAISDKChatGPTResponse("Hi there!")

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
    })

    it("handles chat response error", async () => {
      mockAISDKChatGPTResponse(
        () => {
          throw new Error("LLM error")
        },
        { times: 3 }
      )
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
      const gptResponse = generator.word()
      mockAISDKChatGPTResponse(gptResponse)
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
    })

    it("handles json format", async () => {
      const gptResponse = JSON.stringify({
        [generator.word()]: generator.word(),
      })
      mockAISDKChatGPTResponse(gptResponse)
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
    })

    it("handles structured outputs", async () => {
      const gptResponse = generator.guid()
      const structuredOutput = toResponseFormat(
        z.object({
          [generator.word()]: z.string(),
        })
      )
      mockAISDKChatGPTResponse(gptResponse)
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
    })
  })

  describe("POST /api/ai/tables", () => {
    let cleanupDefaultConfig: (() => Promise<void>) | undefined

    beforeEach(async () => {
      await config.newTenant()
      nock.cleanAll()
      cleanupDefaultConfig = await setupDefaultCompletionsAIConfig(config)
    })

    afterEach(async () => {
      if (cleanupDefaultConfig) {
        await cleanupDefaultConfig()
      }
    })

    const mockAIGenerationStructure = (
      generationStructure: ai.GenerationStructure
    ) => {
      mockAISDKChatGPTResponse(JSON.stringify(generationStructure), {
        format: toResponseFormat(ai.generationStructure),
      })
    }

    const mockAIColumnGeneration = (
      generationStructure: ai.GenerationStructure,
      aiColumnGeneration: ai.AIColumnSchemas
    ) =>
      mockAISDKChatGPTResponse(JSON.stringify(aiColumnGeneration), {
        format: toResponseFormat(
          ai.aiColumnSchemas(
            ai.aiTableResponseToTableSchema(generationStructure)
          )
        ),
      })

    const mockDataGeneration = (
      generationStructure: ai.GenerationStructure,
      dataGeneration: Record<string, Record<string, any>[]>
    ) =>
      mockAISDKChatGPTResponse(JSON.stringify(dataGeneration), {
        format: toResponseFormat(
          ai.tableDataStructuredOutput(
            ai.aiTableResponseToTableSchema(generationStructure)
          )
        ),
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

      // Use nock for image downloads since it intercepts before undici
      nock("https://picsum.photos")
        .get("/600/600")
        .times(5) // 5 employee photos
        .reply(200, Buffer.from("fake image data"))

      const dataGeneration: Record<string, Record<string, any>[]> = {
        Tickets: [
          {
            _id: "ticket_1",
            Title: "System slow performance",
            Description:
              "User reports significant slowdowns when using multiple applications simultaneously on their PC.",
            Priority: "Medium",
            Status: "Closed",
            "Created Date": "2025-04-17",
            Assignee: [],
            Attachment: {
              fileName: "performance_logs.txt",
              extension: ".txt",
              content: "performance logs",
            },
          },
          {
            _id: "ticket_2",
            Title: "Email delivery failure",
            Description:
              "Emails sent to external clients are bouncing back. Bounce back message: '550: Recipient address rejected'.",
            Priority: "Medium",
            Status: "In Progress",
            "Created Date": "2025-04-19",
            Assignee: [],
            Attachment: {
              fileName: "email_bounce_back.txt",
              extension: ".txt",
              content: "Email delivery failure",
            },
          },
          {
            _id: "ticket_3",
            Title: "Software installation request",
            Description:
              "Request to install Adobe Photoshop on user’s workstation for design work.",
            Priority: "Low",
            Status: "In Progress",
            "Created Date": "2025-04-18",
            Assignee: [],
            Attachment: {
              fileName: "software_request_form.pdf",
              extension: ".pdf",
              content: "Software installation request",
            },
          },
          {
            _id: "ticket_4",
            Title: "Unable to connect to VPN",
            Description:
              "User is experiencing issues when trying to connect to the VPN. Error message: 'VPN connection failed due to incorrect credentials'.",
            Priority: "High",
            Status: "Open",
            "Created Date": "2025-04-20",
            Assignee: [],
            Attachment: {
              fileName: "vpn_error_screenshot.pdf",
              extension: ".pdf",
              content: "vpn error",
            },
          },
        ],
        Employees: [
          {
            _id: "employee_1",
            "First Name": "Joshua",
            "Last Name": "Lee",
            Position: "Application Developer",
            Photo: "https://picsum.photos/600/600",
            Documents: [
              {
                fileName: "development_guidelines.pdf",
                extension: ".pdf",
                content: "any content",
              },
              {
                fileName: "project_documents.txt",
                extension: ".txt",
                content: "any content",
              },
            ],
          },
          {
            _id: "employee_2",
            "First Name": "Emily",
            "Last Name": "Davis",
            Position: "Software Deployment Technician",
            Photo: "https://picsum.photos/600/600",
            Documents: [
              {
                fileName: "software_license_list.txt",
                extension: ".txt",
                content: "any content",
              },
              {
                fileName: "deployment_guide.pdf",
                extension: ".pdf",
                content: "any content",
              },
              {
                fileName: "installation_logs.txt",
                extension: ".txt",
                content: "any content",
              },
            ],
          },
          {
            _id: "employee_3",
            "First Name": "James",
            "Last Name": "Smith",
            Position: "IT Support Specialist",
            Photo: "https://picsum.photos/600/600",
            Documents: [
              {
                fileName: "certificates.pdf",
                extension: ".pdf",
                content: "any content",
              },
              {
                fileName: "employment_contract.pdf",
                extension: ".pdf",
                content: "any content",
              },
            ],
          },
          {
            _id: "employee_4",
            "First Name": "Jessica",
            "Last Name": "Taylor",
            Position: "Cybersecurity Analyst",
            Photo: "https://picsum.photos/600/600",
            Documents: [
              {
                fileName: "security_audit_report.pdf",
                extension: ".pdf",
                content: "any content",
              },
              {
                fileName: "incident_response_plan.pdf",
                extension: ".pdf",
                content: "any content",
              },
            ],
          },
          {
            _id: "employee_5",
            "First Name": "Ashley",
            "Last Name": "Harris",
            Position: "Database Administrator",
            Photo: "https://picsum.photos/600/600",
            Documents: [
              {
                fileName: "database_backup.txt",
                extension: ".txt",
                content: "any content",
              },
              {
                fileName: "permission_settings.pdf",
                extension: ".pdf",
                content: "any content",
              },
            ],
          },
        ],
      }
      mockDataGeneration(generationStructure, dataGeneration)

      // Set up interceptors for AI column processing
      // Tickets: 4 rows × 2 AI columns = 8 calls
      // Employees: 5 rows × 1 AI column = 5 calls
      // Total: 13 interceptors needed
      for (let i = 0; i < 13; i++) {
        mockProcessAIColumn("Mock LLM Response")
      }

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
          name: "Employees",
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

    // This scenario emerged when generated tables contained self-referential
    // relationship. On delete, updates to the table caused conflicts and blocked
    // deletion.
    it("rejects self-referential relationships", async () => {
      const prompt = "Create me a table for managing employees"
      const generationStructure: ai.GenerationStructure = {
        tables: [
          {
            name: "Employees",
            primaryDisplay: "Name",
            schema: [
              {
                name: "Name",
                type: FieldType.STRING,
                constraints: {
                  presence: true,
                },
              },
              {
                name: "Manager",
                type: FieldType.LINK,
                tableId: "Employees",
                relationshipType: RelationshipType.MANY_TO_ONE,
                reverseFieldName: "Reports",
                relationshipId: "EmployeeManager",
              },
            ],
          },
        ],
      }
      mockAIGenerationStructure(generationStructure)

      const aiColumnGeneration: ai.AIColumnSchemas = {
        Employees: [],
      }
      mockAIColumnGeneration(generationStructure, aiColumnGeneration)

      const dataGeneration: Record<string, Record<string, any>[]> = {
        Employees: [],
      }
      mockDataGeneration(generationStructure, dataGeneration)

      await expect(config.api.ai.generateTables({ prompt })).rejects.toThrow(
        "Self-referential relationships are not supported. Table Employees cannot link to itself."
      )
    })
  })

  describe("POST /api/ai/upload-file", () => {
    let licenseKey = "test-key"
    let internalApiKey = "api-key"

    let envCleanup: () => void
    beforeAll(() => {
      envCleanup = setEnv({
        SELF_HOSTED: false,
        ACCOUNT_PORTAL_API_KEY: internalApiKey,
      })
    })

    afterAll(() => {
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

    it("handles file upload successfully", async () => {
      const mockFileId = "file-abc123"
      mockOpenAIFileUpload(mockFileId)

      const testData = Buffer.from("test file content")
      const response = await config.api.ai.uploadFile({
        data: testData.toString("base64"),
        filename: "test.pdf",
        contentType: "application/pdf",
        licenseKey,
      })

      expect(response.file).toBe(mockFileId)
    })

    it("handles OpenAI API errors", async () => {
      mockOpenAIFileUpload("file-invalid", {
        status: 400,
        error: {
          error: {
            message: "Invalid file format",
          },
        },
      })

      const testData = Buffer.from("invalid content")
      await config.api.ai.uploadFile(
        {
          data: testData.toString("base64"),
          filename: "test.txt",
          contentType: "text/plain",
          licenseKey,
        },
        { status: 400 }
      )
    })

    it("requires valid license", async () => {
      nock.cleanAll()
      nock(env.ACCOUNT_PORTAL_URL).get(`/api/license/${licenseKey}`).reply(404)

      const testData = Buffer.from("test content")
      await config.api.ai.uploadFile(
        {
          data: testData.toString("base64"),
          filename: "test.pdf",
          contentType: "application/pdf",
          licenseKey,
        },
        { status: 403 }
      )
    })
  })

  describe("POST /api/ai/chat/completions", () => {
    let licenseKey = "test-key"
    let internalApiKey = "api-key"
    let envCleanup: () => void

    beforeAll(async () => {
      envCleanup = setEnv({
        SELF_HOSTED: false,
        ACCOUNT_PORTAL_API_KEY: internalApiKey,
      })
    })

    afterAll(async () => {
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

    it("proxies the OpenAI response without reshaping", async () => {
      mockAISDKChatGPTResponse("hello from openai")

      const response = await config.api.ai.openaiChatCompletions({
        model: "budibase/v1",
        messages: [{ role: "user", content: "hello" }],
        licenseKey,
      })

      expect(response.object).toBe("chat.completion")
      expect(response.choices[0].message.content).toBe("hello from openai")
      expect(response.usage?.total_tokens).toBeGreaterThan(0)
    })

    it("forwards extra fields (e.g. response_format)", async () => {
      const format = toResponseFormat(z.object({ value: z.string() }))
      mockAISDKChatGPTResponse(`{"value":"ok"}`, {
        format,
      })

      const response = await config.api.ai.openaiChatCompletions({
        model: "budibase/v1",
        messages: [{ role: "user", content: "return json" }],
        stream: false,
        // @ts-expect-error extra fields should be proxied through
        response_format: format,
        temperature: 0.1,
        licenseKey,
      })

      expect(response.choices[0].message.content).toBe(`{"value":"ok"}`)
    })

    it("returns HTTP errors from upstream", async () => {
      mockChatGPTStreamFailure({
        status: 401,
        errorMessage: "Unauthorized",
      })

      await config.api.ai.openaiChatCompletions(
        {
          model: "budibase/v1",
          messages: [{ role: "user", content: "hello" }],
          stream: true,
          licenseKey,
        },
        {
          status: 401,
          headers: {
            "Content-Type": /^application\/json/,
          },
        }
      )
    })

    it("increments Budibase AI credits from usage", async () => {
      let usage = await getQuotaUsage()
      expect(usage.monthly.current.budibaseAICredits).toBe(0)

      mockAISDKChatGPTResponse("charged now here")

      await config.api.ai.openaiChatCompletions({
        model: "budibase/v1",
        messages: [{ role: "user", content: "hello there" }],
        licenseKey,
      })

      usage = await getQuotaUsage()
      expect(usage.monthly.current.budibaseAICredits).toBe(11)
    })

    it("rejects requests missing required fields", async () => {
      await config.api.ai.openaiChatCompletions(
        {
          // @ts-expect-error intentionally missing fields
          model: undefined,
          // @ts-expect-error intentionally missing fields
          messages: undefined,
          licenseKey,
        },
        { status: 400 }
      )
    })

    it("rejects unsupported models", async () => {
      await config.api.ai.openaiChatCompletions(
        {
          model: "gpt-5-mini",
          messages: [{ role: "user", content: "hello" }],
          stream: false,
          licenseKey,
        },
        { status: 400 }
      )
    })

    it("errors when LiteLLM API key is missing", async () => {
      await serverWithEnv({ BBAI_LITELLM_KEY: "" }, async () => {
        await config.api.ai.openaiChatCompletions(
          {
            model: "budibase/v1",
            messages: [{ role: "user", content: "hello" }],
            stream: false,
            licenseKey,
          },
          { status: 500 }
        )
      })
    })
  })
})
