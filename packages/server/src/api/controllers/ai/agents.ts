import { context, docIds, HTTPError } from "@budibase/backend-core"
import { ai } from "@budibase/pro"
import {
  AgentChat,
  AgentToolSource,
  AgentToolSourceWithTools,
  ChatAgentRequest,
  CreateToolSourceRequest,
  DocumentType,
  FetchAgentHistoryResponse,
  Message,
  Tool,
  UserCtx,
  ComponentPayload,
} from "@budibase/types"
import { createToolSource as createToolSourceInstance } from "../../../ai/tools/base"
import sdk from "../../../sdk"

function addDebugInformation(messages: Message[]) {
  const processedMessages = [...messages]
  for (let i = 0; i < processedMessages.length; i++) {
    const message = processedMessages[i]
    if (message.role === "assistant" && message.tool_calls?.length) {
      // For each tool call, add debug information to the assistant message content
      let toolDebugInfo = "\n\n**Tool Calls:**\n"

      for (const toolCall of message.tool_calls) {
        if (toolCall.type !== "function" || !toolCall.function) {
          console.warn(
            `[OPENAI TOOL WARN] Unsupported tool call type: ${toolCall.type}`
          )
          continue
        }

        let toolParams = "{}"
        try {
          // Try to parse and prettify the JSON arguments
          toolParams = JSON.stringify(
            JSON.parse(toolCall.function.arguments),
            null,
            2
          )
        } catch (e) {
          // If not valid JSON, use as is
          toolParams = toolCall.function.arguments
        }

        toolDebugInfo += `\n**Tool:** ${toolCall.function.name}\n**Parameters:**\n\`\`\`json\n${toolParams}\n\`\`\`\n`
      }

      // Append tool debug info to the message content
      if (message.content) {
        message.content += toolDebugInfo
      } else {
        message.content = toolDebugInfo
      }
    }
  }
  return processedMessages
}

