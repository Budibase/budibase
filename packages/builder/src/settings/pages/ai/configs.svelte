<script lang="ts">
  import { onMount } from "svelte"
  import { Body, Button, Layout, Modal, notifications } from "@budibase/bbui"
  import { aiConfigsStore, featureFlags } from "@/stores/portal"
  import { AIConfigType, type CustomAIProviderConfig } from "@budibase/types"
  import CustomAIConfigTile from "./CustomAIConfigTile.svelte"
  import CustomConfigModal from "./CustomConfigModal.svelte"

  let customConfigModal: { show: () => void; hide: () => void }
  let customModalConfig: CustomAIProviderConfig | null = null

  $: aiGenerationConfigs = ($aiConfigsStore.customConfigs || []).filter(
    config => config.configType === AIConfigType.GENERATION
  )

  function openCustomAIConfigModal(config?: CustomAIProviderConfig) {
    customModalConfig = config ? { ...config } : null
    customConfigModal?.show()
  }

  onMount(async () => {
    try {
      await aiConfigsStore.fetch()
    } catch {
      notifications.error("Error fetching AI settings")
    }
  })
</script>

<Layout noPadding gap="S">
  {#if $featureFlags.AI_AGENTS}
    <div class="section">
      <div class="section-header">
        <div></div>
        <Button size="S" cta on:click={() => openCustomAIConfigModal()}>
          Add configuration
        </Button>
      </div>

      {#if aiGenerationConfigs.length}
        <div class="ai-list">
          {#each aiGenerationConfigs as config (config._id)}
            <CustomAIConfigTile
              {config}
              editHandler={() => openCustomAIConfigModal(config)}
            />
          {/each}
        </div>
      {:else}
        <div class="no-enabled">
          <Body size="S">No generation configurations yet</Body>
        </div>
      {/if}
    </div>
  {/if}
</Layout>

<Modal bind:this={customConfigModal}>
  <CustomConfigModal
    config={customModalConfig}
    type={AIConfigType.GENERATION}
    on:hide={() => {
      customConfigModal.hide()
    }}
  />
</Modal>

<style>
  .ai-list {
    margin-top: var(--spacing-l);
    margin-bottom: var(--spacing-l);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .no-enabled {
    padding: 16px;
    background-color: var(--grey-1);
    border: 1px solid var(--grey-4);
    border-radius: var(--border-radius-m);
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-m);
    margin-bottom: var(--spacing-m);
  }
</style>
