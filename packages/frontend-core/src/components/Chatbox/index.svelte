<script lang="ts">
  import { MarkdownViewer, notifications } from "@budibase/bbui"
  import type {
    ChatConversation,
    DraftChatConversation,
    AgentMessageMetadata,
  } from "@budibase/types"
  import { Header } from "@budibase/shared-core"
  import BBAI from "../../icons/BBAI.svelte"
  import { tick, onMount, onDestroy, createEventDispatcher } from "svelte"
  import { createAPIClient } from "@budibase/frontend-core"
  import { Chat } from "@ai-sdk/svelte"
  import {
    DefaultChatTransport,
    isToolUIPart,
    isReasoningUIPart,
    getToolName,
    type UIMessage,
  } from "ai"

  export let workspaceId: string
  export let API = createAPIClient({
    attachHeaders: headers => {
      if (workspaceId) {
        headers[Header.APP_ID] = workspaceId
      }
    },
  })

  type ChatConversationLike = ChatConversation | DraftChatConversation

  export let chat: ChatConversationLike
  export let loading: boolean = false
  export let persistConversation: boolean = true

  const dispatch = createEventDispatcher<{
    chatSaved: { chatId?: string; chat: ChatConversationLike }
  }>()

  let chatAreaElement: HTMLDivElement
  let observer: MutationObserver
  let textareaElement: HTMLTextAreaElement
  let expandedTools: Record<string, boolean> = {}
  let inputValue = ""

  let resolvedChatAppId: string | undefined
  let resolvedConversationId: string | undefined

  const getApiUrl = () => {
    const chatAppId = resolvedChatAppId || chat?.chatAppId
    const conversationId = resolvedConversationId || chat?._id || "new"
    return `/api/chatapps/${chatAppId}/conversations/${conversationId}/stream`
  }

  const getBody = () => ({
    _id: resolvedConversationId || chat?._id,
    chatAppId: resolvedChatAppId || chat?.chatAppId,
    agentId: chat?.agentId,
    transient: !persistConversation,
    title: chat?.title,
  })

  // Create the Chat instance with transport
  const chatInstance = new Chat<UIMessage<AgentMessageMetadata>>({
    transport: new DefaultChatTransport({
      api: "/api/chat", // Default, will be overridden by prepareSendMessagesRequest
      headers: () => ({
        [Header.APP_ID]: workspaceId,
      }),
      body: () => getBody(),
      prepareSendMessagesRequest: ({ messages, body: existingBody }) => {
        return {
          api: getApiUrl(),
          body: {
            ...existingBody,
            ...getBody(),
            messages,
          },
        }
      },
    }),
    messages: chat?.messages || [],
    onFinish: async () => {
      loading = false

      if (persistConversation && !chat._id && chat.chatAppId) {
        try {
          const history = await API.fetchChatHistory(chat.chatAppId)
          const messages = chatInstance.messages
          const lastMessageId = messages[messages.length - 1]?.id
          const savedConversation =
            history?.find(convo =>
              convo.messages.some(message => message.id === lastMessageId)
            ) || history?.[0]

          if (savedConversation) {
            chat = {
              ...chat,
              ...savedConversation,
            }
            resolvedConversationId = savedConversation._id
          }
        } catch (historyError) {
          console.error(historyError)
        }
      }

      chat = {
        ...chat,
        messages: chatInstance.messages,
      }

      dispatch("chatSaved", { chatId: chat._id, chat })

      await tick()
      textareaElement?.focus()
    },
    onError: error => {
      console.error(error)
      notifications.error(error.message || "Failed to send message")
      loading = false
    },
  })

  const ensureChatApp = async (): Promise<string | undefined> => {
    if (chat?.chatAppId) {
      resolvedChatAppId = chat.chatAppId
      return chat.chatAppId
    }
    try {
      const chatApp = await API.fetchChatApp(workspaceId)
      if (chatApp?._id) {
        const baseChat = chat || {
          title: "",
          messages: [],
          chatAppId: "",
          agentId: "",
        }
        const fallbackAgentId = chatApp.enabledAgents?.[0]?.agentId
        chat = {
          ...baseChat,
          chatAppId: chatApp._id,
          ...(fallbackAgentId && !baseChat.agentId
            ? { agentId: fallbackAgentId }
            : {}),
        }
        resolvedChatAppId = chatApp._id
        return chatApp._id
      }
    } catch (err) {
      console.error(err)
    }
    return undefined
  }

  $: messages = chatInstance.messages
  $: isStreaming = chatInstance.status === "streaming"
  $: showLoading = loading || isStreaming

  async function scrollToBottom() {
    await tick()
    if (chatAreaElement) {
      chatAreaElement.scrollTop = chatAreaElement.scrollHeight
    }
  }

  $: if (messages?.length) {
    scrollToBottom()
  }

  async function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      await sendMessage()
    }
  }

  async function sendMessage() {
    const chatAppIdFromEnsure = await ensureChatApp()

    if (!chat) {
      chat = { title: "", messages: [], chatAppId: "", agentId: "" }
    }

    const chatAppId = chat.chatAppId || chatAppIdFromEnsure
    const agentId = chat.agentId

    if (!chatAppId) {
      notifications.error("Chat app could not be created")
      return
    }

    if (!agentId) {
      notifications.error("Agent is required to start a chat")
      return
    }

    resolvedChatAppId = chatAppId

    if (
      persistConversation &&
      !chat._id &&
      (!chat.messages || chat.messages.length === 0)
    ) {
      try {
        const newChat = await API.createChatConversation(
          {
            chatAppId,
            agentId,
            title: chat.title,
          },
          workspaceId
        )

        chat = {
          ...chat,
          ...newChat,
          chatAppId,
        }
        resolvedConversationId = newChat._id
      } catch (err: any) {
        console.error(err)
        notifications.error(
          err?.message || "Could not start a new chat conversation"
        )
        return
      }
    } else if (chat._id) {
      resolvedConversationId = chat._id
    }

    const text = inputValue.trim()
    if (!text) return

    inputValue = ""
    loading = true

    chatInstance.sendMessage({ text })
  }

  onMount(async () => {
    if (chat?._id) {
      resolvedConversationId = chat._id
    }
    await ensureChatApp()

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
    textareaElement?.focus()
  })

  onDestroy(() => {
    observer?.disconnect()
  })
