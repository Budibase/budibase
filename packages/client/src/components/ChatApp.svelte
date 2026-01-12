<script lang="ts">
  import {
    NotificationDisplay,
    Heading,
    Body,
    Button,
    Icon,
    ProgressCircle,
    notifications,
  } from "@budibase/bbui"
  import { Chatbox, createAPIClient } from "@budibase/frontend-core"
  import type {
    ChatConversation,
    ChatConversationRequest,
  } from "@budibase/types"
  import { Header } from "@budibase/shared-core"
  import "@/stores/styles"
  import { appStore } from "@/stores"

  type ChatConversationLike = ChatConversation | ChatConversationRequest

  const INITIAL_CHAT: Omit<ChatConversationRequest, "_id" | "_rev"> = {
    title: "",
    messages: [],
    chatAppId: "",
  }
  const NO_MESSAGES_TEXT = "No messages"
  const NO_PREVIEW_TEXT = "No preview available"

  let chat: ChatConversationLike = { ...INITIAL_CHAT }
  let conversations: ChatConversation[] = []
  let chatAppId = ""
  let currentConversationId: string | undefined
  let loading = false
  let deletingChat = false
  let loadingConversations = false
  let lastWorkspaceId = ""
  let workspaceId = ""
  let appName = "Chat"

  $: workspaceId = $appStore?.appId ?? ""
  $: appName = $appStore?.application?.name || "Chat"

  const chatAPI = createAPIClient({
    attachHeaders: headers => {
      if (workspaceId) {
        headers[Header.APP_ID] = workspaceId
      }
    },
  })

  const resetState = () => {
    conversations = []
    chatAppId = ""
    currentConversationId = undefined
    chat = { ...INITIAL_CHAT }
    loading = false
    deletingChat = false
    loadingConversations = false
  }

  const initChat = async () => {
    if (!workspaceId || loadingConversations) {
      return
    }

    loadingConversations = true

    try {
      const chatApp = await chatAPI.fetchChatApp(workspaceId)
      if (!chatApp?._id) {
        resetState()
        return
      }

      chatAppId = chatApp._id
      chat = { ...INITIAL_CHAT, chatAppId }

      const history = await chatAPI.fetchChatHistory(chatAppId)
      conversations = history

      if (history.length) {
        const [initialChat] = history
        chat = {
          ...initialChat,
          chatAppId: initialChat.chatAppId || chatAppId,
        }
        currentConversationId = initialChat._id
      } else {
        currentConversationId = undefined
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load chat history"
      notifications.error(message)
    } finally {
      loadingConversations = false
    }
  }

  const fetchConversations = async () => {
    if (!chatAppId) {
      conversations = []
      return []
    }
    const history = await chatAPI.fetchChatHistory(chatAppId)
    conversations = history
    return history
  }

  const selectChat = (selectedChat: ChatConversation) => {
    chat = {
      ...selectedChat,
      chatAppId: selectedChat.chatAppId || chatAppId,
    }
    currentConversationId = selectedChat._id
  }

  const startNewChat = async () => {
    if (loadingConversations) {
      return
    }
    if (!chatAppId) {
      await initChat()
    }
    if (!chatAppId) {
      return
    }
    chat = { ...INITIAL_CHAT, chatAppId }
    currentConversationId = undefined
  }

  const deleteCurrentChat = async () => {
    if (!chatAppId || !chat?._id || deletingChat) {
      return
    }

    deletingChat = true

    try {
      await chatAPI.deleteChatConversation(chat._id, chatAppId)
      const remainingConversations = await fetchConversations()
      if (remainingConversations.length) {
        const [nextChat] = remainingConversations
        chat = {
          ...nextChat,
          chatAppId: nextChat.chatAppId || chatAppId,
        }
        currentConversationId = nextChat._id
      } else {
        chat = { ...INITIAL_CHAT, chatAppId }
        currentConversationId = undefined
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete chat"
      notifications.error(message)
    } finally {
      deletingChat = false
    }
  }

  const getChatPreview = (chat: ChatConversationLike): string => {
    const messageCount = chat.messages.length
    if (!messageCount) {
      return NO_MESSAGES_TEXT
    }

    const lastMessage = chat.messages[messageCount - 1]?.parts || []
    const msg = lastMessage.some(part => part.type === "text")
      ? lastMessage
          .filter(part => part.type === "text")
          .map(part => part.text)
          .join("")
      : NO_PREVIEW_TEXT
    return typeof msg === "string" ? msg : NO_PREVIEW_TEXT
  }

  const handleChatSaved = async (
    event: CustomEvent<{ chatId?: string; chat: ChatConversationLike }>
  ) => {
    const { chatId, chat: savedChat } = event.detail
    if (!chatAppId) {
      return
    }

    try {
      const updatedConversations = await fetchConversations()
      const lastMessageId =
        savedChat.messages[savedChat.messages.length - 1]?.id

      const newCurrentChat =
        updatedConversations.find(
          conversation => conversation._id === chatId
        ) ||
        (lastMessageId
          ? updatedConversations.find(conversation =>
              conversation.messages?.some(
                message => message.id === lastMessageId
              )
            )
          : undefined)

      if (!newCurrentChat?._id) {
        return
      }

      chat = {
        ...newCurrentChat,
        chatAppId: newCurrentChat.chatAppId || chatAppId,
      }
      currentConversationId = newCurrentChat._id
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to refresh chat history"
      notifications.error(message)
    }
  }

  $: {
    if (!workspaceId) {
      resetState()
    } else if (workspaceId !== lastWorkspaceId) {
      lastWorkspaceId = workspaceId
      initChat()
    }
  }
</script>

<div class="chat-app">
  <div class="modal-container"></div>
  <div class="chat-app__header">
    <Heading size="M">{appName}</Heading>
    <Body size="S" color="var(--spectrum-global-color-gray-700)">
      Ask our assistant anything about this app.
    </Body>
  </div>

  <div class="chat-app__content">
    <aside class="chat-app__sidebar">
      <div class="chat-app__sidebar-header">
        <Heading size="S">Chats</Heading>
        <Button
          quiet
          on:click={startNewChat}
          disabled={!chatAppId || loadingConversations}
        >
          <span class="chat-app__sidebar-action">
            <Icon name="plus" size="S" />
            New chat
          </span>
        </Button>
      </div>

      {#if loadingConversations}
        <div class="chat-app__loading">
          <ProgressCircle size="S" />
          <Body size="S">Loading chats...</Body>
        </div>
      {:else}
        <div class="chat-app__list">
          {#each conversations as conversation (conversation._id)}
            <button
              type="button"
              class="chat-app__item"
              class:selected={currentConversationId === conversation._id}
              on:click={() => selectChat(conversation)}
            >
              <div class="chat-app__item-title">
                {conversation.title || "Untitled Chat"}
              </div>
              <div class="chat-app__item-preview">
                {getChatPreview(conversation)}
              </div>
            </button>
          {/each}
          {#if !conversations.length}
            <div class="chat-app__empty">
              <Body size="S">
                No chat history yet.<br />
                Start a new conversation!
              </Body>
            </div>
          {/if}
        </div>
      {/if}
    </aside>

    <div class="chat-app__main">
      {#if chat?._id}
        <div class="chat-app__actions">
          <Button
            quiet
            warning
            disabled={deletingChat || loading}
            on:click={deleteCurrentChat}
          >
            <span class="chat-app__delete">
              {#if deletingChat}
                <ProgressCircle size="S" />
                Deleting...
              {:else}
                <Icon name="trash" size="S" />
                Delete chat
              {/if}
            </span>
          </Button>
        </div>
      {/if}

      <div class="chat-app__chat">
        {#if workspaceId && chatAppId}
          <Chatbox
            bind:chat
            bind:loading
            {workspaceId}
            on:chatSaved={handleChatSaved}
          />
        {:else if loadingConversations}
          <div class="chat-app__loading">
            <ProgressCircle size="S" />
            <Body size="S">Loading chat...</Body>
          </div>
        {:else}
          <div class="chat-app__empty">
            <Body size="S">Chat app unavailable.</Body>
          </div>
        {/if}
      </div>
    </div>
  </div>

  <NotificationDisplay />
</div>

<style>
  .chat-app {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    width: 100%;
    height: 100%;
    min-height: 100vh;
    background: var(--spectrum-alias-background-color-default);
  }

  .chat-app__header {
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    padding: var(--spacing-xl) var(--spacing-xl) var(--spacing-m);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    text-align: center;
  }

  .chat-app__content {
    flex: 1 1 auto;
    display: flex;
    min-height: 0;
    width: 100%;
  }

  .chat-app__sidebar {
    width: 280px;
    min-width: 220px;
    max-width: 320px;
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--spectrum-global-color-gray-200);
    background: var(--spectrum-alias-background-color-default);
    min-height: 0;
  }

  .chat-app__sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-m) var(--spacing-l);
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
    gap: var(--spacing-s);
  }

  .chat-app__sidebar-action {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .chat-app__list {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    padding: var(--spacing-s);
    overflow-y: auto;
  }

  .chat-app__item {
    appearance: none;
    border: 1px solid transparent;
    background: transparent;
    border-radius: 12px;
    padding: var(--spacing-s) var(--spacing-m);
    text-align: left;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
    color: inherit;
    font: inherit;
  }

  .chat-app__item:hover {
    background: var(--spectrum-global-color-gray-75);
  }

  .chat-app__item.selected {
    border-color: var(--spectrum-global-color-blue-400);
    background: var(--spectrum-global-color-blue-100);
  }

  .chat-app__item-title {
    font-weight: 600;
    font-size: 14px;
    color: var(--spectrum-global-color-gray-900);
  }

  .chat-app__item-preview {
    font-size: 12px;
    color: var(--spectrum-global-color-gray-600);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .chat-app__empty,
  .chat-app__loading {
    padding: var(--spacing-l);
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    align-items: center;
    justify-content: center;
    color: var(--spectrum-global-color-gray-700);
  }

  .chat-app__loading {
    flex-direction: row;
  }

  .chat-app__main {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .chat-app__actions {
    width: 600px;
    max-width: 100%;
    margin: 0 auto;
    padding: var(--spacing-l) 0 var(--spacing-s);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--spacing-m);
  }

  .chat-app__delete {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .chat-app__chat {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .modal-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 999;
  }

  :global(.modal-container *) {
    pointer-events: auto;
  }

  :global(.chat-app .chatbox),
  :global(.chat-app .input-wrapper) {
    width: 100%;
    max-width: 600px;
  }

  @media (max-width: 900px) {
    .chat-app__content {
      flex-direction: column;
    }

    .chat-app__sidebar {
      width: 100%;
      max-width: 100%;
      border-right: none;
      border-bottom: 1px solid var(--spectrum-global-color-gray-200);
    }

    .chat-app__sidebar-header {
      padding: var(--spacing-m);
    }
  }
</style>
