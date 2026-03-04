<script lang="ts">
  import { aiConfigsStore } from "@/stores/portal"
  import { ActionButton, notifications } from "@budibase/bbui"
  import { AIConfigType, type AIConfigResponse } from "@budibase/types"

  interface Props {
    row: AIConfigResponse
  }

  let { row }: Props = $props()

  let isSaving = $state(false)

  let isCompletionConfig = $derived(row.configType === AIConfigType.COMPLETIONS)
  let isConnectedConfig = $derived(!!row._id)

  async function setAsDefault() {
    if (!row._id || row.isDefault || isSaving) {
      return
    }

    isSaving = true
    try {
      const latestConfig =
        $aiConfigsStore.customConfigs.find(config => config._id === row._id) ||
        row

      await aiConfigsStore.updateConfig({
        ...latestConfig,
        isDefault: true,
      })

      notifications.success("Default model updated")
    } catch (err: any) {
      notifications.error(err.message || "Failed to set default model")
    } finally {
      isSaving = false
    }
  }
</script>

{#if isConnectedConfig && isCompletionConfig}
  {#if row.isDefault}
    <div class="default-tag">Default</div>
  {:else}
    <ActionButton size="S" disabled={isSaving} on:click={setAsDefault}
      >Set default</ActionButton
    >
  {/if}
{/if}

<style>
  .default-tag {
    color: var(--spectrum-global-color-static-white);
    background: var(--primary-500);
    border-radius: 6px;
    padding: 4px 8px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    width: fit-content;
  }
</style>
