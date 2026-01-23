<script lang="ts">
  import {
    MarkdownViewer,
    notifications,
    Icon,
    ProgressCircle,
  } from "@budibase/bbui"
  import type {
    ChatConversation,
    DraftChatConversation,
    AgentMessageMetadata,
  } from "@budibase/types"
  import { Header } from "@budibase/shared-core"
  import BBAI from "../../icons/BBAI.svelte"
  import { tick } from "svelte"
  import { createAPIClient } from "@budibase/frontend-core"
  import { Chat } from "@ai-sdk/svelte"
  import {
    DefaultChatTransport,
    isTextUIPart,
    isToolUIPart,
    isReasoningUIPart,
    getToolName,
    type UIMessage,
  } from "ai"

  type ChatConversationLike = ChatConversation | DraftChatConversation

  interface Props {
    workspaceId: string
    chat: ChatConversationLike
    persistConversation?: boolean
    onchatsaved?: (_event: {
      detail: { chatId?: string; chat: ChatConversationLike }
    }) => void
  }

  let {
    workspaceId,
    chat = $bindable(),
    persistConversation = true,
    onchatsaved,
  }: Props = $props()

  let API = $state(
    createAPIClient({
      attachHeaders: headers => {
        if (workspaceId) {
          headers[Header.APP_ID] = workspaceId
        }
      },
    })
  )

  let chatAreaElement = $state<HTMLDivElement>()
  let textareaElement = $state<HTMLTextAreaElement>()
  let expandedTools = $state<Record<string, boolean>>({})
  let inputValue = $state("")

  let resolvedChatAppId = $state<string | undefined>()
  let resolvedConversationId = $state<string | undefined>()

  const chatInstance = new Chat<UIMessage<AgentMessageMetadata>>({
    transport: new DefaultChatTransport({
      headers: () => ({ [Header.APP_ID]: workspaceId }),
      prepareSendMessagesRequest: ({ messages }) => {
        const chatAppId = resolvedChatAppId || chat?.chatAppId
        const conversationId = resolvedConversationId || chat?._id || "new"
        return {
          api: `/api/chatapps/${chatAppId}/conversations/${conversationId}/stream`,
          body: {
            _id: resolvedConversationId || chat?._id,
            chatAppId,
            agentId: chat?.agentId,
            transient: !persistConversation,
            title: chat?.title,
            messages,
          },
        }
      },
    }),
    messages: chat?.messages || [],
    onFinish: async () => {
      if (persistConversation && !chat._id && chat.chatAppId) {
        try {
          const history = await API.fetchChatHistory(chat.chatAppId)
          const msgs = chatInstance.messages
          const lastMessageId = msgs[msgs.length - 1]?.id
          const savedConversation =
            history?.find(convo =>
              convo.messages.some(message => message.id === lastMessageId)
            ) || history?.[0]

          if (savedConversation) {
            chat = { ...chat, ...savedConversation }
            resolvedConversationId = savedConversation._id
          }
        } catch (historyError) {
          console.error(historyError)
        }
      }

      chat = { ...chat, messages: chatInstance.messages }
      onchatsaved?.({ detail: { chatId: chat._id, chat } })

      await tick()
      textareaElement?.focus()
    },
    onError: error => {
      console.error(error)
      notifications.error(error.message || "Failed to send message")
    },
  })

  let messages = $derived(chatInstance.messages)
  let isBusy = $derived(
    chatInstance.status === "streaming" || chatInstance.status === "submitted"
  )

  let lastChatId = $state<string | undefined>(chat?._id)
  $effect(() => {
    if (chat?._id !== lastChatId) {
      lastChatId = chat?._id
      chatInstance.messages = chat?.messages || []
      expandedTools = {}
    }
  })

  const scrollToBottom = async () => {
    await tick()
    if (chatAreaElement) {
      chatAreaElement.scrollTop = chatAreaElement.scrollHeight
    }
  }

  $effect(() => {
    if (messages?.length) {
      scrollToBottom()
    }
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

  const handleKeyDown = async (event: KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      await sendMessage()
    }
  }

  const sendMessage = async () => {
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
          { chatAppId, agentId, title: chat.title },
          workspaceId
        )
        chat = { ...chat, ...newChat, chatAppId }
        resolvedConversationId = newChat._id
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Could not start a new chat conversation"
        console.error(err)
        notifications.error(errorMessage)
        return
      }
    } else if (chat._id) {
      resolvedConversationId = chat._id
    }

    const text = inputValue.trim()
    if (!text) return

    inputValue = ""
    chatInstance.sendMessage({ text })
  }

  const toggleTool = (toolId: string) => {
    expandedTools = { ...expandedTools, [toolId]: !expandedTools[toolId] }
  }

  const formatToolOutput = (output: unknown): string =>
    typeof output === "string" ? output : JSON.stringify(output, null, 2)

  const getUserMessageText = (
    message: UIMessage<AgentMessageMetadata>
  ): string =>
    message.parts
      ?.filter(isTextUIPart)
      .map(p => p.text)
      .join("") || "[Empty message]"

  let mounted = $state(false)

  $effect(() => {
    const currentChatId = chat?._id
    if (currentChatId) {
      resolvedConversationId = currentChatId
    }
  })

  $effect(() => {
    if (!mounted) {
      mounted = true
      ensureChatApp()
      tick().then(() => {
        textareaElement?.focus()
      })
    }
  })

  $effect(() => {
    if (!chatAreaElement) return

    const obs = new MutationObserver(scrollToBottom)
    obs.observe(chatAreaElement, {
      childList: true,
      subtree: true,
      attributes: true,
    })

    return () => {
      obs.disconnect()
    }
  })
