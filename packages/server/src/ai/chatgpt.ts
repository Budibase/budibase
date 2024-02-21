import { Configuration, OpenAIApi } from "openai"
import environment from "../environment"
import { IDiscriminativeModel, ILargeLanguageModel } from "./";
import { TableSchema, Screen, Automation } from "@budibase/types";

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

  async chatCompletion(prompt: string) {
    try {
      const completion = await this.client.createChatCompletion({
        model: Model.GPT_4,
        messages: [{ role: "user", content: prompt }],
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

  // async textToSQL(prompt: string, dialect: SQLDialect): Promise<string> {
  //   const tableSchema = `whatever`
  //   const completion = await this.client.createCompletion({
  //     model: Model.GPT_4,
  //     prompt: `Given the table schema:\n${tableSchema}\n\nGenerate a SQL query for the following request:\n${prompt}`,
  //     temperature: 0.7,
  //     max_tokens: 150,
  //     top_p: 1.0,
  //     frequency_penalty: 0.0,
  //     presence_penalty: 0.0,
  //   })
  //   return completion?.data?.choices[0]?.text?.trim()
  // }

  async generateBudibaseTableSchema(prompt: string): Promise<TableSchema> {
    // {
    //   "_id": "ta_40ccfc10f02f46d9be53551bd121d4c2",
    //   "_rev": "3-67a7a8f1fbd96cad02c7b434ed913dc5",
    //   "name": "test",
    //   "schema": {
    //   "name": {
    //     "type": "string",
    //       "constraints": {
    //       "type": "string",
    //         "length": {
    //         "maximum": null
    //       },
    //       "presence": false
    //     },
    //     "name": "name"
    //   },
    //   "age": {
    //     "type": "number",
    //       "name": "age",
    //       "constraints": {
    //       "type": "number",
    //         "presence": false,
    //         "numericality": {
    //         "greaterThanOrEqualTo": "",
    //           "lessThanOrEqualTo": ""
    //       }
    //     }
    //   }
    // },
    //   "type": "table",
    //   "sourceId": "bb_internal",
    //   "sourceType": "internal",
    //   "views": {},
    //   "createdAt": "2024-01-02T13:29:24.592Z",
    //   "updatedAt": "2024-01-02T13:29:44.862Z",
    //   "indexes": [],
    //   "primaryDisplay": "name"
    // }
    return Promise.resolve({})
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