export async function agentChatStream(ctx: UserCtx<ChatAgentRequest, void>) {
  const aiConfig = await sdk.aiConfigs.getDefault()
  if (!aiConfig) {
    ctx.throw(422, "Chat config not found")
  }
  const model = await ai.getChatLLM({
    model: aiConfig.liteLLMModelId,
    baseUrl: "http://localhost:4000",
    apiKey: await sdk.aiConfigs.getLiteLLMSecretKey(),
  })
  const chat = ctx.request.body
  const db = context.getWorkspaceDB()

  // Set SSE headers and status
  ctx.status = 200
  ctx.set("Content-Type", "text/event-stream")
  ctx.set("Cache-Control", "no-cache")
  ctx.set("Connection", "keep-alive")
  ctx.set("Access-Control-Allow-Origin", "*")
  ctx.set("Access-Control-Allow-Headers", "Cache-Control")

  // Disable buffering for better streaming
  ctx.res.setHeader("X-Accel-Buffering", "no") // Nginx
  ctx.res.setHeader("Transfer-Encoding", "chunked")

  const toolSources = await db.allDocs<AgentToolSource>(
    docIds.getDocParams(DocumentType.AGENT_TOOL_SOURCE, undefined, {
      include_docs: true,
    })
  )

  let prompt = new ai.LLMRequest()
    .addSystemMessage(ai.agentSystemPrompt(ctx.user))
    .addMessages(chat.messages)

  let toolGuidelines = ""

  for (const row of toolSources.rows) {
    const toolSource = row.doc!
    const toolSourceInstance = createToolSourceInstance(toolSource)

    if (!toolSourceInstance) {
      continue
    }

    const guidelines = toolSourceInstance.getGuidelines()
    if (guidelines) {
      toolGuidelines += `\n\nWhen using ${toolSourceInstance.getName()} tools, ensure you follow these guidelines:\n${guidelines}`
    }

    const toolsToAdd = toolSourceInstance.getEnabledTools()

    if (toolsToAdd.length > 0) {
      prompt = prompt.addTools(toolsToAdd)
    }
  }

  // Append tool guidelines to the system prompt if any exist
  if (toolGuidelines) {
    prompt = prompt.addSystemMessage(toolGuidelines)
  }

  try {
    let finalMessages: Message[] = []
    let totalTokens = 0

    for await (const chunk of model.chatStream(prompt)) {
      // Send chunk to client
      ctx.res.write(`data: ${JSON.stringify(chunk)}\n\n`)

      if (chunk.type === "done") {
        finalMessages = chunk.messages || []
        totalTokens = chunk.tokensUsed || 0
        break
      } else if (chunk.type === "error") {
        ctx.res.write(
          `data: ${JSON.stringify({
            type: "error",
            content: chunk.content,
          })}\n\n`
        )
        ctx.res.end()
        return
      }
    }

    // Proof-of-concept: append a mocked custom HTML assistant message so the builder UI can render it.
    const component = await buildComponent(
      chat.messages.map(x => x.content as string).pop()
    )
    if (component) {
      ctx.res.write(
        `data: ${JSON.stringify({
          type: "component",
          component,
        })}\n\n`
      )
    }

    // Save chat to database after streaming is complete
    if (finalMessages.length > 0) {
      if (!chat._id) {
        chat._id = docIds.generateAgentChatID()
      }

      if (!chat.title || chat.title === "") {
        const titlePrompt = new ai.LLMRequest()
          .addSystemMessage(ai.agentHistoryTitleSystemPrompt())
          .addMessages(finalMessages)
        const { message } = await model.prompt(titlePrompt)
        chat.title = message
      }

      const newChat: AgentChat = {
        _id: chat._id,
        _rev: chat._rev,
        title: chat.title,
        messages: addDebugInformation(finalMessages),
      }

      const { rev } = await db.put(newChat)

      // Send final chat info
      ctx.res.write(
        `data: ${JSON.stringify({
          type: "chat_saved",
          chat: { ...newChat, _rev: rev },
          tokensUsed: totalTokens,
        })}\n\n`
      )
    }

    ctx.res.end()
  } catch (error: any) {
    ctx.res.write(
      `data: ${JSON.stringify({ type: "error", content: error.message })}\n\n`
    )
    ctx.res.end()
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
  const db = context.getWorkspaceDB()
  const history = await db.allDocs<AgentChat>(
    docIds.getDocParams(DocumentType.AGENT_CHAT, undefined, {
      include_docs: true,
    })
  )
  // Sort by creation time, newest first
  ctx.body = history.rows
    .map(row => row.doc!)
    .sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return timeB - timeA // Newest first
    })
}

export async function fetchToolSources(
  ctx: UserCtx<void, AgentToolSourceWithTools[]>
) {
  const db = context.getWorkspaceDB()
  const toolSources = await db.allDocs<AgentToolSource>(
    docIds.getDocParams(DocumentType.AGENT_TOOL_SOURCE, undefined, {
      include_docs: true,
    })
  )

  ctx.body = toolSources.rows.map(row => {
    const doc = row.doc!
    const toolSourceInstance = createToolSourceInstance(doc)

    const tools: Tool[] = toolSourceInstance
      ? toolSourceInstance.getTools()
      : []

    return {
      ...doc,
      tools,
    }
  })
}

export async function createToolSource(
  ctx: UserCtx<CreateToolSourceRequest, { created: true }>
) {
  const db = context.getWorkspaceDB()
  const toolSource = ctx.request.body
  toolSource._id = docIds.generateAgentToolSourceID()

  await db.put(toolSource)
  // TODO: handle PH events
  // await events.toolsource.created(toolSource)
  ctx.body = { created: true }
  ctx.status = 201
}

export async function updateToolSource(
  ctx: UserCtx<CreateToolSourceRequest, AgentToolSource>
) {
  const toolSource = ctx.request.body

  if (!toolSource._id || !toolSource._rev) {
    throw new HTTPError("_id or _rev fields missing", 400)
  }

  const db = context.getWorkspaceDB()

  const response = await db.put(toolSource)
  toolSource._rev = response.rev

  ctx.body = toolSource
  ctx.status = 200
}

