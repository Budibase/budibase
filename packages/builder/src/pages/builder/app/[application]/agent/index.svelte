<script lang="ts">
  import { ActionButton, notifications, Button, Tooltip } from "@budibase/bbui"
  import { agentsStore } from "@/stores/portal"
  import Chatbox from "./Chatbox.svelte"
  import type { AgentChat } from "@budibase/types"
  import { API } from "@/api"
  import { onDestroy, onMount } from "svelte"
  import Panel from "@/components/design/Panel.svelte"

  let inputValue = ""
  let chat: AgentChat = { title: "", messages: [] }
  let loading: boolean = false
  let wrapper: HTMLDivElement
  let observer: MutationObserver
  let textareaElement: HTMLTextAreaElement

  $: chat.messages.length, scroll()

  function scroll() {
    if (wrapper) {
      wrapper.scrollTop = wrapper.scrollHeight
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
    
    const userMessage = { role: "user", content: inputValue }
    
    const updatedChat = {
      ...chat,
      messages: [...chat.messages, userMessage] 
    }
    
    // Update local display immediately with user message
    chat = updatedChat
    
    inputValue = ""
    loading = true

    try {
      // Send copy with new message to API
      const response = await API.agentChat(updatedChat)
      
      // Update chat with response from API
      chat = response
    } catch (err: any) {
      console.error(err)
      notifications.error(err.message)
    }

    loading = false

    // Ensure focus returns to textarea after response
    setTimeout(() => {
      if (textareaElement) {
        textareaElement.focus()
      }
    }, 0)
  }

  const reset = async () => {
    chat = { title: "", messages: [] }
  }

  onMount(async () => {
    // Fetch agent history
    await agentsStore.init()

    // Init history for this app
    chat = { title: "", messages: [] }

    // Ensure we always autoscroll to reveal new messages
    observer = new MutationObserver(() => {
      wrapper.scrollTop = wrapper.scrollHeight
    })
    observer.observe(wrapper, {
      childList: true,
      subtree: true,
      attributes: true,
    })
    
    // Set initial focus on the textarea
    if (textareaElement) {
      textareaElement.focus()
    }
  })

  onDestroy(() => {
    observer.disconnect()
  })
</script>

<div class="page" bind:this={wrapper}>
  <div class="layout">
    <div class="chat-area">
      <Chatbox bind:chat {loading} />
      <div class="controls">
        <ActionButton quiet on:click={reset}>Reset history</ActionButton>
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
    <div class="panel-container">
      <Panel
        customWidth={400}
      >
        <div class="debug-panel">
          <h3>Train</h3>
          <p>fooooo</p>
        </div>
      </Panel>
    </div>
  </div>
</div>

<style>
  .page {
    height: 0;
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    position: relative;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  
  .layout {
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
  }
  
  .chat-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    max-width: calc(100% - 400px);
  }
  
  .panel-container {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 400px;
  }
  
  .debug-panel {
    padding: var(--spacing-l);
  }

  .input-wrapper {
    position: sticky;
    bottom: 0;
    width: 600px;
    margin: 0 auto;
    background: var(--background-alt);
    padding-bottom: 48px;
    display: flex;
    flex-direction: column;
  }

  textarea {
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

  textarea::placeholder {
    color: var(--spectrum-global-color-gray-600);
  }

  .controls {
    position: fixed;
    bottom: 8px;
    right: calc(50% - 300px);
    z-index: 1;
  }
</style>
