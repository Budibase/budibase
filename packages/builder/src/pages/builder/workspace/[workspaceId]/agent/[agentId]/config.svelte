<script lang="ts">
  import { Body, notifications, Select, Button } from "@budibase/bbui"
  import { AIConfigType } from "@budibase/types"
  import { agentsStore, aiConfigsStore, selectedAgent } from "@/stores/portal"
  import { workspaceDeploymentStore } from "@/stores/builder"
  import { bb } from "@/stores/bb"
  import { shouldAutoSelectAgentModel } from "./configUtils"
  import { createSaveCoordinator } from "./operationSaveCoordinator"
  import OperationsSection from "./OperationsSection.svelte"

  let draftAgentId: string | undefined = $state()
  let draftAiconfig = $state("")
  let hasUnsavedAiconfig = $state(false)
  let saving = $state(false)
  let showSaveNotifications = $state(true)

  let currentAgent = $derived($selectedAgent)
  let completionConfigs = $derived($aiConfigsStore.customConfigs || [])
  let modelOptions = $derived(
    completionConfigs.map(config => ({
      label: config.name || config._id || "Unnamed",
      value: config._id || "",
    }))
  )

  $effect(() => {
    const agent = currentAgent
    if (!agent?._id) {
      draftAgentId = undefined
      draftAiconfig = ""
      hasUnsavedAiconfig = false
      return
    }

    if (agent._id !== draftAgentId) {
      draftAiconfig = agent.aiconfig || ""
      draftAgentId = agent._id
      hasUnsavedAiconfig = false
      return
    }

    if (!hasUnsavedAiconfig && !saving) {
      draftAiconfig = agent.aiconfig || ""
    }
  })

  $effect(() => {
    if (
      currentAgent &&
      shouldAutoSelectAgentModel({
        modelOptions,
        agentAiconfig: currentAgent.aiconfig,
        draftAiconfig,
      })
    ) {
      draftAiconfig = modelOptions[0].value
      hasUnsavedAiconfig = true
      saveAiconfig({ showNotifications: false })
    }
  })

  const persistAiconfig = async (): Promise<boolean> => {
    if (!currentAgent?._id) {
      return false
    }
    if (draftAiconfig === currentAgent.aiconfig) {
      hasUnsavedAiconfig = false
      return true
    }

    const aiconfigToSave = draftAiconfig
    saving = true
    try {
      await agentsStore.updateAgent({
        ...currentAgent,
        aiconfig: aiconfigToSave,
      })
      hasUnsavedAiconfig = false
      if (showSaveNotifications) {
        notifications.success("Agent saved successfully")
      }
      await workspaceDeploymentStore.fetch()
      return true
    } catch (error) {
      notifications.error(`Error saving agent: ${JSON.stringify(error)}`)
      return false
    } finally {
      saving = false
    }
  }

  const aiconfigSaveCoordinator = createSaveCoordinator(persistAiconfig)

  async function saveAiconfig({
    showNotifications = true,
  }: {
    showNotifications?: boolean
  } = {}): Promise<boolean> {
    if (!currentAgent?._id) {
      return false
    }

    showSaveNotifications = showNotifications
    return aiconfigSaveCoordinator.save()
  }

  const handleAiconfigChange = () => {
    hasUnsavedAiconfig = true
    saveAiconfig({ showNotifications: false })
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="llm-section-container">
  <div class="llm-header">
    <Body size="XS" color="var(--spectrum-global-color-gray-900)">AI Model</Body
    >
    <Body size="XS" color="var(--spectrum-global-color-gray-700)">
      Choose the model that runs this agent. Use{" "}
      <button
        class="link-button"
        onclick={() => bb.settings(`/connections/${AIConfigType.COMPLETIONS}`)}
      >
        AI Connectors
      </button>{" "}
      to add or change providers and models.
    </Body>
  </div>
  <div class="form-row">
    <div class="form-field">
      {#if modelOptions.length === 0}
        <Button
          secondary
          size="S"
          icon="sparkle"
          iconWeight="fill"
          iconColor="#8777D1"
          on:click={() =>
            bb.settings(`/connections/${AIConfigType.COMPLETIONS}`)}
        >
          Connect AI Model
        </Button>
      {:else}
        <Select
          bind:value={draftAiconfig}
          placeholder={false}
          options={modelOptions}
          size="S"
          on:change={handleAiconfigChange}
        />
      {/if}
    </div>
  </div>
</div>

{#if currentAgent?._id}
  <OperationsSection agentId={currentAgent._id} />
{/if}

<style>
  .llm-section-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-l);
    flex-wrap: wrap;
  }

  .llm-header {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 200px;
    width: 260px;
    max-width: 600px;
    gap: 2px;
  }

  .llm-section-container .form-row {
    flex-shrink: 0;
  }

  .llm-section-container .form-row :global(.spectrum-Picker) {
    width: 240px;
  }

  .llm-section-container .form-row :global(.spectrum-Picker-label) {
    color: var(--spectrum-global-color-gray-900);
  }

  .llm-section-container .form-row :global(.spectrum-Button) {
    gap: calc(var(--spacing-s) - 2px);
  }

  .link-button {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    color: var(--spectrum-global-color-gray-800);
    font-size: inherit;
    font-family: inherit;
    cursor: pointer;
  }

  .link-button:hover {
    color: var(--spectrum-global-color-gray-900);
  }

  .llm-header > :global(.spectrum-Body):first-child {
    font-weight: 500;
  }
</style>
