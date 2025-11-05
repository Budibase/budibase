<script lang="ts">
  import { MarkdownViewer, notifications } from "@budibase/bbui"
  import { createAPIClient } from "@budibase/frontend-core"
  import type {
    AgentChat,
    AssistantMessage,
    SystemMessage,
    UserMessage,
  } from "@budibase/types"
  import { createEventDispatcher, onDestroy, onMount, tick } from "svelte"
  import BBAI from "../../icons/BBAI.svelte"
  import Component from "./Component"

  export let API = createAPIClient()

  export let workspaceId: string
  export let chat: AgentChat
  export let loading: boolean = false

  const dispatch = createEventDispatcher<{ chatSaved: { chatId: string } }>()

  let inputValue = ""
  let chatAreaElement: HTMLDivElement
  let observer: MutationObserver
  let textareaElement: HTMLTextAreaElement
  let componentLoading = new Set<string>()
  let toolResponses: Record<string, string> = {}

  const extractToolResponses = (
    messages: AgentChat["messages"] = []
  ): Record<string, string> => {
    return messages.reduce(
      (acc, message) => {
        if (message.role === "tool" && message.tool_call_id) {
          acc[message.tool_call_id] = message.content
        }
        return acc
      },
      {} as Record<string, string>
    )
  }

  $: if (chat?.messages?.length) {
    const extracted = extractToolResponses(chat.messages)
    if (Object.keys(extracted).length) {
      toolResponses = {
        ...toolResponses,
        ...extracted,
      }
    }
  }

  type AssistantSegment =
    | { type: "text"; content: string }
    | {
        type: "component"
        componentId: string
        component?: any // TODO
        loading: boolean
      }

  const toolResultComponentPlaceholderRegex =
    /\{\{toolResult:component:([^}]+)\}\}/g

  const getToolResponse = (runId: string) => {
    const resolved = toolResponses[runId.trim()]
    if (!resolved) {
      return undefined
    }
    try {
      const parsed = JSON.parse(resolved || "")
      if (parsed && typeof parsed === "object") {
        return parsed
      }
    } catch {
      // not JSON, return as is
    }
    return resolved
  }

  const getAssistantSegments = (
    message: AssistantMessage
  ): AssistantSegment[] => {
    let content = message.content
    if (!content) {
      return []
    }

    const segments: AssistantSegment[] = []
    toolResultComponentPlaceholderRegex.lastIndex = 0
    let lastIndex = 0
    let match: RegExpExecArray | null

    while ((match = toolResultComponentPlaceholderRegex.exec(content))) {
      const matchIndex = match.index ?? 0
      const textBefore = content.slice(lastIndex, matchIndex).trim()
      if (textBefore) {
        segments.push({ type: "text", content: textBefore })
      }

      const toolId = match[1]?.trim()
      if (toolId) {
        const componentResponse = getToolResponse(toolId)
        const componentPayload = componentResponse?.component
        const hasComponent =
          componentPayload !== undefined && componentPayload !== null
        segments.push({
          type: "component",
          componentId: toolId,
          component: hasComponent ? componentPayload : undefined,
          loading: !hasComponent,
        })
      }

      lastIndex = matchIndex + match[0].length
    }

    const remaining = content.slice(lastIndex).trim()
    if (remaining) {
      segments.push({ type: "text", content: remaining })
    }

    if (!segments.length) {
      return [{ type: "text", content }]
    }

    return segments
  }

  const clearComponentLoading = (componentId?: string) => {
    if (!componentId) {
      return
    }
    if (componentLoading.has(componentId)) {
      componentLoading.delete(componentId)
    }
  }

  $: if (chat.messages.length) {
    scrollToBottom()
  }

  async function scrollToBottom() {
    await tick()
    if (chatAreaElement) {
      chatAreaElement.scrollTop = chatAreaElement.scrollHeight
    }
  }

  async function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      await prompt()
    }
  }

  async function prompt(message?: string, role: "system" | "user" = "user") {
    if (!chat) {
      chat = { title: "", messages: [], agentId: "" }
    }

    const userMessage: UserMessage | SystemMessage = {
      role,
      content: message ?? inputValue,
    }

    let updatedChat: AgentChat = {
      ...chat,
      messages: [...chat.messages, userMessage],
    }

    chat = updatedChat

    await scrollToBottom()

    inputValue = ""
    loading = true

    let streamingContent = ""

    try {
      await API.agentChatStream(
        updatedChat,
        workspaceId,
        chunk => {
          if (chunk.type === "content") {
            streamingContent += chunk.content || ""

            const updatedMessages = [...updatedChat.messages]

            const lastMessage = updatedMessages[updatedMessages.length - 1]
            if (lastMessage?.role === "assistant") {
              lastMessage.content = streamingContent
              for (const segment of getAssistantSegments(lastMessage)) {
                if (segment.type === "component") {
                  clearComponentLoading(segment.componentId)
                }
              }
            } else {
              const newAssistant: AssistantMessage = {
                role: "assistant",
                content: streamingContent,
              }
              updatedMessages.push(newAssistant)
              for (const segment of getAssistantSegments(newAssistant)) {
                if (segment.type === "component") {
                  clearComponentLoading(segment.componentId)
                }
              }
            }

            chat = {
              ...chat,
              messages: updatedMessages,
            }

            updatedChat = {
              ...updatedChat,
              messages: updatedMessages,
            }

            scrollToBottom()
          } else if (chunk.type === "tool_call_result") {
            if (chunk.toolResult?.result) {
              toolResponses = {
                ...toolResponses,
                [chunk.toolResult.id]: chunk.toolResult.result,
              }
            }
          } else if (chunk.type === "chat_saved") {
            if (chunk.chat) {
              chat = chunk.chat
              updatedChat = chunk.chat
              if (chunk.chat._id) {
                dispatch("chatSaved", { chatId: chunk.chat._id })
              }
            }
          } else if (chunk.type === "done") {
            loading = false
            scrollToBottom()
          } else if (chunk.type === "error") {
            notifications.error(chunk.content || "An error occurred")
            loading = false
          }
        },
        error => {
          console.error("Streaming error:", error)
          notifications.error(error.message)
          loading = false
        }
      )
    } catch (err: any) {
      console.error(err)
      notifications.error(err.message)
      loading = false
    }

    // Return focus to textarea after the response
    await tick()
    if (textareaElement) {
      textareaElement.focus()
    }
  }

  async function submitComponent(
    event: CustomEvent<{
      componentId: string
      tableId: string
      values: Record<string, unknown>
    }>
  ) {
    const { componentId, tableId, values } = event.detail
    componentLoading.add(componentId)
    const data = {
      type: "FORM_SUBMISSION",
      componentId,
      values,
      tableId,
    }
    await prompt(JSON.stringify(data), "system")
  }

  onMount(async () => {
    chat = { title: "", messages: [], agentId: chat.agentId }

    // Ensure we always autoscroll to reveal new messages
    observer = new MutationObserver(async () => {
      await tick()
      if (chatAreaElement) {
        chatAreaElement.scrollTop = chatAreaElement.scrollHeight
      }
    })

    if (chatAreaElement) {
      observer.observe(chatAreaElement, {
        childList: true,
        subtree: true,
        attributes: true,
      })
    }

    await tick()
    if (textareaElement) {
      textareaElement.focus()
    }
  })

  onDestroy(() => {
    observer.disconnect()
  })
