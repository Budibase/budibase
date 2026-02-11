import { utils } from "@budibase/shared-core"
import {
  generateAIColumnsPrompt,
  generateDataPrompt,
  generateTablesPrompt,
} from "../prompts"
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
          generateTablesPrompt(),
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
          generateDataPrompt(),
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
      generateAIColumnsPrompt(),
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
