<script lang="ts">
  import { Button, InlineAlert } from "@budibase/bbui"
  import { AgentChatbox } from "@budibase/frontend-core"
  import { API } from "@/api"
  import { appStore } from "@/stores/app"
  import { get } from "svelte/store"
  import { tick } from "svelte"
  import type { AgentChat, UserMessage } from "@budibase/types"

  export let intro: string = "Ask our assistant anything about this app."
  export let placeholder: string = "Ask Budibase..."
  export let sendButtonLabel: string = "Send"

  let chat: AgentChat = { title: "", messages: [] }
  let inputValue = ""
  let loading = false
  let errorMessage: string | null = null
  let chatContainer: HTMLDivElement | null = null

  const scrollToBottom = async () => {
    await tick()
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight
    }
  }

  const handleKeyDown = async (event: KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      await sendMessage()
    }
  }

  const sendMessage = async (contentOverride?: string) => {
    const rawContent = contentOverride != null ? contentOverride : inputValue
    const content = rawContent.trim()
    if (!content || loading) {
      return
    }

    const workspaceId = get(appStore).appId
    if (!workspaceId) {
      errorMessage = "App ID not available."
      return
    }

    errorMessage = null

    const userMessage: UserMessage = { role: "user", content }

    let updatedChat: AgentChat = chat ?? { title: "", messages: [] }
    updatedChat = {
      ...updatedChat,
      messages: [...updatedChat.messages, userMessage],
    }

    chat = updatedChat
    await scrollToBottom()

    inputValue = ""
    loading = true

    let streamingContent = ""
    let isToolCall = false
    let toolCallInfo = ""

    try {
      await API.agentChatStream(
        updatedChat,
        workspaceId,
        chunk => {
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
            if (lastMessage?.role === "assistant" && !lastMessage.component) {
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
            scrollToBottom()
            return
          }

          if (chunk.type === "error") {
            errorMessage = chunk.content || "An error occurred"
            loading = false
          }
        },
        error => {
          console.error("Agent chat stream error", error)
          errorMessage = error.message
          loading = false
        }
      )
    } catch (err: any) {
      console.error(err)
      errorMessage = err?.message || "Failed to send message"
    } finally {
      loading = false
      await scrollToBottom()
    }
  }
</script>

<section class="agent-chat">
  {#if intro}
    <p class="agent-chat__intro">{intro}</p>
  {/if}
  <div class="chat-wrapper">
    <div class="chat-area" bind:this={chatContainer}>
      <AgentChatbox
        {chat}
        {loading}
        on:interaction={e => sendMessage(e.detail?.label)}
      />
      <div class="input-wrapper">
        {#if errorMessage}
          <InlineAlert type="negative" message={errorMessage} />
        {/if}
        <textarea
          class="chat-input spectrum-Textfield-input"
          bind:value={inputValue}
          {placeholder}
          rows={3}
          on:keydown={handleKeyDown}
          disabled={loading}
        />
        <Button
          primary
          on:click={() => sendMessage()}
          disabled={loading || !inputValue.trim()}
        >
          {sendButtonLabel}
        </Button>
      </div>
    </div>
  </div>
</section>

<style>
  .agent-chat {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m, 16px);
    width: 100%;
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
  }

  .chat-area {
    display: flex;
    flex-direction: column;
    gap: 24px;
    overflow-y: auto;
    max-height: 520px;
    width: min(640px, 100%);
    margin: 0 auto;
    flex: 1 1 auto;
  }

  .input-wrapper {
    position: sticky;
    bottom: 0;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s, 12px);
    padding-bottom: 32px;
  }

  .input-wrapper :global(.spectrum-InLineAlert) {
    margin-bottom: 4px;
  }

  .chat-input {
    width: 100%;
    min-height: 120px;
    resize: none;
    padding: 20px;
    font-size: 16px;
    background-color: var(--grey-3, #f5f5f5);
    color: var(--grey-9, #424242);
    border-radius: 16px;
    border: none;
    outline: none;
  }

  .chat-input::placeholder {
    color: var(--spectrum-global-color-gray-600);
  }
</style>
