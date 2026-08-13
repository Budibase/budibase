<script lang="ts">
  import { Icon, Layout, notifications } from "@budibase/bbui"
  import LiveToggleButton from "@/components/common/LiveToggleButton.svelte"
  import TopBar from "@/components/common/TopBar.svelte"
  import { syncURLToState } from "@/helpers/urlStateSync"
  import { agentsStore, featureFlags, selectedAgent } from "@/stores/portal"
  import { deploymentStore } from "@/stores/builder"
  import * as routify from "@roxi/routify"
  import { onDestroy, onMount } from "svelte"
  import AgentChatPanel from "./AgentChatPanel.svelte"
  import AgentTabList from "./AgentTabList.svelte"
  import AgentUnpublishedChangesIndicator from "./AgentUnpublishedChangesIndicator.svelte"
  import { FeatureFlag } from "@budibase/types"

  const { goto, isActive, params } = routify

  $goto

  const stopSyncing = syncURLToState({
    urlParam: "agentId",
    stateKey: "currentAgentId",
    validate: id => $agentsStore.agents.some(x => x._id === id),
    fallbackUrl: "../index",
    store: agentsStore,
    update: agentsStore.selectAgent,
    routify,
  })

  let togglingLive = $state(false)
  let agentUpdateOverrides = $state<Record<string, unknown>>({})
  let preloadedKnowledgeAgentId = $state<string | undefined>()
  let testsEnabled = $derived($featureFlags[FeatureFlag.AI_TESTS])
  let operationPage = $derived($isActive("./operation"))

  let activeTab = $derived.by(() => {
    if ($isActive("./knowledge")) {
      return "Knowledge"
    }
    if ($isActive("./deployment")) {
      return "Deployment"
    }
    if (testsEnabled && $isActive("./tests")) {
      return "Tests"
    }
    if ($isActive("./logs")) {
      return "Logs"
    }
    return "Configuration"
  })
  let currentAgent = $derived($selectedAgent)

  $effect(() => {
    if (!testsEnabled && $isActive("./tests")) {
      $goto("./config")
    }
  })

  onMount(async () => {
    if (!$agentsStore.agentsLoaded) {
      await agentsStore.init()
    }
  })

  $effect(() => {
    if (
      $agentsStore.toolsLoaded ||
      $agentsStore.toolsLoading ||
      $agentsStore.toolsLoadFailed
    ) {
      return
    }

    agentsStore.fetchTools()
  })

  $effect(() => {
    const agentId = currentAgent?._id
    if (!agentId || operationPage || preloadedKnowledgeAgentId === agentId) {
      return
    }

    agentsStore
      .refreshOperationKnowledge(agentId)
      .then(() => {
        if (currentAgent?._id === agentId) {
          preloadedKnowledgeAgentId = agentId
        }
      })
      .catch(error => {
        console.error(error)
      })
  })

  async function toggleAgentLive() {
    if (!currentAgent || togglingLive) return

    const nextLive = !currentAgent.live

    try {
      togglingLive = true

      await agentsStore.updateAgent({
        ...currentAgent,
        ...agentUpdateOverrides,
        live: nextLive,
      })
      await deploymentStore.publishApp()
      await agentsStore.fetchAgents()

      notifications.success(
        nextLive ? "Agent is now live" : "Agent has been stopped"
      )
    } catch (error) {
      console.error(error)
      const errorMessage = nextLive
        ? "Error setting agent live"
        : "Error stopping agent"

      notifications.error(
        [errorMessage, (error as { message?: string }).message]
          .filter(Boolean)
          .join(": ")
      )
    } finally {
      togglingLive = false
    }
  }

  onDestroy(() => stopSyncing?.())
</script>

