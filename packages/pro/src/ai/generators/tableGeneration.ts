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
        const systemMessage = generateTablesPrompt()

        const messages: ModelMessage[] = [
          { role: "system", content: systemMessage },
          { role: "user", content: userPrompt },
        ]

        const parsedResponse = await generateText({
          model: this.llm.chat,
          messages,
          output: Output.object({ schema: generationStructure }),
        })
        return aiTableResponseToTableSchema(parsedResponse.output)
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
        const systemMessage = generateDataPrompt()

        const messages: ModelMessage[] = [
          { role: "system", content: systemMessage },
          { role: "user", content: userPrompt },
        ]

        const response = await generateText({
          model: this.llm.chat,
          messages,
          output: Output.object({
            schema: tableDataStructuredOutput(forTables),
          }),
        })
        return response.output
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
    const systemMessage = generateAIColumnsPrompt()

    const messages: ModelMessage[] = [
      { role: "system", content: systemMessage },
      {
        role: "user",
        content: `This is the initial user prompt that generated the given schema:
            "${userPrompt}"`,
      },
    ]

    const response = await generateText({
      model: this.llm.chat,
      messages,
      output: Output.object({ schema: aiColumnSchemas(tables) }),
    })

    return response.output
  }
}