</script>

<div class="chat-area" bind:this={chatAreaElement}>
  <div class="chatbox">
    {#each messages as message (message.id)}
      {#if message.role === "user"}
        <div class="message user">
          <MarkdownViewer value={getUserMessageText(message)} />
        </div>
      {:else if message.role === "assistant"}
        <div class="message assistant">
          {#each message.parts || [] as part, partIndex (partIndex)}
            {#if isTextUIPart(part)}
              <MarkdownViewer value={part.text} />
            {:else if isReasoningUIPart(part)}
              <div class="reasoning-part">
                <div class="reasoning-label">Reasoning</div>
                <div class="reasoning-content">{part.text}</div>
              </div>
            {:else if isToolUIPart(part)}
              {@const toolId = `${message.id}-${getToolName(part)}-${partIndex}`}
              {@const isRunning =
                part.state === "input-streaming" ||
                part.state === "input-available"}
              {@const isSuccess = part.state === "output-available"}
              {@const isError = part.state === "output-error"}
              <div class="tool-part" class:tool-running={isRunning}>
                <button
                  class="tool-header"
                  type="button"
                  onclick={() => toggleTool(toolId)}
                >
                  <span
                    class="tool-chevron"
                    class:expanded={expandedTools[toolId]}
                  >
                    <Icon name="caret-right" size="XS" />
                  </span>
                  <span class="tool-icon">
                    <Icon name="wrench" size="S" />
                  </span>
                  <span class="tool-name">{getToolName(part)}</span>
                  <span class="tool-status">
                    {#if isRunning}
                      <ProgressCircle size="S" />
                    {:else if isSuccess}
                      <Icon
                        name="check"
                        size="S"
                        color="var(--spectrum-global-color-green-600)"
                      />
                    {:else if isError}
                      <Icon
                        name="x"
                        size="S"
                        color="var(--spectrum-global-color-red-600)"
                      />
                    {/if}
                  </span>
                </button>
                {#if expandedTools[toolId]}
                  <div class="tool-details">
                    {#if part.input}
                      <div class="tool-section">
                        <div class="tool-section-label">Input</div>
                        <pre class="tool-section-content">{formatToolOutput(
                            part.input
                          )}</pre>
                      </div>
                    {/if}
                    {#if isSuccess && part.output}
                      <div class="tool-section">
                        <div class="tool-section-label">Output</div>
                        <pre class="tool-section-content">{formatToolOutput(
                            part.output
                          )}</pre>
                      </div>
                    {:else if isError && part.errorText}
                      <div class="tool-section tool-error">
                        <div class="tool-section-label">Error</div>
                        <pre
                          class="tool-section-content error-content">{part.errorText}</pre>
                      </div>
                    {/if}
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
    {#if isBusy}
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
      onkeydown={handleKeyDown}
      placeholder="Ask anything"
      disabled={isBusy}
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
    transition: border-color 0.2s ease;
  }

  .tool-part.tool-running {
    border-color: var(--spectrum-global-color-static-seafoam-600);
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
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.15s ease;
    color: var(--spectrum-global-color-gray-600);
  }

  .tool-chevron.expanded {
    transform: rotate(90deg);
  }

  .tool-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--spectrum-global-color-static-seafoam-700);
  }

  .tool-name {
    color: var(--spectrum-global-color-gray-900);
    font-family: var(--font-mono), monospace;
  }

  .tool-status {
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tool-details {
    margin-top: var(--spacing-m);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .tool-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .tool-section-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--spectrum-global-color-gray-600);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .tool-section-content {
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
    max-height: 200px;
    overflow-y: auto;
  }

  .tool-error .tool-section-label {
    color: var(--spectrum-global-color-red-600);
  }

  .error-content {
    border-color: var(--spectrum-global-color-red-400);
    color: var(--spectrum-global-color-red-700);
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