</script>

<div class="chat-area" bind:this={chatAreaElement}>
  <div class="chatbox">
    {#each chat.messages as message, index (index)}
      {#if message.role === "user"}
        <div class="message user">
          <MarkdownViewer
            value={typeof message.content === "string"
              ? message.content
              : message.content.length > 0
                ? message.content
                    .map(part =>
                      part.type === "text"
                        ? part.text
                        : `${part.type} content not supported`
                    )
                    .join("")
                : "[Empty message]"}
          />
        </div>
      {:else if message.role === "assistant"}
        <div class="message assistant">
          {#each getAssistantSegments(message) as segment, segmentIndex (`${index}-${segmentIndex}`)}
            {#if segment.type === "text"}
              <MarkdownViewer value={segment.content} />
            {:else}
              <div
                class="component-message"
                class:component-message--loading={segment.loading ||
                  componentLoading.has(segment.componentId)}
              >
                {#if segment.component}
                  <Component
                    data={segment.component}
                    on:submit={submitComponent}
                  />
                {:else}
                  <div class="component-message__placeholder">
                    Preparing component…
                  </div>
                {/if}
                {#if segment.loading || componentLoading.has(segment.componentId)}
                  <div class="component-message__overlay">
                    <div class="component-message__status">
                      <span class="component-message__status-dot" />
                      <span
                        >{segment.loading ? "Preparing…" : "Submitting…"}</span
                      >
                    </div>
                  </div>
                {/if}
              </div>
            {/if}
          {/each}
        </div>
      {/if}
    {/each}
    {#if loading}
      <div class="message system">
        <BBAI size="48px" animate />
      </div>
    {/if}
  </div>

  <div class="input-wrapper">
    <textarea
      bind:value={inputValue}
      bind:this={textareaElement}
      class="input spectrum-Textfield-input"
      on:keydown={handleKeyDown}
      placeholder="Ask anything"
      disabled={loading}
    />
  </div>
</div>

<style>
  .chat-area {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    height: 0;
  }
  .chatbox {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 600px;
    margin: 0 auto;
    flex: 1 1 auto;
    padding: 48px 0 24px 0;
  }

  .message {
    display: flex;
    flex-direction: column;
    max-width: 80%;
    padding: var(--spacing-l);
    border-radius: 20px;
    font-size: 16px;
    color: var(--spectrum-global-color-gray-900);
  }

  .message.user {
    align-self: flex-end;
    background-color: var(--grey-3);
  }

  .message.assistant {
    align-self: flex-start;
    background-color: var(--grey-1);
    border: 1px solid var(--grey-3);
  }

  .message.system {
    align-self: flex-start;
    background: none;
    padding-left: 0;
  }

  .input-wrapper {
    position: sticky;
    bottom: 0;
    width: 600px;
    margin: 0 auto;
    background: var(--background-alt);
    padding-bottom: 32px;
    display: flex;
    flex-direction: column;
  }

  .input {
    width: 100%;
    height: 100px;
    top: 0;
    resize: none;
    padding: 20px;
    font-size: 16px;
    background-color: var(--grey-3);
    color: var(--grey-9);
    border-radius: 16px;
    border: none;
    outline: none;
    min-height: 100px;
    margin-bottom: 8px;
  }

  .input::placeholder {
    color: var(--spectrum-global-color-gray-600);
  }

  :global(.assistant strong) {
    color: var(--spectrum-global-color-static-seafoam-700);
  }

  :global(.assistant h3) {
    margin-top: var(--spacing-m);
    color: var(--spectrum-global-color-static-seafoam-700);
  }

  :global(.assistant pre) {
    background-color: var(--grey-2);
    border: 1px solid var(--grey-3);
    border-radius: 4px;
  }

  .component-message {
    position: relative;
    padding: 0 0 16px 0;
  }
  .component-message--loading {
    pointer-events: none;
    opacity: 0.6;
  }
  .component-message__placeholder {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 120px;
    border-radius: 12px;
    border: 1px dashed var(--grey-4);
    background: var(--grey-2);
    color: var(--grey-7);
    font-size: 14px;
  }
  .component-message__overlay {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
  }
  .component-message__status {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(0, 0, 0, 0.65);
    color: #fff;
    padding: 6px 12px;
    border-radius: 999px;
    font-size: 12px;
    letter-spacing: 0.3px;
    text-transform: uppercase;
  }
  .component-message__status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--spectrum-global-color-blue-400, #3182ce);
    animation: component-message-pulse 1s ease-in-out infinite;
  }
  @keyframes component-message-pulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 0.6;
    }
    50% {
      transform: scale(1.4);
      opacity: 1;
    }
  }
</style>
