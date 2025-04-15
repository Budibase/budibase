<script lang="ts">
  import { ActionButton } from "@budibase/bbui"
  import { agentsStore } from "@/stores/portal"
  import Chatbox from "./Chatbox.svelte"
  import type { AgentMessage, AgentHistory } from "@budibase/types"
  import { API } from "@/api"
  import { appStore } from "@/stores/builder/app"
  import { onDestroy, onMount } from "svelte"

  let inputValue = ""
  let history: AgentHistory
  let loading: boolean = false
  let wrapper: HTMLDivElement
  let observer: MutationObserver
  let messages: AgentMessage[] = []

  $: appContext = [$appStore.appId]
  $: messages.length, scroll()

  async function handleKeyDown(event: any) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      await prompt()
    }
  }

  async function prompt() {
    messages.push({
      message: inputValue,
      system: false,
    })
    inputValue = ""
    messages = messages
    loading = true
    try {
      const res = await API.agentChat(
        messages.map(m => ({ message: m.message, system: m.system })),
        appContext
      )
      messages.push({
        message: res.response,
        system: true,
      })
    } catch (err: any) {
      messages.push({
        message: err.message,
        system: true,
        isError: true,
      })
    }

    loading = false
    messages = messages
    history = await agentsStore.saveHistory({
      ...history,
      messages,
      appIds: appContext,
    })
  }

  const reset = async () => {
    messages = []
    history = await agentsStore.saveHistory({
      ...history,
      messages: [],
      appIds: appContext,
    })
  }

  onMount(async () => {
    // Fetch agent history
    await agentsStore.init()

    // Init history for this app
    history = $agentsStore.history.find(
      history => history.appIds?.[0] === $appStore.appId
    ) as AgentHistory
    messages = history?.messages || []

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
  <Chatbox bind:messages {loading} />
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
