<script lang="ts">
  import {
    AbsTooltip,
    ActionButton,
    Input,
    Select,
    notifications,
  } from "@budibase/bbui"
  import { AIConfigType, type Agent } from "@budibase/types"
  import {
    agentsStore,
    aiConfigsStore,
    selectedAgent,
    vectorDbStore,
  } from "@/stores/portal"
  import { bb } from "@/stores/bb"
  import { onDestroy, onMount } from "svelte"
  import FilesPanel from "./FilesPanel.svelte"
  const AUTO_SAVE_DEBOUNCE_MS = 800

  let draftAgentId: string | undefined = $state()
  let embeddingModel = $state<string | undefined>()
  let vectorDb = $state<string | undefined>()
  let ragMinDistance = $state(0.7)
  let ragTopK = $state(4)
  let autoSaveTimeout: ReturnType<typeof setTimeout> | undefined
  let saving = $state(false)
  let currentAgent: Agent | undefined = $derived($selectedAgent)
  let embeddingConfigs = $derived(
    $aiConfigsStore.customConfigs.filter(
      cfg => cfg.configType === AIConfigType.EMBEDDINGS
    )
  )
  let embeddingOptions = $derived(
    embeddingConfigs.map(cfg => ({
      label: cfg.name || cfg._id || "Unnamed",
      value: cfg._id || "",
    }))
  )
  let vectorDbOptions = $derived(
    $vectorDbStore.configs.map(cfg => ({
      label: cfg.name || cfg._id || "Unnamed",
      value: cfg._id || "",
    }))
  )

  $effect(() => {
    const agent = currentAgent
    if (agent && agent._id !== draftAgentId) {
      embeddingModel = agent.embeddingModel
      vectorDb = agent.vectorDb
      ragMinDistance = agent.ragMinDistance ?? 0.7
      ragTopK = agent.ragTopK ?? 4
      draftAgentId = agent._id
    }
  })

  const hasRagConfig = $derived(!!embeddingModel && !!vectorDb)

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
        embeddingModel,
        vectorDb,
        ragMinDistance,
        ragTopK,
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
    await aiConfigsStore.fetch()
    await vectorDbStore.fetch()
  })

  onDestroy(() => {
    clearAutoSave()
  })
</script>

<div class="form-row">
  <div class="form-field">
    <Select
      label="Embedding model"
      labelPosition="left"
      bind:value={embeddingModel}
      options={embeddingOptions}
      placeholder="Select embedding model"
      disabled={!embeddingOptions.length}
      on:change={() => {
        scheduleSave(true)
      }}
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

<div class="form-row">
  <div class="form-field">
    <Select
      label="Vector database"
      labelPosition="left"
      bind:value={vectorDb}
      options={vectorDbOptions}
      placeholder="Select vector database"
      disabled={!vectorDbOptions.length}
      on:change={() => scheduleSave(true)}
    />
  </div>
</div>

{#if hasRagConfig}
  <div class="form-row">
    <div class="form-field">
      <Input
        label="Minimum similarity"
        labelPosition="left"
        bind:value={ragMinDistance}
        type="number"
        on:blur={() => scheduleSave(true)}
      />
    </div>
  </div>

  <div class="form-row">
    <div class="form-field">
      <Input
        label="Chunks to retrieve"
        labelPosition="left"
        bind:value={ragTopK}
        type="number"
        on:blur={() => scheduleSave(true)}
      />
    </div>
  </div>

  <div class="section files-section">
    <FilesPanel currentAgentId={currentAgent?._id} />
  </div>
{/if}
