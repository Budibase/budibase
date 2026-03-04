import { HTTPError } from "@budibase/backend-core"
import { utils } from "@budibase/shared-core"
import type { LLMProviderOptions, LLMResponse, Message } from "@budibase/types"
import { generateText, Output, type ModelMessage } from "ai"
import { LLMRequest } from "../llm"

import tracer from "dd-trace"
import { z } from "zod"
import { generateAIColumns, generateData, generateTables } from "../prompts"
import {
  aiColumnSchemas,
  aiTableResponseToTableSchema,
  appendAIColumns,
  generationStructure,
  tableDataStructuredOutput,
} from "../structuredOutputs"
import { TableSchemaFromAI } from "../types"
import { runWithReasoningEffortFallback } from "../reasoningFallback"

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

type ProgressCallback = (message: string) => void

export class TableGeneration {
  private aiModel: LLMResponse

  private delegates: Delegates

  private constructor(aiModel: LLMResponse, delegates: Delegates) {
    this.aiModel = aiModel
    this.delegates = delegates
  }

  static async init(aiModel: LLMResponse, delegates: Delegates) {
    if (!aiModel) {
      throw new HTTPError("LLM not available", 422)
    }
    return new TableGeneration(aiModel, delegates)
  }

  async generate(
    userPrompt: string,
    userId: string,
    onProgress?: ProgressCallback
  ) {
    return tracer.trace("tableGeneration.generate", async span => {
      const tables = await this.generateTables(userPrompt, userId, onProgress)
      span.addTags({ table_count: tables.length })
      return tables
    })
  }

  private llmFunctions = {
    getTableStructure: async (
      userPrompt: string
    ): Promise<TableSchemaFromAI[]> => {
      return tracer.trace("llm.getTableStructure", async () => {
        const parsedResponse = await this.promptForStructuredOutput(
          generateTables().addUserMessage(userPrompt),
          generationStructure,
          "Error generating tables"
        )
        return aiTableResponseToTableSchema(parsedResponse)
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
        return this.promptForStructuredOutput(
          generateData().addUserMessage(userPrompt),
          tableDataStructuredOutput(forTables),
          "Error generating data"
        )
      })
    },
  }

  private async generateTables(
    userPrompt: string,
    userId: string,
    onProgress?: ProgressCallback
  ): Promise<{ id: string; name: string }[]> {
    onProgress?.("Generating table schema...")
    const tablesToCreate = await this.llmFunctions.getTableStructure(userPrompt)

    onProgress?.("Generating AI columns and sample data...")
    const [aiColumnStructure, data] = await Promise.all([
      this.llmFunctions.generateAIColumns(userPrompt, tablesToCreate),
      this.llmFunctions.generateData(userPrompt, tablesToCreate),
    ])

    onProgress?.("Creating tables...")
    // We need to wait for the tables to be created before persisting the data
    const result = await this.delegates.generateTablesDelegate(
      appendAIColumns(tablesToCreate, aiColumnStructure)
    )

    onProgress?.("Populating rows...")
    await this.delegates.generateDataDelegate(
      data,
      userId,
      utils.toMap("name", tablesToCreate)
    )

    onProgress?.("Finalizing...")
    return result
  }

  private async generateAIColumns(
    userPrompt: string,
    tables: TableSchemaFromAI[]
  ) {
    return this.promptForStructuredOutput(
      generateAIColumns().addUserMessage(
        `This is the initial user prompt that generated the given schema:
            "${userPrompt}"`
      ),
      aiColumnSchemas(tables),
      "Error generating columns"
    )
  }

  private async promptForStructuredOutput<T>(
    request: LLMRequest,
    schema: z.ZodType<T>,
    errorMessage: string
  ): Promise<T> {
    const providerOptions = this.aiModel.providerOptions?.(false)

    const run = async (opts?: LLMProviderOptions) => {
      return generateText({
        model: this.aiModel.chat,
        messages: this.toModelMessages(request.messages),
        output: Output.object({ schema }),
        providerOptions: opts,
      })
    }

    try {
      const result = await runWithReasoningEffortFallback({
        providerOptions,
        run,
      })
      return result.output
    } catch (err: unknown) {
      const message = [errorMessage, this.getErrorMessage(err)]
        .filter(Boolean)
        .join(": ")
      throw new HTTPError(message, 500)
    }
  }

  private getErrorMessage(err: unknown): string {
    if (!err || typeof err !== "object") {
      return String(err)
    }
    const error = err as Record<string, unknown>
    return typeof error.message === "string" ? error.message : String(err)
  }

  private toModelMessages(messages: Message[]): ModelMessage[] {
    return messages.map(message => {
      if (typeof message.content !== "string") {
        throw new HTTPError("AI message content must be a string", 422)
      }
      return {
        role: message.role,
        content: message.content,
      } as ModelMessage
    })
  }
}
