<script lang="ts">
  import {
    AbsTooltip,
    ActionButton,
    Heading,
    Select,
    notifications,
  } from "@budibase/bbui"
  import type { Agent } from "@budibase/types"
  import { agentsStore, ragConfigStore, selectedAgent } from "@/stores/portal"
  import { bb } from "@/stores/bb"
  import { onDestroy, onMount } from "svelte"
  import FilesPanel from "./FilesPanel.svelte"
  const AUTO_SAVE_DEBOUNCE_MS = 800

  let draftAgentId: string | undefined = $state()
  let ragConfigId = $state<string | undefined>()
  let ragConfigError: string | undefined = $state()
  let autoSaveTimeout: ReturnType<typeof setTimeout> | undefined
  let saving = $state(false)
  let currentAgent: Agent | undefined = $derived($selectedAgent)
  let ragConfigs = $derived($ragConfigStore.configs || [])

  $effect(() => {
    const agent = currentAgent
    if (agent && agent._id !== draftAgentId) {
      ragConfigId = agent.ragConfigId
      draftAgentId = agent._id
    }
  })

  async function saveAgent({
    showNotifications = true,
  }: {
    showNotifications?: boolean
  }) {
    if (!currentAgent) return
    if (saving) return

    saving = true
    try {
      await agentsStore.updateAgent({
        ...currentAgent,
        ragConfigId,
      })

      if (showNotifications) {
        notifications.success("Agent saved successfully")
      }
      await agentsStore.fetchAgents()
    } catch (error) {
      console.error(error)
      notifications.error("Error saving agent")
    } finally {
      saving = false
    }
  }

  const scheduleSave = (immediate = false) => {
    clearAutoSave()

    if (immediate) {
      saveAgent({ showNotifications: false })
      return
    }

    autoSaveTimeout = setTimeout(() => {
      saveAgent({ showNotifications: false })
      autoSaveTimeout = undefined
    }, AUTO_SAVE_DEBOUNCE_MS)
  }

  const clearAutoSave = () => {
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout)
      autoSaveTimeout = undefined
    }
  }

  onMount(async () => {
    if (!$agentsStore.agentsLoaded) {
      await agentsStore.init()
    }
    await ragConfigStore.fetch()
  })

  onDestroy(() => {
    clearAutoSave()
  })
</script>

<div class="form-row">
  <div class="form-field">
    <Select
      label="RAG configuration"
      labelPosition="left"
      bind:value={ragConfigId}
      getOptionLabel={o => o.name}
      getOptionValue={o => o._id}
      options={ragConfigs}
      placeholder="Select a RAG configuration"
      disabled={!ragConfigs.length}
      on:change={() => {
        ragConfigError = undefined
        scheduleSave(true)
      }}
      error={ragConfigError}
    />
  </div>
  <div class="form-icon">
    <AbsTooltip text="Manage model configurations">
      <ActionButton
        size="M"
        icon="sliders-horizontal"
        on:click={() => bb.settings("/ai/embedding-settings")}
      />
    </AbsTooltip>
  </div>
</div>

{#if ragConfigId}
  <div class="section files-section">
    <FilesPanel currentAgentId={currentAgent?._id} />
  </div>
{/if}
