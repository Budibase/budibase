<script lang="ts">
  import { MarkdownViewer, notifications } from "@budibase/bbui"
  import type { AgentChat } from "@budibase/types"
  import BBAI from "../../icons/BBAI.svelte"
  import { tick } from "svelte"
  import { onDestroy } from "svelte"
  import { onMount } from "svelte"
  import { createEventDispatcher } from "svelte"
  import { createAPIClient } from "@budibase/frontend-core"
  import type { UIMessage } from "ai"
  import { v4 as uuidv4 } from "uuid"

  export let API = createAPIClient()

  export let workspaceId: string
  export let chat: AgentChat
  export let loading: boolean = false

  const dispatch = createEventDispatcher<{
    chatSaved: { chatId?: string; chat: AgentChat }
  }>()

  let inputValue = ""
  let chatAreaElement: HTMLDivElement
  let observer: MutationObserver
  let textareaElement: HTMLTextAreaElement
  let lastFocusedChatId: string | undefined
  let lastFocusedNewChat: AgentChat | undefined

  $: if (chat?.messages?.length) {
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

  async function prompt() {
    if (!chat) {
      chat = { title: "", messages: [] }
    }

    const userMessage: UIMessage = {
      id: uuidv4(),
      role: "user",
      parts: [{ type: "text", text: inputValue }],
    }

    const updatedChat: AgentChat = {
      ...chat,
      messages: [...chat.messages, userMessage],
    }

    chat = updatedChat
    await scrollToBottom()

    inputValue = ""
    loading = true

    try {
      const messageStream = await API.agentChatStream(updatedChat, workspaceId)

      for await (const message of messageStream) {
        chat = {
          ...updatedChat,
          messages: [...updatedChat.messages, message],
        }
        scrollToBottom()
      }

      loading = false
      dispatch("chatSaved", { chatId: chat._id, chat })
    } catch (err: any) {
      console.error(err)
      notifications.error(err.message)
      loading = false
    }

    await tick()
    if (textareaElement) {
      textareaElement.focus()
    }
  }

  onMount(async () => {
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

  $: {
    const currentId = chat?._id
    const isNewChat =
      !currentId && (!chat?.messages || chat.messages.length === 0)
    const shouldFocus =
      textareaElement &&
      ((currentId && currentId !== lastFocusedChatId) ||
        (isNewChat && chat && chat !== lastFocusedNewChat))

    if (shouldFocus) {
      tick().then(() => textareaElement?.focus())
      lastFocusedChatId = currentId
      lastFocusedNewChat = isNewChat ? chat : undefined
    }
  }

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
          {#each message.parts || [] as part}
            {#if part.type === "text"}
              <MarkdownViewer value={part.text || ""} />
            {:else if part.type === "reasoning"}
              <div class="reasoning-part">
                <div class="reasoning-label">Reasoning</div>
                <div class="reasoning-content">{part.text || ""}</div>
              </div>
            {:else if part.type?.startsWith("tool-") || part.type === "dynamic-tool"}
              {@const toolPart = part}
              <div class="tool-part">
                <div class="tool-header">
                  <span class="tool-icon">🔧</span>
                  <span class="tool-name"
                    >{("toolName" in toolPart && toolPart.toolName) ||
                      "Tool"}</span
                  >
                  {#if "state" in toolPart}
                    {#if toolPart.state === "output-available"}
                      <span class="tool-status success">✓</span>
                    {:else if toolPart.state === "output-error"}
                      <span class="tool-status error">✗</span>
                    {:else if toolPart.state === "input-streaming"}
                      <span class="tool-status pending">...</span>
                    {:else if toolPart.state === "input-available"}
                      <span class="tool-status pending">...</span>
                    {/if}
                  {/if}
                </div>
                {#if "state" in toolPart && toolPart.state === "output-available" && "output" in toolPart && toolPart.output}
                  <div class="tool-output">
                    <div class="tool-output-label">Output:</div>
                    <pre class="tool-output-content">{typeof toolPart.output ===
                      "string"
                        ? toolPart.output
                        : JSON.stringify(toolPart.output, null, 2)}</pre>
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
    margin-bottom: var(--spacing-s);
    font-weight: 600;
    font-size: 14px;
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

  .tool-output,
  .tool-output-label,
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
</style>
