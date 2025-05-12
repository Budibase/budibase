<script lang="ts">
  import { ActionButton, notifications } from "@budibase/bbui"
  import { agentsStore } from "@/stores/portal"
  import Chatbox from "./Chatbox.svelte"
  import type { AgentChat } from "@budibase/types"
  import { API } from "@/api"
  import { onDestroy, onMount } from "svelte"

  let inputValue = ""
  let chat: AgentChat = { title: "", messages: [] }
  let loading: boolean = false
  let wrapper: HTMLDivElement
  let observer: MutationObserver

  $: chat.messages.length, scroll()

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
    chat.messages.push({ role: "user", content: inputValue })
    inputValue = ""
    loading = true
    try {
      chat = await API.agentChat(chat)
    } catch (err: any) {
      console.error(err)
      notifications.error(err.message)
    }
    loading = false
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
  })

  onDestroy(() => {
    observer.disconnect()
  })
</script>

<div class="page" bind:this={wrapper}>
  <Chatbox bind:chat {loading} />
  <div class="controls">
    <ActionButton quiet on:click={reset}>Reset history</ActionButton>
  </div>
  <div class="input-wrapper">
    <textarea
      bind:value={inputValue}
      class="input spectrum-Textfield-input"
      on:keydown={handleKeyDown}
      placeholder="Ask anything"
    />
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

  .input-wrapper {
    position: sticky;
    bottom: 0;
    width: 801px;
    margin: 0 auto;
    background: var(--background-alt);
    padding-bottom: 48px;
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
  }
  textarea::placeholder {
    color: var(--spectrum-global-color-gray-600);
  }

  .controls {
    position: fixed;
    bottom: 8px;
    right: calc(50% - 400px);
    z-index: 1;
  }
</style>
