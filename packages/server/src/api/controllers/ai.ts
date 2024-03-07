import * as ai from "../../ai/models"
import sdk from "../../sdk"
import { Ctx } from "@budibase/types"
import { ILargeLanguageModel } from "../../ai/models"

function initLLM(model: string): ILargeLanguageModel {
  if (model === "GPT4All") {
    return new ai.GPT4All()
  } else if (model === "LlamaCPP") {
    return new ai.LlamaCPP()
  } else {
    return new ai.OpenAI(model, { togetherai: !model.includes("gpt-") })
  }
}

export async function prompt(ctx: Ctx) {
  try {
    const { model, prompt } = ctx.request.body
    const client = initLLM(model)
    const response = await client.prompt(prompt)
    ctx.body = { response }
  } catch (err) {
    console.error("Something went wrong", err)
  }
}

export async function summariseText(ctx: Ctx) {
  try {
    const { model, prompt } = ctx.request.body
    const client = initLLM(model)
    const response = await client.summarizeText(prompt)
    ctx.body = { response }
  } catch (err) {
    // TODO: Better error messages
    console.error("Something went wrong", err)
  }
}

export async function generateJS(ctx: Ctx) {
  // TODO: Provide support for multiple tables?
  const { model, prompt } = ctx.request.body

  try {
    const client = initLLM(model)
    const response = await client.generateCode(prompt)
    ctx.body = { response }
  } catch (err) {
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
    const client = initLLM(model)
    const response = await client.generateSQL(prompt, tableSchemaPrompt.join("\n"))
    ctx.body = { response }
  } catch (err) {
    console.error("Something went wrong", err)
  }
}

export async function generateBudibaseTableSchema(ctx: Ctx) {
  try {
    const { model, prompt } = ctx.request.body
    const client = initLLM(model)
    // @ts-ignore
    const response = await client.generateBudibaseTableSchema(prompt)
    ctx.body = response
  } catch (err) {
    console.error("Something went wrong", err)
  }
}

export async function generateBudibaseScreen(ctx: Ctx) {
  try {
    const { model, prompt } = ctx.request.body
    const client = initLLM(model)
    // @ts-ignore
    const response = await client.generateBudibaseScreen(prompt)
    ctx.body = response
  } catch (err) {
    console.error("Something went wrong", err)
  }
}
