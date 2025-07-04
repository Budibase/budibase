import { Message } from "../api"
import { AgentChat, AIProvider } from "../documents"

export enum AIOperationEnum {
  SUMMARISE_TEXT = "SUMMARISE_TEXT",
  CLEAN_DATA = "CLEAN_DATA",
  TRANSLATE = "TRANSLATE",
  CATEGORISE_TEXT = "CATEGORISE_TEXT",
  SENTIMENT_ANALYSIS = "SENTIMENT_ANALYSIS",
  PROMPT = "PROMPT",
  SEARCH_WEB = "SEARCH_WEB",
}

export enum OperationFieldTypeEnum {
  MULTI_COLUMN = "columns",
  COLUMN = "column",
  BINDABLE_TEXT = "prompt",
}

export type OperationFieldsType = {
  [AIOperationEnum.SUMMARISE_TEXT]: {
    columns: OperationFieldTypeEnum.MULTI_COLUMN
  }
  [AIOperationEnum.CLEAN_DATA]: {
    column: OperationFieldTypeEnum.COLUMN
  }
  [AIOperationEnum.TRANSLATE]: {
    column: OperationFieldTypeEnum.COLUMN
    language: OperationFieldTypeEnum.BINDABLE_TEXT
  }
  [AIOperationEnum.CATEGORISE_TEXT]: {
    columns: OperationFieldTypeEnum.MULTI_COLUMN
    categories: OperationFieldTypeEnum.BINDABLE_TEXT
  }
  [AIOperationEnum.SENTIMENT_ANALYSIS]: {
    column: OperationFieldTypeEnum.COLUMN
  }
  [AIOperationEnum.PROMPT]: {
    prompt: OperationFieldTypeEnum.BINDABLE_TEXT
  }
  [AIOperationEnum.SEARCH_WEB]: {
    columns: OperationFieldTypeEnum.MULTI_COLUMN
  }
}

type BaseSchema = {
  operation: AIOperationEnum
}

type SummariseTextSchema = BaseSchema & {
  operation: AIOperationEnum.SUMMARISE_TEXT
  columns: string[]
}

type CleanDataSchema = BaseSchema & {
  operation: AIOperationEnum.CLEAN_DATA
  column: string
}

type TranslateSchema = BaseSchema & {
  operation: AIOperationEnum.TRANSLATE
  column: string
  language: string
}

type CategoriseTextSchema = BaseSchema & {
  operation: AIOperationEnum.CATEGORISE_TEXT
  columns: string[]
  categories: string[]
}

type SentimentAnalysisSchema = BaseSchema & {
  operation: AIOperationEnum.SENTIMENT_ANALYSIS
  column: string
}

type PromptSchema = BaseSchema & {
  operation: AIOperationEnum.PROMPT
  prompt: string
}

type SearchWebSchema = BaseSchema & {
  operation: AIOperationEnum.SEARCH_WEB
  columns: string[]
}

export type AIColumnSchema =
  | SummariseTextSchema
  | CleanDataSchema
  | TranslateSchema
  | CategoriseTextSchema
  | SentimentAnalysisSchema
  | PromptSchema
  | SearchWebSchema

export interface LLMConfigOptions {
  model: string
  apiKey?: string
  maxTokens?: number
  // Primarily here for Azure OpenAI, because each customer has their own endpoint
  baseUrl?: string
}

export interface LLMProviderConfig extends LLMConfigOptions {
  provider: AIProvider
}

export interface LLMStreamChunk {
  type:
    | "content"
    | "tool_call_start"
    | "tool_call_result"
    | "done"
    | "error"
    | "chat_saved"
  content?: string
  toolCall?: {
    id: string
    name: string
    arguments: string
  }
  toolResult?: {
    id: string
    result: string
    error?: string
  }
  messages?: Message[]
  chat?: AgentChat
  tokensUsed?: number
}
