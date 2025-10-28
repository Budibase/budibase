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
    ComponentPayload,
    LLMStreamChunk,
    UserMessage,
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

  type ChatMessage = (typeof chat.messages)[number] & {
    component?: ComponentPayload
  }

  let chatContainer: HTMLDivElement | null = null
  let textareaElement: HTMLTextAreaElement | null = null
  let observer: MutationObserver | null = null

  $: messages = (chat?.messages ?? []) as ChatMessage[]

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

  export const sendMessage = async (contentOverride?: string) => {
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

    const userMessage: UserMessage = { role: "user", content }

    let updatedChat: AgentChat = chat ?? { title: "", messages: [] }
    updatedChat = {
      ...updatedChat,
      messages: [...(updatedChat.messages ?? []), userMessage],
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
            const previewMessage = {
              role: "assistant" as const,
              content: null,
              component: chunk.component,
            }

            chat = {
              ...chat,
              messages: [...chat.messages, previewMessage],
            }

            updatedChat = {
              ...updatedChat,
              messages: [...updatedChat.messages, previewMessage],
            }

            scrollToBottom()
            return
          }

          if (chunk.type === "content") {
            streamingContent += chunk.content || ""
            const updatedMessages = [...updatedChat.messages]
            const lastMessage = updatedMessages[updatedMessages.length - 1]
            if (lastMessage?.role === "assistant" && !lastMessage?.component) {
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
              <MarkdownViewer
                value={typeof message.content === "string"
                  ? message.content
                  : message.content && message.content.length > 0
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
          {:else if message.role === "assistant" && message.component}
            <div class="message assistant">
              <Component data={message.component} />
            </div>
          {:else if message.role === "assistant" && message.content}
            <div class="message assistant">
              <MarkdownViewer value={message.content} />
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
</style>
