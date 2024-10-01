export enum AIOperationEnum {
  SUMMARISE_TEXT = "SUMMARISE_TEXT",
  CLEAN_DATA = "CLEAN_DATA",
  TRANSLATE = "TRANSLATE",
  CATEGORISE_TEXT = "CATEGORISE_TEXT",
  SENTIMENT_ANALYSIS = "SENTIMENT_ANALYSIS",
  PROMPT = "PROMPT",
  SEARCH_WEB = "SEARCH_WEB",
}

enum OperationFieldTypeEnum {
  MULTI_COLUMN = "columns",
  COLUMN = "column",
  BINDABLE_TEXT = "prompt",
}

type OperationFieldsType = {
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

// Define the AI operations with just their labels (no need for separate 'value' property)
const AIOperations: { [key in AIOperationEnum]: string } = {
  [AIOperationEnum.SUMMARISE_TEXT]: "Summarise Text",
  [AIOperationEnum.CLEAN_DATA]: "Clean Data",
  [AIOperationEnum.TRANSLATE]: "Translate",
  [AIOperationEnum.CATEGORISE_TEXT]: "Categorise Text",
  [AIOperationEnum.SENTIMENT_ANALYSIS]: "Sentiment Analysis",
  [AIOperationEnum.PROMPT]: "Prompt",
  [AIOperationEnum.SEARCH_WEB]: "Search Web",
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
  categories: string
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
