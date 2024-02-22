import {
  Automation,
  TableSchema,
  Screen
} from "@budibase/types"


enum SQLDialect {
  POSTGRES,
  MYSQL
}

enum ScreenTemplateType {
  FORM,
  PORTAL,
  APPROVAL
}

export interface IOpenSourceModel {
  verifyConfigured(): Promise<boolean>
}

export interface ILargeLanguageModel {
  prompt(prompt: string): Promise<string | undefined>
  summarizeText(prompt: string): Promise<string | undefined>
  // TODO: Provide dialect support if required
  textToSQL(prompt: string, tableSchema: string, dialect?: SQLDialect): Promise<string | undefined>
  generateBudibaseTableSchema?(prompt: string): Promise<TableSchema>
  generateBudibaseScreen?(prompt: string, type: ScreenTemplateType): Promise<Screen>
  generateBudibaseAutomation?(prompt: string): Promise<Automation>
}

type ClassificationLabel = {
  [key: string]: string;
}

export interface IDiscriminativeModel {
  classifyText?(text: string): Promise<ClassificationLabel[]>
}

// things AI can do for BB
// generate a table schema based on some input
// generate a screen based on some input
// recommend a query given a prompt

// The idea is that you can open the AI helper anywhere inside budibase. With a keyboard shortcut,
// or if you highlight some text and use a keyboard shortcut.
// Deeper integration will come later on, and as the APIs will already exist, but for now this is
// probably the easiest and cleanest way to integrate AI directly into budibase

// In different parts of the UI - clicking a certain button will open the AI helper with
// Some preconfigured stuff. It will then do its magic, and fill out the fields with the AI
// prompt. There's probably a nice abstraction we can do around this

// Ideally I want to create UI components that are able to consume the AI APIs
// so they all have the same shape, and you can define which model you want in settings,
// the frontend or with environment variables

// inspo: https://github.com/dzhng/llm-api?tab=readme-ov-file#-anthropic
export { ChatGPT } from "./chatgpt"
// export { PrivateGPT } from "./privategpt"