export async function deleteToolSource(ctx: UserCtx<void, { deleted: true }>) {
  const toolSourceId = ctx.params.toolSourceId
  const db = context.getWorkspaceDB()

  try {
    const toolSource = await db.get<AgentToolSource>(toolSourceId)
    await db.remove(toolSource)
    ctx.body = { deleted: true }
    ctx.status = 200
  } catch (error: any) {
    if (error.status === 404) {
      throw new HTTPError("Tool source not found", 404)
    }
    throw error
  }
}
async function buildComponent(
  message?: string
): Promise<ComponentPayload | undefined> {
  if (!message) {
    return
  }

  const lowered = message.toLowerCase()

  if (lowered.includes("book meeting")) {
    return {
      name: "Form",
      props: {
        description:
          "Let us know a few details and we’ll send over a calendar invite.",
      },
      slot: "Book a meeting",
      children: [
        {
          name: "Input",
          slot: "Full name",
          props: {
            placeholder: "Ada Lovelace",
          },
        },
        {
          name: "Input",
          slot: "Work email",
          props: {
            placeholder: "you@company.com",
            type: "email",
          },
        },
        {
          name: "Select",
          slot: "Preferred time",
          props: {
            placeholder: "Choose a slot",
            options: [
              { label: "Morning (9-11am)", value: "am" },
              { label: "Afternoon (1-3pm)", value: "pm" },
              { label: "Late afternoon (3-5pm)", value: "late" },
            ],
          },
        },
        {
          name: "TextArea",
          slot: "Agenda",
          props: {
            placeholder: "Share anything we should prepare in advance",
            rows: 3,
          },
        },
        {
          name: "Button",
          slot: "Submit booking",
          props: {
            primary: true,
          },
        },
      ],
    }
  }

  if (lowered.includes("button group")) {
    return {
      name: "MultiButton",
      props: {
        layout: "horizontal",
      },
      slot: "",
      children: [
        {
          name: "Button",
          slot: "Book meeting",
          props: {
            primary: true,
          },
        },
        {
          name: "Button",
          slot: "Request callback",
          props: {
            secondary: true,
          },
        },
        {
          name: "Button",
          slot: "Open docs",
          props: {
            quiet: true,
            onClick: "window.open('https://docs.budibase.com', '_blank')",
          },
        },
      ],
    }
  }

  if (lowered.includes("button")) {
    const buttonProps = {
      primary: true,
      size: "M",
      onClick: "alert('fromCallback')",
    }
    const slotContent = "Ask Budibase"

    return {
      name: "Button",
      props: buttonProps,
      slot: slotContent,
    }
  }
  if (lowered.includes("form")) {
    return {
      name: "Form",
      props: {
        description: "Please leave your details and we'll get back to you.",
      },
      slot: "Contact us",
      children: [
        {
          name: "Input",
          slot: "Full Name",
          props: {
            placeholder: "Jane Doe",
          },
        },
        {
          name: "Input",
          slot: "Email",
          props: {
            placeholder: "name@example.com",
            type: "email",
          },
        },
        {
          name: "Select",
          slot: "Topic",
          props: {
            options: [
              { label: "Sales", value: "sales" },
              { label: "Support", value: "support" },
              { label: "Other", value: "other" },
            ],
            placeholder: "Choose a topic",
          },
        },
        {
          name: "TextArea",
          slot: "Message",
          props: {
            placeholder: "Tell us more about your request",
            rows: 4,
          },
        },
        {
          name: "Checkbox",
          slot: "Subscribe to updates",
          props: {
            helpText: "We'll send occasional product news.",
          },
        },
        {
          name: "Button",
          slot: "Submit",
          props: {
            primary: true,
          },
        },
      ],
    }
  }
}
