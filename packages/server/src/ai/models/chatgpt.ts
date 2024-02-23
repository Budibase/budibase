import { Configuration, CreateChatCompletionRequest, OpenAIApi } from "openai"
import environment from "../../environment"
import { IDiscriminativeModel, ILargeLanguageModel } from "./index";
import { TableSchema, Screen, Automation } from "@budibase/types";
import * as Prompts from "../prompts"

enum Model {
  GPT_35_TURBO = "gpt-3.5-turbo",
  // will only work with api keys that have access to the GPT4 API
  GPT_4 = "gpt-4",
}

export class ChatGPT implements ILargeLanguageModel {
  private client: OpenAIApi

  constructor() {
    const configuration = new Configuration({
      apiKey: environment.OPENAI_API_KEY,
    })
    this.client = new OpenAIApi(configuration)
  }

  async chatCompletion(prompt: string, promptOptions: Partial<CreateChatCompletionRequest> = {}) {
    try {
      const completion = await this.client.createChatCompletion({
        model: Model.GPT_4,
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
      return <TableSchema>JSON.parse(completion!)
    } catch (err) {
      console.error("Error generating budibase schema", err)
      return <TableSchema>{}
    }
  }

  //
  // async generateBudibaseScreen(prompt: string): Promise<Screen> {
  //   return {
  //     routing: {
  //       route: "/",
  //       roleId: "ADMIN"
  //     },
  //     props: {
  //       _instanceName: "test",
  //       _styles: {
  //         padding: "10px"
  //       },
  //       _component: "nee",
  //       _children: []
  //     }
  //   }
  // }
  //
  //
  //
  // generateBudibaseAutomation(prompt: string): Promise<Automation> {
  //   return Promise.resolve({})
  // }
}


