<script lang="ts">
  import { onMount } from "svelte"
  import { Body, Button, Layout, Modal, notifications } from "@budibase/bbui"
  import { aiConfigsStore, featureFlags } from "@/stores/portal"
  import { AIConfigType, type CustomAIProviderConfig } from "@budibase/types"
  import CustomAIConfigTile from "./CustomAIConfigTile.svelte"
  import CustomConfigModal from "./CustomConfigModal.svelte"

  let customConfigModal: { show: () => void; hide: () => void }
  let customModalConfig: CustomAIProviderConfig | null = null

  $: chatConfigs = ($aiConfigsStore.customConfigs || []).filter(
    config => config.configType === AIConfigType.COMPLETIONS
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
        <div class="section-title">Chat configuration</div>
        <Button size="S" cta on:click={() => openCustomAIConfigModal()}>
          Add configuration
        </Button>
      </div>

      {#if chatConfigs.length}
        <div class="ai-list">
          {#each chatConfigs as config (config._id)}
            <CustomAIConfigTile
              {config}
              editHandler={() => openCustomAIConfigModal(config)}
            />
          {/each}
        </div>
      {:else}
        <div class="no-enabled">
          <Body size="S">No chat configurations yet</Body>
        </div>
      {/if}
    </div>
  {/if}
</Layout>

<Modal bind:this={customConfigModal}>
  <CustomConfigModal
    config={customModalConfig}
    type={AIConfigType.COMPLETIONS}
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

  .section-title {
    margin-bottom: var(--spacing-m);
    font-weight: 600;
    font-size: 16px;
    color: var(--ink);
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-m);
    margin-bottom: var(--spacing-m);
  }

  .section-header .section-title {
    margin-bottom: 0;
  }
</style>
