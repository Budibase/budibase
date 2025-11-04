<script lang="ts">
  import { MarkdownViewer, notifications } from "@budibase/bbui"
  import { createAPIClient } from "@budibase/frontend-core"
  import type {
    AgentChat,
    ComponentMessage,
    UserMessage,
  } from "@budibase/types"
  import { createEventDispatcher, onDestroy, onMount, tick } from "svelte"
  import BBAI from "../../icons/BBAI.svelte"
  import Component from "./Component"

  export let API = createAPIClient()

  export let workspaceId: string
  export let chat: AgentChat

  const dispatch = createEventDispatcher<{ chatSaved: { chatId: string } }>()

  let inputValue = ""
  let loading: boolean = false
  let chatAreaElement: HTMLDivElement
  let observer: MutationObserver
  let textareaElement: HTMLTextAreaElement
  let componentLoading = new Set<string>()

  $: if (chat.messages.length) {
    scrollToBottom()
  }

  async function scrollToBottom() {
    await tick()
    if (chatAreaElement) {
      chatAreaElement.scrollTop = chatAreaElement.scrollHeight
    }
  }

  async function handleKeyDown(event: any) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      await prompt()
    }
  }

  async function prompt(message?: string) {
    if (!chat) {
      chat = { title: "", messages: [] }
    }

    const userMessage: UserMessage = {
      role: "user",
      content: message ?? inputValue,
    }

    let updatedChat = {
      ...chat,
      messages: [...chat.messages, userMessage],
    }

    // Update local display immediately with user message
    chat = updatedChat

    // Ensure we scroll to the new message
    await scrollToBottom()

    inputValue = ""
    loading = true

    let streamingContent = ""
    let isToolCall = false
    let toolCallInfo: string = ""

    try {
      await API.agentChatStream(
        updatedChat,
        workspaceId,
        chunk => {
          if (chunk.type === "component") {
            const previewMessage: ComponentMessage = {
              role: "component",
              component: chunk.component!,
            }

            chat = {
              ...chat,
              messages: [...chat.messages, previewMessage],
            }

            updatedChat = {
              ...updatedChat,
              messages: [...updatedChat.messages, previewMessage],
            }

            streamingContent = ""
            scrollToBottom()
            return
          }

          if (chunk.type === "content") {
            // Accumulate streaming content
            streamingContent += chunk.content || ""

            // Update chat with partial content
            const updatedMessages = [...updatedChat.messages]

            // Find or create assistant message
            const lastMessage = updatedMessages[updatedMessages.length - 1]
            if (lastMessage?.role === "assistant") {
              lastMessage.content =
                streamingContent + (isToolCall ? toolCallInfo : "")
            } else {
              updatedMessages.push({
                role: "assistant",
                content: streamingContent + (isToolCall ? toolCallInfo : ""),
              })
            }

            chat = {
              ...chat,
              messages: updatedMessages,
            }

            // Auto-scroll as content streams
            scrollToBottom()
          } else if (chunk.type === "tool_call_start") {
            isToolCall = true
            toolCallInfo = `\n\n**🔧 Executing Tool:** ${chunk.toolCall?.name}\n**Parameters:**\n\`\`\`json\n${chunk.toolCall?.arguments}\n\`\`\`\n`

            const updatedMessages = [...updatedChat.messages]
            const lastMessage = updatedMessages[updatedMessages.length - 1]
            if (lastMessage?.role === "assistant") {
              lastMessage.content = streamingContent + toolCallInfo
            } else {
              updatedMessages.push({
                role: "assistant",
                content: streamingContent + toolCallInfo,
              })
            }

            chat = {
              ...chat,
              messages: updatedMessages,
            }

            scrollToBottom()
          } else if (chunk.type === "tool_call_result") {
            const resultInfo = chunk.toolResult?.error
              ? `\n**❌ Tool Error:** ${chunk.toolResult.error}`
              : `\n**✅ Tool Result:** Complete`

            toolCallInfo += resultInfo

            const updatedMessages = [...updatedChat.messages]
            const lastMessage = updatedMessages[updatedMessages.length - 1]
            if (lastMessage?.role === "assistant") {
              lastMessage.content = streamingContent + toolCallInfo
            }

            chat = {
              ...chat,
              messages: updatedMessages,
            }

            scrollToBottom()
          } else if (chunk.type === "chat_saved") {
            if (chunk.chat) {
              chat = chunk.chat
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
      tableId: tableId,
    }
    await prompt(JSON.stringify(data))
  }

  onMount(async () => {
    chat = { title: "", messages: [] }

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
    {#each chat.messages as message}
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
      {:else if message.role === "assistant" && message.content}
        <div class="message assistant">
          <MarkdownViewer value={message.content} />
        </div>
      {:else if message.role === "component"}
        <div class="message assistant">
          <div
            class="component-message"
            class:component-message--loading={componentLoading.has(
              message.component.componentId
            )}
          >
            <Component data={message.component} on:submit={submitComponent} />
            {#if componentLoading.has(message.component.componentId)}
              <div class="component-message__overlay">
                <div class="component-message__status">
                  <span class="component-message__status-dot" />
                  <span>Submitting…</span>
                </div>
              </div>
            {/if}
          </div>
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

  /* Style the markdown tool sections in assistant messages */
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
  }
  .component-message--loading {
    pointer-events: none;
    opacity: 0.6;
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
