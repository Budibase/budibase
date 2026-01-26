<script lang="ts">
  import {
    MarkdownViewer,
    notifications,
    Icon,
    ProgressCircle,
    Body,
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

  const groupConsecutiveToolParts = (
    parts: UIMessage<AgentMessageMetadata>["parts"]
  ) => {
    if (!parts) return []
    type GroupedPart =
      | { type: "text"; part: Parameters<typeof isTextUIPart>[0] }
      | { type: "reasoning"; part: Parameters<typeof isReasoningUIPart>[0] }
      | {
          type: "tools"
          parts: Array<{
            part: Parameters<typeof isToolUIPart>[0]
            index: number
          }>
        }
    const grouped: GroupedPart[] = []
    let currentToolGroup: Array<{
      part: Parameters<typeof isToolUIPart>[0]
      index: number
    }> | null = null

    parts.forEach((part, index) => {
      if (isToolUIPart(part)) {
        if (!currentToolGroup) {
          currentToolGroup = []
        }
        currentToolGroup.push({ part, index })
      } else {
        if (currentToolGroup) {
          grouped.push({ type: "tools", parts: currentToolGroup })
          currentToolGroup = null
        }
        if (isTextUIPart(part)) {
          grouped.push({ type: "text", part })
        } else if (isReasoningUIPart(part)) {
          grouped.push({ type: "reasoning", part })
        }
      }
    })

    if (currentToolGroup) {
      grouped.push({ type: "tools", parts: currentToolGroup })
    }

    return grouped
  }

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
    {#if messages.length === 0 && !isBusy}
      <div class="empty-state">
        <div class="empty-state-icon">
          <Icon
            name="chat-circle"
            size="L"
            weight="fill"
            color="var(--spectrum-global-color-gray-500)"
          />
        </div>
        <Body size="S" color="var(--spectrum-global-color-gray-700)">
          Your conversation will appear here.
        </Body>
      </div>
    {/if}
    {#each messages as message (message.id)}
      {#if message.role === "user"}
        <div class="message user">
          <MarkdownViewer value={getUserMessageText(message)} />
        </div>
      {:else if message.role === "assistant"}
        <div class="message assistant">
          <svelte:fragment>
            {@const groupedParts = groupConsecutiveToolParts(message.parts)}
            {#each groupedParts as group}
            {#if group.type === "text"}
              <MarkdownViewer value={group.part.text} />
            {:else if group.type === "reasoning"}
              <div class="reasoning-part">
                <div class="reasoning-label">Reasoning</div>
                <div class="reasoning-content">{group.part.text}</div>
              </div>
            {:else if group.type === "tools"}
              <div class="tool-part-wrapper">
                {#each group.parts as { part, index: partIndex }}
                  {@const toolId = `${message.id}-${getToolName(part)}-${partIndex}`}
                  {@const isRunning =
                    part.state === "input-streaming" ||
                    part.state === "input-available"}
                  {@const isSuccess = part.state === "output-available"}
                  {@const isError = part.state === "output-error"}
                  <div class="tool-part" class:tool-running={isRunning}>
                <button
                  class="tool-header"
                  class:tool-header-expanded={expandedTools[toolId]}
                  type="button"
                  onclick={() => toggleTool(toolId)}
                >
                  <span
                    class="tool-chevron"
                    class:expanded={expandedTools[toolId]}
                  >
                    <span class="tool-chevron-icon tool-chevron-icon-default">
                      <Icon
                        name="globe-simple"
                        size="M"
                        weight="regular"
                        color="var(--spectrum-global-color-gray-600)"
                      />
                    </span>
                    <span class="tool-chevron-icon tool-chevron-icon-expanded">
                      <Icon
                        name="minus"
                        size="M"
                        weight="regular"
                        color="var(--spectrum-global-color-gray-600)"
                      />
                    </span>
                  </span>
                  <span class="tool-call-label">Tool call</span>
                  <div class="tool-name-wrapper">
                    <span class="tool-name">{getToolName(part)}</span>
                  </div>
                  {#if isRunning || isError}
                    <span class="tool-status">
                      {#if isRunning}
                        <ProgressCircle size="S" />
                      {:else if isError}
                        <Icon
                          name="x"
                          size="S"
                          color="var(--spectrum-global-color-red-600)"
                        />
                      {/if}
                    </span>
                  {/if}
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
                {/each}
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
          </svelte:fragment>
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
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    min-height: 0;
  }
  .chatbox {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
    flex: 1 1 auto;
    padding: 48px 0 24px 0;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex: 1 1 auto;
    min-height: 0;
    width: 100%;
  }

  .empty-state-icon {
    --size: 24px;
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
    border-radius: 8px;
    align-self: flex-end;
    background-color: #215f9e33;
    font-size: 14px;
    color: var(--spectrum-global-color-gray-800);
  }

  .message.assistant {
    align-self: flex-start;
    background-color: transparent;
    border: none;
    padding: 0;
    font-size: 14px;
    color: var(--spectrum-global-color-gray-800);
    line-height: 1.4;
    max-width: 100%;
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
    flex-shrink: 0;
    line-height: 1.4;
  }

  .input {
    width: 100%;
    height: 100px;
    top: 0;
    resize: none;
    padding: 20px;
    font-size: 16px;
    background-color: var(--spectrum-global-color-gray-200);
    color: var(--grey-9);
    border-radius: 10px;
    border: 1px solid var(--spectrum-global-color-gray-300) !important;
    outline: none;
    min-height: 100px;
  }

  .input:focus {
    border: 1px solid #215f9e33 !important;
  }

  .input::placeholder {
    color: var(--spectrum-global-color-gray-600);
  }

  /* Style the markdown tool sections in assistant messages */
  :global(.assistant strong) {
    color: var(--spectrum-global-color-gray-900);
    font-weight: 500;
  }

  :global(.assistant .markdown-viewer p) {
    margin-top: 8px;
    margin-bottom: 8px;
  }

  :global(.assistant .markdown-viewer p:first-child) {
    margin-top: 0;
  }

  :global(.assistant .markdown-viewer p:last-child) {
    margin-bottom: 0;
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

  :global(.assistant ul) {
    padding-inline-start: 20px;
  }

  /* Tool parts styling */
  .tool-part-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .tool-part {
    position: relative;
    margin-top: var(--spacing-l);
    margin-bottom: 0;
  }

  .tool-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0;
    margin: 0;
    background: none;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    text-align: left;
  }

  .tool-header:hover {
    background-color: var(--spectrum-global-color-gray-100);
  }

  .tool-chevron {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.15s ease;
    color: var(--spectrum-global-color-gray-600);
  }

  .tool-chevron :global(i) {
    --size: 16px !important;
  }

  .tool-chevron-icon-expanded :global(i) {
    --size: 16px !important;
  }

  .tool-chevron-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tool-chevron-icon-expanded {
    display: none;
  }

  .tool-header-expanded .tool-chevron-icon-default {
    display: none !important;
  }

  .tool-header-expanded .tool-chevron-icon-expanded {
    display: flex !important;
  }

  .tool-chevron.expanded {
    transform: rotate(90deg);
  }

  .tool-header-expanded .tool-chevron {
    transform: none;
  }

  .tool-call-label {
    font-size: 14px;
    color: var(--spectrum-global-color-gray-900);
  }

  .tool-name-wrapper {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    padding: 3px 6px;
    background-color: var(--spectrum-global-color-gray-200);
    border-radius: 4px;
  }

  .tool-name {
    font-family: var(--font-mono), monospace;
    font-size: 13px;
    color: var(--spectrum-global-color-gray-800);
    font-weight: 400;
  }

  .tool-status {
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tool-details {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: var(--spacing-m);
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
    background: var(--background);
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 6px;
    padding: var(--spacing-m);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    z-index: 1;
    overflow-x: hidden;
    min-width: 0;
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
    white-space: pre-wrap;
    word-break: break-word;
    overflow-wrap: break-word;
    margin: 0;
    max-height: 200px;
    overflow-y: auto;
    overflow-x: hidden;
    min-width: 0;
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