{#if operationPage}
  <slot />
{:else}
  <div class="config-wrapper">
    <TopBar
      breadcrumbs={[
        { text: "Agents", url: "../", tag: "Beta" },
        { text: currentAgent?.name || "Agent" },
      ]}
      icon="Effect"
    ></TopBar>
    <div class="secondary-bar">
      <AgentTabList ariaLabel="Agent settings">
        <button
          class:active={activeTab === "Configuration"}
          onclick={() => $goto("./config")}
        >
          Configuration
        </button>
        <button
          class:active={activeTab === "Deployment"}
          onclick={() => $goto("./deployment")}
        >
          Deployment
        </button>
        {#if testsEnabled}
          <button
            class:active={activeTab === "Tests"}
            onclick={() => $goto("./tests")}
          >
            Tests
          </button>
        {/if}
        <button
          class:active={activeTab === "Logs"}
          onclick={() => $goto("./logs")}
        >
          Logs
        </button>
      </AgentTabList>
      <AgentUnpublishedChangesIndicator />
      <div class="start-pause-row">
        <div class="status-icons">
          <Icon
            tooltip="Documentation"
            hoverable
            on:click={() =>
              window.open(
                "https://docs.budibase.com/docs/agent-building-101",
                "_blank"
              )}
            name="info"
            size="M"
            color="var(--spectrum-global-color-gray-600)"
          />
        </div>
        <LiveToggleButton
          live={currentAgent?.live === true}
          size="S"
          disabled={togglingLive}
          on:click={toggleAgentLive}
        />
      </div>
    </div>
    <div
      class="config-page"
      class:full-width={activeTab === "Logs" || activeTab === "Tests"}
    >
      <div
        class="config-content"
        class:full-width={activeTab === "Logs" || activeTab === "Tests"}
        class:logs-tab={activeTab === "Logs" || activeTab === "Tests"}
      >
        <div class="config-form">
          {#if activeTab === "Logs" || activeTab === "Tests"}
            <!-- svelte-ignore slot_element_deprecated -->
            <slot />
          {:else}
            <!-- svelte-ignore slot_element_deprecated -->
            <Layout gap="L">
              <slot />
            </Layout>
          {/if}
        </div>
      </div>
      {#if activeTab !== "Logs" && activeTab !== "Tests"}
        <div class="config-preview">
          <AgentChatPanel
            agentId={currentAgent?._id}
            workspaceId={$params.workspaceId || ""}
          />
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .config-wrapper {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex: 1 1 auto;
    background: var(--background);
  }

  .config-page {
    flex: 1 1 auto;
    display: grid;
    grid-template-columns: repeat(24, 1fr);
    grid-template-rows: 1fr;
    height: 0;
    overflow: hidden;
    gap: var(--spacing-xs);
  }

  .config-content {
    grid-column: span 13;
    padding: var(--spacing-xs) var(--spacing-s) 20px;
    min-width: 0;
    overflow-y: auto;
    scrollbar-width: thin;
  }

  .config-page.full-width {
    grid-template-columns: 1fr;
  }

  .config-content.full-width {
    grid-column: 1 / -1;
    padding: var(--spacing-xl) var(--spacing-xl) 20px;
  }

  .config-content.full-width.logs-tab {
    display: flex;
    flex-direction: column;
    min-height: 0;
    padding: 0;
    overflow: hidden;
  }

  .config-content::-webkit-scrollbar {
    width: 6px;
  }

  .config-content::-webkit-scrollbar-track {
    background: transparent;
  }

  .config-content::-webkit-scrollbar-thumb {
    background: var(--spectrum-global-color-gray-300);
    border-radius: 3px;
  }

  .config-content::-webkit-scrollbar-thumb:hover {
    background: var(--spectrum-global-color-gray-400);
  }

  .config-preview {
    grid-column: span 11;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    min-height: 0;
    overflow: hidden;
    padding: var(--spacing-xl) var(--spacing-l) var(--spacing-xl);
    background: var(--background-alt);
    min-width: 0;
  }

  .config-form {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .secondary-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 40px;
    padding: 2px 12px;
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
  }

  .start-pause-row {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-shrink: 0;
  }

  .status-icons {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    margin-right: var(--spacing-m);
  }

  .start-pause-row :global(.spectrum-Button.new-styles .spectrum-Button-label) {
    font-weight: 400;
  }

  :global(.form-row) {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: var(--spacing-m);
  }

  :global(.form-field) {
    min-width: 0;
  }

  :global(.form-icon) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--spectrum-alias-item-height-m);
    height: var(--spectrum-alias-item-height-m);
    flex-shrink: 0;
  }

  :global(
    .config-form .spectrum-Textfield-input,
    .config-form .spectrum-Picker
  ) {
    background-color: var(--background) !important;
  }

  :global(.config-form .spectrum-Form-item:not(.above)) {
    display: grid;
    grid-template-columns: 120px 1fr 20px;
    column-gap: var(--spacing-m);
  }

  :global(.config-form .container) {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
  }

  :global(.section) {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
    flex-shrink: 0;
  }

  :global(.rag-settings) {
    border-top: 1px solid var(--spectrum-global-color-gray-200);
  }

  :global(.files-section),
  :global(.rag-settings) {
    padding-top: var(--spacing-m);
    gap: var(--spacing-s);
  }

  :global(.rag-header) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-s);
  }
</style>
