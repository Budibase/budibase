import { ai } from "@budibase/pro"
import { db } from "@budibase/backend-core"
import {
  UserCtx,
  ChatAgentRequest,
  ChatAgentResponse,
  Automation,
  AllDocsResponse,
  DocumentType,
} from "@budibase/types"
import { JSONSchema4, JSONSchema4TypeName } from "json-schema"

const JsonSchemaTypes = [
  "string",
  "number",
  "integer",
  "boolean",
  "object",
  "array",
  "null",
  "any",
]

async function getAutomations(
  appIds: string[]
): Promise<Record<string, Automation[]>> {
  const appAutomations: Promise<AllDocsResponse<Automation>>[] = []
  for (let appId of appIds) {
    const appDb = db.getDB(db.getProdAppID(appId), { skip_setup: true })
    appAutomations.push(
      appDb.allDocs<Automation>(
        db.getDocParams(DocumentType.AUTOMATION, null, {
          include_docs: true,
        })
      )
    )
  }
  const allAutomations = (await Promise.all(appAutomations)).map(res =>
    res.rows.map(row => row.doc!)
  )
  const appAutomationMap: Record<string, Automation[]> = {}
  for (const automations of allAutomations) {
    const idx = allAutomations.indexOf(automations)
    appAutomationMap[appIds[idx]] = automations
  }
  return appAutomationMap
}

function automationSchemaToJsonSchema(automation: Automation): JSONSchema4 {
  const inputSchema = automation.definition.trigger.schema.inputs
  const properties: Record<string, JSONSchema4> = {}
  for (const [key, props] of Object.entries(inputSchema.properties)) {
    let type: JSONSchema4TypeName = "any"
    if (props.type && JsonSchemaTypes.includes(props.type)) {
      type = props.type as JSONSchema4TypeName
    }
    properties[key] = {
      title: props.title,
      type: type,
      description: props.description,
      enum: props.enum,
      required: props.required,
    }
  }
  return {
    type: "object",
    properties,
    required: Object.keys(properties),
  }
}

function addAutomationTools(
  prompt: ai.Prompt,
  automations: Record<string, Automation[]>
) {
  // TODO: can app ID be used to provide more info
  for (let appId of Object.keys(automations)) {
    for (let automation of automations[appId]) {
      prompt = prompt.tool(automation.name, {
        parameters: automationSchemaToJsonSchema(automation),
      })
    }
  }
  return prompt
}

function agentSystemPrompt() {
  return `You are a helpful support agent, using workflows to solve problems for users.
  The user is asking you for help with a support query.
  
  Your reply MUST be short and concise, answering the user's query as quickly and
  easily as possible.
  
  If asked you can supply the list of "automations" to the user, this is the list of tool names available.`
}

export async function agentChat(
  ctx: UserCtx<ChatAgentRequest, ChatAgentResponse>
) {
  const model = await ai.getLLM()
  if (!model) {
    return ctx.throw(401, "No model available, cannot chat")
  }
  let prompt = new ai.Prompt([])
  const { userPrompt, appIds } = ctx.request.body
  if (appIds && appIds.length) {
    const automations = await getAutomations(appIds)
    prompt = addAutomationTools(prompt, automations)
  }
  prompt.system(agentSystemPrompt())
  prompt.user(userPrompt)
  const response = await model.prompt(prompt)
  ctx.body = {
    response: !response.message ? "No response." : response.message,
  }
}
