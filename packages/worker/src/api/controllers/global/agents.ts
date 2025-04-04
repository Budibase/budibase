import { ai, LLMToolCall } from "@budibase/pro"
import { db, context, docIds } from "@budibase/backend-core"
import {
  AllDocsResponse,
  Automation,
  AutomationIOType,
  AutomationTriggerStepId,
  ChatAgentRequest,
  ChatAgentResponse,
  DocumentType,
  UserCtx,
  ContextUser,
  SaveAgentHistoryRequest,
  SaveAgentHistoryResponse,
  FetchAgentHistoryResponse,
  AgentHistory,
} from "@budibase/types"
import { triggerAutomation } from "../../../utilities/apps"
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

function addAutomationTools(
  prompt: ai.Prompt,
  automations: Record<string, Automation[]>
) {
  // TODO: can app ID be used to provide more info
  for (let appId of Object.keys(automations)) {
    for (let automation of automations[appId]) {
      prompt = prompt.tool(ai.sanitiseToolName(automation._id!), {
        parameters: automationSchemaToJsonSchema(automation),
        description: automation.name,
      })
    }
  }
  return prompt
}

function agentSystemPrompt(user: ContextUser) {
  return `You are a helpful support agent, using workflows to solve problems for users.
  The user is asking you for help with a support query.
  
  Your reply MUST be short and concise, answering the user's query as quickly and
  easily as possible.
  
  You MUST use markdown for any formatting in your response message.
  
  Do not tell the user about the format of the parameters, for example if a date is required to be
  supplied in ISO format, you should convert it to that, allowing the user to provide the date
  in any human readable format.
  
  If asked you can supply the list of "automations" to the user, this is the list of tool names available.
  
  Information about the user making the request can be found below: 
  \`\`\`
  ${JSON.stringify(user)}
  \`\`\``
}

function agentHistoryTitleSystemPrompt() {
  return `You will be provided with a set of history, a conversation between a user and an AI. Using this
  information generate a title for the conversation, this should start with a capital letter and MUST be 
  less than five words.`
}

function findAutomation(
  automations: Record<string, Automation[]>,
  automationId: string
) {
  for (let appId of Object.keys(automations)) {
    const appAutomations = automations[appId]
    const automation = appAutomations.find(
      automation => automation._id === automationId
    )
    if (automation) {
      return { automation, appId }
    }
  }
}

async function automationToolCall(
  call: LLMToolCall,
  automations: Record<string, Automation[]>
): Promise<{ response: { message: string; output?: any }; appId?: string }> {
  const func = call.function
  const found = findAutomation(automations, func.name)
  if (!found) {
    return { response: { message: "No tool found" } }
  }
  const automation = found.automation
  try {
    const json = JSON.parse(func.arguments)
    const response = await triggerAutomation(
      found.appId,
      found.automation._id!,
      json
    )

    return {
      response: {
        message: `I've ran the ${automation.name} workflow.`,
        output: response && response.value ? response.value : response,
      },
      appId: found.appId,
    }
  } catch (err: any) {
    throw new Error(
      `Invalid JSON received for tool ${func.name} arguments - ${err.message}`
    )
  }
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
  let automations: Record<string, Automation[]> = {}
  if (appIds && appIds.length) {
    automations = await getAutomations(appIds)
    prompt = addAutomationTools(prompt, automations)
  }
  prompt.system(agentSystemPrompt(ctx.user))
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
      response.toolCalls.map(call => automationToolCall(call, automations))
    )
    ctx.body = {
      response: toolsCalled
        .map(
          tool =>
            `${tool.response.message} - ${JSON.stringify(tool.response.output)}`
        )
        .join(", "),
      toolsCalled,
    }
  } else {
    ctx.body = {
      response: !response.message ? "No response." : response.message,
    }
  }
}

export async function save(
  ctx: UserCtx<SaveAgentHistoryRequest, SaveAgentHistoryResponse>
) {
  const db = context.getGlobalDB()
  const history = ctx.request.body
  if (!history._id) {
    history._id = docIds.generateAgentHistoryID()
  }
  if (!history.title) {
    let prompt = new ai.Prompt([])
    const model = await ai.getLLM()
    if (!model) {
      return ctx.throw(401, "No model available, cannot generate title")
    }
    prompt.system(agentHistoryTitleSystemPrompt())
    const titleResult = await model.prompt(prompt)
    history.title = titleResult.message!
  }
  const historyDoc: AgentHistory = {
    _id: history._id,
    _rev: history._rev,
    messages: history.messages,
    title: history.title,
    appIds: history.appIds,
  }
  const res = await db.put(historyDoc)
  ctx.body = {
    ...historyDoc,
    _rev: res.rev,
  }
}

export async function remove(ctx: UserCtx<void, void>) {
  const db = context.getGlobalDB()
  const historyId = ctx.params.historyId
  await db.remove(historyId)
  ctx.status = 201
}

export async function fetchHistory(
  ctx: UserCtx<void, FetchAgentHistoryResponse>
) {
  const db = context.getGlobalDB()
  const history = await db.allDocs<AgentHistory>(
    docIds.getDocParams(DocumentType.AGENT_HISTORY, undefined, {
      include_docs: true,
    })
  )
  ctx.body = history.rows.map(row => row.doc!)
}
