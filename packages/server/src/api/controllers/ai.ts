import { db as dbCore, tenancy, context } from "@budibase/backend-core"
import * as ai from "../../ai/models"
import sdk from "../../sdk"
import { Ctx } from "@budibase/types"
import { ILargeLanguageModel } from "../../ai/models"

export async function prompt(ctx: Ctx) {
  // const db = tenancy.getGlobalDB()
  try {
    const { model, prompt } = ctx.request.body
    // TODO: possibly split out at a higher level on the controller
    const LLM = ai[model as keyof typeof ai]
    const client: ILargeLanguageModel = new LLM()
    const response = await client.prompt(prompt)
    ctx.body = { response }
  } catch (err) {
    console.error("Something went wrong", err)
  }
}

export async function summariseText(ctx: Ctx) {
  const db = tenancy.getGlobalDB()
  try {
    const { model, prompt } = ctx.request.body
    const LLM = ai[model as keyof typeof ai]
    const client: ILargeLanguageModel = new LLM()
    const response = await client.summarizeText(prompt)
    ctx.body = { response }
  } catch (err) {
    // TODO: Better error messages
    console.error("Something went wrong", err)
  }
}

export async function generateSQL(ctx: Ctx) {
  // TODO: Provide support for multiple tables?
  const { model, prompt, datasourceId, tableName } = ctx.request.body

  const datasource = await sdk.datasources.get(datasourceId)
  if (!datasource.entities) {
    return ctx.throw(400, "datasource has no tables associated")
  }

  const schema = datasource.entities[tableName].schema
  // Map the entities to something the model can use as context
  const tableSchemaPrompt = [`Table: ${tableName}`]
  for (let column in schema) {
    tableSchemaPrompt.push(`${schema[column].name}: ${schema[column].externalType}`)
  }

  try {
    const LLM = ai[model as keyof typeof ai]
    const client: ILargeLanguageModel = new LLM()
    const response = await client.textToSQL(prompt, tableSchemaPrompt.join("\n"))
    ctx.body = { response }
  } catch (err) {
    console.error("Something went wrong", err)
  }
}

export async function generateBudibaseTableSchema(ctx: Ctx) {
  try {
    const { model, prompt } = ctx.request.body
    // TODO: possibly split out at a higher level on the controller
    const LLM = ai[model as keyof typeof ai]
    const client: ILargeLanguageModel = new LLM()
    // @ts-ignore
    const response = await client.generateBudibaseTableSchema(prompt)
    ctx.body = response
  } catch (err) {
    console.error("Something went wrong", err)
  }
}

