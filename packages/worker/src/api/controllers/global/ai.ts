import {
  AIPromptRequest,
  UserCtx,
  AIPromptResponse,
  App,
} from "@budibase/types"
import OpenAI from "openai"
import env from "../../../environment"
import { getAppMetadata, searchApp } from "../../../utilities/serverRequests"

type ChatCompletionTool = OpenAI.ChatCompletionTool

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
})

function buildSystemPrompt(apps: App[]) {
  const appList = {
    apps: apps.map(app => JSON.stringify({ name: app.name })),
  }
  return `You are a helpful bot that can provide users with data about all the apps they have in this environment - you 
  can do this with tool calling. There list of apps which are available is as follows: 
  ${JSON.stringify(appList)}
  DO NOT stray from this app list, is asked about apps available then you must use one of the options provided here.
  Please pick the best app possible to retrieve the data the user desires and then make the tool call - working out the best possible 
  query to service the request.`
}

export async function prompt(ctx: UserCtx<AIPromptRequest, AIPromptResponse>) {
  const userInput = ctx.request.body.userInput
  const apps = await getAppMetadata()

  // Define a function that OpenAI can "call"
  const tools: ChatCompletionTool[] = [
    {
      function: {
        name: "searchApp",
        description:
          "Search a specific app with a given query. 'app' should be one of your defined apps.",
        parameters: {
          type: "object",
          properties: {
            app: {
              type: "string",
              description: `Name of the app to search, this must be one of the known app names - must be one of the following: ${apps
                .map(app => app.name)
                .join(",")}`,
            },
            query: {
              type: "string",
              description: `The search criteria formatted for the specified app - you must produce a JSON object in the following format:
                {
                  "string": ["value"]
                }
                Here, "string" is fixed and defines the type of query "value" represents one or more possible search criteria. Ensure that your output strictly follows this format.`,
            },
          },
          required: ["app", "query"],
        },
      },
      type: "function",
    },
  ]

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: buildSystemPrompt(apps) },
        { role: "user", content: userInput },
      ],
      tools,
      // let model decide when to perform function calls
      tool_choice: "auto",
    })

    const message = response.choices[0]?.message

    if (message.tool_calls) {
      for (const toolCall of message.tool_calls) {
        // Parse the function call details from OpenAI's response
        const { arguments: argsStr } = toolCall.function
        const args = JSON.parse(argsStr)

        // Find the app based on the provided name
        const selectedApp = apps.find(app => app.name === args.app)
        if (!selectedApp) {
          ctx.throw(400, `App "${args.app}" not found.`)
        }

        const rows = await searchApp(selectedApp.appId!, JSON.parse(args.query))
        ctx.body = {
          message: message.content!,
          data: rows,
        }
      }
    } else {
      // If no function call was generated, just return OpenAI's message
      ctx.body = { message: message.content!, data: [] }
    }
  } catch (error: any) {
    ctx.throw(500, `Unable to generate response - ${error.message}`)
  }
}
