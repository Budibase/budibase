import { ai, LLMToolCall } from "@budibase/pro"
import { db } from "@budibase/backend-core"
import {
  AllDocsResponse,
  Automation,
  AutomationIOType,
  AutomationTriggerStepId,
  ChatAgentRequest,
  ChatAgentResponse,
  DocumentType,
  UserCtx,
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

function getJsonSchemaType(automationType?: AutomationIOType): {
  type: JSONSchema4TypeName
  description?: string
} {
  if (
    automationType === AutomationIOType.DATE ||
    automationType === AutomationIOType.DATETIME
  ) {
    return {
      type: "string",
      description: "Date represented as an ISO date string",
    }
  } else if (!automationType || !JsonSchemaTypes.includes(automationType)) {
    return { type: "string" }
  } else {
    return { type: automationType as JSONSchema4TypeName }
  }
}

function automationSchemaToJsonSchema(automation: Automation): JSONSchema4 {
  const trigger = automation.definition.trigger
  const inputSchema = automation.definition.trigger.schema.inputs
  const properties: Record<string, JSONSchema4> = {}
  // app action automations get their fields from user inputs not the schema
  if (trigger.stepId === AutomationTriggerStepId.APP) {
    const appActionInputs =
      trigger.inputs && "fields" in trigger.inputs ? trigger.inputs.fields : {}
    const fields: Record<string, JSONSchema4> = {}
    for (let key of Object.keys(appActionInputs)) {
      fields[key] = {
        title: key,
        ...getJsonSchemaType(appActionInputs[key]),
      }
    }
    properties["fields"] = {
      title: "fields",
      type: "object",
      required: Object.keys(fields),
      properties: fields,
    }
  } else {
    for (const [key, props] of Object.entries(inputSchema.properties)) {
      properties[key] = {
        title: props.title,
        description: props.description,
        enum: props.enum,
        required: props.required,
        ...getJsonSchemaType(props.type),
      }
    }
  }
  return {
    type: "object",
    properties,
    required: Object.keys(properties),
  }
}

function buildToolName(appId: string, automationName: string) {
  return `${db.getProdAppID(appId)}${db.SEPARATOR}${automationName}`
}

function splitToolName(toolName: string) {
  const splitToolName = toolName.split(db.SEPARATOR)
  const appId = splitToolName.slice(0, 2).join(db.SEPARATOR)
  const automationName = splitToolName.slice(2).join(db.SEPARATOR)
  return { appId, automationName }
}

function addAutomationTools(
  prompt: ai.Prompt,
  automations: Record<string, Automation[]>
) {
  // TODO: can app ID be used to provide more info
  for (let appId of Object.keys(automations)) {
    for (let automation of automations[appId]) {
      prompt = prompt.tool(
        ai.sanitiseToolName(buildToolName(appId, automation.name)),
        {
          parameters: automationSchemaToJsonSchema(automation),
        }
      )
    }
  }
  return prompt
}

function agentSystemPrompt() {
  return `You are a helpful support agent, using workflows to solve problems for users.
  The user is asking you for help with a support query.
  
  Your reply MUST be short and concise, answering the user's query as quickly and
  easily as possible.
  
  You MUST use markdown for any formatting in your response message.
  
  If asked you can supply the list of "automations" to the user, this is the list of tool names available.`
}

async function automationToolCall(
  call: LLMToolCall
): Promise<{ response: string; appId: string }> {
  // TODO: call the automation endpoint on the app
  const func = call.function
  const { appId, automationName } = splitToolName(func.name)
  return { response: `I've ran the ${automationName} workflow.`, appId }
}

export async function agentChat(
  ctx: UserCtx<ChatAgentRequest, ChatAgentResponse>
) {
  const model = await ai.getLLM()
  if (!model) {
    return ctx.throw(401, "No model available, cannot chat")
  }
  let prompt = new ai.Prompt([])
  const { messages, appIds } = ctx.request.body
  if (appIds && appIds.length) {
    const automations = await getAutomations(appIds)
    prompt = addAutomationTools(prompt, automations)
  }
  prompt.system(agentSystemPrompt())
  for (let message of messages) {
    if (message.system) {
      prompt.system(message.message)
    } else {
      prompt.user(message.message)
    }
  }
  const response = await model.prompt(prompt)
  if (response.toolCalls?.length) {
    const toolsCalled = await Promise.all(
      response.toolCalls.map(call => automationToolCall(call))
    )
    ctx.body = {
      toolsCalled,
    }
  } else {
    ctx.body = {
      response: !response.message ? "No response." : response.message,
    }
  }
}
