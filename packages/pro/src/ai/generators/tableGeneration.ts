import { HTTPError } from "@budibase/backend-core"
import { utils } from "@budibase/shared-core"
import { getLLM } from "../llm"
import { LLM } from "../models/base"

import { generateAIColumns, generateData, generateTables } from "../prompts"
import {
  aiColumnSchemas,
  AIColumnSchemas,
  aiTableResponseToTableSchema,
  appendAIColumns,
  GenerationStructure,
  generationStructure,
  tableDataStructuredOutput,
} from "../structuredOutputs"
import { TableSchemaFromAI } from "../types"
import tracer from "dd-trace"

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
  private llm: LLM

  private delegates: Delegates

  private constructor(llm: LLM, delegates: Delegates) {
    this.llm = llm
    this.delegates = delegates
  }

  static async init(delegates: Delegates) {
    const llm = await getLLM({ model: "gpt-5-mini", maxTokens: 5000 })
    if (!llm) {
      throw new HTTPError("LLM not available", 422)
    }
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
        const response = await this.llm.prompt(
          generateTables()
            .addUserMessage(userPrompt)
            .withFormat(generationStructure)
        )
        try {
          const parsedResponse = JSON.parse(
            response.message!
          ) as GenerationStructure
          return aiTableResponseToTableSchema(parsedResponse)
        } catch (e) {
          throw new HTTPError("Error generating tables", 500)
        }
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
        const llmResponse = await this.llm.prompt(
          generateData()
            .addUserMessage(userPrompt)
            .withFormat(tableDataStructuredOutput(forTables))
        )
        try {
          const json = JSON.parse(llmResponse.message!) as Record<
            string,
            Record<string, any>[]
          >
          return json
        } catch (e) {
          throw new HTTPError("Error generating data", 500)
        }
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
    const response = await this.llm.prompt(
      generateAIColumns()
        .addUserMessage(
          `This is the initial user prompt that generated the given schema:
            "${userPrompt}"`
        )
        .withFormat(aiColumnSchemas(tables))
    )

    try {
      const aiColumns = JSON.parse(response.message!) as AIColumnSchemas
      return aiColumns
    } catch (e) {
      throw new HTTPError("Error generating columns", 500)
    }
  }
}
