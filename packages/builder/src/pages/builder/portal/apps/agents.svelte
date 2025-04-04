<script lang="ts">
  import { Heading, Layout, Page, Icon, Multiselect } from "@budibase/bbui"
  import { agentsStore } from "@/stores/portal"
  import Chatbox from "./_agents/Chatbox.svelte"
  import BBAI from "@/components/common/Icons/BBAI.svelte"
  import type { AgentMessage, AgentHistory } from "@budibase/types"
  import { appsStore } from "@/stores/portal"
  import { API } from "@/api"
  import { onMount } from "svelte"

  let textarea: any
  let inputValue = ""
  let loading: boolean = false
  let appContext: string[] = []
  let activeHistoryId: string | undefined

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

  let messages: AgentMessage[] = []

  function historyChanged(history: AgentHistory) {
    activeHistoryId = history._id!
    messages = history.messages
    appContext = history.appIds
  }

  function textChange() {
    textarea.height = "auto"
    textarea.height = textarea.scrollHeight + "px"
  }

  async function handleKeyDown(event: any) {
    if (event.key === "Enter" && !event.shiftKey) {
      await prompt()
    }
  }

  async function prompt() {
    messages.push({
      message: inputValue,
      system: false,
    })
    messages = messages
    loading = true
    try {
      const res = await API.agentChat(
        messages.map(m => ({ message: m.message, system: m.system })),
        appContext
      )
      inputValue = ""
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

  function setCurrentHistory(history: AgentHistory) {
    agentsStore.setCurrentHistoryId(history._id!)
  }

  onMount(async () => {
    await agentsStore.init()
  })
</script>

<Page wide>
  <Layout noPadding gap="S">
    <div class="heading">
      <BBAI />
      <Heading size="L">Budibase Agents</Heading>
    </div>
    <div class="split">
      <div class="all-history">
        {#each $agentsStore.history as history}
          <div
            class="history"
            class:selected-history={history._id === currentHistory?._id}
            on:click={() => setCurrentHistory(history)}
          >
            <Heading size="XS">{history.title}</Heading>
          </div>
        {/each}
      </div>
      <div class="chat">
        <Chatbox bind:messages />
      </div>
    </div>
    <div class="input-wrapper">
      <div class="input-container">
        <pre class="input" aria-hidden="true">{inputValue + "\n"}</pre>
        <textarea
          bind:value={inputValue}
          bind:this={textarea}
          class="input spectrum-Textfield-input"
          on:input={textChange}
          on:keydown={handleKeyDown}
        />
        <div class="run-icon">
          <div class="app-tags">
            <Multiselect
              bind:value={appContext}
              placeholder="App context"
              autoWidth
              options={appOptions}
              getOptionLabel={opt => opt.name}
              getOptionValue={opt => opt.value}
            />
          </div>
          {#if !loading}
            <Icon name="PlayCircle" size="XXL" hoverable on:click={prompt} />
          {:else}
            <BBAI size="36px" animate />
          {/if}
        </div>
      </div>
    </div>
  </Layout>
</Page>

<style>
  .heading {
    display: flex;
    align-items: center;
    gap: var(--spacing-l);
  }

  .app-tags {
    display: flex;
    gap: var(--spacing-l);
  }

  .history {
    border-radius: 10px;
    height: auto;
    padding: 10px;
  }

  .selected-history {
    background-color: var(--grey-3);
  }

  .all-history {
    padding: 20px;
    border-radius: 10px;
    background-color: var(--grey-2);
    width: 15%;
    min-height: 60vh;
    display: flex;
    flex-direction: column;
  }

  .chat {
    padding: 20px;
    border-radius: 10px;
    width: 85%;
    min-height: 60vh;
    padding-bottom: 20vh;
  }

  .split {
    display: flex;
    width: 100%;
    min-height: 100%;
    gap: var(--spacing-m);
  }

  .input-container {
    position: relative;
  }

  .input {
    font-size: 18px;
    background-color: var(--grey-3);
    color: var(--grey-9);
    border-radius: 20px;
    border: none;
    outline: none;
    resize: none;
    overflow: hidden;
    box-sizing: border-box;
    min-height: 100px;
    width: 100%;
    padding: 15px;
  }

  .input-wrapper {
    position: fixed;
    bottom: 50px;
    right: 400px;
    width: calc(100vw - (260px + (400px * 2)));
  }

  textarea {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    resize: none;
  }

  .run-icon {
    position: absolute;
    right: var(--spacing-xl);
    bottom: var(--spacing-xl);
    display: flex;
    gap: var(--spacing-l);
  }
</style>
