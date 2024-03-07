import { Configuration, CreateChatCompletionRequest, OpenAIApi } from "openai"
import environment from "../../environment"
import { IDiscriminativeModel, ILargeLanguageModel } from "./index";
import { TableSchema, Screen, Automation } from "@budibase/types";
import * as Prompts from "../prompts"

enum Model {
  LLAMA_7B = "meta-llama/Llama-2-7b-chat-hf",
  GEMMA_2B = "google/gemma-2b-it",
  GEMMA_7B = "google/gemma-7b-it",
}

export class TogetherAI implements ILargeLanguageModel {
  private client: OpenAIApi

  constructor() {
    const configuration = new Configuration({
      apiKey: environment.TOGETHER_AI_API_KEY,
      basePath: "https://api.together.xyz/v1"
    })
    this.client = new OpenAIApi(configuration)
  }

  async chatCompletion(prompt: string, promptOptions: Partial<CreateChatCompletionRequest> = {}) {
    try {
      const completion = await this.client.createChatCompletion({
        model: Model.GEMMA_7B,
        messages: [{ role: "user", content: prompt }],
        ...promptOptions
      })
      return completion?.data?.choices[0]?.message?.content
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
    const completion = await this.chatCompletion(
      Prompts.generateCode(prompt),
      {
        temperature: 0.7,
        max_tokens: 150,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      }
    )
    return completion
  }

  async generateSQL(prompt: string, tableSchema: string, dialect: any): Promise<string | undefined> {
    const completion = await this.chatCompletion(
      Prompts.generateSQL(prompt, tableSchema),
      {
        temperature: 0.7,
        max_tokens: 150,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      }
    )
    return completion
  }

  async generateBudibaseTableSchema(prompt: string): Promise<TableSchema> {
    try {
      const completion = await this.chatCompletion(
        Prompts.generateBudibaseTable(prompt),
        {
          temperature: 0.7,
          top_p: 1.0,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
        }
      )
      console.log(completion)
      return <TableSchema>JSON.parse(completion!)
    } catch (err) {
      console.error("Error generating budibase schema", err)
      return <TableSchema>{}
    }
  }


  async generateBudibaseScreen(prompt: string): Promise<Screen> {
    try {
      const completion = await this.chatCompletion(
        Prompts.generateForm(prompt),
        {
          temperature: 0.7,
          top_p: 1.0,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
        }
      )
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

