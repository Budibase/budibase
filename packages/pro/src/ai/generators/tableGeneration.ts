import { utils } from "@budibase/shared-core"
import {
  aiColumnSchemas,
  aiTableResponseToTableSchema,
  appendAIColumns,
  generationStructure,
  tableDataStructuredOutput,
} from "../structuredOutputs"
import { TableSchemaFromAI } from "../types"
import tracer from "dd-trace"
import { generateText, ModelMessage, Output } from "ai"
import { LLMResponse } from "@budibase/types"
import z, { ZodObject } from "zod"

interface Delegates {
  generateTablesDelegate: (
    tables: TableSchemaFromAI[]
  ) => Promise<{ id: string; name: string }[]>
  generateDataDelegate: (
    data: Record<string, Record<string, any>[]>,
    userId: string,
    tables: Record<string, TableSchemaFromAI>
  ) => Promise<void>
}

const prompts = {
  generateTable: `
You are generating Budibase table schemas from user prompts.
Always return at least 2 tables, and define only one side of relationships using a link field.
Exclude id, created_at, and updated_at (Budibase adds them).
Include a variety of column types: text, dropdown, date, number.
Add at least one formula column, one attachment, and one multi-attachment column across the tables.
Budibase handles reverse relationships and many-to-many links — never define join tables or reverse fields.
You may specify foreignColumnName, but do not create that field manually.
`,
  generateAIColumns: `Given the generated schema, add only one field of type "AI" to relevant tables to add value to the Budibase user.`,
  generateData: `
For each table, populate the data field with realistic-looking sample records.
Avoid placeholder values like "foo" or "bar". Use real names, emails, etc., and ensure values are unique across rows.
`,
}

export class TableGeneration {
  private llm: LLMResponse

  private delegates: Delegates

  private constructor(llm: LLMResponse, delegates: Delegates) {
    this.llm = llm
    this.delegates = delegates
  }

  static async init(llm: LLMResponse, delegates: Delegates) {
    return new TableGeneration(llm, delegates)
  }

  async generate(userPrompt: string, userId: string) {
    return tracer.trace("tableGeneration.generate", async span => {
      const tables = await this.generateTables(userPrompt, userId)
      span.addTags({ table_count: tables.length })
      return tables
    })
  }

  private llmFunctions = {
    getTableStructure: async (
      userPrompt: string
    ): Promise<TableSchemaFromAI[]> => {
      return tracer.trace("llm.getTableStructure", async () => {
        const response = await this.generateStructuredOutput(
          prompts.generateTable,
          userPrompt,
          generationStructure
        )
        return aiTableResponseToTableSchema(response)
      })
    },
    generateAIColumns: (
      userPrompt: string,
      fromTables: TableSchemaFromAI[]
    ) => {
      return tracer.trace("llm.generateAIColumns", async () => {
        return this.generateAIColumns(userPrompt, fromTables)
      })
    },
    generateData: async (
      userPrompt: string,
      forTables: TableSchemaFromAI[]
    ) => {
      return tracer.trace("llm.generateData", async () => {
        return this.generateStructuredOutput(
          prompts.generateData,
          userPrompt,
          tableDataStructuredOutput(forTables)
        )
      })
    },
  }

  private async generateTables(
    userPrompt: string,
    userId: string
  ): Promise<{ id: string; name: string }[]> {
    const tablesToCreate = await this.llmFunctions.getTableStructure(userPrompt)

    const aiColumnStructure = await this.llmFunctions.generateAIColumns(
      userPrompt,
      tablesToCreate
    )

    const data = await this.llmFunctions.generateData(
      userPrompt,
      tablesToCreate
    )

    // We need to wait for the tables to be created before persisting the data
    const result = await this.delegates.generateTablesDelegate(
      appendAIColumns(tablesToCreate, aiColumnStructure)
    )

    await this.delegates.generateDataDelegate(
      data,
      userId,
      utils.toMap("name", tablesToCreate)
    )

    return result
  }

  private async generateAIColumns(
    userPrompt: string,
    tables: TableSchemaFromAI[]
  ) {
    return this.generateStructuredOutput(
      prompts.generateAIColumns,
      `This is the initial user prompt that generated the given schema:
            "${userPrompt}"`,
      aiColumnSchemas(tables)
    )
  }

  private buildMessages(
    systemMessage: string,
    userContent: string
  ): ModelMessage[] {
    return [
      { role: "system", content: systemMessage },
      { role: "user", content: userContent },
    ]
  }

  private async generateStructuredOutput<T extends ZodObject>(
    systemMessage: string,
    userContent: string,
    schema: T
  ): Promise<z.infer<T>> {
    const messages = this.buildMessages(systemMessage, userContent)
    const response = await generateText({
      model: this.llm.chat,
      messages,
      output: Output.object({ schema }),
      providerOptions: this.llm.providerOptions?.(false),
    })

    return response.output as z.infer<T>
  }
}
