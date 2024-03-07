import { CompletionOptions, createCompletion, InferenceModel, loadModel } from "gpt4all"
import environment from "../../environment"
import { ILargeLanguageModel } from "./index";
import { TableSchema, Screen, Automation } from "@budibase/types";
import * as Prompts from "../prompts"

enum Model {
  MISTRAL_OPENORCA_7B = "mistral-7b-openorca.Q4_0.gguf",
}

export class GPT4All implements ILargeLanguageModel {
  private client: InferenceModel | undefined

  constructor() {
  }

  async chatCompletion(prompt: string) {
    this.client = await loadModel("mistral-7b-openorca.Q4_0.gguf", {
      verbose: true,
      modelPath: environment.GPT4ALL_MODEL_PATH
    })
    try {
      const completion = await createCompletion(this.client,
        [{ role: "user", content: prompt }]
      )
      return completion?.choices[0]?.message?.content
    } catch (err) {
      console.error(err)
    }
  }

  async prompt(prompt: string): Promise<string | undefined> {
    // TODO: validate prompt in some way
    return this.chatCompletion(prompt)
  }

  async summarizeText(prompt: string): Promise<string | undefined> {
    const summarizePrompt = `Summarize this text:\n${prompt}`
    return this.chatCompletion(summarizePrompt)
  }

  async generateCode(prompt: string): Promise<string | undefined> {
    const completion = await this.chatCompletion(Prompts.generateCode(prompt))
    return completion
  }

  async generateSQL(prompt: string, tableSchema: string, dialect: any): Promise<string | undefined> {
    const completion = await this.chatCompletion(Prompts.generateSQL(prompt, tableSchema))
    return completion
  }

  async generateBudibaseTableSchema(prompt: string): Promise<TableSchema> {
    try {
      const completion = await this.chatCompletion(Prompts.generateBudibaseTable(prompt))
      console.log(completion)
      return <TableSchema>JSON.parse(completion!)
    } catch (err) {
      console.error("Error generating budibase schema", err)
      return <TableSchema>{}
    }
  }


  async generateBudibaseScreen(prompt: string): Promise<Screen> {
    try {
      const completion = await this.chatCompletion(Prompts.generateForm(prompt))
      return <Screen>JSON.parse(completion!)
    } catch (err) {
      console.error("Error generating budibase screen", err)
      return <Screen>{}
    }
  }
  //
  //
  //
  // generateBudibaseAutomation(prompt: string): Promise<Automation> {
  //   return Promise.resolve({})
  // }
}


