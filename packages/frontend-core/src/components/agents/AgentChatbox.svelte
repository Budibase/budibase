<script lang="ts">
  import { Button, InlineAlert, MarkdownViewer } from "@budibase/bbui"
  import Component from "./Component/Component.svelte"
  import {
    onMount,
    onDestroy,
    createEventDispatcher,
    type ComponentType,
  } from "svelte"
  import { tick } from "svelte"
  import type {
    AgentChat,
    ComponentMessage,
    LLMStreamChunk,
    UserContent,
  } from "@budibase/types"

  const dispatch = createEventDispatcher<{
    chatSaved: { chat: AgentChat }
    error: { message: string }
    chunk: { chunk: LLMStreamChunk }
    send: { content: string }
  }>()

  export let chat: AgentChat = { title: "", messages: [] }
  export let workspaceId: string | null = null
  type AgentChatStream = (
    _chat: AgentChat,
    _workspaceId: string,
    _onChunk: (_chunk: LLMStreamChunk) => void,
    _onError?: (_error: Error) => void
  ) => Promise<void>

  export let agentChatStream: AgentChatStream | null = null
  export let botAvatar: ComponentType | undefined = undefined
  export let intro: string | null = null
  export let placeholder: string = "Ask Budibase..."
  export let sendButtonLabel: string = "Send"
  export let showSendButton: boolean = true
  export let showInput: boolean = true
  export let sendOnEnter: boolean = true
  export let allowEmptyMessages: boolean = false
  export let rows: number = 3
  export let maxHeight: number | null = 520
  export let autoFocusInput: boolean = false
  export let disabled: boolean = false
  export let loading: boolean = false
  export let errorMessage: string | null = null
  export let showErrorInline: boolean = true
  export let inputValue: string = ""

  let chatContainer: HTMLDivElement | null = null
  let textareaElement: HTMLTextAreaElement | null = null
  let observer: MutationObserver | null = null
  let componentLoading = new Set<string>()

  $: messages = chat?.messages ?? []

  const formatUserContent = (content: UserContent): string => {
    if (typeof content === "string") {
      try {
        const json = JSON.parse(content.trim())
        if (json?.type === "FORM_SUBMISSION") {
          return "Submitted form data"
        }
      } catch {
        // fall back to original content
      }
      return content
    }
    if (content && Array.isArray(content) && content.length > 0) {
      return content
        .map(part =>
          part.type === "text"
            ? part.text
            : `${part.type} content not supported`
        )
        .join("")
    }
    return "[Empty message]"
  }

  const scrollToBottom = async () => {
    await tick()
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight
    }
  }

  const ensureObserver = () => {
    if (!chatContainer) {
      return
    }
    observer = new MutationObserver(() => {
      scrollToBottom()
    })
    observer.observe(chatContainer, {
      childList: true,
      subtree: true,
      attributes: true,
    })
  }

  const focusInput = async () => {
    if (!autoFocusInput) {
      return
    }
    await tick()
    textareaElement?.focus()
  }

  const resetError = () => {
    if (errorMessage) {
      errorMessage = null
    }
  }

  const sendMessage = async (contentOverride?: string) => {
    if (!workspaceId) {
      errorMessage = "Workspace ID not available."
      dispatch("error", { message: errorMessage })
      return
    }

    if (!agentChatStream) {
      errorMessage = "Agent chat stream is not configured."
      dispatch("error", { message: errorMessage })
      return
    }

    const rawContent = contentOverride != null ? contentOverride : inputValue
    const content = rawContent?.trim?.() ?? ""

    if (!allowEmptyMessages && !content) {
      return
    }

    if (loading) {
      return
    }

    let updatedChat: AgentChat = chat ?? { title: "", messages: [] }
    updatedChat = {
      ...updatedChat,
      messages: [...(updatedChat.messages ?? []), { role: "user", content }],
    }

    chat = updatedChat
    dispatch("send", { content })
    await scrollToBottom()

    if (contentOverride == null) {
      inputValue = ""
    }
    loading = true
    errorMessage = null

    let streamingContent = ""
    let isToolCall = false
    let toolCallInfo = ""

    try {
      await agentChatStream(
        updatedChat,
        workspaceId,
        chunk => {
          dispatch("chunk", { chunk })

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
            streamingContent += chunk.content || ""
            const updatedMessages = [...updatedChat.messages]
            const lastMessage = updatedMessages[updatedMessages.length - 1]
            if (lastMessage?.role === "assistant") {
              lastMessage.content =
                streamingContent + (isToolCall ? toolCallInfo : "")
            } else {
              updatedMessages.push({
                role: "assistant" as const,
                content: streamingContent + (isToolCall ? toolCallInfo : ""),
              })
            }

            updatedChat = {
              ...updatedChat,
              messages: updatedMessages,
            }
            chat = updatedChat
            scrollToBottom()
            return
          }

          if (chunk.type === "tool_call_start") {
            isToolCall = true
            toolCallInfo = `\n\n**🔧 Executing Tool:** ${chunk.toolCall?.name}\n**Parameters:**\n\`\`\`json\n${chunk.toolCall?.arguments}\n\`\`\`\n`
            const updatedMessages = [...updatedChat.messages]
            const lastMessage = updatedMessages[updatedMessages.length - 1]
            if (lastMessage?.role === "assistant") {
              lastMessage.content = streamingContent + toolCallInfo
            } else {
              updatedMessages.push({
                role: "assistant" as const,
                content: streamingContent + toolCallInfo,
              })
            }
            updatedChat = {
              ...updatedChat,
              messages: updatedMessages,
            }
            chat = updatedChat
            scrollToBottom()
            return
          }

          if (chunk.type === "tool_call_result") {
            const resultInfo = chunk.toolResult?.error
              ? `\n**❌ Tool Error:** ${chunk.toolResult.error}`
              : `\n**✅ Tool Result:** Complete`
            toolCallInfo += resultInfo
            const updatedMessages = [...updatedChat.messages]
            const lastMessage = updatedMessages[updatedMessages.length - 1]
            if (lastMessage?.role === "assistant") {
              lastMessage.content = streamingContent + toolCallInfo
            }
            updatedChat = {
              ...updatedChat,
              messages: updatedMessages,
            }
            chat = updatedChat
            streamingContent = ""
            isToolCall = false
            toolCallInfo = ""
            scrollToBottom()
            return
          }

          if (chunk.type === "chat_saved" && chunk.chat) {
            chat = chunk.chat
            updatedChat = chunk.chat
            loading = false
            dispatch("chatSaved", { chat: chunk.chat })
            scrollToBottom()
            return
          }

          if (chunk.type === "error") {
            errorMessage = chunk.content || "An error occurred"
            dispatch("error", { message: errorMessage })
            loading = false
          }
        },
        error => {
          console.error("Agent chat stream error", error)
          errorMessage = error?.message || "Failed to send message"
          dispatch("error", { message: errorMessage })
          loading = false
        }
      )
    } catch (err: any) {
      console.error(err)
      errorMessage = err?.message || "Failed to send message"
      dispatch("error", { message: errorMessage! })
    } finally {
      loading = false
      await scrollToBottom()
      await focusInput()
    }
  }

  const handleKeyDown = async (event: KeyboardEvent) => {
    if (!sendOnEnter || event.shiftKey || event.isComposing) {
      return
    }
    if (event.key === "Enter") {
      event.preventDefault()
      await sendMessage()
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
    await sendMessage(JSON.stringify(data))
  }

  onMount(async () => {
    ensureObserver()
    await focusInput()
  })

  onDestroy(() => {
    observer?.disconnect()
    observer = null
  })

  $: if (messages.length) {
    scrollToBottom()
  }
</script>

<section class="agent-chat">
  {#if intro}
    <p class="agent-chat__intro">{intro}</p>
  {/if}
  <div class="chat-wrapper">
    <div
      class="chat-area"
      bind:this={chatContainer}
      style:max-height={maxHeight != null ? `${maxHeight}px` : undefined}
    >
      <div class="chatbox">
        {#each messages as message}
          {#if message.role === "user"}
            <div class="message user">
              <MarkdownViewer value={formatUserContent(message.content)} />
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
                <Component
                  data={message.component}
                  on:submit={submitComponent}
                />
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
        {#if loading && botAvatar}
          <div class="message system">
            <svelte:component this={botAvatar} />
          </div>
        {/if}
      </div>
    </div>

    {#if showInput}
      <div class="input-wrapper">
        {#if showErrorInline && errorMessage}
          <InlineAlert type="negative" message={errorMessage} />
        {/if}
        <textarea
          class="chat-input spectrum-Textfield-input"
          bind:value={inputValue}
          {rows}
          {placeholder}
          bind:this={textareaElement}
          on:keydown={handleKeyDown}
          on:input={resetError}
          disabled={disabled || loading}
        />
        {#if showSendButton}
          <Button
            primary
            on:click={() => sendMessage()}
            disabled={disabled ||
              loading ||
              (!allowEmptyMessages && !inputValue.trim())}
          >
            {sendButtonLabel}
          </Button>
        {/if}
      </div>
    {/if}
  </div>
</section>

<style>
  .agent-chat {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m, 16px);
    width: 100%;
    height: 100%;
  }

  .agent-chat__intro {
    margin: 0;
    color: var(--spectrum-global-color-gray-700);
    text-align: center;
  }

  .chat-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: stretch;
    flex: 1 1 auto;
  }

  .chat-area {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    width: min(640px, 100%);
    margin: 0 auto;
    flex: 1 1 auto;
  }

  .chatbox {
    display: flex;
    flex-direction: column;
    gap: 24px;
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
    bottom: 0;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s, 12px);
    padding-bottom: 32px;
    width: min(640px, 100%);
    margin: 0 auto;
  }

  .chat-input {
    width: 100%;
    resize: none;
    padding: 20px;
    font-size: 16px;
    background-color: var(--grey-3, #f5f5f5);
    color: var(--grey-9, #424242);
    border-radius: 16px;
    border: none;
    outline: none;
    min-height: 120px;
  }

  .chat-input::placeholder {
    color: var(--spectrum-global-color-gray-600);
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