</script>

<div class="chat-area" bind:this={chatAreaElement}>
  <div class="chatbox">
    {#each messages as message (message.id)}
      {#if message.role === "user"}
        <div class="message user">
          <MarkdownViewer
            value={message.parts && message.parts.length > 0
              ? message.parts
                  .filter(part => part.type === "text")
                  .map(part => (part.type === "text" ? part.text : ""))
                  .join("")
              : "[Empty message]"}
          />
        </div>
      {:else if message.role === "assistant"}
        <div class="message assistant">
          {#each message.parts || [] as part, partIndex (partIndex)}
            {#if part.type === "text"}
              <MarkdownViewer value={part.text || ""} />
            {:else if isReasoningUIPart(part)}
              <div class="reasoning-part">
                <div class="reasoning-label">Reasoning</div>
                <div class="reasoning-content">{part.text || ""}</div>
              </div>
            {:else if isToolUIPart(part)}
              {@const toolId = `${message.id}-${getToolName(part)}-${partIndex}`}
              <div class="tool-part">
                <button
                  class="tool-header"
                  type="button"
                  on:click={() => {
                    expandedTools[toolId] = !expandedTools[toolId]
                  }}
                >
                  <span
                    class="tool-chevron"
                    class:expanded={expandedTools[toolId]}>▶</span
                  >
                  <span class="tool-icon">🔧</span>
                  <span class="tool-name">{getToolName(part)}</span>
                  {#if part.state === "output-available"}
                    <span class="tool-status success">✓</span>
                  {:else if part.state === "output-error"}
                    <span class="tool-status error">✗</span>
                  {:else if part.state === "input-streaming" || part.state === "input-available"}
                    <span class="tool-status pending">...</span>
                  {/if}
                </button>
                {#if expandedTools[toolId] && part.state === "output-available" && part.output}
                  <div class="tool-output">
                    <div class="tool-output-label">Output:</div>
                    <pre class="tool-output-content">{typeof part.output ===
                      "string"
                        ? part.output
                        : JSON.stringify(part.output, null, 2)}</pre>
                  </div>
                {/if}
              </div>
            {/if}
          {/each}
          {#if message.metadata?.ragSources?.length}
            <div class="sources">
              <div class="sources-title">Sources</div>
              <ul>
                {#each message.metadata.ragSources as source (source.sourceId)}
                  <li class="source-item">
                    <span class="source-name"
                      >{source.filename || source.sourceId}</span
                    >
                    {#if source.chunkCount > 0}
                      <span class="source-count"
                        >({source.chunkCount} chunk{source.chunkCount === 1
                          ? ""
                          : "s"})</span
                      >
                    {/if}
                  </li>
                {/each}
              </ul>
            </div>
          {/if}
        </div>
      {/if}
    {/each}
    {#if showLoading}
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
      disabled={showLoading}
    ></textarea>
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
    width: 100%;
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
    width: 100%;
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

  /* Tool parts styling */
  .tool-part {
    margin: var(--spacing-m) 0;
    padding: var(--spacing-m);
    background-color: var(--grey-2);
    border: 1px solid var(--grey-3);
    border-radius: 8px;
  }

  .tool-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    width: 100%;
    padding: 0;
    margin: 0;
    background: none;
    border: none;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    text-align: left;
  }

  .tool-header:hover {
    opacity: 0.8;
  }

  .tool-chevron {
    font-size: 10px;
    transition: transform 0.15s ease;
    color: var(--spectrum-global-color-gray-600);
  }

  .tool-chevron.expanded {
    transform: rotate(90deg);
  }

  .tool-icon {
    font-size: 16px;
  }

  .tool-name {
    color: var(--spectrum-global-color-gray-900);
    font-family: var(--font-mono), monospace;
  }

  .tool-status {
    margin-left: auto;
    font-size: 12px;
  }

  .tool-status.success {
    color: var(--spectrum-global-color-green-600);
  }

  .tool-status.error {
    color: var(--spectrum-global-color-red-600);
  }

  .tool-status.pending {
    color: var(--spectrum-global-color-gray-600);
  }

  .tool-output {
    margin-top: var(--spacing-s);
  }

  .tool-output-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-600);
    margin-bottom: var(--spacing-xs);
    text-transform: uppercase;
  }

  .tool-output-content {
    background-color: var(--background);
    border: 1px solid var(--grey-3);
    border-radius: 4px;
    padding: var(--spacing-s);
    font-size: 12px;
    font-family: var(--font-mono), monospace;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
    margin: 0;
  }

  /* Reasoning parts styling */
  .reasoning-part {
    margin: var(--spacing-m) 0;
    padding: var(--spacing-m);
    background-color: var(--grey-1);
    border-left: 3px solid var(--spectrum-global-color-static-seafoam-700);
    border-radius: 4px;
  }

  .reasoning-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--spectrum-global-color-static-seafoam-700);
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .reasoning-content {
    font-size: 13px;
    color: var(--spectrum-global-color-gray-800);
    font-style: italic;
  }

  .sources {
    margin-top: var(--spacing-m);
    padding-top: var(--spacing-s);
    border-top: 1px solid var(--grey-3);
  }

  .sources-title {
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--spectrum-global-color-gray-600);
    margin-bottom: var(--spacing-xs);
  }

  .sources ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .source-item {
    display: flex;
    gap: 8px;
    font-size: 14px;
    color: var(--spectrum-global-color-gray-900);
  }

  .source-name {
    font-weight: 500;
  }

  .source-count {
    color: var(--spectrum-global-color-gray-600);
  }
</style>
