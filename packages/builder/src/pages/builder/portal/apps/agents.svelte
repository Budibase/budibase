<script lang="ts">
  import { Heading, Layout, Page, Icon, Multiselect } from "@budibase/bbui"
  import { agentsStore } from "@/stores/portal"
  import Chatbox from "./_agents/Chatbox.svelte"
  import BBAI from "@/components/common/Icons/BBAI.svelte"
  import type { AgentMessage, AgentHistory } from "@budibase/types"
  import { appsStore } from "@/stores/portal"
  import { API } from "@/api"
  import { onDestroy, onMount } from "svelte"

  let inputValue = ""
  let loading: boolean = false
  let appContext: string[] = []
  let activeHistoryId: string | undefined
  let wrapper: HTMLDivElement
  let observer: MutationObserver
  let messages: AgentMessage[] = []

  $: currentHistory = $agentsStore.history.find(
    history => history._id === $agentsStore.currentHistoryId
  )
  $: appOptions = $appsStore.apps.map(app => ({
    name: app.name,
    value: app.devId!,
  }))
  $: currentHistory?._id !== activeHistoryId
    ? historyChanged(currentHistory!)
    : undefined
  $: messages.length, scroll()

  function historyChanged(history?: AgentHistory) {
    // if no history, this is a new chat
    if (!history) {
      activeHistoryId = undefined
      messages = []
      appContext = []
    }
    // we're loading an existing chat
    else {
      activeHistoryId = history._id!
      messages = history.messages
      appContext = history.appIds
    }
  }

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
    const history = await agentsStore.saveHistory({
      ...currentHistory,
      messages,
      appIds: appContext || [],
    })
    agentsStore.setCurrentHistoryId(history._id!)
    await agentsStore.fetchHistory()
  }

  onMount(async () => {
    await agentsStore.init()

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
  <div class="heading">
    <BBAI size="48px" />
    <Heading size="M">Budibase Agents</Heading>
  </div>
  <Chatbox bind:messages />
  <div class="input-wrapper">
    <textarea
      bind:value={inputValue}
      class="input spectrum-Textfield-input"
      on:keydown={handleKeyDown}
      placeholder="Ask anything"
    />
    <div class="controls">
      <Multiselect
        bind:value={appContext}
        placeholder="App context"
        autoWidth
        options={appOptions}
        getOptionLabel={opt => opt.name}
        getOptionValue={opt => opt.value}
      />
      {#if !loading}
        <Icon name="PlayCircle" size="XXL" hoverable on:click={prompt} />
      {:else}
        <BBAI size="32px" animate />
      {/if}
    </div>
  </div>
</div>

<style>
  .page {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    position: relative;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .heading {
    position: sticky;
    top: 16px;
    display: flex;
    margin-left: 16px;
    align-items: center;
    gap: var(--spacing-m);
  }

  .input-wrapper {
    position: sticky;
    bottom: 0;
    width: 801px;
    margin: 0 auto;
    background: var(--background-alt);
    padding-bottom: 24px;
  }

  textarea {
    width: 100%;
    height: 120px;
    top: 0;
    resize: none;
    padding: 20px;
    font-size: 16px;
    background-color: var(--grey-3);
    color: var(--grey-9);
    border-radius: 20px;
    border: none;
    outline: none;
    overflow: hidden;
    box-sizing: border-box;
    min-height: 100px;
  }
  textarea::placeholder {
    color: var(--spectrum-global-color-gray-600);
  }

  .controls {
    position: absolute;
    right: 14px;
    bottom: 36px;
    display: flex;
    flex-direction: row;
    gap: 12px;
  }
</style>
