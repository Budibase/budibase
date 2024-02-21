import { db as dbCore, tenancy } from "@budibase/backend-core"
import * as ai from "../../ai"
import { Ctx } from "@budibase/types"
import { ILargeLanguageModel } from "../../ai"

export async function prompt(ctx: Ctx) {
  // const db = tenancy.getGlobalDB()
  try {
    const { model, prompt } = ctx.request.body
    // TODO: possibly split out at a higher level on the controller
    const LLM = ai[model as keyof typeof ai]
    const client: ILargeLanguageModel = new LLM()
    const response =await client.prompt(prompt)
    ctx.body = { response }
  } catch (err) {
    console.error("Something went wrong", err)
  }
}

export async function summariseText(ctx: Ctx) {
  // const db = tenancy.getGlobalDB()
  try {
    const { model, prompt } = ctx.request.body
    const LLM = ai[model as keyof typeof ai]
    const client: ILargeLanguageModel = new LLM()
    const response = await client.summarizeText(prompt)
    ctx.body = { response }
  } catch (err) {
    console.error("Something went wrong", err)
  }
}
