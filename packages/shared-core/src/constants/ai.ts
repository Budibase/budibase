import {
  AIOperationEnum,
  OperationFieldsType,
  OperationFieldTypeEnum,
} from "@budibase/types"

export const AIOperations = {
  SUMMARISE_TEXT: {
    label: "Summarise Text",
    value: "SUMMARISE_TEXT",
  },
  CLEAN_DATA: {
    label: "Clean Data",
    value: "CLEAN_DATA",
  },
  TRANSLATE: {
    label: "Translate",
    value: "TRANSLATE",
  },
  CATEGORISE_TEXT: {
    label: "Categorise Text",
    value: "CATEGORISE_TEXT",
  },
  SENTIMENT_ANALYSIS: {
    label: "Sentiment Analysis",
    value: "SENTIMENT_ANALYSIS",
  },
  PROMPT: {
    label: "Prompt",
    value: "PROMPT",
  },
  SEARCH_WEB: {
    label: "Search Web",
    value: "SEARCH_WEB",
  },
}

export const OperationFieldTypes = {
  MULTI_COLUMN: "columns",
  COLUMN: "column",
  BINDABLE_TEXT: "prompt",
}

export const OperationFields: OperationFieldsType = {
  [AIOperationEnum.SUMMARISE_TEXT]: {
    columns: OperationFieldTypeEnum.MULTI_COLUMN,
  },
  [AIOperationEnum.CLEAN_DATA]: {
    column: OperationFieldTypeEnum.COLUMN,
  },
  [AIOperationEnum.TRANSLATE]: {
    column: OperationFieldTypeEnum.COLUMN,
    language: OperationFieldTypeEnum.BINDABLE_TEXT,
  },
  [AIOperationEnum.CATEGORISE_TEXT]: {
    columns: OperationFieldTypeEnum.MULTI_COLUMN,
    categories: OperationFieldTypeEnum.BINDABLE_TEXT,
  },
  [AIOperationEnum.SENTIMENT_ANALYSIS]: {
    column: OperationFieldTypeEnum.COLUMN,
  },
  [AIOperationEnum.PROMPT]: {
    prompt: OperationFieldTypeEnum.BINDABLE_TEXT,
  },
  [AIOperationEnum.SEARCH_WEB]: {
    columns: OperationFieldTypeEnum.MULTI_COLUMN,
  },
}
