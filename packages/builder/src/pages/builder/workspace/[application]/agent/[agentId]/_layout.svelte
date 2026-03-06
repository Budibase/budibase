<script lang="ts">
  import {
    ActionButton,
    Button,
    Icon,
    Layout,
    notifications,
  } from "@budibase/bbui"
  import TopBar from "@/components/common/TopBar.svelte"
  import { syncURLToState } from "@/helpers/urlStateSync"
  import { agentsStore, featureFlags, selectedAgent } from "@/stores/portal"
  import { deploymentStore } from "@/stores/builder"
  import { FeatureFlag } from "@budibase/types"
  import * as routify from "@roxi/routify"
  import { onDestroy } from "svelte"
  import AgentChatPanel from "./AgentChatPanel.svelte"

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
  let ragEnabled = $derived($featureFlags[FeatureFlag.AI_RAG])

  let activeTab = $derived.by(() => {
    if (ragEnabled && $isActive("./knowledge")) {
      return "Knowledge"
    }
    if ($isActive("./deployment")) {
      return "Deployment"
    }
    return "Configuration"
  })
  let currentAgent = $derived($selectedAgent)

  $effect(() => {
    if (!ragEnabled && $isActive("./knowledge")) {
      $goto("./config")
    }
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
        nextLive ? "Agent is now live" : "Agent has been paused"
      )
    } catch (error) {
      console.error(error)
      notifications.error(
        nextLive ? "Error setting agent live" : "Error pausing agent"
      )
    } finally {
      togglingLive = false
    }
  }

  onDestroy(() => stopSyncing?.())
</script>

<div class="config-wrapper">
  <TopBar
    breadcrumbs={[
      { text: "Agents", url: "../" },
      { text: currentAgent?.name || "Agent" },
    ]}
    icon="Effect"
  ></TopBar>
  <div class="secondary-bar">
    <div class="filter">
      <ActionButton
        quiet
        selected={activeTab === "Configuration"}
        on:click={() => $goto("./config")}
      >
        Configuration
      </ActionButton>
      {#if ragEnabled}
        <ActionButton
          quiet
          selected={activeTab === "Knowledge"}
          on:click={() => $goto("./knowledge")}
        >
          Knowledge
        </ActionButton>
      {/if}
      <ActionButton
        quiet
        selected={activeTab === "Deployment"}
        on:click={() => $goto("./deployment")}
      >
        Deployment
      </ActionButton>
    </div>
    <div class="start-pause-row">
      <div class="status-icons">
        <Icon
          tooltip="Documentation"
          on:click={() =>
            window.open("https://docs.budibase.com/docs/agents", "_blank")}
          name="info"
          size="M"
          color="var(--spectrum-global-color-gray-600)"
        />
      </div>
      <Button
        primary={!currentAgent?.live}
        secondary={currentAgent?.live}
        icon={currentAgent?.live ? undefined : "play"}
        iconColor={currentAgent?.live ? "" : "var(--bb-blue)"}
        iconWeight="fill"
        on:click={toggleAgentLive}
        disabled={togglingLive}
        >{currentAgent?.live ? "Pause agent" : "Set agent live"}</Button
      >
    </div>
  </div>
  <div class="config-page">
    <div class=" config-content">
      <div class="config-form">
        <!-- svelte-ignore slot_element_deprecated -->
        <Layout gap="L">
          <slot />
        </Layout>
      </div>
    </div>
    <div class="config-preview">
      <AgentChatPanel
        agentId={currentAgent?._id}
        workspaceId={$params.application || ""}
      />
    </div>
  </div>
</div>

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
    gap: var(--spacing-l);
  }

  .config-content {
    grid-column: span 13;
    padding: var(--spacing-xl) var(--spacing-l) 20px;
    min-width: 0;
    overflow-y: auto;
    scrollbar-width: thin;
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
    padding: 10px 12px;
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .filter {
    display: flex;
    gap: 10px;
  }

  .filter :global(.spectrum-ActionButton) {
    border-radius: 8px;
    transition:
      border-color 130ms ease-out,
      background 130ms ease-out;
    border: 1px solid transparent;
    padding: 3px 10px;
    height: auto;
  }

  .filter :global(.spectrum-ActionButton-label) {
    font-weight: 500;
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

  .start-pause-row {
    display: flex;
    justify-content: flex-end;
    align-items: center;
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
    gap: var(--spectrum-alias-grid-gutter-medium);
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
